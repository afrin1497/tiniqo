import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/common/ContentPages";
import { siteConfig } from "@/config/site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/exchange-return")({
  head: () => seo({
    title: "Exchange & Return Policy",
    description: `Learn about Tiniqo’s ${siteConfig.exchangeWindowDays}-day exchange window, eligibility and support for damaged or incorrect items.`,
  }),
  component: () => <PolicyPage kind="exchange" />,
});
