import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import {
  brandsInList,
  categoryName,
  filterProducts,
  getCategory,
  getParentCategory,
  getSubCategories,
  paginate,
  productsByCategory,
  sortProducts,
  type SortKey,
} from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/categorie/$slug")({
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

const PAGE_SIZE = 9;

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const slug = category.slug;

  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [onlyStock, setOnlyStock] = useState(false);
  const [sort, setSort] = useState<SortKey>("pertinence");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const parent = getParentCategory(category);
  const subs = getSubCategories(slug);
  const inCategory = useMemo(() => productsByCategory(slug), [slug]);
  const brands = useMemo(() => brandsInList(inCategory).map((b) => b.brand), [inCategory]);

  const filtered = useMemo(
    () =>
      sortProducts(
        filterProducts(inCategory, {
          categories: selectedSubs,
          brands: selectedBrands,
          inStock: onlyStock,
          maxPrice,
        }),
        sort,
      ),
    [inCategory, selectedSubs, selectedBrands, onlyStock, maxPrice, sort],
  );

  const { items: shown, pageCount } = paginate(filtered, page, PAGE_SIZE);

  const chips = [
    ...selectedSubs.map((s) => ({
      label: categoryName(s),
      clear: () => setSelectedSubs((v) => v.filter((x) => x !== s)),
    })),
    ...selectedBrands.map((b) => ({
      label: brands.find((x) => x.slug === b)?.name ?? b,
      clear: () => setSelectedBrands((v) => v.filter((x) => x !== b)),
    })),
    ...(onlyStock ? [{ label: "En stock", clear: () => setOnlyStock(false) }] : []),
  ];

  const toggle = (value: string, list: string[], setter: (v: string[]) => void) => {
    setPage(1);
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const Filters = (
    <Accordion type="multiple" defaultValue={["sub", "brand", "price"]} className="w-full">
      {subs.length > 0 && (
        <AccordionItem value="sub">
          <AccordionTrigger>Sous-catégories</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {subs.map((sub) => (
              <label key={sub.slug} className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox
                  checked={selectedSubs.includes(sub.slug)}
                  onCheckedChange={() => toggle(sub.slug, selectedSubs, setSelectedSubs)}
                />
                {sub.name}
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>
      )}
      <AccordionItem value="brand">
        <AccordionTrigger>Marques</AccordionTrigger>
        <AccordionContent className="space-y-2">
          {brands.map((brand) => (
            <label key={brand.slug} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={selectedBrands.includes(brand.slug)}
                onCheckedChange={() => toggle(brand.slug, selectedBrands, setSelectedBrands)}
              />
              {brand.name}
            </label>
          ))}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="price">
        <AccordionTrigger>Prix maximum</AccordionTrigger>
        <AccordionContent>
          <Slider
            value={[maxPrice]}
            min={200}
            max={100000}
            step={200}
            onValueChange={([v]) => {
              setMaxPrice(v ?? 100000);
              setPage(1);
            }}
          />
          <p className="mt-3 text-sm text-muted-foreground">
            Jusqu'à <span className="font-semibold text-foreground">{formatPrice(maxPrice)}</span>
          </p>
          <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox
              checked={onlyStock}
              onCheckedChange={() => {
                setOnlyStock(!onlyStock);
                setPage(1);
              }}
            />
            Uniquement les produits en stock
          </label>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="text-sm text-muted-foreground" aria-label="Fil d'ariane">
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
        <span className="text-foreground">{category.name}</span>
      </nav>

      <h1 className="mt-4 text-3xl">{category.name}</h1>
      {category.intro && <p className="mt-2 max-w-3xl text-muted-foreground">{category.intro}</p>}

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <h2 className="mb-2 text-sm font-bold tracking-wide uppercase">Filtrer</h2>
          {Filters}
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setFiltersOpen(true)}
            >
              <SlidersHorizontal className="size-4" /> Filtres
            </Button>
            <p className="text-sm text-muted-foreground">
              {filtered.length} produit{filtered.length > 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Trier les produits"
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="pertinence">Pertinence</option>
                <option value="prix-croissant">Prix croissant</option>
                <option value="prix-decroissant">Prix décroissant</option>
                <option value="nouveautes">Nouveautés</option>
              </select>
              <div className="hidden rounded-md border border-input sm:flex">
                <button
                  type="button"
                  aria-label="Affichage grille"
                  onClick={() => setView("grid")}
                  className={cn("p-2", view === "grid" && "text-primary")}
                >
                  <LayoutGrid className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Affichage liste"
                  onClick={() => setView("list")}
                  className={cn("p-2", view === "list" && "text-primary")}
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={chip.clear}
                  className="rise-in inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {chip.label} <X className="size-3" />
                </button>
              ))}
            </div>
          )}

          <div
            className={cn(
              "mt-6 grid gap-5",
              view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
            )}
          >
            {shown.map((p, i) => (
              <Reveal key={p.slug} delay={i * 40}>
                <ProductCard product={p} list={view === "list"} />
              </Reveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="card-surface mt-6 p-12 text-center">
              <SlidersHorizontal className="float-soft mx-auto size-10 text-muted-foreground" />
              <p className="mt-4 font-semibold">Aucun produit ne correspond à vos filtres</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Élargissez votre recherche ou contactez-nous pour une demande spécifique.
              </p>
            </div>
          )}

          {pageCount > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i + 1)}
                  className={cn(
                    "press size-9 rounded-md border border-input text-sm",
                    page === i + 1 && "bg-primary text-primary-foreground",
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filtres</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-8">
            {Filters}
            <Button className="mt-6 w-full" onClick={() => setFiltersOpen(false)}>
              Voir les {filtered.length} produits
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
