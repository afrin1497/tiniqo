import type { Product } from "@/data/types";

export type SortKey = "featured" | "best-selling" | "price-asc" | "price-desc" | "newest";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best selling" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
];

export interface Filters {
  inStockOnly: boolean;
  sizes: string[];
  priceMin: number;
  priceMax: number;
  colours: string[];
  materials: string[];
}

export const emptyFilters = (priceMax = 5000): Filters => ({
  inStockOnly: false,
  sizes: [],
  priceMin: 0,
  priceMax,
  colours: [],
  materials: [],
});

export function filterProducts(list: Product[], f: Filters): Product[] {
  return list.filter((p) => {
    if (f.inStockOnly && !p.sizes.some((s) => s.inStock)) return false;
    if (f.sizes.length && !p.sizes.some((s) => f.sizes.includes(s.label) && (!f.inStockOnly || s.inStock))) return false;
    if (p.price < f.priceMin || p.price > f.priceMax) return false;
    if (f.colours.length && !f.colours.includes(p.colour)) return false;
    if (f.materials.length && !f.materials.includes(p.material)) return false;
    return true;
  });
}

export function sortProducts(list: Product[], key: SortKey): Product[] {
  const arr = [...list];
  switch (key) {
    case "best-selling":
      return arr.sort((a, b) => b.popularity - a.popularity);
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "newest":
      return arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    default:
      return arr.sort(
        (a, b) => Number(b.badges.includes("bestseller")) - Number(a.badges.includes("bestseller")) || b.rating - a.rating,
      );
  }
}

export function paginate<T>(list: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(list.length / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  return { items: list.slice((current - 1) * perPage, current * perPage), totalPages, page: current };
}

/** Facet values present in a product list, used to build the filter panel. */
export function facetsFor(list: Product[]) {
  const sizeOrder = new Map<string, number>();
  list.forEach((p) => p.sizes.forEach((s) => sizeOrder.set(s.label, s.minMonths)));
  const sizes = [...sizeOrder.entries()].sort((a, b) => a[1] - b[1]).map(([label]) => {
    const age = list.flatMap((p) => p.sizes).find((s) => s.label === label)?.age ?? "";
    return { label, age };
  });
  const colours = [...new Map(list.map((p) => [p.colour, p.colourHex])).entries()].map(([name, hex]) => ({ name, hex }));
  const materials = [...new Set(list.map((p) => p.material))].sort();
  const maxPrice = Math.max(0, ...list.map((p) => p.price));
  return { sizes, colours, materials, maxPrice };
}

export function searchProducts(list: Product[], query: string): Product[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return list.filter((p) => {
    const hay = [p.title, p.designCode, p.category, p.gender, p.style, p.colour, p.material, ...p.occasions]
      .join(" ")
      .toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
}
