import { Link } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { getParentCategories, getSubCategories, productsByCategory } from "@/lib/catalog";
import { categoryIcon } from "@/lib/category-icons";
import { cn } from "@/lib/utils";

const OPEN_DELAY = 120;
const CLOSE_DELAY = 180;

/** "Catalogue" trigger + full-width mega menu. Rendered inside a `relative` nav. */
export function MegaMenu({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const parents = getParentCategories();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(parents[0]?.slug ?? "");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const panelId = useId();

  const schedule = (next: boolean, delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(next), delay);
  };

  useEffect(() => onOpenChange?.(open), [open, onOpenChange]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const focusFirstLink = () =>
    window.requestAnimationFrame(() =>
      wrapperRef.current?.querySelector<HTMLAnchorElement>("[data-mega-link]")?.focus(),
    );

  const close = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={() => schedule(true, OPEN_DELAY)}
      onMouseLeave={() => schedule(false, CLOSE_DELAY)}
      onBlur={(event) => {
        if (!wrapperRef.current?.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          window.clearTimeout(timer.current);
          setOpen((o) => !o);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            focusFirstLink();
          }
        }}
        className={cn(
          "nav-underline inline-flex items-center gap-1.5 py-2 font-semibold",
          open && "text-primary",
        )}
        data-status={open ? "active" : undefined}
      >
        Catalogue
        <ChevronDown
          className={cn("size-4 transition-transform duration-250", open && "rotate-180")}
        />
      </button>

      <div
        id={panelId}
        inert={!open}
        data-open={open}
        className="mega-panel absolute inset-x-0 top-full z-50 border-t border-border bg-background shadow-[var(--shadow-lift)]"
      >
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px]">
          <ul className="grid grid-cols-4 gap-2">
            {parents.map((cat, i) => {
              const Icon = categoryIcon(cat.slug);
              const isActive = active === cat.slug;
              return (
                <li
                  key={cat.slug}
                  className="mega-column"
                  style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
                  onMouseEnter={() => setActive(cat.slug)}
                  onFocusCapture={() => setActive(cat.slug)}
                >
                  <div
                    className={cn(
                      "h-full rounded-lg border border-transparent p-3 transition-colors duration-200",
                      isActive && "border-border bg-surface",
                    )}
                  >
                    <Link
                      to="/categorie/$slug"
                      params={{ slug: cat.slug }}
                      onClick={close}
                      data-mega-link
                      className="group flex items-start gap-2.5 text-sm font-semibold"
                    >
                      <span
                        className={cn(
                          "grid size-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary transition-transform duration-250",
                          isActive && "scale-110",
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span className="leading-tight transition-colors group-hover:text-primary">
                        {cat.name}
                      </span>
                    </Link>
                    <ul className="mt-2 space-y-0.5 pl-[42px]">
                      {getSubCategories(cat.slug).map((sub) => (
                        <li key={sub.slug}>
                          <Link
                            to="/categorie/$slug"
                            params={{ slug: sub.slug }}
                            onClick={close}
                            data-mega-link
                            className="block py-0.5 text-[13px] text-muted-foreground transition-colors hover:text-primary"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="relative hidden overflow-hidden rounded-xl bg-ink lg:block">
            {parents.map((cat) => (
              <img
                key={cat.slug}
                src={cat.image}
                alt=""
                loading="lazy"
                className={cn(
                  "absolute inset-0 size-full object-cover transition-opacity duration-500",
                  active === cat.slug ? "opacity-70" : "opacity-0",
                )}
              />
            ))}
            <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
            {parents.map((cat) => (
              <div
                key={cat.slug}
                aria-hidden={active !== cat.slug}
                className={cn(
                  "absolute inset-x-5 bottom-5 text-ink-foreground transition-all duration-300",
                  active === cat.slug
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-2 opacity-0",
                )}
              >
                <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                  {productsByCategory(cat.slug).length} produits
                </p>
                <p className="mt-1 text-lg font-bold">{cat.name}</p>
                {cat.intro && <p className="mt-1 line-clamp-3 text-sm opacity-80">{cat.intro}</p>}
                <Link
                  to="/categorie/$slug"
                  params={{ slug: cat.slug }}
                  onClick={close}
                  tabIndex={active === cat.slug ? 0 : -1}
                  className="group mt-3 inline-flex items-center gap-1.5 text-sm font-semibold"
                >
                  Voir la catégorie
                  <ArrowRight className="size-4 transition-transform duration-250 group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
