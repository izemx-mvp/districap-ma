import { Link } from "@tanstack/react-router";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function CartDrawer() {
  const { lines, subtotal, remove, drawerOpen, setDrawerOpen } = useCart();

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent side="right" className="flex w-[92vw] max-w-md flex-col">
        <SheetHeader>
          <SheetTitle>Votre panier</SheetTitle>
        </SheetHeader>
        <div className="flex-1 space-y-3 overflow-y-auto px-4">
          {lines.length === 0 && (
            <div className="py-12 text-center">
              <ShoppingCart className="float-soft mx-auto size-10 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                Votre panier est vide pour le moment.
              </p>
            </div>
          )}
          {lines.map((line) => (
            <div key={line.slug} className="rise-in flex gap-3 border-b border-border pb-3">
              <img
                src={line.image}
                alt=""
                loading="lazy"
                className="size-16 rounded-md border border-border object-contain"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{line.name}</p>
                <p className="text-xs text-muted-foreground">Qté {line.quantity}</p>
                <p className="text-sm font-semibold text-primary">{formatPrice(line.price)}</p>
              </div>
              <button
                type="button"
                aria-label={`Retirer ${line.name}`}
                onClick={() => remove(line.slug)}
                className="press self-start rounded-md p-1 text-muted-foreground transition-colors hover:text-primary"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="space-y-3 border-t border-border p-4">
          <div className="flex items-center justify-between font-semibold">
            <span>Sous-total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Button asChild className="w-full" disabled={lines.length === 0}>
            <Link to="/panier" onClick={() => setDrawerOpen(false)}>
              Voir le panier
            </Link>
          </Button>
          <Button variant="outline" className="w-full" onClick={() => setDrawerOpen(false)}>
            <X className="size-4" /> Continuer mes achats
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
