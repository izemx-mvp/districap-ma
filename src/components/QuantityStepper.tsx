import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/** Quantity input with a vertical number flip in the direction of the change. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  label = "Quantité",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
}) {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const change = (next: number) => {
    setDirection(next >= value ? "up" : "down");
    onChange(next);
  };

  const button = cn(
    "press grid place-items-center text-muted-foreground transition-colors hover:text-primary disabled:opacity-40 disabled:hover:text-muted-foreground",
    size === "sm" ? "size-8" : "size-10",
  );

  return (
    <div
      className="inline-flex items-center rounded-md border border-input bg-background"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        aria-label="Diminuer la quantité"
        onClick={() => change(Math.max(min, value - 1))}
        disabled={value <= min}
        className={button}
      >
        <Minus className="size-4" />
      </button>
      <span
        className={cn(
          "relative grid overflow-hidden text-center font-semibold tabular-nums",
          size === "sm" ? "h-8 w-8 text-sm" : "h-10 w-10",
        )}
        aria-live="polite"
      >
        <span
          key={value}
          className={cn("self-center", direction === "up" ? "flip-up" : "flip-down")}
        >
          {value}
        </span>
      </span>
      <button
        type="button"
        aria-label="Augmenter la quantité"
        onClick={() => change(Math.min(max, value + 1))}
        disabled={value >= max}
        className={button}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
