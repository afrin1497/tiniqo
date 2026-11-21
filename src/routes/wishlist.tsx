import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getProductById } from "@/data";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => seo({ title: "Wishlist", description: "Your saved Tiniqo favourites." }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, hydrated } = useStore();
  const list = wishlist.flatMap((id) => {
    const product = getProductById(id);
    return product ? [product] : [];
  });

  return (
    <>
      <PageHeader title="Wishlist" description="Little favourites, saved for later." crumbs={[{ label: "Wishlist" }]} />
      <main className="container-page py-8">
        {!hydrated ? (
          <div role="status" aria-label="Loading your wishlist" className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Save a little love"
            text="Tap the heart on an outfit you love. Your favourites will be waiting here."
            action={<Button variant="cta" asChild><Link to="/collections/$slug" params={{ slug: "all" }}>Explore the shop</Link></Button>}
          />
        ) : (
          <>
            <p className="mb-5 text-sm text-muted-foreground">{list.length} saved {list.length === 1 ? "outfit" : "outfits"}</p>
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {list.map((product) => <li key={product.id}><ProductCard product={product} /></li>)}
            </ul>
          </>
        )}
      </main>
    </>
  );
}
