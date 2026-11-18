import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/common/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/size-chart")({
  head: () => seo({ title: "Size Chart & How to Measure", description: "Find the right Tiniqo size for your child." }),
  component: () => <InfoPage title="Size Chart & How to Measure" description="Find the right Tiniqo size for your child." />,
});
