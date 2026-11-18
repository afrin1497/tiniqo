import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/common/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/checkout")({
  head: () => seo({ title: "Checkout", description: "Secure checkout for your Tiniqo order." }),
  component: () => <InfoPage title="Checkout" description="Secure checkout for your Tiniqo order." />,
});
