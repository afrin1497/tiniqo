import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/common/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  head: () => seo({ title: "Journal", description: "Sizing guides, festive style tips and care advice from Tiniqo." }),
  component: () => <InfoPage title="Journal" description="Sizing guides, festive style tips and care advice from Tiniqo." />,
});
