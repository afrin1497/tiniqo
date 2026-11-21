import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/common/ContentPages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/shipping-policy")({
  head: () => seo({
    title: "Shipping Policy",
    description: "Review Tiniqo shipping coverage, dispatch estimates, standard charges and express delivery information.",
  }),
  component: () => <PolicyPage kind="shipping" />,
});
