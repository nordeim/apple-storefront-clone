import { describe, expect, it } from "vitest";
import { CATEGORIES, PRODUCTS, getProduct, productsByCategory, searchCatalog } from "./catalog";

describe("catalog integrity", () => {
  it("has unique product ids", () => {
    const ids = PRODUCTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("assigns every product to a known category", () => {
    const known = new Set(CATEGORIES.map((c) => c.id));
    for (const p of PRODUCTS) expect(known.has(p.category)).toBe(true);
  });

  it("gives every option at least one choice with a unique id and a zero-delta default", () => {
    for (const p of PRODUCTS) {
      for (const opt of p.options) {
        expect(opt.choices.length).toBeGreaterThan(0);
        expect(new Set(opt.choices.map((c) => c.id)).size).toBe(opt.choices.length);
        expect(opt.choices[0]?.deltaSgd).toBe(0);
      }
    }
  });
});

describe("lookups", () => {
  it("finds a product by id and returns undefined otherwise", () => {
    expect(getProduct("airpods-pro-3")?.name).toBe("AirPods Pro 3");
    expect(getProduct("nope")).toBeUndefined();
  });

  it("filters by category", () => {
    const macs = productsByCategory("mac");
    expect(macs.length).toBeGreaterThan(0);
    expect(macs.every((p) => p.category === "mac")).toBe(true);
  });
});

describe("searchCatalog", () => {
  it("matches case-insensitively on name", () => {
    expect(searchCatalog("MACBOOK").some((p) => p.id === "macbook-pro-m6")).toBe(true);
  });

  it("matches on tagline text", () => {
    expect(searchCatalog("noise cancellation").map((p) => p.id)).toContain("airpods-pro-3");
  });

  it("returns nothing for blank or whitespace queries", () => {
    expect(searchCatalog("")).toEqual([]);
    expect(searchCatalog("   ")).toEqual([]);
  });

  it("treats regex metacharacters literally", () => {
    expect(() => searchCatalog("(.*[")).not.toThrow();
    expect(searchCatalog("(.*[")).toEqual([]);
  });

  it("caps the number of results", () => {
    expect(searchCatalog("a", 3).length).toBeLessThanOrEqual(3);
  });
});
