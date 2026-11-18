import { ageBands, budgets } from "./taxonomy";

import type { AppHref } from "@/components/common/AppLink";

export interface MenuLink { label: string; to: AppHref }
export interface MenuColumn { title: string; links: MenuLink[] }
export interface MenuItem { label: string; to: AppHref; columns: MenuColumn[]; feature: { image: string; title: string; to: AppHref } }

const genderMenu = (g: "girls" | "boys" | "baby", label: string, image: string): MenuItem => ({
  label,
  to: `/${g}`,
  columns: [
    {
      title: "Shop by style",
      links: [
        { label: "Ethnic", to: `/collections/${g}-ethnic` },
        { label: "Party", to: `/collections/${g}-party` },
        { label: "Casual", to: `/collections/${g}-casual` },
        { label: "New arrivals", to: `/collections/${g}-new-arrivals` },
        { label: `All ${label.toLowerCase()}`, to: `/collections/${g}` },
      ],
    },
    {
      title: "Shop by age",
      links: ageBands
        .filter((b) => (g === "baby" ? b.min < 36 : b.min >= 12))
        .map((b) => ({ label: b.label, to: `/collections/${g}-age-${b.slug}` })),
    },
    {
      title: "Shop by price",
      links: budgets.map((b) => ({ label: b.label, to: `/collections/${g}-${b.slug}` })),
    },
  ],
  feature: { image, title: `${label} bestsellers`, to: `/collections/${g}-bestsellers` },
});

export const mainMenu: MenuItem[] = [
  genderMenu("girls", "Girls", "category-girls"),
  genderMenu("boys", "Boys", "category-boys"),
  genderMenu("baby", "Baby", "category-baby"),
  {
    label: "Sale",
    to: "/collections/sale",
    columns: [
      {
        title: "Sale",
        links: [
          { label: "All sale", to: "/collections/sale" },
          { label: "Girls sale", to: "/collections/girls-sale" },
          { label: "Boys sale", to: "/collections/boys-sale" },
          { label: "Baby sale", to: "/collections/baby-sale" },
        ],
      },
      {
        title: "Budget picks",
        links: budgets.slice(0, 2).map((b) => ({ label: b.label, to: `/collections/${b.slug}` })),
      },
    ],
    feature: { image: "girls-lehenga", title: "Festive styles on offer", to: "/collections/sale" },
  },
];

export const footerColumns: MenuColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Our Story", to: "/about" },
      { label: "Blog", to: "/blog" },
      { label: "Contact", to: "/contact" },
      { label: "Size Chart", to: "/size-chart" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Privacy", to: "/privacy" },
      { label: "Shipping", to: "/shipping-policy" },
      { label: "Exchange & Return", to: "/exchange-return" },
      { label: "Terms", to: "/terms" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQ", to: "/faq" },
      { label: "Track Order", to: "/track-order" },
      { label: "Contact", to: "/contact" },
      { label: "Bulk Enquiry", to: "/bulk-enquiry" },
    ],
  },
];
