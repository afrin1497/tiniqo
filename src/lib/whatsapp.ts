import { siteConfig } from "@/config/site";

export function whatsappLink(message: string): string {
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function productWhatsappMessage(title: string, code: string, size?: string): string {
  return `Hi ${siteConfig.name}! I have a question about "${title}" (Design code: ${code})${size ? `, size ${size}` : ""}.`;
}

export const defaultWhatsappMessage = `Hi ${siteConfig.name}! I need help choosing an outfit.`;
