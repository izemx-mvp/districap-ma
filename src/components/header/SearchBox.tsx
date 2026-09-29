import { Link, useNavigate } from "@tanstack/react-router";
import { useId, useMemo, useRef, useState } from "react";
import { ArrowRight, Search, SearchX } from "lucide-react";
import { brandName, mainImage, searchProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useRecentSearches } from "@/lib/recent-searches";
import { Highlight } from "@/components/Highlight";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const MAX_SUGGESTIONS = 6;

/** Desktop search field with instant suggestions (combobox pattern). */
export function SearchBox({ className }: { className?: string }) {
  const navigate = useNavigate();
  const { add } = useRecentSearches();
  const [term, setTerm] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const query = term.trim();
  const all = useMemo(() => (query.length < 2 ? [] : searchProducts(query)), [query]);
  const suggestions = all.slice(0, MAX_SUGGESTIONS);
  const open = focused && query.length >= 2;
  // Options = suggestions + the trailing "see all" row.
  const optionCount = suggestions.length > 0 ? suggestions.length + 1 : 0;

  const reset = () => {
    setFocused(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  };

  const goToResults = () => {
    if (!query) return;
    add(query);
    reset();
    navigate({ to: "/recherche", search: { q: query } });
  };

  const goToProduct = (slug: string) => {
    add(query);
    setTerm("");
    reset();
    navigate({ to: "/produit/$slug", params: { slug } });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && optionCount > 0) {
      event.preventDefault();
      setFocused(true);
      setActiveIndex((i) => (i + 1) % optionCount);
    } else if (event.key === "ArrowUp" && optionCount > 0) {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? optionCount - 1 : i - 1));
    } else if (event.key === "Escape") {
      setFocused(false);
      setActiveIndex(-1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const product = suggestions[activeIndex];
      if (product) goToProduct(product.slug);
      else goToResults();
    }
  };

  const optionId = (i: number) => `${listId}-opt-${i}`;

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        goToResults();
      }}
      className={cn("relative min-w-0", className)}
    >
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          setActiveIndex(-1);
          setFocused(true);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => window.setTimeout(() => setFocused(false), 150)}
        onKeyDown={onKeyDown}
        placeholder="Rechercher un produit, une marque, une référence…"
        aria-label="Rechercher dans le catalogue"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
        autoComplete="off"
        className="h-11 rounded-full pl-10 transition-shadow duration-200 focus-visible:ring-2 focus-visible:ring-primary"
      />

      {open && (
        <div className="card-surface dropdown-in absolute top-full z-50 mt-2 w-full overflow-hidden">
          {suggestions.length > 0 ? (
            <ul id={listId} role="listbox" aria-label="Suggestions" className="p-1">
              {suggestions.map((p, i) => (
                <li
                  key={p.slug}
                  id={optionId(i)}
                  role="option"
                  aria-selected={activeIndex === i}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => goToProduct(p.slug)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-md p-2 transition-colors",
                    activeIndex === i && "bg-muted",
                  )}
                >
                  <img
                    src={mainImage(p)}
                    alt=""
                    width={40}
                    height={40}
                    loading="lazy"
                    className="size-10 shrink-0 rounded bg-background object-contain"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">
                      <Highlight text={p.name} query={query} />
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {brandName(p.brand)} · Réf. <Highlight text={p.sku} query={query} />
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-primary">
                    {formatPrice(p.price)}
                  </span>
                </li>
              ))}
              <li
                id={optionId(suggestions.length)}
                role="option"
                aria-selected={activeIndex === suggestions.length}
                onMouseDown={(e) => e.preventDefault()}
                onClick={goToResults}
                onMouseEnter={() => setActiveIndex(suggestions.length)}
                className={cn(
                  "mt-1 flex cursor-pointer items-center justify-between rounded-md border-t border-border px-3 py-2.5 text-sm font-semibold text-primary",
                  activeIndex === suggestions.length && "bg-muted",
                )}
              >
                Voir tous les résultats ({all.length})
                <ArrowRight className="size-4" />
              </li>
            </ul>
          ) : (
            <div id={listId} className="p-5 text-center text-sm">
              <SearchX className="mx-auto size-6 text-muted-foreground" />
              <p className="mt-2 font-medium">Aucun produit pour « {query} »</p>
              <p className="mt-1 text-muted-foreground">
                Essayez un autre mot-clé ou{" "}
                <Link
                  to="/devis"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={reset}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  demandez-nous un devis
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
