import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, MapPin, Package } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductById } from "@/data";
import { formatPrice } from "@/lib/pricing";
import { seo } from "@/lib/seo";
import { useStore, type Address } from "@/lib/store";

export const Route = createFileRoute("/account")({
  head: () => seo({
    title: "My Account",
    description: "Your Tiniqo orders, addresses and wishlist.",
  }),
  component: AccountPage,
});

const blankAddress: Address = {
  id: "", name: "", phone: "", line1: "", line2: "",
  city: "", state: "", pincode: "",
};

function ShopAction() {
  return <Button variant="cta" asChild><Link to="/collections/$slug" params={{ slug: "all" }}>Explore the shop</Link></Button>;
}

function AccountPage() {
  const store = useStore();
  const [address, setAddress] = useState<Address | null>(null);

  function authenticate(event: FormEvent<HTMLFormElement>, register: boolean) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const name = String(data.get("name") ?? "").trim();
    store.signIn({
      name: register ? name : email.split("@")[0] || "Friend",
      email,
      phone: String(data.get("phone") ?? "").trim(),
    });
    toast.success(register ? "Welcome to Tiniqo!" : "Welcome back!");
  }

  function saveAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!address) return;
    if (!/^[1-9]\d{5}$/.test(address.pincode.trim())) {
      toast.error("Enter a valid 6-digit pincode.");
      return;
    }
    store.saveAddress({
      ...address,
      id: address.id || crypto.randomUUID(),
      pincode: address.pincode.trim(),
    });
    setAddress(null);
    toast.success("Address saved");
  }

  const savedProducts = store.wishlist.flatMap((id) => {
    const product = getProductById(id);
    return product ? [product] : [];
  });

  return (
    <>
      <PageHeader
        title="My Account"
        description="A little home for your orders and favourites."
        crumbs={[{ label: "My Account" }]}
      />
      <main className="container-page py-8">
        {!store.hydrated ? (
          <div role="status" aria-label="Loading your account" className="space-y-4">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-72 w-full" />
          </div>
        ) : !store.user ? (
          <section className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 shadow-soft">
            <p className="mb-5 text-sm text-muted-foreground">
              Demo account: any email and password will work. Please do not use a real password.
            </p>
            <Tabs defaultValue="login">
              <TabsList className="mb-5 w-full">
                <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
                <TabsTrigger value="register" className="flex-1">Register</TabsTrigger>
              </TabsList>
              {["login", "register"].map((mode) => (
                <TabsContent key={mode} value={mode}>
                  <form onSubmit={(event) => authenticate(event, mode === "register")} className="space-y-4">
                    {mode === "register" && (
                      <div className="space-y-2">
                        <Label htmlFor={`${mode}-name`}>Name</Label>
                        <Input id={`${mode}-name`} name="name" autoComplete="name" required pattern=".*\S.*" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor={`${mode}-email`}>Email</Label>
                      <Input id={`${mode}-email`} name="email" type="email" autoComplete="email" required />
                    </div>
                    {mode === "register" && (
                      <div className="space-y-2">
                        <Label htmlFor={`${mode}-phone`}>Phone</Label>
                        <Input id={`${mode}-phone`} name="phone" type="tel" inputMode="numeric" pattern="[0-9]{10}" title="Enter a 10-digit phone number" autoComplete="tel-national" required />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor={`${mode}-password`}>Password</Label>
                      <Input id={`${mode}-password`} name="password" type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} required />
                    </div>
                    <Button variant="cta" type="submit" className="w-full">
                      {mode === "register" ? "Create demo account" : "Sign in"}
                    </Button>
                  </form>
                </TabsContent>
              ))}
            </Tabs>
          </section>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Hello, {store.user.name}!</h2>
                <p className="text-muted-foreground">{store.user.email}</p>
              </div>
              <Button variant="outline" onClick={() => {
                store.signOut();
                toast.success("You’re signed out");
              }}>Sign out</Button>
            </div>
            <Tabs defaultValue="orders">
              <TabsList className="mb-6">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              </TabsList>
              <TabsContent value="orders">
                {store.orders.length === 0 ? (
                  <EmptyState icon={Package} title="Your first adventure awaits" text="Your orders will appear here after checkout." action={<ShopAction />} />
                ) : (
                  <ul className="space-y-4">
                    {store.orders.map((order) => (
                      <li key={order.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold">{order.id}</h3>
                            <time dateTime={order.createdAt} className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </time>
                          </div>
                          <span className="rounded-full bg-sage-soft px-3 py-1 text-sm font-semibold capitalize text-sage-deep">
                            {order.status.replaceAll("-", " ")}
                          </span>
                        </div>
                        <ul className="my-4 flex flex-wrap gap-3">
                          {order.items.map((item, index) => (
                            <li key={`${item.productId}-${item.size}-${index}`} className="flex items-center gap-3">
                              <img src={item.image} alt={item.title} className="h-20 w-16 rounded-lg object-cover" loading="lazy" />
                              <div className="max-w-48 text-sm">
                                <p className="font-semibold">{item.title}</p>
                                <p className="text-muted-foreground">Size {item.size} · Qty {item.qty}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center justify-between gap-4">
                          <p className="font-bold">{formatPrice(order.total)}</p>
                          <Button variant="outline" asChild><Link to="/track-order">Track order</Link></Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>
              <TabsContent value="addresses" className="space-y-5">
                <Button variant="cta" onClick={() => setAddress({ ...blankAddress })}>Add address</Button>
                {store.addresses.length === 0 ? (
                  <EmptyState icon={MapPin} title="No addresses yet" text="Save a delivery address for your next little parcel." />
                ) : (
                  <ul className="grid gap-4 md:grid-cols-2">
                    {store.addresses.map((item) => (
                      <li key={item.id} className="rounded-2xl border border-border bg-card p-5">
                        <h3 className="font-bold">{item.name}</h3>
                        <address className="mt-2 not-italic text-muted-foreground">
                          {item.line1}<br />
                          {item.line2 && <>{item.line2}<br /></>}
                          {item.city}, {item.state} – {item.pincode}<br />
                          {item.phone}
                        </address>
                        <div className="mt-4 flex gap-3">
                          <Button variant="outline" aria-label={`Edit address for ${item.name}`} onClick={() => setAddress({ ...item })}>Edit</Button>
                          <Button variant="outline" aria-label={`Delete address for ${item.name}`} onClick={() => {
                            store.removeAddress(item.id);
                            toast.success("Address deleted");
                          }}>Delete</Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>
              <TabsContent value="wishlist">
                {savedProducts.length === 0 ? (
                  <EmptyState icon={Heart} title="Save a little love" text="Tap a heart on any outfit to keep it here." action={<ShopAction />} />
                ) : (
                  <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {savedProducts.map((product) => <li key={product.id}><ProductCard product={product} /></li>)}
                  </ul>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}

        <Dialog open={address !== null} onOpenChange={(open) => { if (!open) setAddress(null); }}>
          <DialogContent className="max-h-[90dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{address?.id ? "Edit address" : "Add address"}</DialogTitle>
              <DialogDescription>Where should your next Tiniqo parcel go?</DialogDescription>
            </DialogHeader>
            {address && (
              <form onSubmit={saveAddress} className="grid gap-4 sm:grid-cols-2">
                {([
                  ["name", "Full name"], ["phone", "Phone"],
                  ["line1", "Address line 1"], ["line2", "Address line 2 (optional)"],
                  ["city", "City"], ["state", "State"], ["pincode", "Pincode"],
                ] as const).map(([key, label]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`address-${key}`}>{label}</Label>
                    <Input
                      id={`address-${key}`}
                      value={address[key]}
                      required={key !== "line2"}
                      type={key === "phone" ? "tel" : "text"}
                      inputMode={key === "phone" || key === "pincode" ? "numeric" : "text"}
                      pattern={key === "pincode" ? "[1-9][0-9]{5}" : key === "phone" ? "[0-9]{10}" : key !== "line2" ? ".*\\S.*" : undefined}
                      title={key === "pincode" ? "Enter a valid 6-digit pincode" : key === "phone" ? "Enter a 10-digit phone number" : undefined}
                      onChange={(event) => setAddress({ ...address, [key]: event.target.value })}
                    />
                  </div>
                ))}
                <Button variant="cta" type="submit" className="sm:col-span-2">Save address</Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
