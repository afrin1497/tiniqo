import type { Product } from "@/data/types";
import { discountPercent } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function ProductBadges({ product, className }: { product: Product; className?: string }) {
  const onOffer = discountPercent(product.price, product.compareAtPrice) > 0;
  const soldOut = !product.sizes.some((s) => s.inStock);
  return (
    <div className={cn("flex flex-col items-start gap-1.5", className)}>
      {soldOut && <span className="rounded-full bg-foreground px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-background">Sold out</span>}
      {product.badges.includes("new") && (
        <span className="rounded-full bg-coral px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-coral-foreground">New</span>
      )}
      {onOffer && (
        <span className="rounded-full bg-coral-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-foreground">On offer</span>
      )}
    </div>
  );
}
