import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/common/ContentPages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => seo({
    title: "Terms of Service",
    description: "Review the proposed terms covering Tiniqo orders, product availability, payments and use of the store.",
  }),
  component: () => <PolicyPage kind="terms" />,
});
