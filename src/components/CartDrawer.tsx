import { Link } from "@tanstack/react-router";
import { ArrowRight, Banknote, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { CartLines } from "@/components/CartLines";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function CartDrawer() {
  const { lines, count, subtotal, drawerOpen, setDrawerOpen } = useCart();
  const close = () => setDrawerOpen(false);
  const hasQuoteItems = lines.some((l) => l.price === null);

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent side="right" className="flex w-[92vw] max-w-md flex-col gap-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle>Votre panier</SheetTitle>
          <SheetDescription>
            {count === 0 ? "Aucun article" : `${count} article${count > 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {lines.length === 0 ? (
            <div className="rise-in py-16 text-center">
              <ShoppingCart className="float-soft mx-auto size-10 text-muted-foreground" />
              <p className="mt-4 font-medium">Votre panier est vide pour le moment.</p>
              <Button asChild variant="outline" className="mt-6">
                <Link to="/nouveautes" onClick={close}>
                  Découvrir les nouveautés
                </Link>
              </Button>
            </div>
          ) : (
            <CartLines compact onNavigate={close} />
          )}
        </div>

        {lines.length > 0 && (
          <div className="space-y-3 border-t border-border bg-surface p-4">
            <div className="flex items-center justify-between font-semibold">
              <span>Sous-total TTC</span>
              <span className="text-lg text-primary">
                <AnimatedNumber value={subtotal} format={formatPrice} />
              </span>
            </div>
            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <Banknote className="mt-px size-4 shrink-0 text-primary" />
              Paiement à la livraison, en espèces. Frais de livraison confirmés par notre équipe.
              {hasQuoteItems && " Les articles « Sur devis » seront chiffrés séparément."}
            </p>
            <Button asChild size="lg" className="press group w-full">
              <Link to="/commande" onClick={close}>
                Commander
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/panier" onClick={close}>
                Voir le panier
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
