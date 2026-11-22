import { createFileRoute, Link } from "@tanstack/react-router";

import { FaqList } from "@/components/common/FaqList";
import { AgePills, BudgetPills } from "@/components/common/Pills";
import { ReviewCard } from "@/components/common/ReviewCard";
import { StarRating } from "@/components/common/StarRating";
import { SectionHeading } from "@/components/common/SectionHeading";
import { TrustStrip } from "@/components/common/TrustStrip";
import { NewsletterSection } from "@/components/common/Newsletter";
import { ProductRow } from "@/components/product/ProductRow";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { blogPosts, getProductById, products, reviews } from "@/data";
import { homeFaqs } from "@/data/faqs";
import { garmentTiles, genders, occasions } from "@/data/taxonomy";
import { formatDate } from "@/lib/delivery";
import { img } from "@/data/images";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => seo({ title: `${siteConfig.name} — Kidswear for girls, boys & babies`, description: siteConfig.description }),
  component: Index,
});

function Index() {
  const avgRating = reviews.reduce((n, r) => n + r.rating, 0) / Math.max(1, reviews.length);
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

      <section className="container-page space-y-6 py-8 md:py-12" aria-label="Shop by category">
        <SectionHeading title="Shop by category" />
        <ul className="grid gap-4 sm:grid-cols-3">
          {genders.map((g) => (
            <li key={g.slug}>
              <Link to={`/${g.slug}`} className="group relative block overflow-hidden rounded-2xl shadow-soft">
                <img src={img(g.image)} alt="" loading="lazy" width={800} height={600} className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-x-3 bottom-3 rounded-xl bg-card/95 p-3 backdrop-blur">
                  <span className="block font-heading text-xl font-extrabold">{g.label}</span>
                  <span className="block text-sm text-muted-foreground">{g.blurb}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {garmentTiles.map((t) => (
            <li key={t.slug}>
              <Link to="/collections/$slug" params={{ slug: t.slug }} className="group block overflow-hidden rounded-xl border border-border bg-card shadow-soft">
                <img src={img(t.image)} alt="" loading="lazy" width={400} height={400} className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="block p-3 text-center font-heading font-bold">{t.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page py-8 md:py-12" aria-label="Shop by occasion">
        <SectionHeading title="Shop by occasion" />
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {occasions.map((o) => (
            <li key={o.slug}>
              <Link to="/collections/$slug" params={{ slug: `occasion-${o.slug}` }} className="group block overflow-hidden rounded-xl border border-border bg-card shadow-soft">
                <img src={img(o.image)} alt="" loading="lazy" width={400} height={400} className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="block p-3">
                  <span className="block font-heading font-bold">{o.label}</span>
                  <span className="block text-xs text-muted-foreground">{o.blurb}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page py-8"><SectionHeading title="Shop by budget" /><BudgetPills /></section>

      <section className="container-page py-8 md:py-12" aria-label="Customer reviews">
        <SectionHeading title="Loved by parents" />
        <div className="mb-6 flex items-center gap-3">
          <StarRating rating={avgRating} size="md" />
          <span className="font-semibold">{avgRating.toFixed(1)} out of 5 · from {reviews.length} verified reviews</span>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.slice(0, 4).map((r) => (
            <li key={r.id}><ReviewCard review={r} {...(getProductById(r.productId) ? { productTitle: getProductById(r.productId)!.title } : {})} /></li>
          ))}
        </ul>
      </section>

      <section className="container-page grid gap-8 py-8 md:grid-cols-[1fr_2fr] md:py-12" aria-label="Frequently asked questions">
        <div>
          <SectionHeading title="Good to know" />
          <p className="text-muted-foreground">Quick answers on sizing, shipping and exchanges.</p>
          <Button asChild variant="outline" className="mt-4"><Link to="/faq">All FAQs</Link></Button>
        </div>
        <FaqList items={homeFaqs} idPrefix="home-faq" />
      </section>

      <section className="container-page py-8 md:py-12" aria-label="From the journal">
        <SectionHeading title="From the journal" action={<Link to="/blog" className="text-sm font-semibold text-sage-deep hover:underline">Read the journal</Link>} />
        <ul className="grid gap-5 md:grid-cols-3">
          {blogPosts.slice(0, 3).map((post) => (
            <li key={post.slug}>
              <Link to="/blog/$slug" params={{ slug: post.slug }} className="group block h-full overflow-hidden rounded-xl border border-border bg-card shadow-soft">
                <img src={img(post.image)} alt="" loading="lazy" width={600} height={400} className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="block space-y-2 p-5">
                  <span className="block text-xs text-muted-foreground">{formatDate(post.date)} · {post.readMinutes} min read</span>
                  <span className="block font-heading text-lg font-extrabold">{post.title}</span>
                  <span className="block text-sm text-muted-foreground">{post.excerpt}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <NewsletterSection />
    </>
  );
}
