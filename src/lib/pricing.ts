import { siteConfig } from "@/config/site";

export function formatPrice(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

/** Whole-number "Save %" for a discounted product, or 0 when not discounted. */
export function discountPercent(price: number, compareAtPrice: number | null): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export interface PricedLine { price: number; qty: number }

export function subtotalOf(lines: PricedLine[]): number {
  return lines.reduce((sum, l) => sum + l.price * l.qty, 0);
}

/** Amount still needed to unlock free shipping (0 once unlocked). */
export function freeShippingRemaining(subtotal: number, threshold: number = siteConfig.freeShippingThreshold): number {
  return Math.max(0, threshold - subtotal);
}

export type DeliveryMethod = "standard" | "express";

export function shippingFee(
  subtotalAfterDiscount: number,
  method: DeliveryMethod = "standard",
  cfg: { freeShippingThreshold: number; flatShippingFee: number; expressShippingFee: number } = siteConfig,
): number {
  if (subtotalAfterDiscount <= 0) return 0;
  if (method === "express") return cfg.expressShippingFee;
  return subtotalAfterDiscount >= cfg.freeShippingThreshold ? 0 : cfg.flatShippingFee;
}

export interface Coupon {
  code: string;
  type: "percent" | "flat";
  value: number;
  minSubtotal: number;
  label: string;
}

export type CouponResult = { ok: true; coupon: Coupon; discount: number } | { ok: false; error: string };

export function applyCoupon(
  code: string,
  subtotal: number,
  coupons: readonly Coupon[] = siteConfig.coupons,
): CouponResult {
  const c = coupons.find((x) => x.code.toLowerCase() === code.trim().toLowerCase());
  if (!c) return { ok: false, error: "That code isn't valid." };
  if (subtotal < c.minSubtotal) return { ok: false, error: `Add ${formatPrice(c.minSubtotal - subtotal)} more to use ${c.code}.` };
  const raw = c.type === "percent" ? (subtotal * c.value) / 100 : c.value;
  return { ok: true, coupon: c, discount: Math.min(Math.round(raw), subtotal) };
}

export function orderTotals(opts: { subtotal: number; discount: number; method: DeliveryMethod }) {
  const afterDiscount = Math.max(0, opts.subtotal - opts.discount);
  const shipping = shippingFee(afterDiscount, opts.method);
  return { subtotal: opts.subtotal, discount: opts.discount, shipping, total: afterDiscount + shipping };
}
