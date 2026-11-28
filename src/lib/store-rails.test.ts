import { describe, expect, it } from "vitest";
import {
  STORE_QUICK_LINKS,
  STORE_RAILS,
  productPriceLabel,
  railCardHref,
} from "./store-rails";
import { PRODUCTS, getProduct } from "./catalog";

/** The hash-route grammar every rail card href must satisfy — routeHref factories only. */
const ROUTE_RE = /^#\/(product\/[a-z0-9-]+|info\/[a-z0-9-]+|store(\/[a-z0-9-]+)?|entertainment|support)$/;

describe("STORE_RAILS (the reference's measured store editorial rails)", () => {
  it("carries the seven measured rail headers and subheads, in order", () => {
    expect(STORE_RAILS.map((r) => r.header)).toEqual([
      "The latest.",
      "Personalisation.",
      "Holiday picks.",
      "Colourful finds.",
      "Home essentials.",
      "Only at Apple.",
      "Savings and offers.",
    ]);
    expect(STORE_RAILS.map((r) => r.subhead)).toEqual([
      "Wonderful and colourful choices.",
      "Leave a lasting impression.",
      "Get them all decked out.",
      "Delight up the holiday season.",
      "More room to amaze.",
      "The total package.",
      "Exclusive deals, special stores and more.",
    ]);
  });

  it("routes every card through the routeHref grammar", () => {
    for (const rail of STORE_RAILS) {
      for (const card of rail.cards) {
        expect(card.href).toMatch(ROUTE_RE);
      }
    }
  });

  it("models 'The latest.' on the reference's twelve measured product cards", () => {
    const latest = STORE_RAILS[0];
    expect(latest.cards).toHaveLength(12);
    // the reference's measured card order and eyebrows (live capture, 2026-11-28)
    expect(latest.cards.map((c) => c.label)).toEqual([
      "iPhone 18 Pro",
      "Apple Watch Series 12",
      "MacBook Pro",
      "Apple HomeView",
      "iPad mini",
      "iPhone Duo",
      "Apple Watch Ultra 4",
      "MacBook Pro PROLED XDR Display",
      "Apple TV 4K",
      "AirPods 5",
      "HomePod mini 2",
      "iMac",
    ]);
    expect(latest.cards.map((c) => c.eyebrow ?? "")).toEqual([
      "NEW",
      "NEW",
      "NEW 14” WITH M6",
      "NEW",
      "NEW",
      "NEW",
      "NEW",
      "NEW",
      "NEW",
      "NEW",
      "NEW",
      "NEW",
    ]);
    // the seven catalog-matched cards route to THIS clone's product pages
    const productCards = latest.cards.filter((c) => c.href.startsWith("#/product/"));
    expect(productCards.map((c) => c.label)).toEqual([
      "iPhone 18 Pro",
      "Apple Watch Series 12",
      "MacBook Pro",
      "Apple HomeView",
      "iPhone Duo",
      "MacBook Pro PROLED XDR Display",
      "Apple TV 4K",
    ]);
    expect(productCards.every((c) => c.productId !== undefined)).toBe(true);
    // the non-catalog cards carry the reference's measured price text
    const ipadMini = latest.cards.find((c) => c.label === "iPad mini");
    expect(ipadMini?.desc).toBe("From S$999");
    expect(ipadMini?.href).toMatch(/^#\/info\//);
    const imac = latest.cards.find((c) => c.label === "iMac");
    expect(imac?.desc).toBe("From S$2,099");
  });

  it("models the six editorial rails' card sets on the measured capture", () => {
    const byHeader = (h: string) => STORE_RAILS.find((r) => r.header === h);
    expect(byHeader("Personalisation.")?.cards).toHaveLength(10);
    expect(byHeader("Holiday picks.")?.cards).toHaveLength(12);
    expect(byHeader("Colourful finds.")?.cards).toHaveLength(10);
    expect(byHeader("Home essentials.")?.cards).toHaveLength(12);
    expect(byHeader("Only at Apple.")?.cards).toHaveLength(9);
    expect(byHeader("Savings and offers.")?.cards).toHaveLength(3);
    // eyebrow content is the measured capture, byte-equal on the first cards
    const personalisation = byHeader("Personalisation.");
    expect(personalisation?.cards[0].eyebrow).toBe("FREE ENGRAVING");
    expect(personalisation?.cards[0].label).toBe("It’s your thought that counts.");
    const savings = byHeader("Savings and offers.");
    expect(savings?.cards.map((c) => c.eyebrow ?? "")).toEqual(["EDUCATION", "CERTIFIED REFURBISHED", "SMALL BUSINESS"]);
  });

  it("keeps catalog-matched cards' desc empty (price derives at render)", () => {
    // the seam stores no price text for catalog-matched cards — the component
    // derives the price from the clone's own catalog (deviation D10).
    for (const rail of STORE_RAILS) {
      for (const card of rail.cards) {
        if (card.productId) expect(card.desc).toBeUndefined();
      }
    }
  });
});

describe("railCardHref", () => {
  it("routes an exact catalog product name to its product page", () => {
    expect(railCardHref("iPhone 18 Pro")).toBe("#/product/iphone-18-pro");
    expect(railCardHref("Apple HomeView")).toBe("#/product/apple-homeview");
  });

  it("routes every other measured label to an info page", () => {
    expect(railCardHref("iPad mini")).toMatch(/^#\/info\//);
    expect(railCardHref("It’s your thought that counts.")).toMatch(/^#\/info\//);
  });

  it("is the familyLink rule: exact-name catalog match, else info route", () => {
    for (const product of PRODUCTS) {
      expect(railCardHref(product.name)).toBe(`#/product/${product.id}`);
    }
  });
});

describe("productPriceLabel", () => {
  it("prefixes 'From' for products with options", () => {
    const withOptions = getProduct("iphone-18-pro");
    if (!withOptions) throw new Error("iphone-18-pro missing from catalog");
    expect(productPriceLabel(withOptions)).toBe("From S$1,799");
  });

  it("quotes the flat price for products without options", () => {
    const flat = getProduct("airpods-pro-3");
    if (!flat) throw new Error("airpods-pro-3 missing from catalog");
    expect(productPriceLabel(flat)).toBe("S$349");
  });
});

describe("STORE_QUICK_LINKS (the reference's measured store quick-links strip)", () => {
  it("routes AirPods to the clone's category page and the rest to info pages", () => {
    // The clone HAS the AirPods destination (the reference's quick link goes
    // to /sg/airpods/); the other four labels are informational.
    const airpods = STORE_QUICK_LINKS.find((l) => l.label === "AirPods");
    expect(airpods?.href).toBe("#/store/airpods");
    for (const link of STORE_QUICK_LINKS.filter((l) => l.label !== "AirPods")) {
      expect(link.href).toMatch(/^#\/info\//);
    }
  });
});
