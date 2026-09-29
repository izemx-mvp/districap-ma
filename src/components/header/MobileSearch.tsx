import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Clock, Search, SearchX, X } from "lucide-react";
import { brandName, mainImage, searchProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useRecentSearches } from "@/lib/recent-searches";
import { Highlight } from "@/components/Highlight";

/** Full-screen search overlay for small screens. */
export function MobileSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { recent, add, clear } = useRecentSearches();
  const [term, setTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const query = term.trim();
  const results = useMemo(() => (query.length < 2 ? [] : searchProducts(query)), [query]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focus = window.setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(focus);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const submit = (value: string) => {
    const q = value.trim();
    if (!q) return;
    add(q);
    onClose();
    navigate({ to: "/recherche", search: { q } });
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Rechercher dans le catalogue"
      className="overlay-in fixed inset-0 z-[90] flex flex-col bg-background"
    >
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          submit(term);
        }}
        className="flex items-center gap-2 border-b border-border p-3"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la recherche"
          className="press rounded-md p-2"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="search"
            enterKeyHint="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Produit, marque, référence…"
            aria-label="Rechercher"
            className="h-11 w-full rounded-full border border-input bg-background pr-10 pl-9 text-base outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          {term && (
            <button
              type="button"
              onClick={() => {
                setTerm("");
                inputRef.current?.focus();
              }}
              aria-label="Effacer"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </form>

      <div className="flex-1 overflow-y-auto p-4">
        {query.length < 2 ? (
          recent.length > 0 && (
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-muted-foreground">Recherches récentes</h2>
                <button type="button" onClick={clear} className="text-xs font-medium text-primary">
                  Effacer
                </button>
              </div>
              <ul className="mt-2">
                {recent.map((r, i) => (
                  <li key={r} className="rise-in" style={{ animationDelay: `${i * 40}ms` }}>
                    <button
                      type="button"
                      onClick={() => submit(r)}
                      className="flex w-full items-center gap-3 py-2.5 text-left"
                    >
                      <Clock className="size-4 text-muted-foreground" />
                      <span className="flex-1">{r}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )
        ) : results.length === 0 ? (
          <div className="py-12 text-center">
            <SearchX className="float-soft mx-auto size-10 text-muted-foreground" />
            <p className="mt-4 font-semibold">Aucun produit pour « {query} »</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Essayez un autre mot-clé ou{" "}
              <Link to="/devis" onClick={onClose} className="font-medium text-primary">
                demandez-nous un devis
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-border">
              {results.slice(0, 12).map((p, i) => (
                <li key={p.slug} className="rise-in" style={{ animationDelay: `${i * 30}ms` }}>
                  <Link
                    to="/produit/$slug"
                    params={{ slug: p.slug }}
                    onClick={() => {
                      add(query);
                      onClose();
                    }}
                    className="flex items-center gap-3 py-3"
                  >
                    <img
                      src={mainImage(p)}
                      alt=""
                      width={56}
                      height={56}
                      loading="lazy"
                      className="size-14 shrink-0 rounded-md border border-border object-contain"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-sm font-medium">
                        <Highlight text={p.name} query={query} />
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {brandName(p.brand)}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-primary">
                      {formatPrice(p.price)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => submit(query)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-border py-3 text-sm font-semibold text-primary"
            >
              Voir tous les résultats ({results.length})
              <ArrowRight className="size-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
