import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { mainImage, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Visible cart button in the header, if any. */
function cartTarget() {
  const nodes = document.querySelectorAll<HTMLElement>("[data-cart-target]");
  for (const node of nodes) {
    const rect = node.getBoundingClientRect();
    if (rect.width > 0 && rect.bottom > 0) return rect;
  }
  return null;
}

/** Flies a thumbnail from `source` to the header cart icon (transform/opacity only). */
export function flyToCart(source: HTMLElement | null, image: string) {
  if (!source || prefersReducedMotion()) return;
  const from = source.getBoundingClientRect();
  const to = cartTarget() ?? new DOMRect(window.innerWidth - 48, 12, 24, 24);
  const size = Math.min(from.width, from.height, 160);
  if (size <= 0) return;

  const ghost = document.createElement("img");
  ghost.src = image;
  ghost.alt = "";
  ghost.setAttribute("aria-hidden", "true");
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${from.left + (from.width - size) / 2}px`,
    top: `${from.top + (from.height - size) / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    objectFit: "contain",
    borderRadius: "12px",
    background: "white",
    boxShadow: "0 12px 32px -12px rgb(0 0 0 / 0.35)",
    zIndex: "100",
    pointerEvents: "none",
    willChange: "transform, opacity",
  });
  document.body.appendChild(ghost);

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const endScale = 24 / size;

  const animation = ghost.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      {
        transform: `translate(${dx * 0.55}px, ${dy * 0.35 - 60}px) scale(${Math.max(endScale, 0.45)})`,
        opacity: 0.95,
        offset: 0.55,
      },
      { transform: `translate(${dx}px, ${dy}px) scale(${endScale})`, opacity: 0.2 },
    ],
    { duration: 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  );
  animation.onfinish = () => ghost.remove();
  animation.oncancel = () => ghost.remove();
}

/** Adds a product to the cart with the checkmark state, fly animation and toast. */
export function useAddToCart(product: Product) {
  const { add, setDrawerOpen } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const addToCart = useCallback(
    (quantity = 1, source: HTMLElement | null = null) => {
      if (product.price === null) return;
      const image = mainImage(product);
      add(
        { slug: product.slug, name: product.name, sku: product.sku, price: product.price, image },
        quantity,
      );
      flyToCart(source, image);
      setAdded(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setAdded(false), 1600);
      toast.success("Produit ajouté au panier", {
        description: quantity > 1 ? `${quantity} × ${product.name}` : product.name,
        action: { label: "Voir le panier", onClick: () => setDrawerOpen(true) },
      });
    },
    [add, product, setDrawerOpen],
  );

  return { added, addToCart };
}
