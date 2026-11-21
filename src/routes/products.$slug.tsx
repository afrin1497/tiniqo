import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { MessageCircle, PackageCheck, RefreshCw, Ruler, Truck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ReviewCard } from "@/components/common/ReviewCard";
import { SectionHeading } from "@/components/common/SectionHeading";
import { StarRating } from "@/components/common/StarRating";
import { ImageGallery } from "@/components/product/ImageGallery";
import { PincodeCheck } from "@/components/product/PincodeCheck";
import { PriceTag } from "@/components/product/PriceTag";
import { ProductRow } from "@/components/product/ProductRow";
import { SizeChartDialog } from "@/components/product/SizeChartDialog";
import { SizeSelector } from "@/components/product/SizeSelector";
import { WishlistButton } from "@/components/product/WishlistButton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getProduct, getProductById, relatedProducts, reviewsFor, type Product } from "@/data";
import { genders } from "@/data/taxonomy";
import { formatPrice } from "@/lib/pricing";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";
import { productWhatsappMessage, whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const p = getProduct(params.slug);
    if (!p) throw notFound();
    return { title: p.title, description: p.shortDescription };
  },
  head: ({ loaderData }) => seo({ title: loaderData?.title ?? "Product", description: loaderData?.description ?? "Tiniqo kidswear." }),
  component: ProductPage,
});

const productFaqs = [
  { q: "Is this style true to size?", a: "Yes — it's a regular fit with a little room to grow. Between sizes? Pick the bigger one." },
  { q: "Can I exchange the size?", a: `Absolutely. Free size exchange within ${siteConfig.exchangeWindowDays} days of delivery, tags intact.` },
  { q: "When will it ship?", a: "It's ready stock, so it ships within 1–3 working days." },
];

