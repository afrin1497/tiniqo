import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/common/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/exchange-return")({
  head: () => seo({ title: "Exchange & Return", description: "Tiniqo's 7-day easy exchange policy." }),
  component: () => <InfoPage title="Exchange & Return" description="Tiniqo's 7-day easy exchange policy." />,
});
