import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/common/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/order-success")({
  head: () => seo({ title: "Order Confirmed", description: "Thank you for shopping with Tiniqo." }),
  component: () => <InfoPage title="Order Confirmed" description="Thank you for shopping with Tiniqo." />,
});