function ProductPage() {
  const { slug } = Route.useParams();
  const product = getProduct(slug)!;
  const { addToCart, trackViewed, recentlyViewed, hydrated } = useStore();
  const navigate = useNavigate();
  const sizeRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<string | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    setSize(null);
    setErr(false);
    trackViewed(product.id);
  }, [product.id, trackViewed]);

  const productReviews = reviewsFor(product.id);
  const recent = hydrated
    ? recentlyViewed.filter((id) => id !== product.id).map(getProductById).filter((p): p is Product => Boolean(p))
    : [];
  const gender = genders.find((g) => g.slug === product.gender);

  const add = (buyNow = false) => {
    if (!size) {
      setErr(true);
      sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (buyNow) {
      addToCart(product, size, 1, { openDrawer: false, silent: true });
      void navigate({ to: "/checkout" });
    } else addToCart(product, size);
  };

  const chart = product.garmentType === "romper" || product.gender === "baby" ? "romper" : product.garmentType;

  return (
    <>
      <div className="container-page grid gap-8 py-8 md:grid-cols-2 lg:gap-12">
        <ImageGallery images={product.images} alt={product.title} />
        <div className="space-y-5">
          <Breadcrumbs items={[...(gender ? [{ label: gender.label, to: `/${gender.slug}` as const }] : []), { label: product.title }]} />
          <div>
            <h1 className="text-3xl font-extrabold">{product.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Design code: {product.designCode}</p>
          </div>
          <a href="#reviews" className="inline-flex items-center gap-2 text-sm hover:underline">
            <StarRating rating={product.rating} />
            <span>{product.rating.toFixed(1)} · {product.reviewCount} reviews</span>
          </a>
          <div>
            <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
            <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>
          </div>
          <ul className="flex flex-wrap gap-2" aria-label="Key features">
            {Object.entries(product.attributes).map(([k, v]) => (
              <li key={k} className="rounded-full bg-sage-soft px-3 py-1 text-xs font-semibold text-sage-deep">
                <span className="capitalize">{k}</span>: {v}
              </li>
            ))}
          </ul>

          <div ref={sizeRef} className="scroll-mt-28 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Size</span>
              <div className="flex items-center gap-3">
                <Link to="/size-chart" className="inline-flex items-center gap-1 text-sm font-semibold text-sage-deep hover:underline"><Ruler className="size-4" aria-hidden />Find my size</Link>
                <SizeChartDialog chart={chart} />
              </div>
            </div>
            <SizeSelector sizes={product.sizes} value={size} onChange={(s) => { setSize(s); setErr(false); }} error={err} />
            {err && <p role="alert" className="text-sm text-destructive">Please choose a size.</p>}
          </div>

          <div className="flex gap-2">
            <Button variant="cta" size="lg" className="flex-1" onClick={() => add()}>Add to cart</Button>
            <WishlistButton product={product} withLabel />
          </div>
          <Button variant="outline" size="lg" className="w-full" onClick={() => add(true)}>Buy now</Button>
          <a href={whatsappLink(productWhatsappMessage(product.title, product.designCode, size ?? undefined))} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sage-deep hover:underline">
            <MessageCircle className="size-4" aria-hidden /> Ask on WhatsApp
          </a>

          <ul className="grid grid-cols-3 gap-2 rounded-xl bg-sage-soft p-4 text-center text-xs font-semibold text-sage-deep">
            <li><PackageCheck className="mx-auto mb-1.5 size-5" aria-hidden />Ready stock</li>
            <li><RefreshCw className="mx-auto mb-1.5 size-5" aria-hidden />Free size exchange</li>
            <li><Truck className="mx-auto mb-1.5 size-5" aria-hidden />Ships in 1–3 days</li>
          </ul>

          <PincodeCheck />

          <Accordion type="multiple" defaultValue={["details"]} className="rounded-xl border border-border bg-card px-4">
            <AccordionItem value="details">
              <AccordionTrigger className="font-heading font-bold hover:no-underline">Details</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{product.shortDescription}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="specs">
              <AccordionTrigger className="font-heading font-bold hover:no-underline">Specifications</AccordionTrigger>
              <AccordionContent>
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Product specifications</caption>
                  <tbody>
                    {Object.entries(product.specs).map(([k, v]) => (
                      <tr key={k} className="border-b border-border last:border-0">
                        <th scope="row" className="py-2 pr-4 font-semibold">{k}</th>
                        <td className="py-2 text-muted-foreground">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="care">
              <AccordionTrigger className="font-heading font-bold hover:no-underline">Wash &amp; care</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground">{product.washCare.map((w) => <li key={w}>{w}</li>)}</ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="delivery">
              <AccordionTrigger className="font-heading font-bold hover:no-underline">Delivery &amp; exchange</AccordionTrigger>
              <AccordionContent className="space-y-2 text-muted-foreground">
                <p>Ready stock ships in 1–3 working days; delivery takes 2–7 days depending on your pincode.</p>
                <p>Free shipping above {formatPrice(siteConfig.freeShippingThreshold)}, otherwise {formatPrice(siteConfig.flatShippingFee)}. Express delivery {formatPrice(siteConfig.expressShippingFee)}.</p>
                <p>Free size exchange within {siteConfig.exchangeWindowDays} days of delivery — unworn, unwashed, tags intact. <Link to="/exchange-return" className="font-semibold text-sage-deep hover:underline">Read the policy</Link></p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faqs" className="border-b-0">
              <AccordionTrigger className="font-heading font-bold hover:no-underline">FAQs</AccordionTrigger>
              <AccordionContent>
                <dl className="space-y-3">
                  {productFaqs.map((f) => <div key={f.q}><dt className="font-semibold">{f.q}</dt><dd className="text-muted-foreground">{f.a}</dd></div>)}
                </dl>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <section id="reviews" className="container-page scroll-mt-28 py-8 md:py-12" aria-label="Customer reviews">
        <SectionHeading title="Customer reviews" />
        <div className="mb-6 flex items-center gap-3">
          <StarRating rating={product.rating} size="md" />
          <span className="font-semibold">{product.rating.toFixed(1)} out of 5 · {product.reviewCount} reviews</span>
        </div>
        {productReviews.length ? (
          <div className="grid gap-4 md:grid-cols-3">{productReviews.map((r) => <ReviewCard key={r.id} review={r} />)}</div>
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-card p-6 text-muted-foreground">No written reviews for this style yet — be the first after your order arrives.</p>
        )}
      </section>

      <ProductRow title="You may also like" products={relatedProducts(product)} />
      <ProductRow title="Recently viewed" products={recent} />

      <div className="h-20 md:hidden" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] shadow-lift backdrop-blur md:hidden">
        <div className="container-page flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-xs text-muted-foreground">{size ? `Size ${size}` : "Select a size"}</p>
            <p className="font-extrabold">{formatPrice(product.price)}</p>
          </div>
          <Button variant="cta" onClick={() => add()}>Add to cart</Button>
        </div>
      </div>
    </>
  );
}
