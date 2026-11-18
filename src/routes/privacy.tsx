import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/common/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => seo({ title: "Privacy Policy", description: "How Tiniqo handles your personal data." }),
  component: () => <InfoPage title="Privacy Policy" description="How Tiniqo handles your personal data." />,
});
