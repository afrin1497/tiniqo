import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, MessageCircle, Package } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import { products } from "@/data";
import { addDays, formatDate } from "@/lib/delivery";
import { formatPrice } from "@/lib/pricing";
import { seo } from "@/lib/seo";
import { useStore, type Order } from "@/lib/store";

export const Route = createFileRoute("/track-order")({
  head: () => seo({
    title: "Track Order",
    description: "Check the status of your Tiniqo order.",
  }),
  component: TrackOrderPage,
});

const steps = [
  { status: "placed", label: "Order placed", day: 0 },
  { status: "packed", label: "Packed", day: 1 },
  { status: "shipped", label: "Shipped", day: 2 },
  { status: "out-for-delivery", label: "Out for delivery", day: 4 },
  { status: "delivered", label: "Delivered", day: 5 },
] as const;

type TrackingOrder = Pick<Order,
  "id" | "createdAt" | "status" | "estimatedDelivery" | "items" | "total"
>;

function TrackOrderPage() {
  const { hydrated, orders } = useStore();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ order: TrackingOrder; demo: boolean } | null>(null);
  const [error, setError] = useState("");

  function track(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hydrated) return;
    const value = query.trim();
    const phone = value.replace(/[\s()-]/g, "");
    const found = orders.find((order) =>
      order.id.toLowerCase() === value.toLowerCase() ||
      (/^\d{10}$/.test(phone) && order.phone.replace(/\D/g, "").slice(-10) === phone)
    );
    setError("");
    if (found) {
      setResult({ order: found, demo: false });
      return;
    }
    if (/^TQ[-A-Z0-9]+$/i.test(value) || /^\d{10}$/.test(phone)) {
      const product = products[0];
      const createdAt = addDays(new Date(), -3).toISOString();
      setResult({
        demo: true,
        order: {
          id: /^TQ/i.test(value) ? value.toUpperCase() : "TQ-DEMO",
          createdAt,
          status: "shipped",
          estimatedDelivery: addDays(new Date(createdAt), 5).toISOString(),
          items: product ? [{
            productId: product.id,
            slug: product.slug,
            title: product.title,
            size: product.sizes[0]?.label ?? "20",
            qty: 1,
            price: product.price,
            image: product.images[0] ?? "",
          }] : [],
          total: product?.price ?? 0,
        },
      });
      return;
    }
    setResult(null);
    setError("Order not found. Enter an order number beginning with TQ or a 10-digit phone number.");
  }

  const current = result ? steps.findIndex((step) => step.status === result.order.status) : -1;

  return (
    <>
      <PageHeader title="Track Order" description="Follow your little parcel from our hands to yours." crumbs={[{ label: "Track Order" }]} />
      <main className="container-page max-w-4xl space-y-8 py-8">
        <form onSubmit={track} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <Label htmlFor="tracking-query">Order number or phone number</Label>
          <p id="tracking-hint" className="my-2 text-sm text-muted-foreground">
            Use your TQ order number or the 10-digit phone number from checkout.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input id="tracking-query" value={query} onChange={(event) => setQuery(event.target.value)}
              placeholder="e.g. TQ12345" required aria-describedby={error ? "tracking-hint tracking-error" : "tracking-hint"} aria-invalid={!!error} />
            <Button variant="cta" type="submit" disabled={!hydrated}>
              {hydrated ? "Track order" : "Loading orders…"}
            </Button>
          </div>
          {error && <p id="tracking-error" role="alert" className="mt-3 font-medium">{error}</p>}
        </form>

        {result && (
          <section aria-live="polite" aria-labelledby="tracking-title" className="space-y-6">
            {result.demo && (
              <p className="rounded-xl bg-sage-soft p-4 text-sage-deep">
                Demo tracking — no matching saved order was found. This sample shows how tracking works; it is not a real shipment.
              </p>
            )}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 id="tracking-title" className="text-xl font-bold">{result.order.id}</h2>
              <p className="mt-2 text-muted-foreground">
                {result.order.status === "delivered" ? "Delivered" : "Estimated delivery"}:{" "}
                {formatDate(result.order.estimatedDelivery)}
              </p>
              <ol className="mt-6">
                {steps.map((step, index) => {
                  const done = index < current;
                  const active = index === current;
                  return (
                    <li key={step.status} aria-current={active ? "step" : undefined} className="relative flex gap-4 pb-7 last:pb-0">
                      {index < steps.length - 1 && <span aria-hidden className="absolute bottom-0 left-5 top-10 border-l border-border" />}
                      <span className={`relative grid size-10 shrink-0 place-items-center rounded-full ${index <= current ? "bg-sage-soft text-sage-deep" : "bg-secondary text-muted-foreground"} ${active ? "ring-2 ring-sage-deep ring-offset-2 ring-offset-card" : ""}`}>
                        {done ? <Check className="size-5" aria-hidden /> : <Package className="size-5" aria-hidden />}
                      </span>
                      <div>
                        <h3 className={active ? "font-bold text-sage-deep" : "font-semibold"}>
                          {step.label}{active && <span className="ml-2 text-sm">(Current status)</span>}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {index > current ? "Expected " : ""}
                          {formatDate(addDays(new Date(result.order.createdAt), step.day).toISOString())}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-xl font-bold">In your parcel</h2>
              <ul className="my-5 space-y-4">
                {result.order.items.map((item, index) => (
                  <li key={`${item.productId}-${item.size}-${index}`} className="flex items-center gap-4">
                    <img src={item.image} alt={item.title} className="h-24 w-20 rounded-lg object-cover" />
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">Size {item.size} · Qty {item.qty}</p>
                      <p>{formatPrice(item.price * item.qty)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="border-t border-border pt-4 font-bold">Order total: {formatPrice(result.order.total)}</p>
            </div>
          </section>
        )}
        <section className="rounded-2xl bg-sage-soft p-6">
          <h2 className="text-lg font-bold">Need a hand?</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <a href={`https://wa.me/${siteConfig.contact.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 size-4" aria-hidden /> WhatsApp us
              </a>
            </Button>
            <Button variant="outline" asChild><Link to="/contact">Contact support</Link></Button>
          </div>
        </section>
      </main>
    </>
  );
}
