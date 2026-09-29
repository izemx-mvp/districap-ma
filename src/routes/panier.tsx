import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { productImage } from "@/lib/images";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Votre panier – DISTRICAP" },
      {
        name: "description",
        content:
          "Consultez les articles de votre panier DISTRICAP et finalisez votre commande avec paiement à la livraison partout au Maroc.",
      },
      { property: "og:title", content: "Votre panier – DISTRICAP" },
      {
        property: "og:description",
        content: "Finalisez votre commande de matériel de sécurité et audiovisuel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, setQuantity, remove, subtotal } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShoppingCart className="float-soft mx-auto size-12 text-muted-foreground" />
        <h1 className="mt-6 text-2xl">Votre panier est vide</h1>
        <p className="mt-2 text-muted-foreground">
          Parcourez notre catalogue pour trouver le matériel adapté à votre projet.
        </p>
        <Button asChild className="mt-6">
          <Link to="/categorie/$slug" params={{ slug: "videosurveillance" }}>
            Voir la vidéosurveillance
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl">Votre panier</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {lines.map((line) => (
            <div key={line.slug} className="card-surface rise-in flex gap-4 p-4">
              <img
                src={productImage(line.imageKey)}
                alt=""
                loading="lazy"
                className="size-24 rounded-md border border-border object-contain"
              />
              <div className="min-w-0 flex-1">
                <Link
                  to="/produit/$slug"
                  params={{ slug: line.slug }}
                  className="font-semibold hover:text-primary"
                >
                  {line.name}
                </Link>
                <p className="text-sm text-muted-foreground">Réf. {line.sku}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <div className="flex items-center rounded-md border border-input">
                    <button
                      type="button"
                      aria-label="Diminuer"
                      onClick={() => setQuantity(line.slug, line.quantity - 1)}
                      className="press p-2"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-10 text-center font-semibold">{line.quantity}</span>
                    <button
                      type="button"
                      aria-label="Augmenter"
                      onClick={() => setQuantity(line.slug, line.quantity + 1)}
                      className="press p-2"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <span className="font-semibold text-primary">
                    {formatPrice((line.price ?? 0) * line.quantity)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                aria-label={`Retirer ${line.name}`}
                onClick={() => remove(line.slug)}
                className="press self-start rounded-md p-2 text-muted-foreground transition-colors hover:text-primary"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>

        <aside className="card-surface h-fit p-6 lg:sticky lg:top-40">
          <h2 className="text-lg">Récapitulatif</h2>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Sous-total TTC</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Frais de livraison confirmés à la commande.
          </p>
          <Button asChild size="lg" className="mt-6 w-full">
            <Link to="/commande">Passer la commande</Link>
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Paiement à la livraison partout au Maroc
          </p>
        </aside>
      </div>
    </div>
  );
}
