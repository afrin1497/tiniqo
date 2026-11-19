import { Check } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { Filters } from "@/lib/catalog";
import { formatPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export interface Facets {
  sizes: { label: string; age: string }[];
  colours: { name: string; hex: string }[];
  materials: string[];
  maxPrice: number;
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-border pb-5 last:border-b-0">
      <legend className="mb-3 font-heading text-base font-extrabold">{title}</legend>
      {children}
    </fieldset>
  );
}

export function FilterPanel({
  facets,
  filters,
  onChange,
  idPrefix = "f",
}: {
  facets: Facets;
  filters: Filters;
  onChange: (f: Filters) => void;
  idPrefix?: string;
}) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  return (
    <div className="space-y-5">
      <Group title="Availability">
        <label htmlFor={`${idPrefix}-stock`} className="flex items-center justify-between gap-3 text-sm">
          <span>In stock only</span>
          <Switch id={`${idPrefix}-stock`} checked={filters.inStockOnly} onCheckedChange={(v) => set({ inStockOnly: v })} />
        </label>
      </Group>

      <Group title="Size">
        <div className="flex flex-wrap gap-2">
          {facets.sizes.map((s) => {
            const active = filters.sizes.includes(s.label);
            return (
              <button
                key={s.label}
                type="button"
                aria-pressed={active}
                onClick={() => set({ sizes: toggle(filters.sizes, s.label) })}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors",
                  active ? "border-sage-deep bg-sage-soft text-foreground" : "border-border bg-card hover:border-primary",
                )}
              >
                {s.label}
                {s.age && s.age !== s.label && <span className="ml-1 font-normal text-muted-foreground">({s.age})</span>}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Price">
        <Slider
          min={0}
          max={facets.maxPrice}
          step={50}
          value={[filters.priceMin, Math.min(filters.priceMax, facets.maxPrice)]}
          onValueChange={([min = 0, max = facets.maxPrice]) => set({ priceMin: min, priceMax: max })}
          aria-label="Price"
          className="mt-2"
        />
        <p className="mt-3 flex justify-between text-sm text-muted-foreground">
          <span>{formatPrice(filters.priceMin)}</span>
          <span>{formatPrice(Math.min(filters.priceMax, facets.maxPrice))}</span>
        </p>
      </Group>

      <Group title="Colour">
        <div className="flex flex-wrap gap-2.5">
          {facets.colours.map((c) => {
            const active = filters.colours.includes(c.name);
            return (
              <button
                key={c.name}
                type="button"
                aria-pressed={active}
                aria-label={c.name}
                title={c.name}
                onClick={() => set({ colours: toggle(filters.colours, c.name) })}
                className={cn(
                  "grid size-8 place-items-center rounded-full border-2 transition-transform hover:scale-110",
                  active ? "border-sage-deep" : "border-border",
                )}
                // Swatch colours come from product data, so they are applied inline.
                style={{ backgroundColor: c.hex }}
              >
                {active && <Check className="size-4 text-foreground" aria-hidden />}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Material">
        <ul className="space-y-2.5">
          {facets.materials.map((m) => (
            <li key={m}>
              <label htmlFor={`${idPrefix}-mat-${m}`} className="flex items-center gap-2.5 text-sm">
                <Checkbox
                  id={`${idPrefix}-mat-${m}`}
                  checked={filters.materials.includes(m)}
                  onCheckedChange={() => set({ materials: toggle(filters.materials, m) })}
                />
                {m}
              </label>
            </li>
          ))}
        </ul>
      </Group>
    </div>
  );
}

export function activeFilterCount(f: Filters, maxPrice: number): number {
  return (
    Number(f.inStockOnly) +
    f.sizes.length +
    f.colours.length +
    f.materials.length +
    Number(f.priceMin > 0 || f.priceMax < maxPrice)
  );
}
