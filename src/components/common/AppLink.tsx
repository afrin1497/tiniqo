import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import type { FileRoutesByTo } from "@/routeTree.gen";

/** Every static route path in the app (no $params). */
export type StaticPath = Exclude<keyof FileRoutesByTo, `${string}$${string}`>;
export type CollectionHref = `/collections/${string}`;
export type ProductHref = `/products/${string}`;
export type AppHref = StaticPath | CollectionHref | ProductHref;

const isCollection = (h: AppHref): h is CollectionHref => h.startsWith("/collections/");
const isProduct = (h: AppHref): h is ProductHref => h.startsWith("/products/");

/** Link for data-driven hrefs (menus, tiles). Static paths stay type-checked. */
export function AppLink({
  href,
  className,
  children,
  onClick,
  "aria-label": ariaLabel,
}: {
  href: AppHref;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  "aria-label"?: string;
}) {
  const common = { className, onClick, "aria-label": ariaLabel };
  if (isCollection(href))
    return (
      <Link to="/collections/$slug" params={{ slug: href.slice("/collections/".length) }} {...common}>
        {children}
      </Link>
    );
  if (isProduct(href))
    return (
      <Link to="/products/$slug" params={{ slug: href.slice("/products/".length) }} {...common}>
        {children}
      </Link>
    );
  return (
    <Link to={href} {...common}>
      {children}
    </Link>
  );
}
