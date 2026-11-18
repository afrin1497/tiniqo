import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/common/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => seo({ title: "Terms of Service", description: "The terms for shopping with Tiniqo." }),
  component: () => <InfoPage title="Terms of Service" description="The terms for shopping with Tiniqo." />,
});
