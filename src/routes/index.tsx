import { createFileRoute, Link } from "@tanstack/react-router";

import { AgePills, BudgetPills } from "@/components/common/Pills";
import { SectionHeading } from "@/components/common/SectionHeading";
import { TrustStrip } from "@/components/common/TrustStrip";
import { NewsletterSection } from "@/components/common/Newsletter";
import { ProductRow } from "@/components/product/ProductRow";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { products } from "@/data";
import { img } from "@/data/images";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => seo({ title: `${siteConfig.name} — Kidswear for girls, boys & babies`, description: siteConfig.description }),
  component: Index,
});

function Index() {
  const best = (g: string) => products.filter((p) => p.gender === g && p.badges.includes("bestseller"));
  return (
    <>
      <section className="container-page pt-6"><AgePills /></section>
      <section className="container-page py-6">
        <div className="relative overflow-hidden rounded-3xl">
          <img src={img("hero-kids-garden")} alt="Kids playing in a garden in Tiniqo outfits" width={1600} height={912} className="h-[420px] w-full object-cover md:h-[520px]" />
          <div className="absolute inset-y-0 left-0 flex max-w-lg flex-col justify-center gap-4 p-6 md:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage-deep">{siteConfig.hero.eyebrow}</p>
            <h1 className="text-4xl font-black md:text-5xl">{siteConfig.hero.title}</h1>
            <p className="text-muted-foreground">{siteConfig.hero.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="cta" size="lg"><Link to="/collections/$slug" params={{ slug: "new-arrivals" }}>{siteConfig.hero.primaryCta.label}</Link></Button>
              <Button asChild variant="outline" size="lg"><Link to="/size-chart">{siteConfig.hero.secondaryCta.label}</Link></Button>
            </div>
          </div>
        </div>
      </section>
      <section className="container-page py-4"><TrustStrip /></section>
      <ProductRow title="Girls bestsellers" products={best("girls")} />
      <ProductRow title="Boys bestsellers" products={best("boys")} />
      <ProductRow title="Baby bestsellers" products={best("baby")} />
      <ProductRow title="New arrivals" products={products.filter((p) => p.badges.includes("new"))} />
      <section className="container-page py-8"><SectionHeading title="Shop by budget" /><BudgetPills /></section>
      <NewsletterSection />
    </>
  );
}
