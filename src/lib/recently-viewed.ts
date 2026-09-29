import { useEffect, useState } from "react";
import { getProduct, type Product } from "@/lib/catalog";

const STORAGE_KEY = "districap.recently-viewed.v1";
const MAX = 12;

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/**
 * Records `slug` as viewed and returns the other recently viewed products
 * (client-only: empty during SSR and the first render).
 */
export function useRecentlyViewed(slug: string, limit = 8) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const previous = read().filter((s) => s !== slug);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([slug, ...previous].slice(0, MAX)));
    } catch {
      /* storage unavailable */
    }
    setProducts(
      previous
        .map((s) => getProduct(s))
        .filter((p): p is Product => Boolean(p))
        .slice(0, limit),
    );
  }, [slug, limit]);

  return products;
}
