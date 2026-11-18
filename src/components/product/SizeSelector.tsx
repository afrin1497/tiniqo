import type { ProductSize } from "@/data/types";
import { cn } from "@/lib/utils";

export function SizeSelector({
  sizes,
  value,
  onChange,
  error,
}: {
  sizes: ProductSize[];
  value: string | null;
  onChange: (label: string) => void;
  error?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label="Select size" className="flex flex-wrap gap-2">
      {sizes.map((s) => {
        const selected = value === s.label;
        const showAge = s.age && s.age !== s.label;
        return (
          <button
            key={s.label}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={!s.inStock}
            onClick={() => onChange(s.label)}
            title={s.inStock ? undefined : "Sold out"}
            className={cn(
              "relative min-w-[4.5rem] rounded-xl border px-3 py-2 text-sm font-semibold transition-all",
              selected
                ? "border-sage-deep bg-sage-soft ring-2 ring-primary"
                : "border-border bg-card hover:border-primary",
              error && !selected && "border-destructive/60",
              !s.inStock && "cursor-not-allowed bg-muted text-muted-foreground line-through decoration-1 opacity-60",
            )}
          >
            {s.label}
            {showAge && <span className="ml-1 font-normal text-muted-foreground">({s.age})</span>}
            {!s.inStock && <span className="sr-only"> — sold out</span>}
          </button>
        );
      })}
    </div>
  );
}
