import { createFileRoute } from "@tanstack/react-router";

import { CategoryHub } from "@/components/catalog/CategoryHub";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/boys")({
  head: () => seo({ title: "Boys Clothing", description: "Shop Tiniqo boys clothing: ethnic, party and everyday styles." }),
  component: () => <CategoryHub gender="boys" />,
});
