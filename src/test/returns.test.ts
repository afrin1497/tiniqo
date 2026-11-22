import { describe, expect, it } from "vitest";

import { siteConfig } from "@/config/site";

describe("return policy rules", () => {
  it("accepts returns within 7 days of delivery", () => {
    expect(siteConfig.returnWindowDays).toBe(7);
  });
  it("starts an approved refund within 7 days of inspection", () => {
    expect(siteConfig.refundProcessingDays).toBe(7);
  });
  it("charges a ₹99 pickup fee for a change-of-mind return", () => {
    expect(siteConfig.returnPickupFee).toBe(99);
  });
  it("keeps store credit valid for 12 months", () => {
    expect(siteConfig.storeCreditValidityMonths).toBe(12);
  });
});
