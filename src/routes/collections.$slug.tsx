import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data";
import { resolveCollection } from "@/data/collections";
import { sortOptions, sortProducts, type SortKey } from "@/lib/catalog";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }) => {
    const c = resolveCollection(params.slug);
    if (!c) throw notFound();
    return { title: c.title, description: c.description };
  },
  head: ({ loaderData }) => seo({ title: loaderData?.title ?? "Collection", description: loaderData?.description ?? "Shop Tiniqo kidswear." }),
  component: CollectionPage,
});

function CollectionPage() {
  const { slug } = Route.useParams();
  const c = resolveCollection(slug)!;
  const [sort, setSort] = useState<SortKey>("featured");
  const list = sortProducts(products.filter(c.match), sort);
  return (
    <>
      <PageHeader title={c.title} description={c.description} crumbs={c.crumbs} />
      <div className="container-page py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{list.length} products</p>
          <label className="text-sm">
            Sort{" "}
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="rounded-lg border border-border bg-card px-2 py-1">
              {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        </div>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {list.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
        </ul>
      </div>
    </>
  );
}
