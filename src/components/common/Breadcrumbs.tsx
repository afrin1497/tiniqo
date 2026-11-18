import { ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { AppLink, type AppHref } from "./AppLink";

export function Breadcrumbs({ items }: { items: { label: string; to?: AppHref }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link to="/" className="hover:text-foreground">Home</Link>
        </li>
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-1">
            <ChevronRight className="size-3.5" aria-hidden />
            {c.to && i < items.length - 1 ? (
              <AppLink href={c.to} className="hover:text-foreground">{c.label}</AppLink>
            ) : (
              <span aria-current={i === items.length - 1 ? "page" : undefined} className="font-medium text-foreground">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
