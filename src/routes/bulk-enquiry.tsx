import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/common/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/bulk-enquiry")({
  head: () => seo({ title: "Bulk Enquiry", description: "Wholesale and bulk orders for Tiniqo kidswear." }),
  component: () => <InfoPage title="Bulk Enquiry" description="Wholesale and bulk orders for Tiniqo kidswear." />,
});
