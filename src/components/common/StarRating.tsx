import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function StarRating({ rating, size = "sm", className }: { rating: number; size?: "sm" | "md"; className?: string }) {
  const px = size === "sm" ? "size-3.5" : "size-5";
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${rating} out of 5 stars`} role="img">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(px, i <= Math.round(rating) ? "fill-coral text-coral" : "fill-muted text-border")}
        />
      ))}
    </span>
  );
}
