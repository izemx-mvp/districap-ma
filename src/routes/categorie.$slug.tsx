import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FileText,
  LayoutGrid,
  List,
  MessageCircle,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import {
  brandName,
  brandsInList,
  categoryName,
  filterProducts,
  getCategory,
  getParentCategory,
  getSubCategories,
  paginate,
  priceRange,
  productsByCategory,
  sortProducts,
  SORT_OPTIONS,
  type SortKey,
} from "@/lib/catalog";
import { categoryIcon } from "@/lib/category-icons";
import { formatPrice } from "@/lib/format";
import { ProductCard } from "@/components/ProductCard";
import { RangeSlider } from "@/components/RangeSlider";
import { FilterChips, type FilterChip } from "@/components/category/FilterChips";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

type CategorySearch = {
  sous?: string | undefined;
  marques?: string | undefined;
  min?: number | undefined;
  max?: number | undefined;
  stock?: boolean | undefined;
  tri?: SortKey | undefined;
  vue?: "liste" | undefined;
  page?: number | undefined;
};

const SORT_KEYS = SORT_OPTIONS.map((o) => o.value);

function toNumber(value: unknown) {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(n) ? n : undefined;
}

function toList(value: string | undefined) {
  return value ? value.split(",").filter(Boolean) : [];
}

function fromList(list: string[]) {
  return list.length ? list.join(",") : undefined;
}

