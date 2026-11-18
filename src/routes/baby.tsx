import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/common/PageHeader";
import { AgePills, BudgetPills } from "@/components/common/Pills";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/baby")({
  head: () => seo({ title: "Baby Clothing", description: "Shop Tiniqo baby clothing: ethnic, party and everyday styles." }),
  component: Hub,
});

function Hub() {
  const list = products.filter((p) => p.gender === "baby");
  return (
    <>
      <PageHeader title="Baby" description="Ethnic, party and everyday styles." crumbs={[{ label: "Baby" }]} />
      <div className="container-page space-y-10 py-10">
        <section><SectionHeading title="Shop by age" /><AgePills gender="baby" /></section>
        <section><SectionHeading title="Shop by price" /><BudgetPills gender="baby" /></section>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {list.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
        </ul>
      </div>
    </>
  );
}
