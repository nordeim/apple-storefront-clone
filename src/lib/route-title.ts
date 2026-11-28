import { getProduct, type CategoryId } from "./catalog";
import type { MarketingCategoryId, Route } from "./router";
import { INFO_TITLES } from "./site-content";

const SITE = "Apple (Singapore)";

/**
 * The document title for a route — the tab-title contract. Store category
 * pages use the same full-form label map as the store page's h1
 * ("Shop Apple Watch"), so the tab and the page never disagree; every other
 * route derives from the catalogue or the INFO_TITLES map and degrades to
 * honest fallbacks rather than throwing.
 *
 * Two categories render their reference's own page families, not the "Shop X"
 * store family: airpods is the marketing page (h1 "AirPods", the reference's
 * document title) and accessories is the filtered grid (h1 "Accessories") —
 * session-11's D14/D15. The per-category accessories views carry the
 * reference's own measured titles (session-12 D16) — including iPad's
 * lowercase "accessories".
 */
const STORE_PAGE_TITLES: Readonly<Record<CategoryId, string>> = {
  mac: "Shop Mac",
  ipad: "Shop iPad",
  iphone: "Shop iPhone",
  watch: "Shop Apple Watch",
  vision: "Shop Apple Vision Pro",
  airpods: "AirPods",
  home: "Shop Home",
  accessories: "Accessories",
};

const ACCESSORIES_VIEW_TITLES: Readonly<Record<CategoryId, string>> = {
  mac: "Shop Mac Accessories",
  ipad: "Shop iPad accessories",
  iphone: "Shop iPhone Accessories",
  watch: "Apple Watch Accessories",
  vision: "Apple Vision Pro Accessories",
  airpods: "Shop AirPods & Accessories",
  home: "Home Accessories",
  accessories: "Accessories",
};

/** The nav-main marketing pages' measured document titles (session-13 D17 —
 * the reference's `/sg/{x}/` pages, each "… - Apple (SG)" there). */
const MARKETING_PAGE_TITLES: Readonly<Record<MarketingCategoryId, string>> = {
  mac: "Mac",
  ipad: "iPad",
  iphone: "iPhone",
  watch: "Apple Watch",
  vision: "Apple Vision Pro",
  home: "Home",
};

export function routeTitle(route: Route): string {
  switch (route.name) {
    case "home":
      return SITE;
    case "store":
      if (route.view === "accessories" && route.category) {
        return `${ACCESSORIES_VIEW_TITLES[route.category]} - ${SITE}`;
      }
      return `${route.category ? STORE_PAGE_TITLES[route.category] : "Store"} - ${SITE}`;
    case "marketing":
      return `${MARKETING_PAGE_TITLES[route.category]} - ${SITE}`;
    case "product":
      return `${getProduct(route.id)?.name ?? "Product"} - ${SITE}`;
    case "bag":
      return `Bag - ${SITE}`;
    case "checkout":
      return `Check Out - ${SITE}`;
    case "confirmation":
      return `Order confirmed - ${SITE}`;
    case "search":
      return `${route.query.trim() ? `Search results for ${route.query.trim()}` : "Search"} - ${SITE}`;
    case "entertainment":
      return `Entertainment - ${SITE}`;
    case "support":
      return `Support - ${SITE}`;
    case "info":
      return `${INFO_TITLES.get(route.slug) ?? "Page not found"} - ${SITE}`;
    case "not-found":
      return `Page not found - ${SITE}`;
  }
}
