import type { SizeRow } from "@/data/sizeChart";

export interface SizeRecommendation {
  row: SizeRow;
  betweenSizes: boolean;
}

/**
 * Recommends a size from a chest measurement (inches).
 * Picks the smallest size whose chest is at least the child's chest.
 * When the measurement falls strictly between two sizes, the bigger one is chosen.
 */
export function recommendByChest(rows: SizeRow[], chest: number): SizeRecommendation | null {
  if (!rows.length || !(chest > 0)) return null;
  const sorted = [...rows].sort((a, b) => a.chest - b.chest);
  const idx = sorted.findIndex((r) => r.chest >= chest);
  if (idx === -1) return { row: sorted[sorted.length - 1]!, betweenSizes: false };
  const row = sorted[idx]!;
  const between = idx > 0 && row.chest !== chest;
  return { row, betweenSizes: between };
}

/** Recommends a size from the child's age in months. */
export function recommendByAge(rows: SizeRow[], ageMonths: number): SizeRecommendation | null {
  if (!rows.length || ageMonths < 0) return null;
  const sorted = [...rows].sort((a, b) => a.minMonths - b.minMonths);
  const row = sorted.find((r) => ageMonths >= r.minMonths && ageMonths < r.maxMonths);
  if (row) return { row, betweenSizes: false };
  // In a gap between bands (e.g. 8.5 years) pick the next size up.
  const next = sorted.find((r) => r.minMonths > ageMonths);
  if (next) return { row: next, betweenSizes: true };
  return { row: sorted[sorted.length - 1]!, betweenSizes: false };
}
