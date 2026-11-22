import { describe, expect, it } from "vitest";

import { applyCoupon, discountPercent, freeShippingRemaining, orderTotals, shippingFee } from "@/lib/pricing";

describe("pricing rules", () => {
  it("gives free standard shipping at ₹999 and above", () => {
    expect(shippingFee(999)).toBe(0);
  });
  it("charges the flat ₹79 fee below ₹999", () => {
    expect(shippingFee(998)).toBe(79);
  });
  it("always charges ₹149 for express", () => {
    expect(shippingFee(2500, "express")).toBe(149);
  });
  it("shows how much more is needed for free shipping", () => {
    expect(freeShippingRemaining(799)).toBe(200);
  });
  it("TINIQO10 takes 10% off", () => {
    const r = applyCoupon("tiniqo10", 1200);
    expect(r.ok && r.discount).toBe(120);
  });
  it("WELCOME100 needs a ₹799 subtotal", () => {
    expect(applyCoupon("WELCOME100", 700).ok).toBe(false);
  });
  it("free shipping is judged after the discount", () => {
    expect(orderTotals({ subtotal: 1050, discount: 105, method: "standard" })).toEqual({ subtotal: 1050, discount: 105, shipping: 79, total: 1024 });
  });
  it("rounds the Save % badge", () => {
    expect(discountPercent(749, 999)).toBe(25);
  });
});
