import type { ReactNode } from "react";

import type { AppHref } from "./AppLink";
import { Breadcrumbs } from "./Breadcrumbs";

export function PageHeader({
  title,
  description,
  crumbs,
  children,
}: {
  title: string;
  description?: string;
  crumbs?: { label: string; to?: AppHref }[];
  children?: ReactNode;
}) {
  return (
    <header className="bg-garden border-b border-border bg-secondary/60">
      <div className="container-page py-8 md:py-12">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>}
        {children}
      </div>
    </header>
  );
}
