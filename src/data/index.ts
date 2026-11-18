import productsJson from "./products.json";
import reviewsJson from "./reviews.json";
import blogJson from "./blog.json";
import type { BlogPost, Product, Review } from "./types";

export const products = productsJson as unknown as Product[];
export const reviews = reviewsJson as unknown as Review[];
export const blogPosts = blogJson as unknown as BlogPost[];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
export function reviewsFor(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId);
}
export function relatedProducts(product: Product, limit = 8): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.gender === product.gender)
    .sort((a, b) => Number(b.style === product.style) - Number(a.style === product.style) || b.popularity - a.popularity)
    .slice(0, limit);
}

export * from "./types";
