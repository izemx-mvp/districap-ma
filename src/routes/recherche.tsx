import { createFileRoute } from "@tanstack/react-router";
import { SearchX } from "lucide-react";
import { searchProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/recherche")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : "",
  }),
  head: ({ match }) => ({
    meta: [
      {
        title: match.search.q
          ? `Recherche « ${match.search.q} » – DISTRICAP`
          : "Résultats de recherche – DISTRICAP",
      },
      { name: "robots", content: "noindex" },
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
  const results = searchProducts(q);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl">Résultats pour « {q} »</h1>
      <p className="mt-2 text-muted-foreground">
        {results.length} produit{results.length > 1 ? "s" : ""} trouvé
        {results.length > 1 ? "s" : ""}
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {results.map((p, i) => (
          <Reveal key={p.slug} delay={i * 40}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>

      {results.length === 0 && (
        <div className="card-surface mt-8 p-12 text-center">
          <SearchX className="float-soft mx-auto size-10 text-muted-foreground" />
          <p className="mt-4 font-semibold">Aucun produit ne correspond à votre recherche</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Essayez un autre mot-clé ou contactez-nous : nous pouvons commander la référence pour
            vous.
          </p>
        </div>
      )}
    </div>
  );
}
