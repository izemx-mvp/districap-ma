import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { useCart, type CartLine } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { QuantityStepper } from "@/components/QuantityStepper";
import { cn } from "@/lib/utils";

const LEAVE_MS = 300;

/** One cart line that expands in on mount and collapses + fades before removal. */
function CartLineRow({
  line,
  compact,
  onNavigate,
}: {
  line: CartLine;
  compact: boolean;
  onNavigate?: (() => void) | undefined;
}) {
  const { setQuantity, remove } = useCart();
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpen(true));
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer.current);
    };
  }, []);

  const removeLine = () => {
    setOpen(false);
    timer.current = window.setTimeout(() => remove(line.slug), LEAVE_MS);
  };

  const total = line.price === null ? null : line.price * line.quantity;

  return (
    <li className="collapse-rows" data-open={open}>
      <div className="overflow-hidden">
        <div
          className={cn(
            "flex gap-3",
            compact ? "border-b border-border py-3" : "card-surface mb-4 gap-4 p-4",
          )}
        >
          <Link
            to="/produit/$slug"
            params={{ slug: line.slug }}
            onClick={onNavigate}
            className="shrink-0"
            tabIndex={-1}
            aria-hidden="true"
          >
            <img
              src={line.image}
              alt=""
              width={96}
              height={96}
              loading="lazy"
              className={cn(
                "rounded-md border border-border bg-background object-contain",
                compact ? "size-16" : "size-20 sm:size-24",
              )}
            />
          </Link>
          <div className="min-w-0 flex-1">
            <Link
              to="/produit/$slug"
              params={{ slug: line.slug }}
              onClick={onNavigate}
              className={cn(
                "line-clamp-2 font-medium transition-colors hover:text-primary",
                compact ? "text-sm" : "font-semibold",
              )}
            >
              {line.name}
            </Link>
            <p className="text-xs text-muted-foreground">
              Réf. {line.sku}
              {line.price !== null && ` · ${formatPrice(line.price)} l'unité`}
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <QuantityStepper
                size="sm"
                value={line.quantity}
                onChange={(q) => setQuantity(line.slug, q)}
                label={`Quantité pour ${line.name}`}
              />
              <span className="text-sm font-semibold text-primary">{formatPrice(total)}</span>
            </div>
          </div>
          <button
            type="button"
            aria-label={`Retirer ${line.name} du panier`}
            onClick={removeLine}
            className="press self-start rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </li>
  );
}

export function CartLines({
  compact = false,
  onNavigate,
}: {
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const { lines } = useCart();
  return (
    <ul aria-label="Articles du panier">
      {lines.map((line) => (
        <CartLineRow key={line.slug} line={line} compact={compact} onNavigate={onNavigate} />
      ))}
    </ul>
  );
}
