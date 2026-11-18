import { BadgeCheck } from "lucide-react";

import type { Review } from "@/data/types";
import { formatDate } from "@/lib/delivery";
import { StarRating } from "./StarRating";

export function ReviewCard({ review, productTitle }: { review: Review; productTitle?: string }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-soft">
      <StarRating rating={review.rating} />
      <h3 className="mt-3 font-heading text-base font-bold">{review.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">“{review.body}”</p>
      <footer className="mt-4 flex items-center justify-between gap-2 text-xs">
        <span>
          <span className="font-bold text-foreground">{review.author}</span>
          <span className="text-muted-foreground"> · {review.city}</span>
        </span>
        {review.verified && (
          <span className="inline-flex items-center gap-1 text-sage-deep">
            <BadgeCheck className="size-3.5" aria-hidden /> Verified
          </span>
        )}
      </footer>
      {productTitle && <p className="mt-2 text-xs text-muted-foreground">On {productTitle} · {formatDate(review.date)}</p>}
    </article>
  );
}
