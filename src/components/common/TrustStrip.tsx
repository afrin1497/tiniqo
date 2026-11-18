import { PackageCheck, RefreshCcw, ShieldCheck, Truck } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const items = [
  { icon: PackageCheck, title: "Ready stock", text: "Every style in stock" },
  { icon: Truck, title: "Fast shipping", text: "Ships in 1-3 days" },
  { icon: RefreshCcw, title: `${siteConfig.exchangeWindowDays}-day easy exchange`, text: "Free size swaps" },
  { icon: ShieldCheck, title: "Secure payments", text: "UPI, cards & COD" },
];

export function TrustStrip({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3 md:grid-cols-4", className)}>
      {items.map(({ icon: Icon, title, text }) => (
        <li
          key={title}
          className={cn(
            "flex items-center gap-3 rounded-xl border border-border bg-card",
            compact ? "p-3" : "p-4 md:p-5",
          )}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sage-soft text-sage-deep">
            <Icon className="size-5" aria-hidden />
          </span>
          <span>
            <span className="block text-sm font-bold leading-tight">{title}</span>
            {!compact && <span className="block text-xs text-muted-foreground">{text}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}
