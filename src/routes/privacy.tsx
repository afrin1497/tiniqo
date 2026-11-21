import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/common/ContentPages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => seo({
    title: "Privacy Policy",
    description: "Read about customer information, privacy choices, browser storage and contacting Tiniqo about your data.",
  }),
  component: () => <PolicyPage kind="privacy" />,
});
