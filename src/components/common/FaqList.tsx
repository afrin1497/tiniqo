import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Faq } from "@/data/faqs";

export function FaqList({ items, idPrefix = "faq" }: { items: Faq[]; idPrefix?: string }) {
  return (
    <Accordion type="single" collapsible className="rounded-xl border border-border bg-card px-4 md:px-6">
      {items.map((f, i) => (
        <AccordionItem key={f.q} value={`${idPrefix}-${i}`} className="last:border-b-0">
          <AccordionTrigger className="text-left font-heading text-base font-bold hover:no-underline">{f.q}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
