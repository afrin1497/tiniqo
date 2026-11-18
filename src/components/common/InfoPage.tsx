import type { ReactNode } from "react";

import { PageHeader } from "./PageHeader";

export function InfoPage({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return (
    <>
      <PageHeader title={title} description={description} crumbs={[{ label: title }]} />
      <div className="container-page prose-tiniqo max-w-3xl py-10">
        {children ?? (
          <p>[Placeholder] This page is part of the skeleton. Replace this text with your own content.</p>
        )}
      </div>
    </>
  );
}
