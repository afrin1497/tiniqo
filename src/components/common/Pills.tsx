import { ageBands, budgets } from "@/data/taxonomy";
import type { Gender } from "@/data/types";
import { AppLink } from "./AppLink";

const pill =
  "inline-flex shrink-0 items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition-colors hover:border-primary hover:bg-sage-soft focus-visible:ring-2 focus-visible:ring-ring";

export function AgePills({ gender }: { gender?: Gender }) {
  const bands = gender === "baby" ? ageBands.filter((b) => b.min < 36) : gender ? ageBands.filter((b) => b.min >= 12) : ageBands;
  return (
    <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
      {bands.map((b) => (
        <li key={b.slug}>
          <AppLink href={`/collections/${gender ? `${gender}-` : ""}age-${b.slug}`} className={pill}>
            {b.label}
          </AppLink>
        </li>
      ))}
    </ul>
  );
}

export function BudgetPills({ gender }: { gender?: Gender }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {budgets.map((b) => (
        <li key={b.slug}>
          <AppLink
            href={`/collections/${gender ? `${gender}-` : ""}${b.slug}`}
            className="flex h-full flex-col items-center justify-center rounded-2xl border border-border bg-card px-4 py-6 text-center transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lift"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Shop</span>
            <span className="mt-1 font-heading text-xl font-extrabold">{b.label}</span>
          </AppLink>
        </li>
      ))}
    </ul>
  );
}
