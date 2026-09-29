import { lazy, Suspense, useRef, useState } from "react";
import { Expand } from "lucide-react";
import { cn } from "@/lib/utils";

const Lightbox = lazy(() => import("@/components/product/Lightbox"));

const ZOOM = 2.2;

type Touches = { distance: number } | { x: number; y: number } | null;

function distance(a: React.Touch, b: React.Touch) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

/**
 * Product gallery: crossfading main image, thumbnails, cursor-follow zoom on
 * desktop, swipe + pinch on touch devices, fullscreen lightbox.
 */
export function ProductGallery({
  images,
  alt,
  imageRef,
}: {
  images: string[];
  alt: string;
  imageRef?: React.Ref<HTMLImageElement>;
}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [pinch, setPinch] = useState(1);
  const [lightbox, setLightbox] = useState(false);
  const gesture = useRef<Touches>(null);
  const count = images.length;

  const go = (delta: number) => setActive((i) => (i + delta + count) % count);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  const onTouchStart = (event: React.TouchEvent) => {
    const [a, b] = [event.touches[0], event.touches[1]];
    if (a && b) gesture.current = { distance: distance(a, b) };
    else if (a) gesture.current = { x: a.clientX, y: a.clientY };
  };

  const onTouchMove = (event: React.TouchEvent) => {
    const g = gesture.current;
    const [a, b] = [event.touches[0], event.touches[1]];
    if (g && "distance" in g && a && b) {
      setPinch(Math.min(3, Math.max(1, distance(a, b) / g.distance)));
    }
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const g = gesture.current;
    const t = event.changedTouches[0];
    if (g && "x" in g && t && pinch === 1 && count > 1) {
      const dx = t.clientX - g.x;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(t.clientY - g.y)) go(dx < 0 ? 1 : -1);
    }
    if (event.touches.length === 0) {
      gesture.current = null;
      setPinch(1);
    }
  };

  return (
    <div className="lg:flex lg:flex-row-reverse lg:gap-4">
      <div className="relative flex-1">
        <div
          className="card-surface relative aspect-square cursor-zoom-in touch-pan-y overflow-hidden"
          onPointerMove={onPointerMove}
          onPointerLeave={() => setZoom(null)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={() => setLightbox(true)}
          role="group"
          aria-roledescription="galerie"
          aria-label={`${alt} – image ${active + 1} sur ${count}`}
        >
          {images.map((src, i) => (
            <img
              key={src}
              ref={i === active ? imageRef : undefined}
              src={src}
              alt={i === active ? alt : ""}
              width={1008}
              height={1008}
              fetchPriority={i === 0 ? "high" : "low"}
              draggable={false}
              className={cn(
                "absolute inset-0 size-full object-contain p-6 transition-[opacity,transform] duration-300 ease-out select-none",
                i === active ? "opacity-100" : "opacity-0",
              )}
              style={
                i === active
                  ? zoom
                    ? {
                        transform: `scale(${ZOOM})`,
                        transformOrigin: `${zoom.x}% ${zoom.y}%`,
                      }
                    : pinch > 1
                      ? { transform: `scale(${pinch})`, transitionDuration: "0ms" }
                      : undefined
                  : undefined
              }
            />
          ))}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(true);
            }}
            aria-label="Afficher en plein écran"
            className="press absolute right-3 bottom-3 grid size-10 place-items-center rounded-full border border-border bg-background/95 shadow-sm transition-colors hover:text-primary"
          >
            <Expand className="size-4" />
          </button>
          {count > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 lg:hidden">
              {images.map((src, i) => (
                <span
                  key={src}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === active ? "w-5 bg-primary" : "w-1.5 bg-border",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto lg:mt-0 lg:flex-col">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              aria-label={`Afficher l'image ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "size-18 shrink-0 overflow-hidden rounded-md border-2 bg-background transition-colors",
                i === active ? "border-primary" : "border-border hover:border-muted-foreground",
              )}
            >
              <img src={src} alt="" loading="lazy" className="size-full object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <Suspense fallback={null}>
          <Lightbox
            images={images}
            alt={alt}
            index={active}
            onIndexChange={setActive}
            onClose={() => setLightbox(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
