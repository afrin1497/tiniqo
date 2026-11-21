import { createFileRoute } from "@tanstack/react-router";
import { JournalPage } from "@/components/common/ContentPages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  head: () => seo({
    title: "The Tiniqo Journal",
    description: "Explore kidswear sizing guides, festive dressing inspiration and gentle clothing-care advice from Tiniqo.",
  }),
  component: JournalPage,
});
