import { Heart, Menu, Package, Ruler, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { AppLink } from "@/components/common/AppLink";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { mainMenu } from "@/data/navigation";
import { Logo } from "./Logo";
import { SearchBox } from "./SearchBox";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="grid size-10 place-items-center rounded-full hover:bg-secondary lg:hidden" aria-label="Open menu">
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="flex w-[88%] flex-col gap-0 overflow-y-auto p-0 sm:max-w-sm">
        <SheetHeader className="border-b border-border p-4 text-left">
          <SheetTitle asChild>
            <div onClick={close}><Logo /></div>
          </SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <SearchBox id="mobile-search" onDone={close} />
        </div>
        <Accordion type="single" collapsible className="px-4">
          {mainMenu.map((item) => (
            <AccordionItem key={item.label} value={item.label}>
              <AccordionTrigger className="font-heading text-base font-bold hover:no-underline">{item.label}</AccordionTrigger>
              <AccordionContent>
                <AppLink href={item.to} onClick={close} className="mb-3 block text-sm font-bold text-sage-deep">
                  Shop all {item.label.toLowerCase()} →
                </AppLink>
                {item.columns.map((col) => (
                  <div key={col.title} className="mb-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">{col.title}</p>
                    <ul className="flex flex-wrap gap-2">
                      {col.links.map((l) => (
                        <li key={l.label}>
                          <AppLink href={l.to} onClick={close} className="inline-block rounded-full border border-border px-3 py-1.5 text-sm">
                            {l.label}
                          </AppLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <ul className="mt-auto grid grid-cols-2 gap-2 border-t border-border p-4 text-sm font-semibold">
          <li><Link to="/account" onClick={close} className="flex items-center gap-2 rounded-xl bg-secondary p-3"><User className="size-4" />Account</Link></li>
          <li><Link to="/wishlist" onClick={close} className="flex items-center gap-2 rounded-xl bg-secondary p-3"><Heart className="size-4" />Wishlist</Link></li>
          <li><Link to="/track-order" onClick={close} className="flex items-center gap-2 rounded-xl bg-secondary p-3"><Package className="size-4" />Track order</Link></li>
          <li><Link to="/size-chart" onClick={close} className="flex items-center gap-2 rounded-xl bg-secondary p-3"><Ruler className="size-4" />Size chart</Link></li>
        </ul>
      </SheetContent>
    </Sheet>
  );
}
