import { createFileRoute } from "@tanstack/react-router";
import { BulkEnquiryPage } from "@/components/common/ContentPages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/bulk-enquiry")({
  head: () => seo({
    title: "Wholesale & Bulk Enquiries",
    description: "Plan kidswear orders for retail shops, schools, events and gifting with a tailored Tiniqo enquiry.",
  }),
  component: BulkEnquiryPage,
});
