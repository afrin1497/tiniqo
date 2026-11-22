import { describe, expect, it } from "vitest";

import { sizeCharts } from "@/data/sizeChart";
import { recommendByAge, recommendByChest } from "@/lib/sizing";

const rows = sizeCharts.frock.rows;

describe("size finder", () => {
  it("picks the bigger size when the chest is between sizes", () => {
    const r = recommendByChest(rows, 23.5);
    expect(r?.row.size).toBe("26");
    expect(r?.betweenSizes).toBe(true);
  });
  it("matches an exact chest measurement", () => {
    expect(recommendByChest(rows, 22)?.row.size).toBe("22");
  });
  it("recommends size 26 for a 5-year-old", () => {
    expect(recommendByAge(rows, 66)?.row.size).toBe("26");
  });
  it("sizes up when the age falls in a gap between bands", () => {
    expect(recommendByAge(rows, 100)?.row.size).toBe("32");
  });
});
