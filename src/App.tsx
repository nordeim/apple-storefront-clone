import { useEffect, useRef } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Footer } from "@/components/Footer";
import { GlobalNav } from "@/components/GlobalNav";
import { BagProvider } from "@/context/BagContext";
import { useRoute } from "@/hooks/useRoute";
import { getProduct } from "@/lib/catalog";
import { HOME_FOOTNOTES } from "@/lib/home-content";
import { routeTitle } from "@/lib/route-title";
import { hasBuyParam, type Route } from "@/lib/router";
import { BagPage } from "@/pages/BagPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { ConfirmationPage } from "@/pages/ConfirmationPage";
import { HomePage } from "@/pages/HomePage";
import { ProductPage } from "@/pages/ProductPage";
import { SearchPage } from "@/pages/SearchPage";
import { EntertainmentPage, InfoPage, NotFoundPage, SupportPage } from "@/pages/StaticPages";
import { StorePage } from "@/pages/StorePage";

function RouteView({ route }: { route: Route }) {
  switch (route.name) {
    case "home":
      return <HomePage />;
    case "store":
      return <StorePage key={route.view === "accessories" ? `${route.category ?? "all"}-accessories` : route.category ?? "all"} category={route.category} view={route.view} />;
    case "product": {
      const product = getProduct(route.id);
      return product ? <ProductPage product={product} /> : <NotFoundPage />;
    }
    case "bag":
      return <BagPage />;
    case "checkout":
      return <CheckoutPage />;
    case "confirmation":
      return <ConfirmationPage orderNo={route.orderNo} />;
    case "search":
      return <SearchPage key={route.query} query={route.query} />;
    case "entertainment":
      return <EntertainmentPage />;
    case "support":
      return <SupportPage />;
    case "info":
      return <InfoPage slug={route.slug} />;
    case "not-found":
      return <NotFoundPage />;
  }
}

function Shell() {
  const { route, hash } = useRoute();
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef<string | null>(null);
  const path = hash.split("?")[0] ?? "";

  useEffect(() => {
    document.title = routeTitle(route);
    const isNavigation = previousPath.current !== null && previousPath.current !== path;
    previousPath.current = path;
    if (!isNavigation) return;
    // Hash routing never reloads the page, so reset scroll and focus the way a real navigation would.
    // A product deep link (?buy) hands focus to the Configurator's heading — its
    // child effect runs first, so the shell's focus reset would steal it back.
    if (!(route.name === "product" && hasBuyParam(hash))) {
      window.scrollTo(0, 0);
      mainRef.current?.focus({ preventScroll: true });
    }
  }, [route, hash, path]);

  return (
    <>
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>
      <GlobalNav />
      <main id="main" ref={mainRef} tabIndex={-1} className="focus:outline-none">
        <ErrorBoundary resetKey={path}>
          <RouteView route={route} />
        </ErrorBoundary>
      </main>
      <Footer notes={route.name === "home" ? HOME_FOOTNOTES : []} />
    </>
  );
}

export default function App() {
  return (
    <BagProvider>
      <Shell />
    </BagProvider>
  );
}
