import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Front-end-only customer accounts. There is no backend: accounts live in this
 * browser's localStorage, and the password is only stored as a SHA-256 hash.
 * This is a convenience for pre-filling forms, not real authentication.
 */

export type AccountType = "particulier" | "professionnel";

export type Account = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  type: AccountType;
  company: string;
  createdAt: string;
};

type StoredAccount = Account & { passwordHash: string };

type SignUpInput = Omit<Account, "createdAt"> & { password: string };

type Result = { ok: true } | { ok: false; error: string };

type AccountContextValue = {
  user: Account | null;
  /** False until the session has been read from storage. */
  hydrated: boolean;
  signUp: (input: SignUpInput) => Promise<Result>;
  signIn: (email: string, password: string, remember: boolean) => Promise<Result>;
  signOut: () => void;
};

const ACCOUNTS_KEY = "districap.accounts.v1";
const SESSION_KEY = "districap.session.v1";
const AccountContext = createContext<AccountContextValue | null>(null);

const normalizeEmail = (email: string) => email.trim().toLowerCase();

async function hashPassword(email: string, password: string) {
  const data = new TextEncoder().encode(`districap:${normalizeEmail(email)}:${password}`);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

function readAccounts(): Record<string, StoredAccount> {
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, StoredAccount>) : {};
  } catch {
    return {};
  }
}

function writeAccounts(accounts: Record<string, StoredAccount>) {
  try {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    /* stockage indisponible (navigation privée) */
  }
}

function publicAccount({ passwordHash: _hash, ...account }: StoredAccount): Account {
  return account;
}

/** "Remember me" keeps the session in localStorage, otherwise only for this tab. */
function writeSession(email: string | null, remember = true) {
  try {
    window.localStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem(SESSION_KEY);
    if (email) (remember ? window.localStorage : window.sessionStorage).setItem(SESSION_KEY, email);
  } catch {
    /* stockage indisponible */
  }
}

function readSession() {
  try {
    return window.localStorage.getItem(SESSION_KEY) ?? window.sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Account | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const email = readSession();
    const stored = email ? readAccounts()[email] : undefined;
    if (stored) setUser(publicAccount(stored));
    setHydrated(true);
  }, []);

  const signUp = useCallback(async ({ password, ...input }: SignUpInput): Promise<Result> => {
    const email = normalizeEmail(input.email);
    const accounts = readAccounts();
    if (accounts[email]) {
      return { ok: false, error: "Un compte existe déjà avec cette adresse e-mail." };
    }
    const stored: StoredAccount = {
      ...input,
      email,
      createdAt: new Date().toISOString(),
      passwordHash: await hashPassword(email, password),
    };
    writeAccounts({ ...accounts, [email]: stored });
    writeSession(email);
    setUser(publicAccount(stored));
    return { ok: true };
  }, []);

  const signIn = useCallback(
    async (rawEmail: string, password: string, remember: boolean): Promise<Result> => {
      const email = normalizeEmail(rawEmail);
      const stored = readAccounts()[email];
      if (!stored || stored.passwordHash !== (await hashPassword(email, password))) {
        return { ok: false, error: "E-mail ou mot de passe incorrect." };
      }
      writeSession(email, remember);
      setUser(publicAccount(stored));
      return { ok: true };
    },
    [],
  );

  const signOut = useCallback(() => {
    writeSession(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, hydrated, signUp, signIn, signOut }),
    [user, hydrated, signUp, signIn, signOut],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used inside AccountProvider");
  return ctx;
}
