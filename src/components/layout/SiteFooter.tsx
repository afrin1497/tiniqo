import { Facebook, Instagram, Mail, Phone, Youtube } from "lucide-react";

import { AppLink } from "@/components/common/AppLink";
import { NewsletterForm } from "@/components/common/Newsletter";
import { siteConfig } from "@/config/site";
import { footerColumns } from "@/data/navigation";
import { Logo } from "./Logo";

const payments = ["UPI", "Visa", "Mastercard", "RuPay", "GPay", "PhonePe", "Paytm", "COD"];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t border-border bg-card">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{siteConfig.tagline}. Soft, breathable kidswear — ready stock, shipped in 1-3 days.</p>
          <p className="mt-5 text-sm font-bold">Get 10% off your first order</p>
          <NewsletterForm compact className="mt-2" />
          <ul className="mt-5 flex gap-2" aria-label="Social media">
            {[
              { href: siteConfig.social.instagram, label: "Instagram", Icon: Instagram },
              { href: siteConfig.social.facebook, label: "Facebook", Icon: Facebook },
              { href: siteConfig.social.youtube, label: "YouTube", Icon: Youtube },
            ].map(({ href, label, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full border border-border hover:border-primary hover:bg-secondary">
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        {footerColumns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="font-heading text-sm font-extrabold uppercase tracking-widest">{col.title}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={`${col.title}-${l.label}`}>
                  <AppLink href={l.to} className="text-muted-foreground hover:text-foreground hover:underline">{l.label}</AppLink>
                </li>
              ))}
            </ul>
            {col.title === "Help" && (
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Phone className="size-4" />{siteConfig.contact.phoneDisplay}</li>
                <li className="flex items-center gap-2"><Mail className="size-4" />{siteConfig.contact.email}</li>
              </ul>
            )}
          </nav>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <ul className="flex flex-wrap justify-center gap-2" aria-label="Accepted payment methods">
            {payments.map((p) => (
              <li key={p} className="rounded-md border border-border bg-background px-2.5 py-1 text-[11px] font-bold tracking-wide text-muted-foreground">{p}</li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">© {year} {siteConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
