import { createFileRoute } from "@tanstack/react-router";

import { CategoryHub } from "@/components/catalog/CategoryHub";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/girls")({
  head: () => seo({ title: "Girls Clothing", description: "Shop Tiniqo girls clothing: ethnic, party and everyday styles." }),
  component: () => <CategoryHub gender="girls" />,
});
