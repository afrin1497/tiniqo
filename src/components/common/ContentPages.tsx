import { Link } from "@tanstack/react-router";
import type { FormEvent } from "react";
import {
  ArrowRight,
  Check,
  Clock,
  Heart,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shirt,
} from "lucide-react";
import { toast } from "sonner";

import { FaqList } from "@/components/common/FaqList";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";
import { blogPosts, type BlogPost } from "@/data";
import { faqGroups } from "@/data/faqs";
import { img } from "@/data/images";
import { whatsappLink } from "@/lib/whatsapp";

const panel = "rounded-xl border border-border bg-card p-6 shadow-soft";
const money = (amount: number) =>
  `${siteConfig.currencySymbol}${amount.toLocaleString("en-IN")}`;

function HelpCta() {
  return (
    <aside className="rounded-xl bg-sage-soft p-6 md:p-10">
      <h2 className="text-2xl font-bold">Still need a little help?</h2>
      <p className="mt-3 max-w-xl text-muted-foreground">
        From finding the right size to checking an order, we’re happy to help.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="cta" asChild>
          <a
            href={whatsappLink("Hi Tiniqo! I have a question.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle aria-hidden="true" /> Chat on WhatsApp
          </a>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/contact">Contact us</Link>
        </Button>
      </div>
    </aside>
  );
}

export function StoryPage() {
  const values = [
    {
      icon: Leaf,
      title: "Comfort comes first",
      text: "Breathable fabrics, easy fits and thoughtful details for busy little bodies.",
    },
    {
      icon: Heart,
      title: "Made for real childhood",
      text: "Clothes for floor picnics, family celebrations and all the ordinary magic in between.",
    },
    {
      icon: Shirt,
      title: "Less fuss, more play",
      text: "Simple sizing guidance and practical care advice help make getting dressed easier.",
    },
  ];

  return (
    <>
      <PageHeader
        title="Our story"
        description="Little clothes. Big feelings. Room for every adventure."
        crumbs={[{ label: "Our story" }]}
      />
      <div className="container-page space-y-14 py-10 md:space-y-20 md:py-16">
        <section className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <img
            src={img("studio-story")}
            alt="A glimpse inside the Tiniqo studio"
            className="aspect-[4/3] w-full rounded-xl object-cover"
            fetchPriority="high"
          />
          <div>
            <SectionHeading
              eyebrow="Hello, we’re Tiniqo"
              title="For the days they’ll grow out of, but you’ll never forget"
            />
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Childhood is wonderfully untidy: a pocket full of treasures,
                another lap around the garden, a celebration that ends with a
                sleepy cuddle. We believe their clothes should feel at home in
                every one of those moments.
              </p>
              <p>
                Tiniqo brings together soft everyday favourites and
                celebration-ready outfits for girls, boys and babies. We look
                for pieces that feel good to wear, leave room to move and make
                little personalities shine.
              </p>
              <p>
                Our idea is simple: make choosing their next favourite outfit a
                little easier, so there’s more time for the good stuff.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="story-values">
          <div id="story-values">
            <SectionHeading
              eyebrow="What matters to us"
              title="Small details, a lot of heart"
            />
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {values.map(({ icon: Icon, title, text }) => (
              <article key={title} className={panel}>
                <Icon className="mb-5 size-8 text-sage-deep" aria-hidden="true" />
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-sage-soft p-6 md:p-10">
          <SectionHeading
            title="Our little promise"
            description="Clear information, friendly help and clothes chosen with childhood in mind."
          />
          <dl className="grid gap-8 sm:grid-cols-3">
            {[
              ["0–13", "Years of little adventures"],
              [
                `${siteConfig.exchangeWindowDays} days`,
                "To request an eligible exchange",
              ],
              [
                money(siteConfig.freeShippingThreshold),
                "Free shipping on orders above this amount",
              ],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="mt-2 text-3xl font-extrabold text-sage-deep">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            Their next favourite outfit is waiting
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Discover everyday comfort and outfits for the moments worth dressing up for.
          </p>
          <Button variant="cta" size="lg" className="mt-6" asChild>
            <Link to="/collections/$slug" params={{ slug: "new-arrivals" }}>
              Shop new arrivals <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </section>
      </div>
    </>
  );
}

type Field = {
  name: string;
  label: string;
  type?: string;
  optional?: boolean;
  autoComplete?: string;
};

function EnquiryForm({ bulk = false }: { bulk?: boolean }) {
  const fields: Field[] = bulk
    ? [
        { name: "business", label: "Business, school or organisation name", autoComplete: "organization" },
        { name: "name", label: "Contact name", autoComplete: "name" },
        { name: "email", label: "Email", type: "email", autoComplete: "email" },
        { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
        { name: "city", label: "City", autoComplete: "address-level2" },
      ]
    : [
        { name: "name", label: "Name", autoComplete: "name" },
        { name: "email", label: "Email", type: "email", autoComplete: "email" },
        { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
        { name: "order", label: "Order number", optional: true },
      ];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const empty = fields.find(
      (field) => !field.optional && !String(data.get(field.name) ?? "").trim(),
    );
    if (empty || !String(data.get("message") ?? "").trim()) {
      toast.error("Please complete all required fields.");
      return;
    }

    const digits = String(data.get("phone") ?? "").replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15) {
      const phone = form.elements.namedItem("phone");
      if (phone instanceof HTMLInputElement) {
        phone.setCustomValidity("Enter a phone number with 7–15 digits.");
        phone.reportValidity();
        phone.focus();
      }
      return;
    }

    toast.success(
      "Demo complete — your enquiry has not been sent. Please contact us by email or WhatsApp.",
    );
    form.reset();
  }

  return (
    <form onSubmit={submit} className={`${panel} space-y-6`}>
      <div>
        <h2 className="text-xl font-bold">
          {bulk ? "Tell us what you have in mind" : "Send us a message"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          All fields are required unless marked optional.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const id = `${bulk ? "bulk" : "contact"}-${field.name}`;
          return (
            <div key={field.name} className="space-y-2">
              <label htmlFor={id} className="text-sm font-semibold">
                {field.label}{field.optional ? " (optional)" : ""}
              </label>
              <Input
                id={id}
                name={field.name}
                type={field.type ?? "text"}
                autoComplete={field.autoComplete}
                required={!field.optional}
                maxLength={field.name === "phone" ? 30 : 200}
                onInput={(event) => event.currentTarget.setCustomValidity("")}
              />
            </div>
          );
        })}

        {bulk && (
          <>
            <div className="space-y-2">
              <label htmlFor="bulk-type" className="text-sm font-semibold">
                Enquiry type
              </label>
              <select
                id="bulk-type"
                name="type"
                required
                defaultValue=""
                className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="" disabled>Select an enquiry type</option>
                <option value="wholesale">Wholesale / retail</option>
                <option value="school">School / group</option>
                <option value="event">Event / celebration</option>
                <option value="gifting">Corporate gifting</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="bulk-quantity" className="text-sm font-semibold">
                Estimated quantity
              </label>
              <Input
                id="bulk-quantity"
                name="quantity"
                type="number"
                min={1}
                step={1}
                max={1000000}
                required
              />
            </div>
          </>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor={bulk ? "bulk-message" : "contact-message"} className="text-sm font-semibold">
          Message
        </label>
        <Textarea
          id={bulk ? "bulk-message" : "contact-message"}
          name="message"
          rows={6}
          minLength={10}
          maxLength={5000}
          required
          aria-describedby={bulk ? "bulk-message-help" : "contact-message-help"}
        />
        <p
          id={bulk ? "bulk-message-help" : "contact-message-help"}
          className="text-sm text-muted-foreground"
        >
          {bulk
            ? "Include age groups, sizes, your preferred styles and any event deadline."
            : "Tell us how we can help. Please do not include payment details."}
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        Demo form only: submissions are not sent or stored. For a real enquiry,
        please use our email or WhatsApp.
      </p>
      <Button type="submit" variant="cta">Preview enquiry submission</Button>
    </form>
  );
}

export function ContactPage() {
  const contact = siteConfig.contact;
  const cards = [
    {
      icon: Phone,
      title: "Give us a ring",
      value: contact.phoneDisplay,
      href: `tel:${contact.phoneDisplay.replace(/[^\d+]/g, "")}`,
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "Chat with Tiniqo",
      href: whatsappLink("Hi Tiniqo! I need a little help."),
    },
    {
      icon: Mail,
      title: "Email us",
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    { icon: MapPin, title: "Our address", value: contact.address },
    { icon: Clock, title: "Opening hours", value: contact.hours },
  ];

  return (
    <>
      <PageHeader
        title="Let’s talk"
        description="Questions about a size, an order or a special occasion? We’re all ears."
        crumbs={[{ label: "Contact" }]}
      />
      <div className="container-page space-y-10 py-10 md:py-16">
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <EnquiryForm />
          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map(({ icon: Icon, title, value, href }) => (
              <section key={title} className={panel}>
                <Icon className="mb-4 size-6 text-sage-deep" aria-hidden="true" />
                <h2 className="font-bold">{title}</h2>
                {href ? (
                  <a
                    href={href}
                    className="mt-2 block break-words text-sm text-sage-deep underline underline-offset-4"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value}
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
        <section
          aria-label="Studio location placeholder"
          className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-sage-soft p-8 text-center"
        >
          <MapPin className="mb-4 size-10 text-sage-deep" aria-hidden="true" />
          <h2 className="text-xl font-bold">Find our studio</h2>
          <p className="mt-2 max-w-lg text-muted-foreground">{contact.address}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Map placeholder — location details will be confirmed before an
            interactive map is added. Please contact us before visiting.
          </p>
        </section>
      </div>
    </>
  );
}

export function FaqPage() {
  return (
    <>
      <PageHeader
        title="A little help, right here"
        description="Answers to your questions about fit, delivery, payments and keeping their favourites lovely."
        crumbs={[{ label: "FAQ" }]}
      />
      <div className="container-page space-y-12 py-10 md:py-16">
        <nav aria-label="FAQ categories" className="flex flex-wrap gap-3">
          {faqGroups.map((group) => (
            <Button key={group.id} variant="outline" asChild>
              <a href={`#${group.id}`}>{group.title}</a>
            </Button>
          ))}
        </nav>
        <div className="mx-auto max-w-3xl space-y-10">
          {faqGroups.map((group) => (
            <section
              key={group.id}
              id={group.id}
              aria-labelledby={`${group.id}-heading`}
              className="scroll-mt-28"
            >
              <h2 id={`${group.id}-heading`} className="mb-4 text-2xl font-bold">
                {group.title}
              </h2>
              <FaqList items={group.items} idPrefix={group.id} />
            </section>
          ))}
          <HelpCta />
        </div>
      </div>
    </>
  );
}

export function BulkEnquiryPage() {
  return (
    <>
      <PageHeader
        title="Little outfits, bigger plans"
        description="Explore wholesale, school, event and gifting enquiries with Tiniqo."
        crumbs={[{ label: "Bulk enquiry" }]}
      />
      <div className="container-page grid items-start gap-10 py-10 md:py-16 lg:grid-cols-2">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Let’s plan together"
            title="For your shop, your school or your special day"
            description="Tell us about your group and we’ll help you explore suitable styles, size mixes and availability."
          />
          <ul className="space-y-5">
            {[
              ["A thoughtful selection", "Explore everyday favourites and celebration-ready outfits for different age groups."],
              ["Help with the details", "Discuss size assortments, quantities and preferred styles before making a decision."],
              ["A tailored conversation", "Pricing, minimum quantities and delivery feasibility are confirmed for each enquiry."],
              ["Clear next steps", "Share your date and destination so timelines can be reviewed before an order is agreed."],
            ].map(([title, text]) => (
              <li key={title} className={`${panel} flex gap-4`}>
                <Check className="mt-1 size-5 shrink-0 text-sage-deep" aria-hidden="true" />
                <div>
                  <h2 className="font-bold">{title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            Submitting an enquiry does not reserve stock or confirm an order.
            Customisation and special pricing are subject to confirmation.
          </p>
        </div>
        <EnquiryForm bulk />
      </div>
    </>
  );
}

type PolicyKind = "shipping" | "exchange" | "privacy" | "terms";

type PolicySection = {
  title: string;
  text?: string;
  steps?: string[];
  bullets?: string[];
};

type Policy = {
  title: string;
  description: string;
  sections: PolicySection[];
  /** Present once the copy is final; omitted while the policy is still a draft. */
  confirmed?: { lastUpdated: string; summary: string[] };
};

const policies: Record<PolicyKind, Policy> = {
  shipping: {
    title: "Shipping policy",
    description: "A guide to dispatch, delivery and shipping charges.",
    sections: [
      {
        title: "Where we deliver",
        text: "We currently plan to deliver across serviceable pincodes in India. Delivery availability is subject to courier coverage and should be confirmed before an order is accepted.",
      },
      {
        title: "Dispatch and delivery estimates",
        text: "Ready-stock orders are generally prepared within 1–3 working days. Delivery may take a further 2–7 working days depending on the destination. These are estimates, not guarantees; holidays, weather and courier disruptions may affect timing.",
      },
      {
        title: "Shipping charges",
        text: `Standard shipping is free on orders above ${money(siteConfig.freeShippingThreshold)}. Otherwise, the standard fee is ${money(siteConfig.flatShippingFee)}. Express shipping, where available, costs ${money(siteConfig.expressShippingFee)}. Available services and the final charge should be shown before payment.`,
      },
      {
        title: "Tracking your parcel",
        text: "Once your parcel is handed to the courier, tracking details should be shared using the contact information supplied with your order. Tracking updates may take time to appear after dispatch.",
      },
      {
        title: "Incorrect addresses or delivery issues",
        text: "Please check your address, pincode and phone number carefully. Contact us promptly if anything needs changing. Address changes after dispatch may not be possible. If a parcel is delayed, marked delivered but missing, or arrives damaged, contact us with your order number so we can investigate.",
      },
    ],
  },
  exchange: {
    title: "Exchange & return policy",
    description: "How to return or exchange an item, what we can accept, and when refunds reach you.",
    confirmed: {
      lastUpdated: "22 November 2026",
      summary: [
        `${siteConfig.returnWindowDays}-day returns from the day of delivery`,
        "Free size exchange on your first request",
        `Refunds within ${siteConfig.refundProcessingDays} days of inspection`,
        "Personalised and hygiene-sealed items are not returnable",
      ],
    },
    sections: [
      {
        title: "What you can return or exchange",
        text: `You may return or exchange any item within ${siteConfig.returnWindowDays} days of delivery. Items must be unworn, unwashed and unaltered, free of stains, odour or pet hair, with the original tags, packaging and invoice intact. Between sizes? Your first size exchange is free — just tell us the size you need.`,
      },
      {
        title: "How to return or exchange",
        steps: [
          "Message us by email or WhatsApp with your order number, the item and the reason for the return.",
          "We confirm eligibility and share a pickup slot or a return address.",
          "Pack the item safely with the invoice and hand it over to the courier.",
          "Once the item passes inspection, we dispatch your replacement or start your refund.",
        ],
        text: "Please wait for our go-ahead before sending anything back — unapproved returns may not be accepted. Replacement styles and sizes depend on availability.",
      },
      {
        title: "Return shipping and pickup charges",
        text: `Pickup is free when the item is damaged, defective or not what you ordered, and for your first size exchange. For a change-of-mind return, a ${money(siteConfig.returnPickupFee)} pickup fee is deducted from your refund. If you arrange your own courier we cannot cover that cost, and the original shipping charge is not refunded.`,
      },
      {
        title: "Refunds",
        text: `Approved refunds are initiated within ${siteConfig.refundProcessingDays} days of the returned item passing inspection and are credited to the original payment method. Cash-on-delivery orders are refunded to the UPI ID or bank account you share. Banks and wallets may need a further 3–5 working days to post the credit.`,
      },
      {
        title: "Items we can’t accept",
        bullets: [
          "Personalised or monogrammed pieces",
          "Hygiene-sealed items such as socks, innerwear and swimwear once opened",
          "Anything marked final sale",
          "Items that have been worn, washed, altered or damaged through use",
          "Items with missing tags or packaging",
          "Requests raised after the return window has closed",
        ],
      },
      {
        title: "Damaged, defective or incorrect items",
        text: `Tell us within ${siteConfig.returnWindowDays} days of delivery and send clear photographs of the item and its packaging. Keep the product and packaging until the review is complete. Where the issue is confirmed, we arrange a free pickup and offer a replacement, or a full refund including shipping if no replacement is available.`,
      },
      {
        title: "Gifts, store credit and bulk orders",
        text: `A gift can be exchanged or returned with the order number from the sender; the refund goes to the original payment method, or we can issue store credit valid for ${siteConfig.storeCreditValidityMonths} months. Wholesale, school and bulk orders follow the terms agreed at the time of the order.`,
      },
      {
        title: "Your consumer rights",
        text: "Nothing in this policy limits your rights under applicable consumer protection law, including the right to a remedy for defective goods. If a return is declined, we will explain why and return the item to you or hold it for collection.",
      },
    ],
  },
  privacy: {
    title: "Privacy policy",
    description: "An outline of how customer information should be handled.",
    sections: [
      {
        title: "Information you share",
        text: "When you contact us or place an order, you may provide your name, email, phone number, shipping address and order details. Please do not send full card numbers, passwords or other sensitive credentials through enquiry forms.",
      },
      {
        title: "How information is used",
        text: "Customer information may be used to answer enquiries, fulfil orders, arrange delivery, provide support and meet legal obligations. Optional marketing communications should be sent only where permitted, with a clear way to opt out.",
      },
      {
        title: "Service providers",
        text: "Order fulfilment may require sharing necessary details with delivery, payment and technical service providers. Their identities, processing arrangements and applicable privacy notices must be confirmed before this policy is published as final.",
      },
      {
        title: "Cookies and analytics",
        text: "Essential browser storage may support shopping features such as the basket. Any analytics, advertising cookies or third-party tracking must be documented here and appropriate consent controls provided before use.",
      },
      {
        title: "Retention, security and your choices",
        text: "Information should be retained only as needed for its stated purpose and applicable legal requirements. Reasonable safeguards should protect it, but no online system is entirely risk-free. Contact us to ask about access, correction or deletion; requests may be subject to identity checks and legal retention duties.",
      },
      {
        title: "Children’s information and external links",
        text: "This store is intended for adults purchasing children’s clothing, not for children to submit personal information. Please contact us if a child has shared personal data. Third-party sites, including WhatsApp, operate under their own privacy policies.",
      },
    ],
  },
  terms: {
    title: "Terms of service",
    description: "The proposed terms for browsing and shopping with Tiniqo.",
    sections: [
      {
        title: "Using the store",
        text: "Use this site lawfully and provide accurate contact and delivery information. Purchases should be made by an adult capable of entering into a binding agreement. Do not misuse the site, interfere with its operation or attempt unauthorised access.",
      },
      {
        title: "Products and availability",
        text: "Product images are illustrative; colours may vary between screens. Review measurements, materials and care instructions before ordering. Availability can change, and an unavailable item should not be replaced without your agreement.",
      },
      {
        title: "Prices and payment",
        text: `Prices are displayed in ${siteConfig.currency}. Applicable shipping charges and any taxes should be shown before payment. Promotions are subject to their stated conditions. If a material pricing error occurs, we will seek your instructions or cancel and arrange any applicable refund.`,
      },
      {
        title: "Order acceptance and cancellations",
        text: "An order acknowledgement does not necessarily confirm acceptance. Stock, payment and delivery details may need verification. Contact us promptly to request cancellation; cancellation after dispatch may not be possible. If we cannot fulfil an accepted order, we will explain the available remedy.",
      },
      {
        title: "Delivery, exchanges and returns",
        text: `Our shipping and exchange policies explain delivery estimates, charges and eligibility. Eligible exchange requests should be raised within ${siteConfig.exchangeWindowDays} days of delivery. These policies do not remove rights provided by applicable consumer law.`,
      },
      {
        title: "Content, responsibility and disputes",
        text: "Site text, branding and images may not be reused commercially without permission from their respective rights holders. Nothing in these draft terms excludes liability that cannot lawfully be excluded. The legal business identity, governing law and dispute process must be reviewed and completed before publication.",
      },
    ],
  },
};

export function PolicyPage({ kind }: { kind: PolicyKind }) {
  const policy = policies[kind];

  return (
    <>
      <PageHeader
        title={policy.title}
        description={policy.description}
        crumbs={[{ label: policy.title }]}
      />
      <div className="container-page max-w-3xl space-y-8 py-10 md:py-16">
        {policy.confirmed ? (
          <aside className="rounded-xl border border-border bg-sage-soft p-6">
            <h2 className="font-bold">The short version</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {policy.confirmed.summary.map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-sage-deep" aria-hidden="true" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Last updated: {policy.confirmed.lastUpdated}.
            </p>
          </aside>
        ) : (
          <aside className="rounded-xl border border-border bg-sage-soft p-6">
            <p className="font-bold">[Placeholder — replace with your own policy]</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Draft copy for review only. Confirm your legal business details,
              actual operations and applicable consumer and privacy requirements
              before publishing.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Last updated: Draft — publication date to be confirmed.
            </p>
          </aside>
        )}
        <nav aria-label={`${policy.title} sections`} className={panel}>
          <h2 className="font-bold">On this page</h2>
          <ol className="mt-4 list-inside list-decimal space-y-2">
            {policy.sections.map((section, index) => (
              <li key={section.title}>
                <a
                  href={`#policy-section-${index + 1}`}
                  className="text-sage-deep underline underline-offset-4"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        {policy.sections.map((section, index) => (
          <section
            key={section.title}
            id={`policy-section-${index + 1}`}
            className="scroll-mt-28"
          >
            <h2 className="text-xl font-bold">{section.title}</h2>
            {section.text && (
              <p className="mt-3 leading-relaxed text-muted-foreground">{section.text}</p>
            )}
            {section.steps && (
              <ol className="mt-3 list-inside list-decimal space-y-2 leading-relaxed text-muted-foreground marker:font-semibold marker:text-sage-deep">
                {section.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            )}
            {section.bullets && (
              <ul className="mt-3 list-inside list-disc space-y-2 leading-relaxed text-muted-foreground marker:text-sage-deep">
                {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            )}
          </section>
        ))}
        <section className={panel}>
          <h2 className="text-xl font-bold">Questions about this policy?</h2>
          <p className="mt-3 text-muted-foreground">
            Email{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="break-words text-sage-deep underline underline-offset-4"
            >
              {siteConfig.contact.email}
            </a>{" "}
            or contact us during {siteConfig.contact.hours}.
          </p>
        </section>
      </div>
    </>
  );
}

function PostDate({ date }: { date: string }) {
  return (
    <time dateTime={date}>
      {new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${date}T00:00:00Z`))}
    </time>
  );
}

function JournalCard({ post }: { post: BlogPost }) {
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
      <Link
        to="/blog/$slug"
        params={{ slug: post.slug }}
        className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <div className="overflow-hidden">
          <img
            src={img(post.image)}
            alt=""
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
          />
        </div>
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-sage-soft px-3 py-1 text-xs font-semibold text-sage-deep"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <PostDate date={post.date} />
            <span>{post.readMinutes} min read</span>
          </p>
          <h2 className="text-xl font-bold group-hover:underline">{post.title}</h2>
          <p className="leading-relaxed text-muted-foreground">{post.excerpt}</p>
          <span className="inline-flex items-center gap-2 font-semibold text-sage-deep">
            Read story <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}

export function JournalPage() {
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHeader
        title="The Tiniqo journal"
        description="Practical little guides, thoughtful care tips and inspiration for their everyday adventures."
        crumbs={[{ label: "Journal" }]}
      />
      <section aria-label="Journal stories" className="container-page py-10 md:py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => <JournalCard key={post.slug} post={post} />)}
        </div>
      </section>
    </>
  );
}

export function JournalPost({ post }: { post: BlogPost }) {
  const more = blogPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <>
      <PageHeader
        title={post.title}
        description={post.excerpt}
        crumbs={[{ label: "Journal", to: "/blog" }, { label: post.title }]}
      >
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span>By {post.author}</span>
          <PostDate date={post.date} />
          <span>{post.readMinutes} min read</span>
        </div>
        <ul aria-label="Article tags" className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-sage-soft px-3 py-1 text-xs font-semibold text-sage-deep">
              {tag}
            </li>
          ))}
        </ul>
      </PageHeader>

      <article aria-label={post.title} className="container-page max-w-4xl py-10 md:py-14">
        <img
          src={img(post.image)}
          alt={`Tiniqo kidswear illustrating ${post.tags.join(" and ").toLowerCase()}`}
          className="mb-10 aspect-[4/3] w-full rounded-xl object-cover md:aspect-[16/9]"
          fetchPriority="high"
        />
        <div className="mx-auto max-w-2xl space-y-6 text-base leading-8">
          {post.body.map((block, index) => {
            if (block.type === "h2") {
              return (
                <h2 key={index} className="pt-5 text-2xl font-bold leading-snug">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "p") {
              return <p key={index} className="text-muted-foreground">{block.text}</p>;
            }
            return (
              <ul key={index} className="list-disc space-y-2 pl-6 text-muted-foreground marker:text-sage-deep">
                {block.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
              </ul>
            );
          })}
          <div className="border-t border-border pt-8">
            <Button variant="outline" asChild>
              <Link to="/blog">Back to the journal</Link>
            </Button>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section className="border-t border-border bg-secondary/60 py-10 md:py-16">
          <div className="container-page">
            <SectionHeading title="More from the journal" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {more.map((candidate) => (
                <JournalCard key={candidate.slug} post={candidate} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
