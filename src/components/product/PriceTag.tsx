import { discountPercent, formatPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function PriceTag({ price, compareAtPrice, size = "sm", className }: { price: number; compareAtPrice: number | null; size?: "sm" | "lg"; className?: string }) {
  const pct = discountPercent(price, compareAtPrice);
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span className={cn("font-heading font-extrabold text-foreground", size === "lg" ? "text-3xl" : "text-base")}>
        {formatPrice(price)}
      </span>
      {pct > 0 && compareAtPrice && (
        <>
          <span className={cn("text-muted-foreground line-through", size === "lg" ? "text-lg" : "text-sm")}>
            <span className="sr-only">Original price </span>
            {formatPrice(compareAtPrice)}
          </span>
          <span className={cn("rounded-md bg-coral-soft px-1.5 py-0.5 font-bold text-foreground", size === "lg" ? "text-sm" : "text-xs")}>
            Save {pct}%
          </span>
        </>
      )}
    </div>
  );
}
