import { Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/common/PageHeader";
import { AgePills, BudgetPills } from "@/components/common/Pills";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";
import { products, type Gender, type Product } from "@/data";
import { img } from "@/data/images";
import { genders } from "@/data/taxonomy";

const tiles: { slug: string; label: string; pick: (p: Product) => boolean }[] = [
  { slug: "ethnic", label: "Ethnic", pick: (p) => p.style === "ethnic" },
  { slug: "party", label: "Party", pick: (p) => p.style === "party" },
  { slug: "casual", label: "Casual", pick: (p) => p.style === "casual" },
  { slug: "new-arrivals", label: "New arrivals", pick: (p) => p.badges.includes("new") },
  { slug: "sale", label: "Sale", pick: (p) => p.compareAtPrice !== null && p.compareAtPrice > p.price },
  { slug: "all", label: "Shop all", pick: () => true },
];

export function CategoryHub({ gender }: { gender: Gender }) {
  const meta = genders.find((g) => g.slug === gender)!;
  const list = products.filter((p) => p.gender === gender);
  const best = [...list].sort((a, b) => b.popularity - a.popularity).slice(0, 8);

  return (
    <>
      <PageHeader title={meta.label} description={meta.blurb} crumbs={[{ label: meta.label }]} />
      <div className="container-page space-y-12 py-10">
        <section aria-label={`${meta.label} collections`}>
          <SectionHeading title="Shop collections" />
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {tiles.map((t) => {
              const cover = list.find(t.pick) ?? list[0];
              return (
                <li key={t.slug}>
                  <Link to="/collections/$slug" params={{ slug: `${gender}-${t.slug}` }}
                    className="group block overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift">
                    <img src={img(cover?.images[0] ?? meta.image)} alt="" loading="lazy" width={400} height={400}
                      className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="block p-3 text-center font-heading font-bold">{t.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
        <section><SectionHeading title="Shop by age" /><AgePills gender={gender} /></section>
        <section><SectionHeading title="Shop by price" /><BudgetPills gender={gender} /></section>
        <section aria-label={`${meta.label} bestsellers`}>
          <SectionHeading title={`${meta.label} bestsellers`} />
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {best.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
          </ul>
        </section>
      </div>
    </>
  );
}
