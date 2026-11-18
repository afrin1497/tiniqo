import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/common/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/shipping-policy")({
  head: () => seo({ title: "Shipping Policy", description: "Tiniqo shipping timelines and charges." }),
  component: () => <InfoPage title="Shipping Policy" description="Tiniqo shipping timelines and charges." />,
});
