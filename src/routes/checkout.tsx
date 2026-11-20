import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Lock, ShieldCheck, ShoppingBag, Tag, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/EmptyState";
import { PaymentMethods, validatePayment, type PaymentErrors } from "@/components/checkout/PaymentMethods";
import { FreeShippingBar } from "@/components/layout/FreeShippingBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";
import { img } from "@/data/images";
import { addDays, checkPincode } from "@/lib/delivery";
import { processPayment, type PaymentDetails, type PaymentMethod } from "@/lib/payments";
import { applyCoupon, formatPrice, orderTotals, type Coupon, type DeliveryMethod } from "@/lib/pricing";
import { seo } from "@/lib/seo";
import { useStore, type Address, type Order } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => seo({ title: "Secure Checkout", description: "Enter your details, choose delivery and pay securely to complete your Tiniqo order." }),
  component: CheckoutPage,
});

type Form = { email: string; phone: string; name: string; line1: string; line2: string; city: string; state: string; pincode: string };
type FormErrors = Partial<Record<keyof Form, string>>;

const EMPTY: Form = { email: "", phone: "", name: "", line1: "", line2: "", city: "", state: "", pincode: "" };

function validate(f: Form): FormErrors {
  const e: FormErrors = {};
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = "Enter a valid email";
  if (!/^[6-9]\d{9}$/.test(f.phone.replace(/\D/g, "").slice(-10))) e.phone = "Enter a 10-digit mobile number";
  if (f.name.trim().length < 2) e.name = "Enter the full name";
  if (f.line1.trim().length < 3) e.line1 = "Enter house / street";
  if (f.city.trim().length < 2) e.city = "Enter city";
  if (f.state.trim().length < 2) e.state = "Enter state";
  if (!checkPincode(f.pincode).valid) e.pincode = "Enter a valid 6-digit pincode";
  return e;
}

const newOrderId = () => `TQ${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 10)}`;

