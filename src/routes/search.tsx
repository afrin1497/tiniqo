import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { products } from "@/data";
import { searchProducts } from "@/lib/catalog";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): { q?: string } =>
    typeof search["q"] === "string" ? { q: search["q"] } : {},
  head: () => seo({ title: "Search", description: "Search Tiniqo kidswear." }),
  component: SearchPage,
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  return <SearchResults key={q} query={q} />;
}

function SearchResults({ query }: { query: string }) {
  const navigate = Route.useNavigate();
  const [input, setInput] = useState(query);
  const [sort, setSort] = useState("relevance");
  const results = [...searchProducts(products, query)];

  if (sort === "price-low") results.sort((a, b) => a.price - b.price);
  if (sort === "price-high") results.sort((a, b) => b.price - a.price);
  if (sort === "newest") results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = input.trim(); void navigate({ to: "/search", search: q ? { q } : {} });
  }

  return (
    <>
      <PageHeader
        title={query ? `Results for “${query}”` : "Search"}
        description="Find their next favourite outfit."
        crumbs={[{ label: "Search" }]}
      />
      <main className="container-page py-8">
        <form onSubmit={submit} role="search" className="mb-6">
          <Label htmlFor="catalog-search">Search kidswear</Label>
          <div className="mt-2 flex gap-3">
            <Input id="catalog-search" type="search" name="q" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Try cotton, frock or festive…" />
            <Button variant="cta" type="submit"><Search className="mr-2 size-4" aria-hidden /> Search</Button>
          </div>
        </form>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p role="status" className="text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? "product" : "products"} found
          </p>
          {results.length > 0 && (
            <div className="flex items-center gap-3">
              <Label htmlFor="search-sort">Sort by</Label>
              <select id="search-sort" value={sort} onChange={(event) => setSort(event.target.value)} className="h-10 rounded-md border border-border bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="newest">Newest first</option>
              </select>
            </div>
          )}
        </div>

        {results.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No little matches just yet"
            text="Try a shorter search, a garment type such as frock or shirt, or explore all our outfits."
            action={<Button variant="cta" asChild><Link to="/collections/$slug" params={{ slug: "all" }}>Browse all outfits</Link></Button>}
          />
        ) : (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {results.map((product) => <li key={product.id}><ProductCard product={product} /></li>)}
          </ul>
        )}
      </main>
    </>
  );
}
