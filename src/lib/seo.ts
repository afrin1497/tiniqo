import { siteConfig } from "@/config/site";

/** Builds per-page title, description and Open Graph / Twitter meta tags. */
export function seo({ title, description, image }: { title: string; description: string; image?: string }) {
  const fullTitle = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;
  const meta: Record<string, string>[] = [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: siteConfig.name },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
  ];
  if (image && /^https:\/\//.test(image)) {
    meta.push({ property: "og:image", content: image }, { name: "twitter:image", content: image });
  }
  return { meta };
}
