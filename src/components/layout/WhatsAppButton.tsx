import { MessageCircle } from "lucide-react";
import { useMatch } from "@tanstack/react-router";

import { getProduct } from "@/data";
import { defaultWhatsappMessage, productWhatsappMessage, whatsappLink } from "@/lib/whatsapp";

export function WhatsAppButton() {
  const match = useMatch({ from: "/products/$slug", shouldThrow: false });
  const product = match ? getProduct(match.params.slug) : undefined;
  const message = product ? productWhatsappMessage(product.title, product.designCode) : defaultWhatsappMessage;
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`fixed right-4 z-30 grid size-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lift transition-transform hover:scale-105 md:bottom-6 md:right-6 ${product ? "bottom-24" : "bottom-5"}`}
    >
      <MessageCircle className="size-7" aria-hidden />
    </a>
  );
}
