import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/common/PageHeader";
import { AgePills, BudgetPills } from "@/components/common/Pills";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/girls")({
  head: () => seo({ title: "Girls Clothing", description: "Shop Tiniqo girls clothing: ethnic, party and everyday styles." }),
  component: Hub,
});

function Hub() {
  const list = products.filter((p) => p.gender === "girls");
  return (
    <>
      <PageHeader title="Girls" description="Ethnic, party and everyday styles." crumbs={[{ label: "Girls" }]} />
      <div className="container-page space-y-10 py-10">
        <section><SectionHeading title="Shop by age" /><AgePills gender="girls" /></section>
        <section><SectionHeading title="Shop by price" /><BudgetPills gender="girls" /></section>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {list.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
        </ul>
      </div>
    </>
  );
}
