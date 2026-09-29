import { Check, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

/** Cart icon that morphs into a checkmark, with the matching label. */
export function AddedLabel({
  added,
  label = "Ajouter au panier",
  addedLabel = "Ajouté",
  className,
}: {
  added: boolean;
  label?: string;
  addedLabel?: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative grid size-4 place-items-center" aria-hidden="true">
        <ShoppingCart
          className={cn(
            "absolute size-4 transition-all duration-300",
            added ? "scale-50 -rotate-45 opacity-0" : "scale-100 opacity-100",
          )}
        />
        <Check
          className={cn(
            "absolute size-4 transition-all duration-300",
            added ? "scale-100 rotate-0 opacity-100" : "scale-50 rotate-45 opacity-0",
          )}
          strokeWidth={3}
        />
      </span>
      <span aria-live="polite">{added ? addedLabel : label}</span>
    </span>
  );
}
