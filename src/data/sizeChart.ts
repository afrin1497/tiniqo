// Size charts in inches. Replace with your own measurements.
export interface SizeRow {
  size: string;
  age: string;
  chest: number;
  waist: number;
  length: number;
  /** age range in months, used by the size finder */
  minMonths: number;
  maxMonths: number;
}

const kidsBase: Omit<SizeRow, "length">[] = [
  { size: "18", age: "1-2Y", chest: 20, waist: 19.5, minMonths: 12, maxMonths: 24 },
  { size: "20", age: "2-3Y", chest: 21, waist: 20, minMonths: 24, maxMonths: 36 },
  { size: "22", age: "3-4Y", chest: 22, waist: 20.5, minMonths: 36, maxMonths: 48 },
  { size: "24", age: "4-5Y", chest: 23, waist: 21, minMonths: 48, maxMonths: 60 },
  { size: "26", age: "5-6Y", chest: 24, waist: 21.5, minMonths: 60, maxMonths: 72 },
  { size: "28", age: "6-7Y", chest: 25, waist: 22, minMonths: 72, maxMonths: 84 },
  { size: "30", age: "7-8Y", chest: 26, waist: 22.5, minMonths: 84, maxMonths: 96 },
  { size: "32", age: "9-10Y", chest: 27.5, waist: 23.5, minMonths: 108, maxMonths: 120 },
  { size: "34", age: "11-12Y", chest: 29, waist: 24.5, minMonths: 132, maxMonths: 144 },
  { size: "36", age: "12-13Y", chest: 30.5, waist: 25.5, minMonths: 144, maxMonths: 156 },
];

const withLength = (start: number, step: number) =>
  kidsBase.map((r, i) => ({ ...r, length: Math.round((start + i * step) * 2) / 2 }));

export const sizeCharts = {
  frock: { label: "Frock", note: "Length measured from shoulder to hem.", rows: withLength(18, 1.5) },
  set: { label: "Set", note: "Length is for the top / kurta, shoulder to hem.", rows: withLength(15, 1.25) },
  shirt: { label: "Shirt", note: "Length measured from back collar to hem.", rows: withLength(14, 1) },
  romper: {
    label: "Baby romper",
    note: "Length measured from shoulder to crotch snap.",
    rows: [
      { size: "0-3M", age: "0-3M", chest: 16, waist: 16, length: 14, minMonths: 0, maxMonths: 3 },
      { size: "3-6M", age: "3-6M", chest: 17, waist: 17, length: 15, minMonths: 3, maxMonths: 6 },
      { size: "6-9M", age: "6-9M", chest: 18, waist: 18, length: 16, minMonths: 6, maxMonths: 9 },
      { size: "9-12M", age: "9-12M", chest: 19, waist: 18.5, length: 17, minMonths: 9, maxMonths: 12 },
      { size: "12-18M", age: "12-18M", chest: 19.5, waist: 19, length: 18, minMonths: 12, maxMonths: 18 },
      { size: "18-24M", age: "18-24M", chest: 20, waist: 19.5, length: 19, minMonths: 18, maxMonths: 24 },
    ],
  },
} satisfies Record<string, { label: string; note: string; rows: SizeRow[] }>;

export type SizeChartKey = keyof typeof sizeCharts;
