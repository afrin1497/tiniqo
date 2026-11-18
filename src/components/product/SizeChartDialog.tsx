import { Ruler } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { sizeCharts, type SizeChartKey } from "@/data/sizeChart";
import { SizeTable } from "./SizeTable";

export function SizeChartDialog({ chart, triggerLabel = "Size chart" }: { chart: SizeChartKey; triggerLabel?: string }) {
  const c = sizeCharts[chart];
  return (
    <Dialog>
      <DialogTrigger className="inline-flex items-center gap-1.5 text-sm font-semibold text-sage-deep underline-offset-4 hover:underline">
        <Ruler className="size-4" aria-hidden /> {triggerLabel}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-extrabold">{c.label} size chart</DialogTitle>
          <DialogDescription>All measurements in inches. {c.note} Between sizes? Pick the bigger one.</DialogDescription>
        </DialogHeader>
        <SizeTable rows={c.rows} />
        <Link to="/size-chart" className="text-sm font-semibold text-sage-deep underline-offset-4 hover:underline">
          How to measure & find my size →
        </Link>
      </DialogContent>
    </Dialog>
  );
}
