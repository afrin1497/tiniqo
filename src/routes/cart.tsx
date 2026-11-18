import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/common/PageHeader";
import { CartLineItem } from "@/components/layout/CartLineItem";
import { FreeShippingBar } from "@/components/layout/FreeShippingBar";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/pricing";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => seo({ title: "Your Cart", description: "Review your Tiniqo cart." }),
  component: CartPage,
});

function CartPage() {
  const { cartLines, cartSubtotal } = useStore();
  return (
    <>
      <PageHeader title="Your cart" crumbs={[{ label: "Cart" }]} />
      <div className="container-page max-w-3xl space-y-4 py-8">
        {cartLines.length === 0 ? <p className="text-muted-foreground">Your cart is empty.</p> : (
          <>
            <FreeShippingBar subtotal={cartSubtotal} />
            <ul className="divide-y divide-border">{cartLines.map((l) => <CartLineItem key={l.key} line={l} />)}</ul>
            <div className="flex items-center justify-between font-bold"><span>Subtotal</span><span>{formatPrice(cartSubtotal)}</span></div>
            <Button asChild variant="cta" size="lg" className="w-full"><Link to="/checkout">Checkout</Link></Button>
          </>
        )}
      </div>
    </>
  );
}
