import type { SizeRow } from "@/data/sizeChart";
import { cn } from "@/lib/utils";

export function SizeTable({ rows, highlight }: { rows: SizeRow[]; highlight?: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[420px] text-sm">
        <caption className="sr-only">Size chart in inches</caption>
        <thead className="bg-secondary text-left">
          <tr>
            {["Size", "Age", "Chest", "Waist", "Length"].map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-bold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.size} className={cn("border-t border-border", highlight === r.size && "bg-coral-soft font-semibold")}>
              <th scope="row" className="px-4 py-2.5 text-left font-bold">{r.size}</th>
              <td className="px-4 py-2.5">{r.age}</td>
              <td className="px-4 py-2.5">{r.chest}″</td>
              <td className="px-4 py-2.5">{r.waist}″</td>
              <td className="px-4 py-2.5">{r.length}″</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
