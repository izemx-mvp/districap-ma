import type { Brand } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * Brand logo, or a clean wordmark placeholder until real logos are provided.
 * Grayscale by default; pass `interactive` for the color-on-hover effect (needs a `group`).
 */
export function BrandLogo({
  brand,
  className,
  interactive = false,
}: {
  brand: Brand;
  className?: string;
  interactive?: boolean;
}) {
  if (brand.logo) {
    return (
      <img
        src={brand.logo}
        alt={brand.name}
        loading="lazy"
        className={cn(
          "h-8 w-auto object-contain",
          interactive &&
            "opacity-60 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0",
          className,
        )}
      />
    );
  }
  return (
    <span
      className={cn(
        "font-display text-xl font-extrabold tracking-[0.08em] whitespace-nowrap uppercase",
        interactive
          ? "text-muted-foreground/60 transition-colors duration-300 group-hover:text-primary"
          : "text-foreground",
        className,
      )}
    >
      {brand.name}
    </span>
  );
}
