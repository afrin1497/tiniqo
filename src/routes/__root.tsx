import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import { products } from "@/data";
import { StoreProvider } from "@/lib/store";

function NotFoundComponent() {
  const picks = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 4);
  return (
    <section className="container-page py-16 md:py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-heading text-7xl font-black text-primary">404</p>
        <h1 className="mt-4 text-3xl font-extrabold">Oops, this page wandered off to play</h1>
        <p className="mt-3 text-muted-foreground">
          We couldn't find what you were looking for. Maybe one of these little favourites?
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="cta" size="lg"><Link to="/">Back to home</Link></Button>
          <Button asChild variant="outline" size="lg"><Link to="/collections/$slug" params={{ slug: "new-arrivals" }}>New arrivals</Link></Button>
        </div>
      </div>
      <ul className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
        {picks.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
      </ul>
    </section>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </Button>
          <Button asChild variant="outline">
            <a href="/">Go home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${siteConfig.name} — Kidswear for girls, boys & babies` },
      { name: "description", content: siteConfig.description },
      { name: "author", content: siteConfig.name },
      { name: "theme-color", content: "#F7FAF3" },
      { property: "og:site_name", content: siteConfig.name },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Nunito:wght@700;800;900&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <a
          href="#main"
          className="sr-only z-50 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <AnnouncementBar />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="min-h-[60vh] outline-none">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
        <CartDrawer />
        <WhatsAppButton />
        <Toaster position="top-center" richColors closeButton />
      </StoreProvider>
    </QueryClientProvider>
  );
}
