import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/common/PageHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => seo({ title: "Wishlist", description: "Your saved Tiniqo favourites." }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist } = useStore();
  const list = products.filter((p) => wishlist.includes(p.id));
  return (
    <>
      <PageHeader title="Wishlist" crumbs={[{ label: "Wishlist" }]} />
      <div className="container-page py-8">
        {list.length === 0 ? <p className="text-muted-foreground">No saved items yet.</p> : (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">{list.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}</ul>
        )}
      </div>
    </>
  );
}
