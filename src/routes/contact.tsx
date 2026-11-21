import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/common/ContentPages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => seo({
    title: "Contact Us",
    description: "Get in touch with Tiniqo for sizing guidance, order questions and friendly shopping support.",
  }),
  component: ContactPage,
});
