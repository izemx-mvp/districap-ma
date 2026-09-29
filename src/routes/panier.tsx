import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Banknote, FileText, ShoppingCart, Truck } from "lucide-react";
import { newProducts, promoProducts } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { CartLines } from "@/components/CartLines";
import { ProductCarousel } from "@/components/ProductCarousel";
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
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function Suggestions({ title }: { title: string }) {
  const products = [...promoProducts(), ...newProducts()].filter(
    (p, i, all) => all.findIndex((x) => x.slug === p.slug) === i,
  );
  return (
    <section className="mt-16">
      <h2 className="text-2xl">{title}</h2>
      <ProductCarousel products={products.slice(0, 10)} label={title} className="mt-6" />
    </section>
  );
}

function CartPage() {
  const { lines, count, subtotal, hydrated } = useCart();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10" aria-busy="true">
        <div className="shimmer h-9 w-56 rounded" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <div className="shimmer h-32 rounded-xl" />
            <div className="shimmer h-32 rounded-xl" />
          </div>
          <div className="shimmer h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="rise-in mx-auto max-w-xl text-center">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-primary/10">
            <ShoppingCart className="float-soft size-9 text-primary" />
          </span>
          <h1 className="mt-6 text-3xl">Votre panier est vide</h1>
          <p className="mt-2 text-muted-foreground">
            Parcourez notre catalogue pour trouver le matériel adapté à votre projet, ou
            demandez-nous un devis.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/nouveautes">Voir les nouveautés</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/devis">
                <FileText className="size-4" /> Demander un devis
              </Link>
            </Button>
          </div>
        </div>
        <Suggestions title="Nos suggestions" />
      </div>
    );
  }

  const hasQuoteItems = lines.some((l) => l.price === null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl">
        Votre panier{" "}
        <span className="text-lg font-medium text-muted-foreground">
          ({count} article{count > 1 ? "s" : ""})
        </span>
      </h1>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <CartLines />
          <Link
            to="/"
            className="mt-2 inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            ← Continuer mes achats
          </Link>
        </div>

        <aside className="card-surface p-6 lg:sticky lg:top-32" aria-label="Récapitulatif">
          <h2 className="text-lg">Récapitulatif</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Sous-total TTC</dt>
              <dd className="font-semibold">
                <AnimatedNumber value={subtotal} format={formatPrice} />
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Livraison</dt>
              <dd className="text-muted-foreground">Confirmée par notre équipe</dd>
            </div>
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="font-semibold">Total TTC</span>
            <span className="text-xl font-bold text-primary">
              <AnimatedNumber value={subtotal} format={formatPrice} />
            </span>
          </div>
          {hasQuoteItems && (
            <p className="mt-3 text-xs text-muted-foreground">
              Les articles « Sur devis » ne sont pas inclus dans le total : notre équipe vous
              communiquera leur prix.
            </p>
          )}
          <Button asChild size="lg" className="press group mt-6 w-full">
            <Link to="/commande">
              Passer la commande
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
            <li className="flex items-center gap-2">
              <Banknote className="size-4 text-primary" /> Paiement à la livraison, en espèces
            </li>
            <li className="flex items-center gap-2">
              <Truck className="size-4 text-primary" /> Livraison partout au Maroc
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
