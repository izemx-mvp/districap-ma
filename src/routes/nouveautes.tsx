import { createFileRoute, Link } from "@tanstack/react-router";
import { newProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/nouveautes")({
  head: () => ({
    meta: [
      { title: "Nouveautés – DISTRICAP" },
      {
        name: "description",
        content:
          "Les dernières références du catalogue DISTRICAP : vidéosurveillance, audiovisuel, affichage et sécurité. Livraison partout au Maroc.",
      },
      { property: "og:title", content: "Nouveautés – DISTRICAP" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewProductsPage,
});

function NewProductsPage() {
  const products = newProducts();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="text-sm text-muted-foreground" aria-label="Fil d'Ariane">
        <Link to="/" className="hover:text-primary">
          Accueil
        </Link>
        {" / "}
        <span className="text-foreground">Nouveautés</span>
      </nav>
      <h1 className="mt-4 text-3xl">Nouveautés</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Les dernières références entrées à notre catalogue.
      </p>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p, i) => (
          <Reveal as="li" key={p.slug} delay={i * 50}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
