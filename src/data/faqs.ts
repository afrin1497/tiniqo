export interface Faq { q: string; a: string }

export const faqGroups: { id: string; title: string; items: Faq[] }[] = [
  {
    id: "sizing",
    title: "Sizing",
    items: [
      { q: "How do I choose the right size?", a: "Use our Size Chart & Find My Size tool. Measure your child's chest and compare with the chart. If they're between sizes, pick the bigger one." },
      { q: "Do your clothes run true to size?", a: "Yes, most styles are a regular fit with a little room to grow. Any exceptions are noted on the product page." },
      { q: "What if the size doesn't fit?", a: "We offer a free size exchange within 7 days of delivery, as long as tags are intact." },
    ],
  },
  {
    id: "shipping",
    title: "Shipping",
    items: [
      { q: "How fast do you ship?", a: "All styles are ready stock and ship within 1-3 working days. Delivery usually takes 2-7 days depending on your pincode." },
      { q: "Is shipping free?", a: "Shipping is free on orders above ₹999. Below that, a flat fee applies at checkout." },
      { q: "Do you ship internationally?", a: "Not yet — we currently ship across India only." },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    items: [
      { q: "Which payment methods do you accept?", a: "UPI, credit & debit cards, netbanking, wallets (GPay, PhonePe, Paytm) and Cash on Delivery on eligible pincodes." },
      { q: "Is Cash on Delivery available?", a: "COD is available on most pincodes. Enter your pincode on any product page to check." },
      { q: "Is it safe to pay online?", a: "Yes. Payments are processed by a secure, PCI-DSS compliant gateway. We never store your card details." },
    ],
  },
  {
    id: "exchange",
    title: "Exchange",
    items: [
      { q: "What is your exchange policy?", a: "Easy 7-day exchange for size or style, with tags intact and the item unworn and unwashed." },
      { q: "How do I request an exchange?", a: "Message us on WhatsApp or email with your order number and we'll arrange a pickup." },
      { q: "Do you offer refunds?", a: "Refunds are offered for damaged or incorrect items. Otherwise we offer exchange or store credit." },
    ],
  },
  {
    id: "care",
    title: "Care",
    items: [
      { q: "How should I wash Tiniqo clothes?", a: "Gentle cold wash, inside out, and dry in shade. Embellished and festive pieces are best hand washed or dry cleaned." },
      { q: "Will cotton shrink?", a: "Our cottons are pre-washed to minimise shrinkage. Avoid hot water and tumble drying." },
    ],
  },
];

export const homeFaqs: Faq[] = [
  faqGroups[0]!.items[0]!,
  faqGroups[1]!.items[0]!,
  faqGroups[2]!.items[1]!,
  faqGroups[3]!.items[0]!,
];
