import type { Gender, Occasion, Style } from "./types";

export const genders: { slug: Gender; label: string; blurb: string; image: string }[] = [
  { slug: "girls", label: "Girls", blurb: "Frocks, lehengas & twirl-ready sets", image: "category-girls" },
  { slug: "boys", label: "Boys", blurb: "Kurtas, shirts & smart party sets", image: "category-boys" },
  { slug: "baby", label: "Baby", blurb: "Organic rompers & newborn sets", image: "category-baby" },
];

export const styles: { slug: Style; label: string }[] = [
  { slug: "ethnic", label: "Ethnic" },
  { slug: "party", label: "Party" },
  { slug: "casual", label: "Casual" },
];

export const ageBands = [
  { slug: "0-12m", label: "0-12 months", min: 0, max: 12 },
  { slug: "1-2y", label: "1-2 yrs", min: 12, max: 36 },
  { slug: "3-4y", label: "3-4 yrs", min: 36, max: 60 },
  { slug: "5-6y", label: "5-6 yrs", min: 60, max: 84 },
  { slug: "7-8y", label: "7-8 yrs", min: 84, max: 108 },
  { slug: "9-10y", label: "9-10 yrs", min: 108, max: 132 },
  { slug: "11-13y", label: "11-13 yrs", min: 132, max: 168 },
] as const;

export const budgets = [
  { slug: "under-500", label: "Under ₹500", min: 0, max: 499 },
  { slug: "500-999", label: "₹500 – ₹999", min: 500, max: 999 },
  { slug: "1000-1999", label: "₹1000 – ₹1999", min: 1000, max: 1999 },
  { slug: "2000-plus", label: "₹2000+", min: 2000, max: Number.POSITIVE_INFINITY },
] as const;

export const occasions: { slug: Occasion; label: string; image: string; blurb: string }[] = [
  { slug: "birthday", label: "Birthday", image: "girls-party-dress", blurb: "Twirl-worthy party picks" },
  { slug: "wedding", label: "Wedding", image: "boys-party-set", blurb: "Little guests, big style" },
  { slug: "festival", label: "Festival", image: "girls-lehenga", blurb: "Diwali, Eid & puja looks" },
  { slug: "newborn", label: "Newborn", image: "baby-jhabla-set", blurb: "Soft first-wardrobe sets" },
  { slug: "everyday", label: "Everyday", image: "girls-coord-set", blurb: "Play-proof cottons" },
];

export const garmentTiles = [
  { slug: "type-frock", label: "Frocks & Dresses", image: "girls-floral-frock" },
  { slug: "ethnic", label: "Ethnic Wear", image: "boys-kurta-set" },
  { slug: "type-set", label: "Co-ords & Sets", image: "boys-tee-set" },
  { slug: "type-shirt", label: "Shirts", image: "boys-shirt-shorts" },
  { slug: "type-romper", label: "Rompers", image: "baby-romper" },
];
