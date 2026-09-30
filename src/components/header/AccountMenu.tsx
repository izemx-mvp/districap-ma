import { Link, useLocation } from "@tanstack/react-router";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { useAccount } from "@/lib/account";
import { initials } from "@/lib/account-helpers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Header account entry: sign-in link when signed out, initials menu when signed in. */
export function AccountMenu() {
  const { user, hydrated, signOut } = useAccount();
  const pathname = useLocation({ select: (l) => l.pathname });
  const onAuthPage = pathname === "/connexion" || pathname === "/inscription";

  if (!hydrated || !user) {
    return (
      <Link
        to="/connexion"
        search={onAuthPage || pathname === "/" ? {} : { redirect: pathname }}
        aria-label="Se connecter"
        className="press inline-flex items-center gap-1.5 rounded-md p-2 text-sm font-medium transition-colors hover:text-primary"
      >
        <User className="size-5" />
        <span className="hidden xl:inline">Connexion</span>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Mon compte, ${user.fullName}`}
        className="press grid size-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground ring-offset-2 ring-offset-background transition-shadow outline-none hover:ring-2 hover:ring-primary/40 focus-visible:ring-2 focus-visible:ring-primary"
      >
        {initials(user.fullName)}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-semibold">{user.fullName}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          {user.company && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.company}</p>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            signOut();
            toast("Vous êtes déconnecté.");
          }}
        >
          <LogOut className="size-4" /> Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
