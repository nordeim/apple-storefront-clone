import { describe, expect, it } from "vitest";
import { routeTitle } from "./route-title";
import type { Route } from "./router";

const SITE = "Apple (Singapore)";

describe("routeTitle", () => {
  it("uses the site name alone for the home route", () => {
    expect(routeTitle({ name: "home" })).toBe(SITE);
  });

  it("titles the all-products store page 'Store'", () => {
    expect(routeTitle({ name: "store" })).toBe(`Store - ${SITE}`);
  });

  it("titles category store pages with the full-form label, matching the h1", () => {
    // The store page's h1 renders STORE_CATEGORY_LABELS ("Shop Apple Watch");
    // the tab title must not diverge to the short category label.
    expect(routeTitle({ name: "store", category: "watch" })).toBe(`Shop Apple Watch - ${SITE}`);
    expect(routeTitle({ name: "store", category: "vision" })).toBe(`Shop Apple Vision Pro - ${SITE}`);
    expect(routeTitle({ name: "store", category: "mac" })).toBe(`Shop Mac - ${SITE}`);
  });

  it("titles every category with the same full-form label map as the h1 seam", () => {
    const cases: [Route, string][] = [
      [{ name: "store", category: "ipad" }, "Shop iPad"],
      [{ name: "store", category: "iphone" }, "Shop iPhone"],
      [{ name: "store", category: "home" }, "Shop Home"],
    ];
    for (const [route, expected] of cases) {
      expect(routeTitle(route)).toBe(`${expected} - ${SITE}`);
    }
  });

  it("titles the two non-store page families with their reference's own titles (D14/D15)", () => {
    // airpods renders the reference's marketing page (h1 "AirPods"), and
    // accessories renders its filtered grid (h1 "Accessories") — neither is a
    // "Shop X" store page, so neither title carries the prefix.
    expect(routeTitle({ name: "store", category: "airpods" })).toBe(`AirPods - ${SITE}`);
    expect(routeTitle({ name: "store", category: "accessories" })).toBe(`Accessories - ${SITE}`);
  });

  it("titles product pages with the product's catalogue name", () => {
    expect(routeTitle({ name: "product", id: "iphone-duo" })).toBe(`iPhone Duo - ${SITE}`);
  });

  it("falls back to 'Product' for an unknown product id", () => {
    // parseHash rejects unknown ids, but the title seam degrades gracefully too.
    expect(routeTitle({ name: "product", id: "no-such-product" })).toBe(`Product - ${SITE}`);
  });

  it("titles the transactional routes", () => {
    expect(routeTitle({ name: "bag" })).toBe(`Bag - ${SITE}`);
    expect(routeTitle({ name: "checkout" })).toBe(`Check Out - ${SITE}`);
    expect(routeTitle({ name: "confirmation", orderNo: "EL-ABCDEFGH" })).toBe(`Order confirmed - ${SITE}`);
  });

  it("titles search with the trimmed query and degrades when empty", () => {
    expect(routeTitle({ name: "search", query: "macbook pro" })).toBe(`Search results for macbook pro - ${SITE}`);
    expect(routeTitle({ name: "search", query: "   " })).toBe(`Search - ${SITE}`);
  });

  it("titles the fixed pages", () => {
    expect(routeTitle({ name: "entertainment" })).toBe(`Entertainment - ${SITE}`);
    expect(routeTitle({ name: "support" })).toBe(`Support - ${SITE}`);
    expect(routeTitle({ name: "not-found" })).toBe(`Page not found - ${SITE}`);
  });

  it("titles info pages from the INFO_TITLES derivation", () => {
    expect(routeTitle({ name: "info", slug: "compare-mac" })).toBe(`Compare Mac - ${SITE}`);
    expect(routeTitle({ name: "info", slug: "no-such-slug" })).toBe(`Page not found - ${SITE}`);
  });
});
