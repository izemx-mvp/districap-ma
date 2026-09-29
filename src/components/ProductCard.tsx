import { Link } from "@tanstack/react-router";
import { lazy, Suspense, useRef, useState } from "react";
import { Eye, FileText } from "lucide-react";
import { brandName, discountPercent, mainImage, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useAddToCart } from "@/lib/add-to-cart";
import { AddedLabel } from "@/components/AddedLabel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const QuickView = lazy(() => import("@/components/QuickView"));

export function ProductCard({ product, list = false }: { product: Product; list?: boolean }) {
  const { added, addToCart } = useAddToCart(product);
  const [quickOpen, setQuickOpen] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const price = product.price;
  const oldPrice = product.old_price;
  const discount = discountPercent(product);
  const secondImage = product.images[1];

  const onAdd = () => addToCart(1, imageRef.current);

  return (
    <article
      className={cn(
        "card-surface group relative flex h-full overflow-hidden transition-[transform,box-shadow] duration-250 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]",
        list ? "flex-row gap-4 p-3" : "flex-col",
      )}
    >
      <span className="absolute inset-x-0 top-0 z-10 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-250 group-hover:scale-x-100" />

      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-background",
          list ? "size-32 rounded-md sm:size-40" : "aspect-square",
        )}
      >
        <Link
          to="/produit/$slug"
          params={{ slug: product.slug }}
          className="block size-full"
          tabIndex={-1}
          aria-hidden="true"
        >
          <img
            ref={imageRef}
            src={mainImage(product)}
            alt=""
            width={400}
            height={400}
            loading="lazy"
            decoding="async"
            className={cn(
              "size-full object-contain p-4 transition duration-500 group-hover:scale-105",
              secondImage && "group-hover:opacity-0",
            )}
          />
          {secondImage && (
            <img
              src={secondImage}
              alt=""
              width={400}
              height={400}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-contain p-4 opacity-0 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
            />
          )}
        </Link>

        {!list && (
          <button
            type="button"
            onClick={() => setQuickOpen(true)}
            aria-label={`Aperçu rapide : ${product.name}`}
            className="press absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full border border-border bg-background/95 text-foreground shadow-sm transition-all duration-250 hover:text-primary focus-visible:translate-y-0 focus-visible:opacity-100 lg:-translate-y-1 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
          >
            <Eye className="size-4" />
          </button>
        )}

        {!list && price !== null && (
          <div className="absolute inset-x-3 bottom-3 z-10 hidden translate-y-[calc(100%+12px)] transition-transform duration-300 ease-entrance group-hover:translate-y-0 group-focus-within:translate-y-0 lg:block">
            <Button size="sm" className="press w-full shadow-md" onClick={onAdd}>
              <AddedLabel added={added} />
            </Button>
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-1">
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

      <div className={cn("flex min-w-0 flex-1 flex-col p-4", list && "p-0 py-1")}>
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {brandName(product.brand)}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm leading-snug font-semibold">
          <Link
            to="/produit/$slug"
            params={{ slug: product.slug }}
            className="transition-colors after:absolute after:inset-0 after:content-[''] hover:text-primary"
          >
            {product.name}
          </Link>
        </h3>
        {list && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {product.short_description}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">Réf. {product.sku}</p>

        <div className="mt-3 flex flex-wrap items-end gap-x-2">
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

        <div className={cn("relative z-10 mt-auto pt-4", !list && price !== null && "lg:hidden")}>
          {price === null ? (
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/devis">
                <FileText className="size-4" /> Demander un devis
              </Link>
            </Button>
          ) : (
            <Button size="sm" className="press w-full" onClick={onAdd}>
              <AddedLabel added={added} label={list ? "Ajouter au panier" : "Ajouter"} />
            </Button>
          )}
        </div>
      </div>

      {quickOpen && (
        <Suspense fallback={null}>
          <QuickView product={product} open={quickOpen} onOpenChange={setQuickOpen} />
        </Suspense>
      )}
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
