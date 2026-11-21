import { createFileRoute } from "@tanstack/react-router";
import { StoryPage } from "@/components/common/ContentPages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => seo({
    title: "Our Story",
    description: "Meet Tiniqo: thoughtful kidswear for everyday adventures, family celebrations and room to grow.",
  }),
  component: StoryPage,
});
