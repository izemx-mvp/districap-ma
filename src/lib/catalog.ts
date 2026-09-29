import { BRANDS, type Brand } from "@/data/brands";
import { CATEGORIES, type Category } from "@/data/categories";
import { PRODUCTS, type Product } from "@/data/products";
import { FALLBACK_IMAGE } from "@/lib/images";

export type { Brand, Category, Product };

const byPosition = (a: Category, b: Category) => a.position - b.position;

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

export function getProducts() {
  return PRODUCTS;
}

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getBrand(slug: string) {
  return BRANDS.find((b) => b.slug === slug);
}

export function getBrands() {
  return BRANDS;
}

export function mainImage(product: Product) {
  return product.images[0] ?? FALLBACK_IMAGE;
}

export function brandName(slug: string) {
  return getBrand(slug)?.name ?? slug;
}

export function categoryName(slug: string) {
  return getCategory(slug)?.name ?? slug;
}

export function getParentCategories() {
  return CATEGORIES.filter((c) => c.parent === null).sort(byPosition);
}

export function getSubCategories(parentSlug: string) {
  return CATEGORIES.filter((c) => c.parent === parentSlug).sort(byPosition);
}

export function getParentCategory(category: Category) {
  return category.parent ? getCategory(category.parent) : undefined;
}

/** The category itself plus all of its sub-categories. */
export function categoryTreeSlugs(slug: string) {
  return [slug, ...getSubCategories(slug).map((c) => c.slug)];
}

/** Products of a category, including those of its sub-categories. */
export function productsByCategory(slug: string) {
  const scope = new Set(categoryTreeSlugs(slug));
  return PRODUCTS.filter((p) => scope.has(p.category));
}

export function promoProducts() {
  return PRODUCTS.filter((p) => p.old_price !== null);
}

export function newProducts() {
  return PRODUCTS.filter((p) => p.is_new);
}

/** Same sub-category first, then the rest of the parent category. */
export function similarProducts(product: Product, limit = 8) {
  const category = getCategory(product.category);
  const sameSub = PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug,
  );
  const parentSlug = category?.parent;
  const sameParent = parentSlug
    ? productsByCategory(parentSlug).filter(
        (p) => p.category !== product.category && p.slug !== product.slug,
      )
    : [];
  return [...sameSub, ...sameParent].slice(0, limit);
}

export function discountPercent(product: Product) {
  if (product.price === null || product.old_price === null) return null;
  if (product.old_price <= product.price) return null;
  return Math.round((1 - product.price / product.old_price) * 100);
}

// ---------------------------------------------------------------------------
// Search (accent- and case-insensitive: "camera" matches "Caméra")
// ---------------------------------------------------------------------------

export function normalize(value: string) {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

function searchableText(p: Product) {
  return normalize(
    [p.name, p.sku, brandName(p.brand), categoryName(p.category), p.short_description].join(" "),
  );
}

export function searchProducts(query: string, list: Product[] = PRODUCTS) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return list.filter((p) => {
    const text = searchableText(p);
    return terms.every((t) => text.includes(t));
  });
}

// ---------------------------------------------------------------------------
// Filters, sort, pagination
// ---------------------------------------------------------------------------

export type SortKey = "pertinence" | "prix-croissant" | "prix-decroissant" | "nouveautes";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "pertinence", label: "Pertinence" },
  { value: "prix-croissant", label: "Prix croissant" },
  { value: "prix-decroissant", label: "Prix décroissant" },
  { value: "nouveautes", label: "Nouveautés" },
];

export type ProductFilters = {
  categories?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
};

/** Price filters never exclude "Sur devis" products (price `null`). */
export function filterProducts(list: Product[], filters: ProductFilters) {
  const { categories, brands, minPrice, maxPrice, inStock } = filters;
  return list.filter((p) => {
    if (categories?.length && !categories.includes(p.category)) return false;
    if (brands?.length && !brands.includes(p.brand)) return false;
    if (inStock && !p.in_stock) return false;
    if (p.price !== null) {
      if (minPrice !== undefined && p.price < minPrice) return false;
      if (maxPrice !== undefined && p.price > maxPrice) return false;
    }
    return true;
  });
}

export function sortProducts(list: Product[], sort: SortKey) {
  const sorted = [...list];
  switch (sort) {
    case "prix-croissant":
      return sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    case "prix-decroissant":
      return sorted.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    case "nouveautes":
      return sorted.sort((a, b) => Number(b.is_new) - Number(a.is_new));
    default:
      return sorted;
  }
}

export function paginate<T>(list: T[], page: number, pageSize: number) {
  const pageCount = Math.max(1, Math.ceil(list.length / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  return {
    items: list.slice((current - 1) * pageSize, current * pageSize),
    page: current,
    pageCount,
    total: list.length,
  };
}

/** Min/max of known prices in a list (ignores "Sur devis"). */
export function priceRange(list: Product[]) {
  const prices = list.map((p) => p.price).filter((v): v is number => v !== null);
  if (prices.length === 0) return { min: 0, max: 0 };
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/** Brands present in a list, with product counts. */
export function brandsInList(list: Product[]) {
  const counts = new Map<string, number>();
  for (const p of list) counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
  return BRANDS.filter((b) => counts.has(b.slug)).map((brand) => ({
    brand,
    count: counts.get(brand.slug) ?? 0,
  }));
}
