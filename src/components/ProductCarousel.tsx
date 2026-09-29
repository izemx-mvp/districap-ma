import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/utils";

/** Horizontal product carousel: arrows on desktop, drag on touch, progress dots. */
export function ProductCarousel({
  products,
  label,
  className,
}: {
  products: Product[];
  label: string;
  className?: string;
}) {
  const [viewportRef, api] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    slidesToScroll: "auto",
  });
  const [snaps, setSnaps] = useState<number[]>([]);
  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const sync = useCallback(() => {
    if (!api) return;
    setSnaps(api.scrollSnapList());
    setSelected(api.selectedScrollSnap());
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    sync();
    api.on("select", sync).on("reInit", sync);
    return () => {
      api.off("select", sync).off("reInit", sync);
    };
  }, [api, sync]);

  return (
    <div
      className={cn("relative", className)}
      role="region"
      aria-roledescription="carrousel"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") api?.scrollNext();
        if (e.key === "ArrowLeft") api?.scrollPrev();
      }}
    >
      <div ref={viewportRef} className="-mx-2 overflow-hidden px-2 py-2">
        <ul className="flex touch-pan-y gap-5">
          {products.map((p, i) => (
            <li
              key={p.slug}
              className="w-[72%] shrink-0 sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]"
              aria-roledescription="diapositive"
              aria-label={`${i + 1} sur ${products.length}`}
            >
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </div>

      {(canPrev || canNext) && (
        <>
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            disabled={!canPrev}
            aria-label="Produits précédents"
            className="press absolute top-[40%] -left-4 z-10 hidden size-11 place-items-center rounded-full border border-border bg-background shadow-[var(--shadow-card)] transition-opacity duration-200 hover:text-primary disabled:pointer-events-none disabled:opacity-0 md:grid"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            disabled={!canNext}
            aria-label="Produits suivants"
            className="press absolute top-[40%] -right-4 z-10 hidden size-11 place-items-center rounded-full border border-border bg-background shadow-[var(--shadow-card)] transition-opacity duration-200 hover:text-primary disabled:pointer-events-none disabled:opacity-0 md:grid"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}

      {snaps.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {snaps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => api?.scrollTo(i)}
              aria-label={`Aller au groupe ${i + 1}`}
              aria-current={i === selected}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === selected ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
