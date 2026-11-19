import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const btn = "grid size-10 place-items-center rounded-xl border text-sm font-semibold transition-colors disabled:opacity-40";
  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
      <button type="button" className={cn(btn, "border-border bg-card hover:border-primary")} disabled={page === 1} onClick={() => onPage(page - 1)} aria-label="Previous page">
        <ChevronLeft className="size-4" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onPage(n)}
          aria-current={n === page ? "page" : undefined}
          aria-label={`Page ${n}`}
          className={cn(btn, n === page ? "border-sage-deep bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary")}
        >
          {n}
        </button>
      ))}
      <button type="button" className={cn(btn, "border-border bg-card hover:border-primary")} disabled={page === totalPages} onClick={() => onPage(page + 1)} aria-label="Next page">
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
