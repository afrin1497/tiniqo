import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/common/ContentPages";
import { siteConfig } from "@/config/site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/exchange-return")({
  head: () => seo({
    title: "Exchange & Return Policy",
    description: `Returns and exchanges within ${siteConfig.returnWindowDays} days of delivery: eligibility, pickup charges, refund timelines and what we can’t accept.`,
  }),
  component: () => <PolicyPage kind="exchange" />,
});
