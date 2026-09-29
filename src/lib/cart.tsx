import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProduct } from "@/lib/catalog";
import { FALLBACK_IMAGE } from "@/lib/images";

export type CartLine = {
  slug: string;
  name: string;
  sku: string;
  price: number | null;
  /** Resolved image URL. */
  image: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  /** False until the cart has been read from localStorage. */
  hydrated: boolean;
};

const STORAGE_KEY = "districap.cart.v1";
const CartContext = createContext<CartContextValue | null>(null);

/** Carts saved before the static catalog stored an `imageKey` instead of an URL. */
function withImage(line: CartLine): CartLine {
  if (line.image) return line;
  return { ...line, image: getProduct(line.slug)?.images[0] ?? FALLBACK_IMAGE };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines((JSON.parse(raw) as CartLine[]).map(withImage));
    } catch {
      /* panier illisible : on repart d'un panier vide */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const add = useCallback((line: Omit<CartLine, "quantity">, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((l) => l.slug === line.slug);
      if (existing) {
        return current.map((l) =>
          l.slug === line.slug ? { ...l, quantity: l.quantity + quantity } : l,
        );
      }
      return [...current, { ...line, quantity }];
    });
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setLines((current) =>
      current
        .map((l) => (l.slug === slug ? { ...l, quantity: Math.max(1, quantity) } : l))
        .filter((l) => l.quantity > 0),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((current) => current.filter((l) => l.slug !== slug));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, l) => sum + l.quantity, 0);
    const subtotal = lines.reduce((sum, l) => sum + (l.price ?? 0) * l.quantity, 0);
    return {
      lines,
      count,
      subtotal,
      add,
      setQuantity,
      remove,
      clear,
      drawerOpen,
      setDrawerOpen,
      hydrated,
    };
  }, [lines, add, setQuantity, remove, clear, drawerOpen, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans un CartProvider");
  return ctx;
}
