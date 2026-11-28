import { describe, expect, it } from "vitest";
import { hasBuyParam, parseHash, routeHref } from "./router";

describe("parseHash", () => {
  it("treats empty and root hashes as home", () => {
    expect(parseHash("")).toEqual({ name: "home" });
    expect(parseHash("#")).toEqual({ name: "home" });
    expect(parseHash("#/")).toEqual({ name: "home" });
  });

  it("parses store with and without a valid category", () => {
    expect(parseHash("#/store")).toEqual({ name: "store" });
    expect(parseHash("#/store/mac")).toEqual({ name: "store", category: "mac" });
  });

  it("falls back to not-found for an unknown category", () => {
    expect(parseHash("#/store/toasters")).toEqual({ name: "not-found" });
  });

  it("parses product ids only when they exist in the catalog", () => {
    expect(parseHash("#/product/iphone-18-pro")).toEqual({ name: "product", id: "iphone-18-pro" });
    expect(parseHash("#/product/does-not-exist")).toEqual({ name: "not-found" });
  });

  it("decodes the search query and tolerates malformed escapes", () => {
    expect(parseHash("#/search?q=mac%20book")).toEqual({ name: "search", query: "mac book" });
    expect(parseHash("#/search?q=%E0%A4%A")).toEqual({ name: "search", query: "%E0%A4%A" });
    expect(parseHash("#/search")).toEqual({ name: "search", query: "" });
  });

  it("restricts confirmation order numbers to a safe charset", () => {
    expect(parseHash("#/confirmation/EL-8F3K2Q9X")).toEqual({ name: "confirmation", orderNo: "EL-8F3K2Q9X" });
    expect(parseHash("#/confirmation/<script>")).toEqual({ name: "not-found" });
  });

  it("handles static pages and info slugs", () => {
    expect(parseHash("#/bag")).toEqual({ name: "bag" });
    expect(parseHash("#/checkout")).toEqual({ name: "checkout" });
    expect(parseHash("#/entertainment")).toEqual({ name: "entertainment" });
    expect(parseHash("#/support")).toEqual({ name: "support" });
    expect(parseHash("#/info/privacy")).toEqual({ name: "info", slug: "privacy" });
    expect(parseHash("#/info/..%2F..")).toEqual({ name: "not-found" });
  });

  it("accepts info slugs up to 130 chars and rejects longer ones (S10-1: the measured rail labels slugify to 126)", () => {
    // The longest measured rail label slugifies to 70 chars (store rails) and
    // the longest category-shelf label to 126 (the APPLECARE+ card) — both
    // must be routeable. 130 is the boundary; 131 must 404 (the grammar stays
    // bounded).
    const slug70 = "beats-360-over-ear-headphones-pink-with-pink-performance-knit-cushions";
    expect(slug70).toHaveLength(70);
    expect(parseHash(`#/info/${slug70}`)).toEqual({ name: "info", slug: slug70 });
    const slug126 = "b".repeat(126);
    expect(parseHash(`#/info/${slug126}`)).toEqual({ name: "info", slug: slug126 });
    const slug131 = "a".repeat(131);
    expect(parseHash(`#/info/${slug131}`)).toEqual({ name: "not-found" });
  });

  it("rejects trailing segments on the argless heads (uniform 404 grammar)", () => {
    // bag/checkout already 404 these; search/entertainment/support must not
    // silently truncate a trailing segment into a valid route.
    expect(parseHash("#/search/xyz")).toEqual({ name: "not-found" });
    expect(parseHash("#/entertainment/tv")).toEqual({ name: "not-found" });
    expect(parseHash("#/support/iphone")).toEqual({ name: "not-found" });
  });

  it("returns not-found for unknown routes", () => {
    expect(parseHash("#/nope")).toEqual({ name: "not-found" });
  });
});

describe("routeHref factories", () => {
  it("builds every route from one grammar — including the ?buy deep link", () => {
    expect(routeHref.home).toBe("#/");
    expect(routeHref.store()).toBe("#/store");
    expect(routeHref.store("mac")).toBe("#/store/mac");
    expect(routeHref.product("iphone-18-pro")).toBe("#/product/iphone-18-pro");
    expect(routeHref.productBuy("iphone-18-pro")).toBe("#/product/iphone-18-pro?buy");
    expect(routeHref.bag).toBe("#/bag");
    expect(routeHref.info("privacy")).toBe("#/info/privacy");
  });

  it("round-trips the buy deep link through parseHash to the product page", () => {
    // The ?buy suffix is a scroll hint consumed by App/ProductPage; the route
    // itself must still parse to the product page.
    expect(parseHash(routeHref.productBuy("iphone-18-pro"))).toEqual({ name: "product", id: "iphone-18-pro" });
  });
});

describe("hasBuyParam", () => {
  it("recognises the exact bare-key buy param the factory builds", () => {
    expect(hasBuyParam("#/product/iphone-18-pro?buy")).toBe(true);
    expect(hasBuyParam("#/product/iphone-18-pro?buy=true")).toBe(true);
    expect(hasBuyParam("#/product/iphone-18-pro?color=gold&buy")).toBe(true);
  });

  it("does not substring-match the buy grammar", () => {
    // "?buyfoo" is not the buy param; "?q=buy" is a search query value.
    expect(hasBuyParam("#/product/iphone-18-pro?buyfoo")).toBe(false);
    expect(hasBuyParam("#/store?buyfoo")).toBe(false);
    expect(hasBuyParam("#/search?q=buy")).toBe(false);
    expect(hasBuyParam("#/product/iphone-18-pro?b=buy")).toBe(false);
  });

  it("is false without any query part", () => {
    expect(hasBuyParam("#/product/iphone-18-pro")).toBe(false);
    expect(hasBuyParam("#/")).toBe(false);
    expect(hasBuyParam("")).toBe(false);
  });
});
