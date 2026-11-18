import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, type ReactNode } from "react";

import { SectionHeading } from "@/components/common/SectionHeading";
import type { Product } from "@/data/types";
import { ProductCard } from "./ProductCard";

export function ProductRow({ title, eyebrow, products, action }: { title: string; eyebrow?: string; products: Product[]; action?: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  if (!products.length) return null;
  return (
    <section className="container-page py-8 md:py-12" aria-label={title}>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        action={
          <div className="flex items-center gap-2">
            {action}
            <div className="hidden gap-2 md:flex">
              <button type="button" onClick={() => scroll(-1)} aria-label={`Scroll ${title} left`} className="grid size-10 place-items-center rounded-full border border-border bg-card hover:border-primary">
                <ChevronLeft className="size-4" />
              </button>
              <button type="button" onClick={() => scroll(1)} aria-label={`Scroll ${title} right`} className="grid size-10 place-items-center rounded-full border border-border bg-card hover:border-primary">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        }
      />
      <ul ref={ref} className="scroll-row">
        {products.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
