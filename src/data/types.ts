export type Gender = "girls" | "boys" | "baby";
export type Style = "ethnic" | "party" | "casual";
export type GarmentType = "frock" | "set" | "shirt" | "romper";
export type Badge = "new" | "bestseller" | "offer";
export type Occasion = "birthday" | "wedding" | "festival" | "newborn" | "everyday";

export interface ProductSize {
  label: string;
  age: string;
  minMonths: number;
  maxMonths: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  designCode: string;
  category: string;
  garmentType: GarmentType;
  gender: Gender;
  style: Style;
  sizes: ProductSize[];
  colour: string;
  colourHex: string;
  material: string;
  occasions: Occasion[];
  price: number;
  compareAtPrice: number | null;
  badges: Badge[];
  images: string[];
  shortDescription: string;
  attributes: { fabric: string; closure: string; occasion: string };
  specs: Record<string, string>;
  washCare: string[];
  rating: number;
  reviewCount: number;
  popularity: number;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  city: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  readMinutes: number;
  tags: string[];
  body: BlogBlock[];
}
