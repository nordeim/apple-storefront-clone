import { isCategoryId, getProduct, type CategoryId } from "./catalog";

export type Route =
  | { name: "home" }
  | { name: "store"; category?: CategoryId }
  | { name: "product"; id: string }
  | { name: "bag" }
  | { name: "checkout" }
  | { name: "confirmation"; orderNo: string }
  | { name: "search"; query: string }
  | { name: "entertainment" }
  | { name: "support" }
  | { name: "info"; slug: string }
  | { name: "not-found" };

const NOT_FOUND: Route = { name: "not-found" };
export const ORDER_NO = /^EL-[A-Z0-9]{8}$/;
// Cap 60 → 130 (session-10, S10-1): measured rail/category labels slugify to
// as long as 126 chars and 404'd under the 60 cap — silent dead links the
// href-shape specs could not see. 130 keeps the grammar bounded with headroom
// over the longest measured label; the round-trip specs guard the boundary.
const SLUG = /^[a-z0-9-]{1,130}$/;

function safeDecode(raw: string): string | undefined {
  try {
    return decodeURIComponent(raw);
  } catch {
    return undefined;
  }
}

function parseSearchQuery(queryString: string): string {
  for (const pair of queryString.split("&")) {
    const [key, value = ""] = pair.split("=");
    if (key !== "q") continue;
    // Malformed escapes degrade to the raw text instead of throwing in render.
    return safeDecode(value.replace(/\+/g, " ")) ?? value;
  }
  return "";
}

/** Exact `?buy` deep-link detection: the param is a discrete query key, never
 * a substring of the hash — `?buyfoo` or `?q=buy` are not the buy deep link. */
export function hasBuyParam(hash: string): boolean {
  const queryPart = hash.replace(/^#/, "").split("?")[1] ?? "";
  return new URLSearchParams(queryPart).has("buy");
}

export function parseHash(hash: string): Route {
  const withoutHash = hash.replace(/^#/, "");
  const [pathPart = "", queryPart = ""] = withoutHash.split("?");
  const segments = pathPart.split("/").filter(Boolean).map((s) => safeDecode(s));
  if (segments.some((s) => s === undefined)) return NOT_FOUND;
  const [head, arg, ...rest] = segments as string[];

  if (rest.length > 0) return NOT_FOUND;

  switch (head) {
    case undefined:
      return arg === undefined ? { name: "home" } : NOT_FOUND;
    case "store":
      if (arg === undefined) return { name: "store" };
      return isCategoryId(arg) ? { name: "store", category: arg } : NOT_FOUND;
    case "product":
      return arg !== undefined && getProduct(arg) ? { name: "product", id: arg } : NOT_FOUND;
    case "bag":
      return arg === undefined ? { name: "bag" } : NOT_FOUND;
    case "checkout":
      return arg === undefined ? { name: "checkout" } : NOT_FOUND;
    case "confirmation":
      return arg !== undefined && ORDER_NO.test(arg) ? { name: "confirmation", orderNo: arg } : NOT_FOUND;
    case "search":
      return arg === undefined ? { name: "search", query: parseSearchQuery(queryPart) } : NOT_FOUND;
    case "entertainment":
      return arg === undefined ? { name: "entertainment" } : NOT_FOUND;
    case "support":
      return arg === undefined ? { name: "support" } : NOT_FOUND;
    case "info":
      return arg !== undefined && SLUG.test(arg) ? { name: "info", slug: arg } : NOT_FOUND;
    default:
      return NOT_FOUND;
  }
}

export const routeHref = {
  home: "#/",
  store: (category?: CategoryId) => (category ? `#/store/${category}` : "#/store"),
  product: (id: string) => `#/product/${id}`,
  /** Product deep link that scrolls straight to the configurator (App/ProductPage consume the `?buy` hint). */
  productBuy: (id: string) => `#/product/${id}?buy`,
  bag: "#/bag",
  checkout: "#/checkout",
  confirmation: (orderNo: string) => `#/confirmation/${orderNo}`,
  search: (query: string) => `#/search?q=${encodeURIComponent(query)}`,
  entertainment: "#/entertainment",
  support: "#/support",
  info: (slug: string) => `#/info/${slug}`,
} as const;
