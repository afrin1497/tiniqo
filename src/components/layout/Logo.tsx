import { Link } from "@tanstack/react-router";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2", className)} aria-label={`${siteConfig.name} home`}>
      <span aria-hidden className="relative grid size-9 place-items-center rounded-full bg-primary">
        <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-coral" />
        <span className="font-heading text-lg font-black text-primary-foreground">t</span>
      </span>
      <span className="font-heading text-2xl font-black tracking-tight text-foreground">{siteConfig.name.toLowerCase()}</span>
    </Link>
  );
}