export const Route = createFileRoute("/categorie/$slug")({
  validateSearch: (search: Record<string, unknown>): CategorySearch => {
    const { sous, marques, min, max, stock, tri, vue, page } = search;
    const pageNumber = toNumber(page);
    const sortKey = tri as SortKey;
    return {
      sous: typeof sous === "string" && sous ? sous : undefined,
      marques: typeof marques === "string" && marques ? marques : undefined,
      min: toNumber(min),
      max: toNumber(max),
      stock: stock === true || stock === "true" ? true : undefined,
      tri: SORT_KEYS.includes(sortKey) && sortKey !== "pertinence" ? sortKey : undefined,
      vue: vue === "liste" ? "liste" : undefined,
      page: pageNumber && pageNumber > 1 ? Math.floor(pageNumber) : undefined,
    };
  },
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.category.name ?? "Catégorie";
    const description =
      loaderData?.category.intro ??
      `Découvrez notre sélection ${name} : matériel professionnel disponible au Maroc, livraison partout et paiement à la livraison.`;
    return {
      meta: [
        { title: `${name} – DISTRICAP` },
        { name: "description", content: description },
        { property: "og:title", content: `${name} – DISTRICAP` },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryHero({ slug }: { slug: string }) {
  const category = getCategory(slug)!;
  const parent = getParentCategory(category);
  const root = parent ?? category;
  const pills = getSubCategories(root.slug);
  const Icon = categoryIcon(root.slug);

  return (
    <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
      <img
        src={category.image}
        alt=""
        width={1600}
        height={600}
        className="absolute inset-0 -z-10 size-full object-cover opacity-35"
      />
      <span className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <nav className="text-sm text-ink-foreground/70" aria-label="Fil d'Ariane">
          <Link to="/" className="hover:text-primary">
            Accueil
          </Link>
          {parent && (
            <>
              {" / "}
              <Link
                to="/categorie/$slug"
                params={{ slug: parent.slug }}
                className="hover:text-primary"
              >
                {parent.name}
              </Link>
            </>
          )}
          {" / "}
          <span className="text-ink-foreground" aria-current="page">
            {category.name}
          </span>
        </nav>
        <div className="rise-in mt-5 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Icon className="size-5" />
          </span>
          <h1 className="text-3xl text-ink-foreground md:text-4xl">{category.name}</h1>
        </div>
        {(category.intro ?? root.intro) && (
          <p className="rise-in mt-3 max-w-2xl opacity-85" style={{ animationDelay: "80ms" }}>
            {category.intro ?? root.intro}
          </p>
        )}
        {pills.length > 0 && (
          <ul
            className="rise-in -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0"
            style={{ animationDelay: "160ms" }}
          >
            <li className="shrink-0">
              <Link
                to="/categorie/$slug"
                params={{ slug: root.slug }}
                className={cn(
                  "inline-flex rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  slug === root.slug
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-white/25 hover:border-white/60",
                )}
              >
                Tout voir
              </Link>
            </li>
            {pills.map((sub) => (
              <li key={sub.slug} className="shrink-0">
                <Link
                  to="/categorie/$slug"
                  params={{ slug: sub.slug }}
                  className={cn(
                    "inline-flex rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    slug === sub.slug
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-white/25 hover:border-white/60",
                  )}
                >
                  {sub.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const slug = category.slug;
  const listRef = useRef<HTMLDivElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const subs = getSubCategories(slug);
  const inCategory = useMemo(() => productsByCategory(slug), [slug]);
  const brands = useMemo(() => brandsInList(inCategory), [inCategory]);
  const bounds = useMemo(() => {
    const { min, max } = priceRange(inCategory);
    return { min: Math.floor(min), max: Math.ceil(max) };
  }, [inCategory]);
  const priceStep = bounds.max - bounds.min > 20000 ? 100 : 10;

  const selectedSubs = toList(search.sous);
  const selectedBrands = toList(search.marques);
  const minPrice = search.min ?? bounds.min;
  const maxPrice = search.max ?? bounds.max;
  const sort = search.tri ?? "pertinence";
  const view = search.vue === "liste" ? "list" : "grid";

  // Local slider state while dragging; committed to the URL on release.
  const [draftPrice, setDraftPrice] = useState<[number, number]>([minPrice, maxPrice]);
  useEffect(() => setDraftPrice([minPrice, maxPrice]), [minPrice, maxPrice]);

  const setSearch = (patch: Partial<CategorySearch>, resetPage = true) =>
    navigate({
      search: (prev) => ({ ...prev, ...(resetPage ? { page: undefined } : {}), ...patch }),
      replace: true,
      resetScroll: false,
    });

  const filtered = useMemo(
    () =>
      sortProducts(
        filterProducts(inCategory, {
          categories: selectedSubs,
          brands: selectedBrands,
          inStock: search.stock,
          minPrice: search.min,
          maxPrice: search.max,
        }),
        sort,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inCategory, search.sous, search.marques, search.stock, search.min, search.max, sort],
  );

  const { items: shown, page, pageCount } = paginate(filtered, search.page ?? 1, PAGE_SIZE);

  const toggleIn = (list: string[], value: string) =>
    fromList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const clearAll = () =>
    setSearch({
      sous: undefined,
      marques: undefined,
      min: undefined,
      max: undefined,
      stock: undefined,
    });

  const priceActive = search.min !== undefined || search.max !== undefined;
  const chips: FilterChip[] = [
    ...selectedSubs.map((s) => ({
      key: `sous-${s}`,
      label: categoryName(s),
      onRemove: () => setSearch({ sous: toggleIn(toList(search.sous), s) }),
    })),
    ...selectedBrands.map((b) => ({
      key: `marque-${b}`,
      label: brandName(b),
      onRemove: () => setSearch({ marques: toggleIn(toList(search.marques), b) }),
    })),
    ...(priceActive
      ? [
          {
            key: "prix",
            label: `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`,
            onRemove: () => setSearch({ min: undefined, max: undefined }),
          },
        ]
      : []),
    ...(search.stock
      ? [{ key: "stock", label: "En stock", onRemove: () => setSearch({ stock: undefined }) }]
      : []),
  ];

  const goToPage = (next: number) => {
    setSearch({ page: next > 1 ? next : undefined }, false);
    const top = listRef.current?.getBoundingClientRect().top;
    if (top !== undefined) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: window.scrollY + top - 140, behavior: reduced ? "auto" : "smooth" });
    }
  };

  // Changing this key re-mounts the grid so cards replay their entrance.
  const gridKey = [
    slug,
    search.sous,
    search.marques,
    search.min,
    search.max,
    search.stock,
    sort,
    view,
    page,
  ].join("|");

  const filters = (
    <Accordion type="multiple" defaultValue={["sub", "brand", "price"]} className="w-full">
      {subs.length > 0 && (
        <AccordionItem value="sub">
          <AccordionTrigger>Sous-catégories</AccordionTrigger>
          <AccordionContent className="space-y-2.5">
            {subs.map((sub) => {
              const count = inCategory.filter((p) => p.category === sub.slug).length;
              return (
                <label key={sub.slug} className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <Checkbox
                    checked={selectedSubs.includes(sub.slug)}
                    onCheckedChange={() => setSearch({ sous: toggleIn(selectedSubs, sub.slug) })}
                  />
                  <span className="flex-1">{sub.name}</span>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </label>
              );
            })}
          </AccordionContent>
        </AccordionItem>
      )}
      {brands.length > 0 && (
        <AccordionItem value="brand">
          <AccordionTrigger>Marques</AccordionTrigger>
          <AccordionContent className="space-y-2.5">
            {brands.map(({ brand, count }) => (
              <label key={brand.slug} className="flex cursor-pointer items-center gap-2.5 text-sm">
                <Checkbox
                  checked={selectedBrands.includes(brand.slug)}
                  onCheckedChange={() =>
                    setSearch({ marques: toggleIn(selectedBrands, brand.slug) })
                  }
                />
                <span className="flex-1">{brand.name}</span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>
      )}
      <AccordionItem value="price">
        <AccordionTrigger>Prix</AccordionTrigger>
        <AccordionContent>
          {bounds.max > bounds.min ? (
            <>
              <RangeSlider
                className="mt-2"
                value={draftPrice}
                min={bounds.min}
                max={bounds.max}
                step={priceStep}
                labels={["Prix minimum", "Prix maximum"]}
                onValueChange={setDraftPrice}
                onValueCommit={([lo, hi]) =>
                  setSearch({
                    min: lo > bounds.min ? lo : undefined,
                    max: hi < bounds.max ? hi : undefined,
                  })
                }
              />
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-semibold">{formatPrice(draftPrice[0])}</span>
                <span className="font-semibold">{formatPrice(draftPrice[1])}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Les produits « Sur devis » restent affichés.
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Un seul niveau de prix.</p>
          )}
          <label className="mt-5 flex cursor-pointer items-center gap-2.5 text-sm">
            <Checkbox
              checked={Boolean(search.stock)}
              onCheckedChange={() => setSearch({ stock: search.stock ? undefined : true })}
            />
            Uniquement les produits en stock
          </label>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <>
      <CategoryHero slug={slug} />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block" aria-label="Filtres">
            <div className="sticky top-32">
              <h2 className="mb-2 text-sm font-bold tracking-wide uppercase">Filtrer</h2>
              {filters}
            </div>
          </aside>

          <div ref={listRef}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setFiltersOpen(true)}
              >
                <SlidersHorizontal className="size-4" /> Filtres
                {chips.length > 0 && (
                  <span className="grid size-5 place-items-center rounded-full bg-primary text-[11px] text-primary-foreground">
                    {chips.length}
                  </span>
                )}
              </Button>
              <p className="text-sm text-muted-foreground" aria-live="polite">
                {filtered.length} produit{filtered.length > 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-2">
                <select
                  value={sort}
                  onChange={(e) =>
                    setSearch({
                      tri:
                        e.target.value === "pertinence" ? undefined : (e.target.value as SortKey),
                    })
                  }
                  aria-label="Trier les produits"
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <div
                  className="relative hidden rounded-md border border-input p-0.5 sm:flex"
                  role="group"
                  aria-label="Affichage"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-0.5 left-0.5 size-8 rounded bg-primary/10 transition-transform duration-300 ease-entrance",
                      view === "list" && "translate-x-8",
                    )}
                  />
                  <button
                    type="button"
                    aria-label="Affichage grille"
                    aria-pressed={view === "grid"}
                    onClick={() => setSearch({ vue: undefined }, false)}
                    className={cn(
                      "relative grid size-8 place-items-center",
                      view === "grid" && "text-primary",
                    )}
                  >
                    <LayoutGrid className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Affichage liste"
                    aria-pressed={view === "list"}
                    onClick={() => setSearch({ vue: "liste" }, false)}
                    className={cn(
                      "relative grid size-8 place-items-center",
                      view === "list" && "text-primary",
                    )}
                  >
                    <List className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <FilterChips chips={chips} onClearAll={clearAll} />
            </div>

            {filtered.length > 0 ? (
              <ul
                key={gridKey}
                className={cn(
                  "mt-6 grid gap-5",
                  view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
                )}
              >
                {shown.map((p, i) => (
                  <li key={p.slug} className="grid-in" style={{ animationDelay: `${i * 40}ms` }}>
                    <ProductCard product={p} list={view === "list"} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="card-surface grid-in mt-6 p-10 text-center">
                <SlidersHorizontal className="float-soft mx-auto size-10 text-muted-foreground" />
                <p className="mt-4 font-semibold">Aucun produit ne correspond à vos filtres</p>
                <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                  Élargissez votre sélection, ou dites-nous ce que vous cherchez : nous pouvons vous
                  proposer une référence équivalente.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button onClick={clearAll}>
                    <RotateCcw className="size-4" /> Réinitialiser les filtres
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/devis">
                      <FileText className="size-4" /> Demander un devis
                    </Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link to="/contact">
                      <MessageCircle className="size-4" /> Nous contacter
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {pageCount > 1 && (
              <nav className="mt-10 flex justify-center gap-2" aria-label="Pagination">
                {Array.from({ length: pageCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goToPage(i + 1)}
                    aria-label={`Page ${i + 1}`}
                    aria-current={page === i + 1 ? "page" : undefined}
                    className={cn(
                      "press size-10 rounded-md border border-input text-sm font-medium transition-colors",
                      page === i + 1
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:border-primary hover:text-primary",
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>

      <Drawer open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DrawerContent className="max-h-[88vh]">
          <DrawerHeader className="flex items-center justify-between text-left">
            <DrawerTitle>Filtres</DrawerTitle>
            {chips.length > 0 && (
              <button type="button" onClick={clearAll} className="text-sm font-medium text-primary">
                Tout effacer
              </button>
            )}
          </DrawerHeader>
          <div className="overflow-y-auto px-4">{filters}</div>
          <DrawerFooter className="border-t border-border bg-background">
            <Button size="lg" className="w-full" onClick={() => setFiltersOpen(false)}>
              Voir les {filtered.length} produit{filtered.length > 1 ? "s" : ""}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
