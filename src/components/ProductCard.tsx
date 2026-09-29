import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { brandName, discountPercent, mainImage, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProductCard({ product, list = false }: { product: Product; list?: boolean }) {
  const { add, setDrawerOpen } = useCart();
  const [added, setAdded] = useState(false);
  const price = product.price;
  const oldPrice = product.old_price;
  const discount = discountPercent(product);

  const addToCart = () => {
    add({
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      price,
      image: mainImage(product),
    });
    setAdded(true);
    toast.success("Produit ajouté au panier", { description: product.name });
    window.setTimeout(() => setAdded(false), 1200);
    window.setTimeout(() => setDrawerOpen(true), 300);
  };

  return (
    <article
      className={cn(
        "card-surface group relative flex overflow-hidden transition-all duration-250 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]",
        list ? "flex-row gap-4 p-3" : "flex-col",
      )}
    >
      <span className="absolute inset-x-0 top-0 z-10 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-250 group-hover:scale-x-100" />

      <Link
        to="/produit/$slug"
        params={{ slug: product.slug }}
        className={cn(
          "relative block overflow-hidden bg-background",
          list ? "size-32 shrink-0 rounded-md" : "aspect-square",
        )}
      >
        <img
          src={mainImage(product)}
          alt={product.name}
          loading="lazy"
          className="size-full object-contain p-4 transition-transform duration-250 group-hover:scale-105"
        />
      </Link>

      <div className="absolute top-3 left-3 flex flex-col gap-1">
        {discount && (
          <span className="rise-in rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
            -{discount} %
          </span>
        )}
        {product.is_new && (
          <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-bold text-ink-foreground">
            Nouveau
          </span>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col p-4", list && "p-0")}>
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {brandName(product.brand)}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm leading-snug font-semibold">
          <Link to="/produit/$slug" params={{ slug: product.slug }}>
            {product.name}
          </Link>
        </h3>
        {list && product.short_description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {product.short_description}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">Réf. {product.sku}</p>

        <div className="mt-3 flex items-end gap-2">
          <span className="text-lg font-bold text-primary">{formatPrice(price)}</span>
          {oldPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(oldPrice)}
            </span>
          )}
        </div>

        <p
          className={cn(
            "mt-1 text-xs font-medium",
            product.in_stock ? "text-success" : "text-muted-foreground",
          )}
        >
          {product.in_stock ? "En stock" : "Sur commande"}
        </p>

        <div className="mt-4">
          {price === null ? (
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/devis">Demander un devis</Link>
            </Button>
          ) : (
            <Button size="sm" className="press w-full" onClick={addToCart}>
              {added ? (
                <>
                  <Check className="size-4" /> Ajouté
                </>
              ) : (
                <>
                  <ShoppingCart className="size-4" /> Ajouter au panier
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card-surface overflow-hidden">
      <div className="shimmer aspect-square" />
      <div className="space-y-2 p-4">
        <div className="shimmer h-3 w-1/3 rounded" />
        <div className="shimmer h-4 w-full rounded" />
        <div className="shimmer h-4 w-2/3 rounded" />
        <div className="shimmer h-9 w-full rounded" />
      </div>
    </div>
  );
}
