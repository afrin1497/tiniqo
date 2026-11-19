import { createFileRoute, notFound } from "@tanstack/react-router";
import { PackageSearch, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { activeFilterCount, FilterPanel } from "@/components/catalog/FilterPanel";
import { Pagination } from "@/components/catalog/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { FaqList } from "@/components/common/FaqList";
import { PageHeader } from "@/components/common/PageHeader";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { products } from "@/data";
import { resolveCollection } from "@/data/collections";
import { faqGroups } from "@/data/faqs";
import { emptyFilters, facetsFor, filterProducts, paginate, sortOptions, sortProducts, type Filters, type SortKey } from "@/lib/catalog";
import { formatPrice } from "@/lib/pricing";
import { seo } from "@/lib/seo";

const PER_PAGE = 12;

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }) => {
    const c = resolveCollection(params.slug);
    if (!c) throw notFound();
    return { title: c.title, description: c.description };
  },
  head: ({ loaderData }) =>
    seo({
      title: loaderData?.title ?? "Collection",
      description: loaderData ? `${loaderData.description} Shop ${loaderData.title.toLowerCase()} at ${siteConfig.name}.` : "Shop Tiniqo kidswear.",
    }),
  component: CollectionPage,
});

function CollectionPage() {
  const { slug } = Route.useParams();
  const c = resolveCollection(slug)!;
  const base = useMemo(() => products.filter(c.match), [c]);
  const facets = useMemo(() => facetsFor(base), [base]);

  const [sort, setSort] = useState<SortKey>("featured");
  const [filters, setFilters] = useState<Filters>(() => emptyFilters(facets.maxPrice));
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState(false);

  // Reset when moving between collections.
  useEffect(() => {
    setFilters(emptyFilters(facets.maxPrice));
    setPage(1);
    setSort("featured");
  }, [slug, facets.maxPrice]);

  const change = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPending(true);
  };
  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => setPending(false), 250);
    return () => clearTimeout(t);
  }, [pending]);

  const filtered = sortProducts(filterProducts(base, filters), sort);
  const { items, totalPages, page: current } = paginate(filtered, page, PER_PAGE);
  const count = activeFilterCount(filters, facets.maxPrice);

  const onFilters = change((f: Filters) => {
    setFilters(f);
    setPage(1);
  });
  const onPage = change((p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  const clear = () => onFilters(emptyFilters(facets.maxPrice));

  const chips = [
    ...(filters.inStockOnly ? [{ label: "In stock", remove: () => onFilters({ ...filters, inStockOnly: false }) }] : []),
    ...filters.sizes.map((s) => ({ label: `Size ${s}`, remove: () => onFilters({ ...filters, sizes: filters.sizes.filter((x) => x !== s) }) })),
    ...filters.colours.map((s) => ({ label: s, remove: () => onFilters({ ...filters, colours: filters.colours.filter((x) => x !== s) }) })),
    ...filters.materials.map((s) => ({ label: s, remove: () => onFilters({ ...filters, materials: filters.materials.filter((x) => x !== s) }) })),
    ...(filters.priceMin > 0 || filters.priceMax < facets.maxPrice
      ? [{ label: `${formatPrice(filters.priceMin)} – ${formatPrice(filters.priceMax)}`, remove: () => onFilters({ ...filters, priceMin: 0, priceMax: facets.maxPrice }) }]
      : []),
  ];

  return (
    <>
      <PageHeader title={c.title} description={c.description} crumbs={c.crumbs} />
      <div className="container-page py-8">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-36 rounded-2xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-extrabold">Filters</h2>
                {count > 0 && <button type="button" onClick={clear} className="text-sm font-semibold text-sage-deep hover:underline">Clear all</button>}
              </div>
              <FilterPanel facets={facets} filters={filters} onChange={onFilters} idPrefix="desk" />
            </div>
          </aside>

          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <SlidersHorizontal /> Filters{count > 0 && ` (${count})`}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-sm">
                    <SheetHeader className="text-left">
                      <SheetTitle className="font-heading text-xl font-extrabold">Filters</SheetTitle>
                      <SheetDescription>{filtered.length} products match</SheetDescription>
                    </SheetHeader>
                    <div className="px-4 pb-8">
                      <FilterPanel facets={facets} filters={filters} onChange={onFilters} idPrefix="mob" />
                      {count > 0 && <Button variant="outline" className="mt-4 w-full" onClick={clear}>Clear all</Button>}
                    </div>
                  </SheetContent>
                </Sheet>
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  {filtered.length} {filtered.length === 1 ? "product" : "products"}
                </p>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Sort by</span>
                <select
                  value={sort}
                  onChange={(e) => change(setSort)(e.target.value as SortKey)}
                  className="h-10 rounded-xl border border-border bg-card px-3 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </label>
            </div>

            {chips.length > 0 && (
              <ul className="mb-5 flex flex-wrap gap-2" aria-label="Active filters">
                {chips.map((chip) => (
                  <li key={chip.label}>
                    <button type="button" onClick={chip.remove} className="inline-flex items-center gap-1 rounded-full bg-sage-soft px-3 py-1 text-xs font-semibold hover:bg-secondary">
                      {chip.label} <X className="size-3" aria-label="Remove filter" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {pending ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : items.length === 0 ? (
              <EmptyState
                icon={PackageSearch}
                title="No matches"
                text="Try removing a filter or two to see more little outfits."
                action={<Button variant="outline" onClick={clear}>Clear filters</Button>}
              />
            ) : (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                {items.map((p, i) => <li key={p.id}><ProductCard product={p} priority={i < 4} /></li>)}
              </ul>
            )}
            <Pagination page={current} totalPages={totalPages} onPage={onPage} />
          </div>
        </div>

        <section className="mt-16 grid gap-10 border-t border-border pt-10 md:grid-cols-2" aria-labelledby="collection-about">
          <div className="prose-tiniqo">
            <h2 id="collection-about">About {c.title}</h2>
            <p>
              {c.description} Every {siteConfig.name} piece is ready stock and ships in 1–3 days, with free shipping on orders above{" "}
              {formatPrice(siteConfig.freeShippingThreshold)} and an easy {siteConfig.exchangeWindowDays}-day size exchange.
            </p>
            <p>
              Not sure about the fit? Check the size chart on each product — and if your little one is between sizes, pick the bigger one.
            </p>
          </div>
          <div>
            <h2 className="mb-4 text-xl font-extrabold">Good to know</h2>
            <FaqList items={[faqGroups[0]!.items[0]!, faqGroups[1]!.items[1]!, faqGroups[3]!.items[0]!]} idPrefix="col-faq" />
          </div>
        </section>
      </div>
    </>
  );
}
