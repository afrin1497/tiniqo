import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/common/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/track-order")({
  head: () => seo({ title: "Track Order", description: "Check the status of your Tiniqo order." }),
  component: () => <InfoPage title="Track Order" description="Check the status of your Tiniqo order." />,
});
