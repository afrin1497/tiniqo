import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, MessageCircle, PackageSearch, Truck } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { img } from "@/data/images";
import { formatDate } from "@/lib/delivery";
import { formatPrice } from "@/lib/pricing";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";
import { whatsappLink } from "@/lib/whatsapp";

const PAYMENT_LABEL = { upi: "UPI", card: "Card", netbanking: "Netbanking", wallet: "Wallet", cod: "Cash on Delivery" } as const;

export const Route = createFileRoute("/order-success")({
  validateSearch: (s: Record<string, unknown>): { order?: string } => (typeof s.order === "string" ? { order: s.order } : {}),
  head: () => {
    const { meta } = seo({ title: "Order Confirmed", description: "Thank you for shopping with Tiniqo — your order is confirmed." });
    return { meta: [...meta, { name: "robots", content: "noindex" }] };
  },
  component: OrderSuccess,
});

function OrderSuccess() {
  const { order: orderId } = Route.useSearch();
  const { hydrated, orders } = useStore();
  const order = orderId ? orders.find((o) => o.id === orderId) : orders[0];

  if (!hydrated) return <div className="container-page max-w-3xl space-y-4 py-12"><Skeleton className="h-40 rounded-2xl" /><Skeleton className="h-64 rounded-2xl" /></div>;

  if (!order) {
    return (
      <div className="container-page max-w-2xl py-16">
        <EmptyState icon={PackageSearch} title="We couldn't find that order" text="If you just placed it, check your email for confirmation, or track it with your order number."
          action={<div className="flex flex-wrap justify-center gap-2"><Button asChild variant="outline"><Link to="/track-order">Track order</Link></Button><Button asChild variant="cta"><Link to="/">Continue shopping</Link></Button></div>} />
      </div>
    );
  }

  return (
    <div className="container-page max-w-3xl space-y-6 py-10 md:py-14">
      <section className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft md:p-10">
        <CheckCircle2 className="mx-auto size-14 text-sage-deep" aria-hidden />
        <h1 className="mt-4 text-3xl font-extrabold">Thank you! Your order is confirmed</h1>
        <p className="mt-2 text-muted-foreground">We've sent a confirmation to <strong className="text-foreground">{order.email}</strong>.</p>
        <dl className="mt-6 grid gap-3 text-left sm:grid-cols-3">
          <div className="rounded-xl bg-secondary p-4"><dt className="text-xs uppercase tracking-wide text-muted-foreground">Order number</dt><dd className="mt-1 font-heading text-lg font-extrabold">{order.id}</dd></div>
          <div className="rounded-xl bg-secondary p-4"><dt className="text-xs uppercase tracking-wide text-muted-foreground">Estimated delivery</dt><dd className="mt-1 flex items-center gap-1.5 font-bold"><Truck className="size-4 text-sage-deep" aria-hidden />{formatDate(order.estimatedDelivery)}</dd></div>
          <div className="rounded-xl bg-secondary p-4"><dt className="text-xs uppercase tracking-wide text-muted-foreground">Payment</dt><dd className="mt-1 font-bold">{PAYMENT_LABEL[order.paymentMethod]}{order.paymentMethod === "cod" ? " · pay on delivery" : " · paid"}</dd></div>
        </dl>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-xl font-extrabold">Order summary</h2>
        <ul className="mt-4 divide-y divide-border">
          {order.items.map((i) => (
            <li key={`${i.productId}-${i.size}`} className="flex items-center gap-3 py-3">
              <img src={img(i.image)} alt="" width={56} height={70} className="h-[70px] w-14 rounded-lg object-cover" />
              <span className="flex-1 text-sm"><Link to="/products/$slug" params={{ slug: i.slug }} className="font-semibold hover:underline">{i.title}</Link><span className="block text-muted-foreground">Size {i.size} · Qty {i.qty}</span></span>
              <span className="font-bold">{formatPrice(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-2 space-y-1.5 border-t border-border pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
          {order.discount > 0 && <div className="flex justify-between text-sage-deep"><dt>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</dt><dd>− {formatPrice(order.discount)}</dd></div>}
          <div className="flex justify-between"><dt className="text-muted-foreground">Shipping ({order.deliveryMethod})</dt><dd>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd></div>
          <div className="flex justify-between pt-2 text-lg font-extrabold"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
        </dl>
        <div className="mt-5 rounded-xl bg-secondary p-4 text-sm">
          <p className="font-semibold">Shipping to</p>
          <p className="text-muted-foreground">{order.address.name}, {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}, {order.address.city}, {order.address.state} {order.address.pincode} · {order.address.phone}</p>
        </div>
      </section>

      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild variant="cta" size="lg"><Link to="/">Continue shopping</Link></Button>
        <Button asChild variant="outline" size="lg"><Link to="/track-order">Track your order</Link></Button>
        <Button asChild variant="ghost" size="lg"><a href={whatsappLink(`Hi! I have a question about my order ${order.id}.`)} target="_blank" rel="noreferrer"><MessageCircle className="size-4" aria-hidden /> Help on WhatsApp</a></Button>
      </div>
    </div>
  );
}
