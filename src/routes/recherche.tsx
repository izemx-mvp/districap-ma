import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SearchX } from "lucide-react";
import { productsQuery } from "@/lib/catalog";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/recherche")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  head: () => ({
    meta: [
      { title: "Résultats de recherche – DISTRICAP" },
      {
        name: "description",
        content:
          "Trouvez rapidement une caméra, une centrale d'alarme, un vidéoprojecteur ou un accessoire dans le catalogue DISTRICAP.",
      },
      { property: "og:title", content: "Résultats de recherche – DISTRICAP" },
      {
        property: "og:description",
        content: "Recherche dans le catalogue DISTRICAP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { data: products = [], isLoading } = useQuery(productsQuery);
  const term = q.trim().toLowerCase();

  const results = products.filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      (p.short_description ?? "").toLowerCase().includes(term) ||
      (p.brand_slug ?? "").includes(term) ||
      p.sku.toLowerCase().includes(term),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl">Résultats pour « {q} »</h1>
      <p className="mt-2 text-muted-foreground">
        {results.length} produit{results.length > 1 ? "s" : ""} trouvé
        {results.length > 1 ? "s" : ""}
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : results.map((p, i) => (
              <Reveal key={p.id} delay={i * 40}>
                <ProductCard product={p} />
              </Reveal>
            ))}
      </div>

      {!isLoading && results.length === 0 && (
        <div className="card-surface mt-8 p-12 text-center">
          <SearchX className="float-soft mx-auto size-10 text-muted-foreground" />
          <p className="mt-4 font-semibold">Aucun produit ne correspond à votre recherche</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Essayez un autre mot-clé ou contactez-nous : nous pouvons commander la
            référence pour vous.
          </p>
        </div>
      )}
    </div>
  );
}
