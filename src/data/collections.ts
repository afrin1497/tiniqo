import type { AppHref } from "@/components/common/AppLink";

import type { Product } from "./types";
import { ageBands, budgets, genders, occasions, styles } from "./taxonomy";

export interface Collection {
  slug: string;
  title: string;
  description: string;
  match: (p: Product) => boolean;
  crumbs: { label: string; to?: AppHref }[];
}

const genderLabel = (g: string) => genders.find((x) => x.slug === g)?.label ?? g;

/**
 * Resolves collection slugs such as:
 *   new-arrivals, sale, bestsellers, all
 *   girls, girls-ethnic, boys-party, baby-casual
 *   age-3-4y, girls-age-5-6y
 *   under-500, boys-1000-1999
 *   occasion-wedding, type-frock, girls-sale
 */
export function resolveCollection(slug: string): Collection | null {
  const parts = slug.split("-");
  const maybeGender = parts[0];
  const gender = genders.find((g) => g.slug === maybeGender)?.slug;
  const rest = gender ? parts.slice(1).join("-") : slug;
  const gMatch = (p: Product) => (gender ? p.gender === gender : true);
  const gTitle = gender ? `${genderLabel(gender)} ` : "";
  const baseCrumbs: Collection["crumbs"] = gender
    ? [{ label: genderLabel(gender), to: `/${gender}` as const }]
    : [];

  const make = (title: string, description: string, match: (p: Product) => boolean): Collection => ({
    slug,
    title,
    description,
    match: (p) => gMatch(p) && match(p),
    crumbs: [...baseCrumbs, { label: title }],
  });

  if (rest === "" && gender) {
    return {
      slug,
      title: `All ${genderLabel(gender)}`,
      description: `Every ${genderLabel(gender).toLowerCase()} style in one place — ethnic, party and everyday.`,
      match: gMatch,
      crumbs: [{ label: genderLabel(gender), to: `/${gender}` as const }, { label: "All" }],
    };
  }
  if (rest === "all") return make(`${gTitle}All Products`.trim(), "Browse the full Tiniqo collection.", () => true);
  if (rest === "new-arrivals")
    return make(`${gTitle}New Arrivals`, "Fresh styles just landed — ready stock, shipped in 1-3 days.", (p) => p.badges.includes("new"));
  if (rest === "sale")
    return make(`${gTitle}Sale`, "Much-loved styles at gentler prices, while sizes last.", (p) => p.compareAtPrice !== null && p.compareAtPrice > p.price);
  if (rest === "bestsellers")
    return make(`${gTitle}Bestsellers`, "The pieces parents re-order again and again.", (p) => p.badges.includes("bestseller"));

  const style = styles.find((s) => s.slug === rest);
  if (style)
    return make(`${gTitle}${style.label} Wear`, `${style.label} outfits made soft enough for little ones to love.`, (p) => p.style === style.slug);

  if (rest.startsWith("age-")) {
    const band = ageBands.find((b) => `age-${b.slug}` === rest);
    if (band)
      return make(`${gTitle}Ages ${band.label}`, `Styles that fit ${band.label} — check the size chart for the perfect fit.`, (p) =>
        p.sizes.some((s) => s.minMonths < band.max && s.maxMonths > band.min),
      );
  }

  const budget = budgets.find((b) => b.slug === rest);
  if (budget)
    return make(`${gTitle}${budget.label}`, `Quality kidswear ${budget.label.toLowerCase()}.`, (p) => p.price >= budget.min && p.price <= budget.max);

  if (rest.startsWith("occasion-")) {
    const occ = occasions.find((o) => `occasion-${o.slug}` === rest);
    if (occ) return make(`${gTitle}${occ.label} Outfits`, occ.blurb + ".", (p) => p.occasions.includes(occ.slug));
  }

  const typeMap: Record<string, string> = { "type-frock": "Frocks & Dresses", "type-set": "Co-ords & Sets", "type-shirt": "Shirts", "type-romper": "Rompers" };
  const typeTitle = typeMap[rest];
  if (typeTitle) {
    const t = rest.replace("type-", "");
    return make(`${gTitle}${typeTitle}`, `Shop ${typeTitle.toLowerCase()} for every age and occasion.`, (p) => p.garmentType === t);
  }

  return null;
}
