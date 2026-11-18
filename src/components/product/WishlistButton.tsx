import { Heart } from "lucide-react";

import type { Product } from "@/data/types";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function WishlistButton({ product, className, withLabel = false }: { product: Product; className?: string; withLabel?: boolean }) {
  const { isWishlisted, toggleWishlist } = useStore();
  const active = isWishlisted(product.id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/90 backdrop-blur transition-all hover:scale-105 hover:border-coral",
        withLabel ? "h-12 px-4 text-sm font-semibold" : "size-9",
        className,
      )}
    >
      <Heart className={cn("size-4", active ? "fill-coral text-coral" : "text-foreground")} aria-hidden />
      {withLabel && <span>{active ? "Saved" : "Wishlist"}</span>}
    </button>
  );
}
