import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Boxes, MapPin, ShieldCheck, Truck, type LucideIcon } from "lucide-react";
import { getParentCategories, getProducts } from "@/lib/catalog";
import { AMBIANCE } from "@/lib/images";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type Mode = "connexion" | "inscription";

const TABS: { mode: Mode; to: "/connexion" | "/inscription"; label: string }[] = [
  { mode: "connexion", to: "/connexion", label: "Se connecter" },
  { mode: "inscription", to: "/inscription", label: "Créer un compte" },
];

function Point({
  icon: Icon,
  children,
  delay,
}: {
  icon: LucideIcon;
  children: ReactNode;
  delay: number;
}) {
  return (
    <li className="rise-in flex items-start gap-3" style={{ animationDelay: `${delay}ms` }}>
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 backdrop-blur">
        <Icon className="size-4" />
      </span>
      <span className="pt-2 text-sm text-white/85">{children}</span>
    </li>
  );
}

function CircuitPattern() {
  return (
    <svg
      aria-hidden="true"
      className="circuit-drift pointer-events-none absolute -inset-[60px] h-[calc(100%+120px)] w-[calc(100%+120px)] text-white opacity-[0.06]"
    >
      <defs>
        <pattern id="auth-circuit" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M0 30h18l6-6h12l6 6h18M30 0v18m0 24v18" fill="none" stroke="currentColor" />
          <circle cx="24" cy="24" r="2" fill="currentColor" />
          <circle cx="42" cy="30" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#auth-circuit)" />
    </svg>
  );
}

/** Split-screen layout shared by the sign-in and sign-up pages. */
export function AuthShell({
  mode,
  title,
  subtitle,
  redirect,
  children,
}: {
  mode: Mode;
  title: string;
  subtitle: string;
  redirect?: string;
  children: ReactNode;
}) {
  const categories = getParentCategories().length;
  const products = getProducts().length;
  const active = TABS.findIndex((t) => t.mode === mode);

  return (
    <div className="relative overflow-hidden bg-surface">
      <div className="mx-auto grid max-w-7xl gap-0 px-4 py-8 md:py-12 lg:grid-cols-[1fr_1.05fr] lg:gap-10 lg:py-16">
        <aside className="ink-panel relative isolate hidden overflow-hidden rounded-2xl lg:flex lg:flex-col lg:justify-between lg:p-10">
          <img
            src={AMBIANCE.securite}
            alt=""
            className="ken-burns absolute inset-0 -z-20 size-full object-cover opacity-35"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ink via-ink/85 to-primary/40" />
          <CircuitPattern />
          <div
            aria-hidden="true"
            className="float-soft absolute -top-24 -right-24 -z-10 size-72 rounded-full bg-primary/30 blur-3xl"
          />

          <div className="rise-in">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              {SITE.name} · {SITE.tagline}
            </p>
            <h2 className="mt-4 max-w-md text-3xl leading-tight text-white xl:text-4xl">
              Votre espace client, pour équiper et sécuriser vos projets.
            </h2>
          </div>

          <ul className="my-10 space-y-4">
            <Point icon={ShieldCheck} delay={120}>
              Distributeur à Casablanca depuis 2009
            </Point>
            <Point icon={Boxes} delay={200}>
              {products} produits répartis dans {categories} univers
            </Point>
            <Point icon={Truck} delay={280}>
              {SITE.promise}
            </Point>
            <Point icon={MapPin} delay={360}>
              Ain Harrouda, Casablanca
            </Point>
          </ul>

          <p className="rise-in text-xs text-white/60" style={{ animationDelay: "440ms" }}>
            Besoin d'aide ? Appelez-nous au {SITE.phones[0]}.
          </p>
        </aside>

        <section className="mx-auto w-full max-w-md lg:max-w-none lg:py-4">
          <div className="card-surface rise-in relative overflow-hidden p-6 sm:p-8">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/70 to-transparent"
            />
            <nav
              aria-label="Connexion ou inscription"
              className="relative grid grid-cols-2 rounded-lg bg-muted p-1 text-sm font-semibold"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-md bg-background shadow-sm transition-transform duration-300 ease-entrance"
                style={{ transform: `translateX(${active * 100}%)` }}
              />
              {TABS.map((tab) => (
                <Link
                  key={tab.mode}
                  to={tab.to}
                  search={redirect && redirect !== "/" ? { redirect } : {}}
                  aria-current={tab.mode === mode ? "page" : undefined}
                  className={cn(
                    "relative z-10 rounded-md py-2 text-center transition-colors duration-200",
                    tab.mode === mode
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>

            <div key={mode} className="step-in-right mt-7">
              <h1 className="text-2xl sm:text-3xl">{title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
              <div className="mt-6">{children}</div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Votre compte est enregistré uniquement dans ce navigateur. Aucune donnée n'est envoyée à
            nos serveurs.
          </p>
        </section>
      </div>
    </div>
  );
}
