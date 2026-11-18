import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/common/PageHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data";
import { searchProducts } from "@/lib/catalog";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): { q?: string } => (typeof s["q"] === "string" ? { q: s["q"] } : {}),
  head: () => seo({ title: "Search", description: "Search Tiniqo kidswear." }),
  component: SearchPage,
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const results = searchProducts(products, q);
  return (
    <>
      <PageHeader title={q ? `Results for “${q}”` : "Search"} description={`${results.length} products found`} crumbs={[{ label: "Search" }]} />
      <ul className="container-page grid grid-cols-2 gap-4 py-8 md:grid-cols-4">
        {results.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
      </ul>
    </>
  );
}
