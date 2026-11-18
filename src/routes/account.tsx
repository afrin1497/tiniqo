import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/common/InfoPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/account")({
  head: () => seo({ title: "My Account", description: "Your Tiniqo orders, addresses and wishlist." }),
  component: () => <InfoPage title="My Account" description="Your Tiniqo orders, addresses and wishlist." />,
});
