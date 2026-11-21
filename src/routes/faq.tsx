import { createFileRoute } from "@tanstack/react-router";
import { FaqPage } from "@/components/common/ContentPages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/faq")({
  head: () => seo({
    title: "Frequently Asked Questions",
    description: "Find Tiniqo answers about sizing, shipping, payments, exchanges and caring for kidswear.",
  }),
  component: FaqPage,
});
