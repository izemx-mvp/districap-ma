import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowRight, FileText } from "lucide-react";
import { brandName, discountPercent, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useAddToCart } from "@/lib/add-to-cart";
import { AddedLabel } from "@/components/AddedLabel";
import { QuantityStepper } from "@/components/QuantityStepper";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/** Product quick view modal (code-split, loaded on first open). */
export default function QuickView({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { added, addToCart } = useAddToCart(product);
  const [active, setActive] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);
  const discount = discountPercent(product);
  const images = product.images;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-background">
              {images.map((src, i) => (
                <img
                  key={src}
                  ref={i === active ? imageRef : undefined}
                  src={src}
                  alt={i === active ? product.name : ""}
                  width={500}
                  height={500}
                  className={cn(
                    "absolute inset-0 size-full object-contain p-6 transition-opacity duration-300",
                    i === active ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
              {discount && (
                <span className="absolute top-3 left-3 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                  -{discount} %
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Image ${i + 1}`}
                    aria-current={i === active}
                    className={cn(
                      "size-16 overflow-hidden rounded-md border-2 bg-background transition-colors",
                      i === active ? "border-primary" : "border-border",
                    )}
                  >
                    <img src={src} alt="" className="size-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {brandName(product.brand)}
            </p>
            <DialogTitle className="mt-1 text-xl leading-snug">{product.name}</DialogTitle>
            <p className="mt-1 text-xs text-muted-foreground">Réf. {product.sku}</p>
            <DialogDescription className="mt-3 text-sm">
              {product.short_description}
            </DialogDescription>

            <div className="mt-4 flex flex-wrap items-end gap-x-3">
              <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
              {product.old_price && (
                <span className="text-muted-foreground line-through">
                  {formatPrice(product.old_price)}
                </span>
              )}
              {product.price !== null && <span className="text-sm text-muted-foreground">TTC</span>}
            </div>
            <p
              className={cn(
                "mt-1 text-sm font-medium",
                product.in_stock ? "text-success" : "text-muted-foreground",
              )}
            >
              {product.in_stock ? "En stock" : "Sur commande"}
            </p>

            <div className="mt-auto space-y-3 pt-6">
              {product.price !== null ? (
                <div className="flex gap-3">
                  <QuantityStepper value={quantity} onChange={setQuantity} />
                  <Button
                    className="press flex-1"
                    size="lg"
                    onClick={() => addToCart(quantity, imageRef.current)}
                  >
                    <AddedLabel added={added} addedLabel="Ajouté au panier" />
                  </Button>
                </div>
              ) : (
                <Button asChild size="lg" className="w-full">
                  <Link to="/devis" onClick={() => onOpenChange(false)}>
                    <FileText className="size-4" /> Demander un devis
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" className="group w-full">
                <Link
                  to="/produit/$slug"
                  params={{ slug: product.slug }}
                  onClick={() => onOpenChange(false)}
                >
                  Voir la fiche complète
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
