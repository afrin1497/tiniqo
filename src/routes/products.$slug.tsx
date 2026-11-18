import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ImageGallery } from "@/components/product/ImageGallery";
import { PincodeCheck } from "@/components/product/PincodeCheck";
import { PriceTag } from "@/components/product/PriceTag";
import { ProductRow } from "@/components/product/ProductRow";
import { SizeChartDialog } from "@/components/product/SizeChartDialog";
import { SizeSelector } from "@/components/product/SizeSelector";
import { WishlistButton } from "@/components/product/WishlistButton";
import { Button } from "@/components/ui/button";
import { getProduct, relatedProducts } from "@/data";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const p = getProduct(params.slug);
    if (!p) throw notFound();
    return { title: p.title, description: p.shortDescription };
  },
  head: ({ loaderData }) => seo({ title: loaderData?.title ?? "Product", description: loaderData?.description ?? "Tiniqo kidswear." }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = getProduct(slug)!;
  const { addToCart, trackViewed } = useStore();
  const [size, setSize] = useState<string | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => trackViewed(product.id), [product.id, trackViewed]);
  const add = () => {
    if (!size) return setErr(true);
    addToCart(product, size);
  };
  const chart = product.garmentType === "romper" || product.gender === "baby" ? "romper" : product.garmentType;
  return (
    <>
      <div className="container-page grid gap-8 py-8 md:grid-cols-2">
        <ImageGallery images={product.images} alt={product.title} />
        <div className="space-y-5">
          <Breadcrumbs items={[{ label: product.title }]} />
          <h1 className="text-3xl font-extrabold">{product.title}</h1>
          <p className="text-sm text-muted-foreground">Design code: {product.designCode}</p>
          <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
          <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>
          <div className="flex items-center justify-between"><span className="font-semibold">Size</span><SizeChartDialog chart={chart} /></div>
          <SizeSelector sizes={product.sizes} value={size} onChange={(s) => { setSize(s); setErr(false); }} error={err} />
          {err && <p className="text-sm text-destructive">Please choose a size.</p>}
          <div className="flex gap-2">
            <Button variant="cta" size="lg" className="flex-1" onClick={add}>Add to cart</Button>
            <WishlistButton product={product} withLabel />
          </div>
          <PincodeCheck />
          <p className="text-muted-foreground">{product.shortDescription}</p>
        </div>
      </div>
      <ProductRow title="You may also like" products={relatedProducts(product)} />
    </>
  );
}
