import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function NewsletterForm({ className, compact = false }: { className?: string; compact?: boolean }) {
  const [email, setEmail] = useState("");
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    // TODO(backend): save subscriber to your database or email tool.
    toast.success("You're on the list!", { description: "Look out for 10% off in your inbox." });
    setEmail("");
  };
  return (
    <form onSubmit={onSubmit} className={cn("flex w-full gap-2", compact ? "max-w-sm" : "max-w-md", className)}>
      <label htmlFor={compact ? "nl-footer" : "nl-main"} className="sr-only">Email address</label>
      <Input
        id={compact ? "nl-footer" : "nl-main"}
        type="email"
        required
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-11 rounded-xl bg-card"
      />
      <Button type="submit" variant="cta" className="h-11">Subscribe</Button>
    </form>
  );
}

export function NewsletterSection() {
  return (
    <section className="container-page py-12 md:py-16" aria-labelledby="newsletter-heading">
      <div className="bg-garden relative overflow-hidden rounded-3xl border border-border bg-sage-soft px-6 py-10 text-center md:px-12 md:py-14">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage-deep">Join the Tiniqo family</p>
        <h2 id="newsletter-heading" className="mx-auto mt-2 max-w-xl text-2xl font-extrabold md:text-3xl">
          Get 10% off your first order
        </h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">New drops, size tips and members-only offers. No spam, ever.</p>
        <NewsletterForm className="mx-auto mt-6" />
      </div>
    </section>
  );
}
