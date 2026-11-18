import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/common/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/faq")({
  head: () => seo({ title: "FAQ", description: "Answers about sizing, shipping, payments, exchange and care." }),
  component: () => <InfoPage title="FAQ" description="Answers about sizing, shipping, payments, exchange and care." />,
});
