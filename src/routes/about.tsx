import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/common/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => seo({ title: "About Tiniqo", description: "Our story: soft, breathable kidswear made for play." }),
  component: () => <InfoPage title="About Tiniqo" description="Our story: soft, breathable kidswear made for play." />,
});
