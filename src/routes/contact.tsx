import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/common/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => seo({ title: "Contact Us", description: "Reach Tiniqo by phone, WhatsApp or email." }),
  component: () => <InfoPage title="Contact Us" description="Reach Tiniqo by phone, WhatsApp or email." />,
});
