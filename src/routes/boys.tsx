import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/common/PageHeader";
import { AgePills, BudgetPills } from "@/components/common/Pills";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/boys")({
  head: () => seo({ title: "Boys Clothing", description: "Shop Tiniqo boys clothing: ethnic, party and everyday styles." }),
  component: Hub,
});

function Hub() {
  const list = products.filter((p) => p.gender === "boys");
  return (
    <>
      <PageHeader title="Boys" description="Ethnic, party and everyday styles." crumbs={[{ label: "Boys" }]} />
      <div className="container-page space-y-10 py-10">
        <section><SectionHeading title="Shop by age" /><AgePills gender="boys" /></section>
        <section><SectionHeading title="Shop by price" /><BudgetPills gender="boys" /></section>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {list.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
        </ul>
      </div>
    </>
  );
}
