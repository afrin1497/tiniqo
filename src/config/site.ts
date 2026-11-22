/**
 * Tiniqo store settings — edit brand name, contact details, prices and copy here.
 * Everything in the storefront reads from this one file.
 */
export const siteConfig = {
  name: "Tiniqo",
  tagline: "Little clothes for big adventures",
  description:
    "Tiniqo makes soft, breathable kidswear for girls, boys and babies — ethnic, party and everyday outfits, ready to ship in 1-3 days.",
  url: "https://tiniqo.example.com", // TODO: replace with your live domain

  currency: "INR",
  currencySymbol: "₹",
  freeShippingThreshold: 999,
  flatShippingFee: 79,
  expressShippingFee: 149,
  exchangeWindowDays: 7,
  returnWindowDays: 7,
  refundProcessingDays: 7,
  returnPickupFee: 99,
  storeCreditValidityMonths: 12,

  // Coupons are mocked until a backend is connected.
  coupons: [
    { code: "TINIQO10", type: "percent", value: 10, minSubtotal: 0, label: "10% off your order" },
    { code: "WELCOME100", type: "flat", value: 100, minSubtotal: 799, label: "₹100 off above ₹799" },
  ] as const,

  contact: {
    // TODO: replace with your real WhatsApp number (country code + number, digits only)
    whatsappNumber: "919000000000",
    phoneDisplay: "+91 90000 00000",
    email: "hello@tiniqo.example.com",
    address: "Studio 4, Green Lane, Indiranagar, Bengaluru 560038", // placeholder
    hours: "Mon–Sat, 10:00 am – 7:00 pm IST",
  },

  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
    pinterest: "https://pinterest.com/",
  },

  announcements: [
    "New arrivals are here",
    "Free shipping above ₹999",
    "Ready stock, ships in 1-3 days",
  ],

  hero: {
    eyebrow: "The Little Garden Edit",
    title: "Soft, sunny outfits made for play",
    subtitle: "Breathable cottons and festive favourites for ages 0–13. Ready stock, shipped in 1–3 days.",
    primaryCta: { label: "Shop new arrivals", to: "/collections/new-arrivals" },
    secondaryCta: { label: "Find my size", to: "/size-chart" },
  },
} as const;

export type SiteConfig = typeof siteConfig;
