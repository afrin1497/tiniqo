import { useState } from "react";

import { AppLink } from "@/components/common/AppLink";
import { img } from "@/data/images";
import { mainMenu } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function MegaMenu() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <nav aria-label="Main" className="hidden lg:block" onMouseLeave={() => setOpen(null)}>
      <ul className="flex items-center justify-center gap-1">
        {mainMenu.map((item) => (
          <li key={item.label} onMouseEnter={() => setOpen(item.label)} onFocus={() => setOpen(item.label)}>
            <AppLink
              href={item.to}
              onClick={() => setOpen(null)}
              className={cn(
                "inline-flex h-12 items-center px-4 font-heading text-[15px] font-bold transition-colors hover:text-sage-deep",
                item.label === "Sale" && "text-coral-hover",
                open === item.label && "text-sage-deep",
              )}
            >
              {item.label}
            </AppLink>
            {open === item.label && (
              <div className="absolute inset-x-0 top-full z-40 border-y border-border bg-card shadow-lift">
                <div className="container-page grid grid-cols-[1fr_1fr_1fr_16rem] gap-8 py-8">
                  {item.columns.map((col) => (
                    <div key={col.title}>
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{col.title}</p>
                      <ul className="space-y-2">
                        {col.links.map((l) => (
                          <li key={l.label}>
                            <AppLink href={l.to} onClick={() => setOpen(null)} className="text-sm font-medium hover:text-sage-deep hover:underline">
                              {l.label}
                            </AppLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {item.columns.length < 3 && <div />}
                  <AppLink href={item.feature.to} onClick={() => setOpen(null)} className="group col-start-4 overflow-hidden rounded-xl border border-border">
                    <img src={img(item.feature.image)} alt="" loading="lazy" width={480} height={300} className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <p className="p-3 font-heading text-sm font-bold">{item.feature.title} →</p>
                  </AppLink>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
