import { Link } from "@tanstack/react-router";

import { StarRating } from "@/components/common/StarRating";
import { img } from "@/data/images";
import type { Product } from "@/data/types";
import { cn } from "@/lib/utils";
import { PriceTag } from "./PriceTag";
import { ProductBadges } from "./ProductBadges";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({ product, className, priority = false }: { product: Product; className?: string; priority?: boolean }) {
  const [first, second] = product.images;
  const sizeRange = product.sizes.length
    ? `${product.sizes[0]!.age} – ${product.sizes[product.sizes.length - 1]!.age}`
    : "";
  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative overflow-hidden rounded-xl border border-border bg-secondary">
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="block aspect-[4/5]"
          aria-label={product.title}
        >
          <img
            src={img(first ?? "")}
            alt={`${product.title} in ${product.colour}`}
            width={1024}
            height={1280}
            loading={priority ? "eager" : "lazy"}
            className="absolute inset-0 size-full object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          {second && (
            <img
              src={img(second)}
              alt=""
              aria-hidden
              width={1024}
              height={1280}
              loading="lazy"
              className="absolute inset-0 size-full object-cover opacity-0 transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
            />
          )}
        </Link>
        <ProductBadges product={product} className="absolute left-2.5 top-2.5" />
        <WishlistButton product={product} className="absolute right-2.5 top-2.5" />
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-1 px-0.5">
        <p className="text-xs text-muted-foreground">{product.category} · {sizeRange}</p>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug md:text-[15px]">
          <Link to="/products/$slug" params={{ slug: product.slug }} className="hover:text-sage-deep">
            {product.title}
          </Link>
        </h3>
        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} />
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
        <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} className="mt-1" />
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      <div className="aspect-[4/5] animate-pulse rounded-xl bg-sage-soft" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-sage-soft" />
      <div className="h-4 w-4/5 animate-pulse rounded bg-sage-soft" />
      <div className="h-4 w-1/3 animate-pulse rounded bg-sage-soft" />
    </div>
  );
}
