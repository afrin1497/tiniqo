import { ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/pricing";
import { useStore } from "@/lib/store";
import { CartLineItem } from "./CartLineItem";
import { FreeShippingBar } from "./FreeShippingBar";

export function CartDrawer() {
  const { cartOpen, setCartOpen, cartLines, cartCount, cartSubtotal, cartNote, setCartNote } = useStore();
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const close = () => setCartOpen(false);

  const checkout = () => {
    if (!agreed) {
      toast.error("Please accept the terms to continue");
      return;
    }
    close();
    void navigate({ to: "/checkout" });
  };

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle className="font-heading text-xl font-extrabold">Your cart ({cartCount})</SheetTitle>
          <SheetDescription className="sr-only">Review items in your cart and check out</SheetDescription>
        </SheetHeader>

        {cartLines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-sage-soft text-sage-deep">
              <ShoppingBag className="size-7" aria-hidden />
            </span>
            <p className="font-heading text-lg font-extrabold">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">Little outfits are waiting for you.</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Button asChild variant="cta" onClick={close}><Link to="/collections/$slug" params={{ slug: "new-arrivals" }}>Shop new arrivals</Link></Button>
              <Button asChild variant="outline" onClick={close}><Link to="/collections/$slug" params={{ slug: "bestsellers" }}>Bestsellers</Link></Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              <div className="pt-4"><FreeShippingBar subtotal={cartSubtotal} /></div>
              <ul className="divide-y divide-border">
                {cartLines.map((l) => <CartLineItem key={l.key} line={l} onNavigate={close} />)}
              </ul>
              <div className="pb-4">
                <label htmlFor="cart-note" className="text-sm font-semibold">Order note</label>
                <Textarea id="cart-note" value={cartNote} onChange={(e) => setCartNote(e.target.value)} placeholder="Gift message or special instructions" className="mt-1.5 rounded-xl bg-card" rows={2} />
              </div>
            </div>
            <div className="space-y-3 border-t border-border bg-card px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Subtotal</span>
                <span className="font-heading text-xl font-extrabold">{formatPrice(cartSubtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
              <label className="flex items-start gap-2 text-sm">
                <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} className="mt-0.5" />
                <span>
                  I agree to the{" "}
                  <Link to="/terms" onClick={close} className="font-semibold underline">terms & conditions</Link>
                </span>
              </label>
              <Button variant="cta" size="lg" className="w-full" onClick={checkout}>Checkout · {formatPrice(cartSubtotal)}</Button>
              <Link to="/cart" onClick={close} className="block text-center text-sm font-semibold text-sage-deep hover:underline">View full cart</Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