function CheckoutPage() {
  const { hydrated, cartLines, cartSubtotal, cartNote, user, addresses, saveAddress, addOrder, clearCart } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [delivery, setDelivery] = useState<DeliveryMethod>("standard");
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [details, setDetails] = useState<PaymentDetails>({});
  const [payErrors, setPayErrors] = useState<PaymentErrors>({});
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [note, setNote] = useState("");
  const [saveAddr, setSaveAddr] = useState(true);
  const [placing, setPlacing] = useState(false);

  // Prefill from the signed-in account and first saved address once storage has loaded.
  useEffect(() => {
    if (!hydrated) return;
    const a = addresses[0];
    setForm((f) => ({
      ...f,
      email: f.email || user?.email || "",
      phone: f.phone || user?.phone || a?.phone || "",
      name: f.name || a?.name || user?.name || "",
      line1: f.line1 || a?.line1 || "",
      line2: f.line2 || a?.line2 || "",
      city: f.city || a?.city || "",
      state: f.state || a?.state || "",
      pincode: f.pincode || a?.pincode || "",
    }));
    setNote((n) => n || cartNote);
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const pin = checkPincode(form.pincode);
  const codAvailable = pin.valid ? pin.codAvailable : null;
  useEffect(() => {
    if (method === "cod" && codAvailable === false) setMethod("upi");
  }, [codAvailable, method]);

  // Re-check the coupon whenever the subtotal changes (e.g. min-spend no longer met).
  const couponResult = useMemo(() => (coupon ? applyCoupon(coupon.code, cartSubtotal) : null), [coupon, cartSubtotal]);
  const discount = couponResult?.ok ? couponResult.discount : 0;
  const totals = orderTotals({ subtotal: cartSubtotal, discount, method: delivery });

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const applyCode = () => {
    const r = applyCoupon(couponInput, cartSubtotal);
    if (r.ok) {
      setCoupon(r.coupon);
      setCouponError("");
      toast.success(`${r.coupon.code} applied`, { description: `You saved ${formatPrice(r.discount)}` });
    } else {
      setCoupon(null);
      setCouponError(r.error);
    }
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const fe = validate(form);
    const pe = validatePayment(method, details);
    setErrors(fe);
    setPayErrors(pe);
    if (Object.keys(fe).length || Object.keys(pe).length) {
      toast.error("Please check the highlighted fields");
      const first = document.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }
    setPlacing(true);
    const orderId = newOrderId();
    const result = await processPayment({
      orderId,
      amount: totals.total,
      method,
      details,
      customer: { name: form.name, email: form.email, phone: form.phone },
    });
    if (!result.success) {
      setPlacing(false);
      toast.error("Payment failed", { description: result.error });
      return;
    }
    const address: Address = {
      id: addresses.find((a) => a.line1 === form.line1 && a.pincode === form.pincode)?.id ?? `addr_${Date.now().toString(36)}`,
      name: form.name, phone: form.phone, line1: form.line1, line2: form.line2, city: form.city, state: form.state, pincode: form.pincode,
    };
    if (saveAddr) saveAddress(address);
    const maxDays = delivery === "express" ? 2 : pin.maxDays || 7;
    const order: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: cartLines.map((l) => ({
        productId: l.product.id, slug: l.product.slug, title: l.product.title, size: l.size, qty: l.qty, price: l.product.price, image: l.product.images[0] ?? "",
      })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      couponCode: couponResult?.ok ? couponResult.coupon.code : null,
      shipping: totals.shipping,
      total: totals.total,
      email: form.email,
      phone: form.phone,
      address,
      deliveryMethod: delivery,
      paymentMethod: method,
      paymentId: result.paymentId,
      note,
      estimatedDelivery: addDays(new Date(), maxDays + 1).toISOString(),
      status: "placed",
    };
    addOrder(order);
    clearCart();
    void navigate({ to: "/order-success", search: { order: orderId } });
  };

  if (!hydrated) {
    return (
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-4">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-48 rounded-xl" />)}</div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (cartLines.length === 0) {
    return (
      <div className="container-page max-w-2xl py-16">
        <EmptyState icon={ShoppingBag} title="Your cart is empty" text="Add a few little outfits before checking out."
          action={<Button asChild variant="cta"><Link to="/collections/$slug" params={{ slug: "new-arrivals" }}>Shop new arrivals</Link></Button>} />
      </div>
    );
  }

  return (
    <div className="container-page py-8 md:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl font-extrabold">Checkout</h1>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><Lock className="size-4 text-sage-deep" aria-hidden /> Secure checkout</p>
      </div>

      <form onSubmit={placeOrder} noValidate className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
        <div className="space-y-6">
          <Section n={1} title="Contact information">
            {!user && (
              <p className="mb-4 text-sm text-muted-foreground">
                Have an account? <Link to="/account" className="font-semibold text-sage-deep underline-offset-4 hover:underline">Sign in</Link> for faster checkout.
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <F id="email" label="Email" error={errors.email}><Input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} aria-invalid={!!errors.email} /></F>
              <F id="phone" label="Mobile number" error={errors.phone}><Input id="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="98765 43210" value={form.phone} onChange={set("phone")} aria-invalid={!!errors.phone} /></F>
            </div>
          </Section>

          <Section n={2} title="Shipping address">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><F id="name" label="Full name" error={errors.name}><Input id="name" autoComplete="name" value={form.name} onChange={set("name")} aria-invalid={!!errors.name} /></F></div>
              <div className="sm:col-span-2"><F id="line1" label="House no., building, street" error={errors.line1}><Input id="line1" autoComplete="address-line1" value={form.line1} onChange={set("line1")} aria-invalid={!!errors.line1} /></F></div>
              <div className="sm:col-span-2"><F id="line2" label="Area, landmark (optional)"><Input id="line2" autoComplete="address-line2" value={form.line2} onChange={set("line2")} /></F></div>
              <F id="city" label="City" error={errors.city}><Input id="city" autoComplete="address-level2" value={form.city} onChange={set("city")} aria-invalid={!!errors.city} /></F>
              <F id="state" label="State" error={errors.state}><Input id="state" autoComplete="address-level1" value={form.state} onChange={set("state")} aria-invalid={!!errors.state} /></F>
              <F id="pincode" label="Pincode" error={errors.pincode}>
                <Input id="pincode" inputMode="numeric" autoComplete="postal-code" maxLength={6} value={form.pincode}
                  onChange={(e) => { setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, "") })); setErrors((x) => ({ ...x, pincode: undefined })); }} aria-invalid={!!errors.pincode} />
              </F>
              <div className="flex items-end pb-2 text-sm">
                {pin.valid && (
                  <span className="text-sage-deep">Delivers in {pin.minDays}–{pin.maxDays} days · COD {pin.codAvailable ? "available" : "not available"}</span>
                )}
              </div>
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={saveAddr} onChange={(e) => setSaveAddr(e.target.checked)} className="size-4 accent-sage-deep" />
              Save this address for next time
            </label>
          </Section>

          <Section n={3} title="Delivery method">
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Delivery method">
              {([
                { id: "standard", label: "Standard", sub: pin.valid ? `${pin.minDays}–${pin.maxDays} working days` : "2–7 working days", fee: orderTotals({ subtotal: cartSubtotal, discount, method: "standard" }).shipping },
                { id: "express", label: "Express", sub: "1–2 working days", fee: siteConfig.expressShippingFee },
              ] as const).map((d) => (
                <button key={d.id} type="button" role="radio" aria-checked={delivery === d.id} onClick={() => setDelivery(d.id)}
                  className={cn("flex items-center justify-between rounded-xl border bg-card p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", delivery === d.id ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary")}>
                  <span><span className="block font-semibold">{d.label}</span><span className="block text-xs text-muted-foreground">{d.sub}</span></span>
                  <span className="font-bold">{d.fee === 0 ? "Free" : formatPrice(d.fee)}</span>
                </button>
              ))}
            </div>
          </Section>

          <Section n={4} title="Payment">
            <PaymentMethods method={method} onMethodChange={(m) => { setMethod(m); setPayErrors({}); }} details={details}
              onDetailsChange={(d) => { setDetails(d); setPayErrors({}); }} errors={payErrors} codAvailable={codAvailable} />
            <div className="mt-4">
              <Label htmlFor="order-note">Order note (optional)</Label>
              <Textarea id="order-note" className="mt-1.5" rows={2} placeholder="Gift message or delivery instructions" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          </Section>
        </div>

        <aside className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-soft lg:sticky lg:top-28" aria-label="Order summary">
          <h2 className="text-xl font-extrabold">Order summary</h2>
          <ul className="max-h-72 space-y-3 overflow-y-auto pr-1">
            {cartLines.map((l) => (
              <li key={l.key} className="flex gap-3">
                <span className="relative shrink-0">
                  <img src={img(l.product.images[0] ?? "")} alt="" width={64} height={80} className="h-20 w-16 rounded-lg object-cover" />
                  <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-sage-deep text-xs font-bold text-primary-foreground">{l.qty}</span>
                </span>
                <span className="flex-1 text-sm">
                  <span className="line-clamp-2 font-semibold">{l.product.title}</span>
                  <span className="text-muted-foreground">Size {l.size}</span>
                </span>
                <span className="text-sm font-bold">{formatPrice(l.lineTotal)}</span>
              </li>
            ))}
          </ul>

          <div>
            <Label htmlFor="coupon" className="flex items-center gap-1.5"><Tag className="size-4" aria-hidden /> Coupon code</Label>
            {couponResult?.ok ? (
              <div className="mt-1.5 flex items-center justify-between rounded-lg bg-sage-soft px-3 py-2 text-sm">
                <span><strong>{couponResult.coupon.code}</strong> · {couponResult.coupon.label}</span>
                <button type="button" onClick={() => { setCoupon(null); setCouponInput(""); }} aria-label="Remove coupon" className="rounded p-1 hover:bg-card"><X className="size-4" /></button>
              </div>
            ) : (
              <div className="mt-1.5 flex gap-2">
                <Input id="coupon" placeholder="e.g. TINIQO10" value={couponInput} onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyCode(); } }} aria-invalid={!!couponError || (couponResult ? !couponResult.ok : false)} />
                <Button type="button" variant="outline" onClick={applyCode} disabled={!couponInput.trim()}>Apply</Button>
              </div>
            )}
            {(couponError || (couponResult && !couponResult.ok && couponResult.error)) && (
              <p className="mt-1 text-xs font-medium text-destructive">{couponError || (couponResult && !couponResult.ok ? couponResult.error : "")}</p>
            )}
          </div>

          <FreeShippingBar subtotal={Math.max(0, cartSubtotal - discount)} />

          <dl className="space-y-2 border-t border-border pt-4 text-sm">
            <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
            {totals.discount > 0 && <Row label="Discount" value={`− ${formatPrice(totals.discount)}`} className="text-sage-deep" />}
            <Row label={`Shipping (${delivery})`} value={totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)} />
            <div className="flex justify-between border-t border-border pt-3 text-lg font-extrabold">
              <dt>Total</dt><dd>{formatPrice(totals.total)}</dd>
            </div>
            <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>
          </dl>

          <Button type="submit" variant="cta" size="lg" className="w-full" disabled={placing}>
            {placing ? <><Loader2 className="size-4 animate-spin" aria-hidden /> Processing…</> : method === "cod" ? "Place order" : `Pay ${formatPrice(totals.total)}`}
          </Button>
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0 text-sage-deep" aria-hidden />
            Payments are encrypted and processed securely. We never store your card details. By placing this order you agree to our{" "}
            <Link to="/terms" className="underline underline-offset-2">Terms</Link>.
          </p>
        </aside>
      </form>
    </div>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft md:p-6">
      <h2 className="mb-4 flex items-center gap-3 text-xl font-extrabold">
        <span className="grid size-7 place-items-center rounded-full bg-sage-soft text-sm text-sage-deep">{n}</span>{title}
      </h2>
      {children}
    </section>
  );
}

function F({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return <div className={cn("flex justify-between", className)}><dt className="text-muted-foreground">{label}</dt><dd className="font-semibold">{value}</dd></div>;
}
