import { createFileRoute } from "@tanstack/react-router";

import { CategoryHub } from "@/components/catalog/CategoryHub";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/baby")({
  head: () => seo({ title: "Baby Clothing", description: "Shop Tiniqo baby clothing: ethnic, party and everyday styles." }),
  component: () => <CategoryHub gender="baby" />,
});
