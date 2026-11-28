import { isCategoryId, getProduct, type CategoryId, type DeviceCategoryId } from "./catalog";

export type Route =
  | { name: "home" }
  | { name: "store"; category?: CategoryId; view?: "accessories" }
  | { name: "marketing"; category: MarketingCategoryId }
  | { name: "product"; id: string }
  | { name: "bag" }
  | { name: "checkout" }
  | { name: "confirmation"; orderNo: string }
  | { name: "search"; query: string }
  | { name: "entertainment" }
  | { name: "support" }
  | { name: "info"; slug: string }
  | { name: "not-found" };

/** The categories whose nav-main destination is a marketing page
 * (`/sg/{x}/` on the reference — session-13 D17). AirPods is absent on
 * purpose: its marketing family lives at `#/store/airpods` (session-11 D14). */
export const MARKETING_ROUTE_CATEGORIES = ["mac", "ipad", "iphone", "watch", "vision", "home"] as const;
export type MarketingCategoryId = (typeof MARKETING_ROUTE_CATEGORIES)[number];

/** The categories whose reference destination is a per-category accessories
 * grid (/sg/shop/{cat}/accessories) — every category except accessories
 * itself (session-12 D16). */
const ACCESSORIES_VIEW_CATEGORIES: ReadonlySet<string> = new Set([
  "mac",
  "ipad",
  "iphone",
  "watch",
  "vision",
  "airpods",
  "home",
]);

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

  // Exactly one second segment is legal anywhere in the grammar: the store
  // head's per-category accessories view (`#/store/mac/accessories`). Every
  // other trailing segment 404s (the uniform grammar).
  if (rest.length === 1) {
    if (head !== "store" || rest[0] !== "accessories") return NOT_FOUND;
    if (arg === undefined || !ACCESSORIES_VIEW_CATEGORIES.has(arg)) return NOT_FOUND;
    return { name: "store", category: arg as CategoryId, view: "accessories" };
  }
  if (rest.length > 1) return NOT_FOUND;

  switch (head) {
    case undefined:
      return arg === undefined ? { name: "home" } : NOT_FOUND;
    case "store":
      if (arg === undefined) return { name: "store" };
      return isCategoryId(arg) ? { name: "store", category: arg } : NOT_FOUND;
    case "mac":
    case "ipad":
    case "iphone":
    case "watch":
    case "vision":
    case "home":
      // the six nav-main marketing pages (S13-5, D17) — single-segment routes
      // mirroring the reference's /sg/{x}/ shape. The case labels ARE the
      // marketing categories; the set check is defense-in-depth.
      return arg === undefined && MARKETING_ROUTE_SET.has(head) ? { name: "marketing", category: head } : NOT_FOUND;
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

const MARKETING_ROUTE_SET: ReadonlySet<string> = new Set(MARKETING_ROUTE_CATEGORIES);

export const routeHref = {
  home: "#/",
  store: (category?: CategoryId) => (category ? `#/store/${category}` : "#/store"),
  /** The per-category accessories grid (`#/store/mac/accessories`) — the
   * reference's /sg/shop/{cat}/accessories destination (session-12 D16). The
   * parameter is DeviceCategoryId: the accessories category itself has no
   * accessories page (`#/store/accessories/accessories` 404s by design) and
   * the type now makes building that dead href impossible (session-13 S13-3). */
  storeAccessories: (category: DeviceCategoryId) => `#/store/${category}/accessories`,
  /** The nav-main marketing page (`#/mac` … `#/home`) — the reference's
   * /sg/{x}/ destination (session-13 D17). */
  marketing: (category: MarketingCategoryId) => `#/${category}`,
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
