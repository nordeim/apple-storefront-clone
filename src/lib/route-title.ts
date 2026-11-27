import { getProduct } from "./catalog";
import type { Route } from "./router";
import { INFO_TITLES, STORE_CATEGORY_LABELS } from "./site-content";

const SITE = "Apple (Singapore)";

/**
 * The document title for a route — the tab-title contract. Store category
 * pages use the same full-form label map as the store page's h1
 * ("Shop Apple Watch"), so the tab and the page never disagree; every other
 * route derives from the catalogue or the INFO_TITLES map and degrades to
 * honest fallbacks rather than throwing.
 */
export function routeTitle(route: Route): string {
  switch (route.name) {
    case "home":
      return SITE;
    case "store":
      return `${route.category ? `Shop ${STORE_CATEGORY_LABELS[route.category]}` : "Store"} - ${SITE}`;
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
