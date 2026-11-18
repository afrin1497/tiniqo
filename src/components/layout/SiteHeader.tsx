import { Heart, Search, ShoppingBag, User, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { SearchBox } from "./SearchBox";

export function SiteHeader() {
  const { cartCount, wishlist, setCartOpen, hydrated } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const iconBtn = "relative grid size-10 place-items-center rounded-full transition-colors hover:bg-secondary";
  const count = (n: number) =>
    hydrated && n > 0 ? (
      <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-coral px-1 text-[11px] font-bold leading-5 text-coral-foreground">
        {n}
      </span>
    ) : null;

  return (
    <header className={cn("sticky top-0 z-40 border-b bg-background/95 backdrop-blur transition-shadow", scrolled ? "border-border shadow-soft" : "border-transparent")}>
      <div className="container-page relative">
        <div className="flex h-16 items-center gap-3 md:h-[4.5rem]">
          <MobileNav />
          <Logo />
          <SearchBox className="mx-6 hidden max-w-md flex-1 md:block" />
          <div className="ml-auto flex items-center gap-0.5">
            <button type="button" className={cn(iconBtn, "md:hidden")} aria-label={searchOpen ? "Close search" : "Open search"} onClick={() => setSearchOpen((s) => !s)}>
              {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
            </button>
            <Link to="/wishlist" className={cn(iconBtn, "hidden sm:grid")} aria-label={`Wishlist${hydrated ? `, ${wishlist.length} items` : ""}`}>
              <Heart className="size-5" />
              {count(wishlist.length)}
            </Link>
            <Link to="/account" className={iconBtn} aria-label="Account">
              <User className="size-5" />
            </Link>
            <button type="button" className={iconBtn} onClick={() => setCartOpen(true)} aria-label={`Open cart${hydrated ? `, ${cartCount} items` : ""}`}>
              <ShoppingBag className="size-5" />
              {count(cartCount)}
            </button>
          </div>
        </div>
        {searchOpen && (
          <div className="pb-3 md:hidden">
            <SearchBox id="header-mobile-search" autoFocus onDone={() => setSearchOpen(false)} />
          </div>
        )}
      </div>
      <div className="relative hidden border-t border-border lg:block">
        <MegaMenu />
      </div>
    </header>
  );
}
