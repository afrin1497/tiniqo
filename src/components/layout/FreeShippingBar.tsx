import { Truck } from "lucide-react";

import { siteConfig } from "@/config/site";
import { formatPrice, freeShippingRemaining } from "@/lib/pricing";

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const remaining = freeShippingRemaining(subtotal);
  const pct = Math.min(100, (subtotal / siteConfig.freeShippingThreshold) * 100);
  return (
    <div className="rounded-xl bg-secondary p-3">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Truck className="size-4 text-sage-deep" aria-hidden />
        {remaining > 0 ? (
          <span>Add <strong>{formatPrice(remaining)}</strong> more for free shipping</span>
        ) : (
          <span>Yay! You've unlocked free shipping 🎉</span>
        )}
      </p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-card" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label="Progress to free shipping">
        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
