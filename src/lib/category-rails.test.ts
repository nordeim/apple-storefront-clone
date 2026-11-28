import { describe, expect, it } from "vitest";
import { productsByCategory } from "./catalog";
import { parseHash } from "./router";
import { CATEGORY_RAIL_INFO_LABELS, CATEGORY_RAILS, type CategoryRail, type CategoryRailCard } from "./category-rails";

/** Every card href must survive the router — the session-10 drift guard. */
const routeable = (href: string): boolean => parseHash(href).name !== "not-found";

const allCards: readonly CategoryRailCard[] = (Object.values(CATEGORY_RAILS) as unknown as readonly (readonly CategoryRail[])[]).flatMap(
  (shelves) => shelves.flatMap((s) => s.cards),
);

describe("CATEGORY_RAILS (the reference's measured category-page shelves)", () => {
  it("models the six device category pages with the measured shelf counts", () => {
    expect(Object.keys(CATEGORY_RAILS)).toEqual(["mac", "ipad", "iphone", "watch", "vision", "home", "airpods", "accessories"]);
    expect(CATEGORY_RAILS.mac.map((s) => s.header)).toEqual([
      "All models.",
      "Mac picks.",
      "Ways to save.",
      "Only at Apple.",
      "Setup and support.",
      "The Mac experience.",
      "Savings and offers.",
    ]);
    expect(CATEGORY_RAILS.mac).toHaveLength(7);
    expect(CATEGORY_RAILS.ipad).toHaveLength(7);
    expect(CATEGORY_RAILS.iphone).toHaveLength(6);
    expect(CATEGORY_RAILS.watch.map((s) => s.header)).toEqual([
      "All models.",
      "Apple Watch picks.",
      "Ways to save.",
      "Only at Apple.",
      "Apple Watch charging essentials.",
      "The Apple Watch experience.",
      "Setup and support.",
      "Special stores.",
    ]);
    expect(CATEGORY_RAILS.watch).toHaveLength(8);
    expect(CATEGORY_RAILS.vision).toHaveLength(7);
    expect(CATEGORY_RAILS.home).toHaveLength(5);
  });

  it("carries the measured subheads (the page-level marketing lines)", () => {
    expect(CATEGORY_RAILS.mac[0]?.subhead).toBe("Take your pick.");
    expect(CATEGORY_RAILS.watch[1]?.subhead).toBe("Time to celebrate.");
    expect(CATEGORY_RAILS.vision[0]).toMatchObject({ header: "Apple Vision Pro.", subhead: "Welcome to the era of spatial computing." });
    expect(CATEGORY_RAILS.home[0]).toMatchObject({ header: "Apple Home.", subhead: "Explore the lineup." });
    expect(CATEGORY_RAILS.iphone[4]?.subhead).toBe("Our Specialists are here to help.");
  });

  it("leaves airpods and accessories empty this cycle (D13: their reference pages are different families)", () => {
    expect(CATEGORY_RAILS.airpods).toEqual([]);
    expect(CATEGORY_RAILS.accessories).toEqual([]);
  });

  it("derives the first shelf's product cards from THIS clone's catalog (D12) with working buy deep links", () => {
    for (const category of ["mac", "ipad", "iphone", "watch", "vision", "home"] as const) {
      const shelf = CATEGORY_RAILS[category][0];
      if (!shelf) throw new Error(`${category} has no first shelf`);
      const products = productsByCategory(category);
      const productCards = shelf.cards.filter((c) => c.productId !== undefined);
      expect(productCards, category).toHaveLength(products.length);
      for (const card of productCards) {
        expect(card.href, `${category} ${card.label}`).toBe(`#/product/${card.productId}`);
        expect(card.buyHref, `${category} ${card.label}`).toBe(`#/product/${card.productId}?buy`);
        expect(routeable(card.href)).toBe(true);
        expect(routeable(card.buyHref ?? "")).toBe(true);
      }
    }
    // the measured per-product eyebrows carry onto the catalog-matched cards
    const macPro = CATEGORY_RAILS.mac[0]?.cards.find((c) => c.productId === "macbook-pro-m6");
    expect(macPro?.eyebrow).toBe("NEW 14\u201d WITH M6");
    const homeview = CATEGORY_RAILS.home[0]?.cards.find((c) => c.productId === "apple-homeview");
    expect(homeview?.eyebrow).toBe("NEW");
    // the vision hero renders at the measured wide geometry
    const visionHero = CATEGORY_RAILS.vision[0]?.cards.find((c) => c.productId === "apple-vision-pro");
    expect(visionHero?.variant).toBe("product-wide");
  });

  it("carries the measured trailing editorial cards on the first shelves", () => {
    const macCompare = CATEGORY_RAILS.mac[0]?.cards.find((c) => c.eyebrow === "COMPARE ALL MODELS");
    expect(macCompare).toMatchObject({ label: "Which Mac is right for you?", variant: "editorial-wide" });
    const watchCompare = CATEGORY_RAILS.watch[0]?.cards.find((c) => c.eyebrow === "COMPARE ALL MODELS");
    expect(watchCompare).toMatchObject({ label: "Which Apple Watch is right for you?" });
    const iphoneExplore = CATEGORY_RAILS.iphone[0]?.cards.find((c) => c.label === "Explore iPhone accessories.");
    expect(iphoneExplore).toBeDefined();
    const visionExplore = CATEGORY_RAILS.vision[0]?.cards.find((c) => c.label === "Explore all Apple Vision Pro accessories.");
    expect(visionExplore).toBeDefined();
  });

  it("models the measured content shelves (picks, service rails) with the measured card sets", () => {
    const macPicks = CATEGORY_RAILS.mac[1];
    if (!macPicks) throw new Error("mac picks missing");
    expect(macPicks.cards).toHaveLength(10);
    expect(macPicks.cards[0]).toMatchObject({ eyebrow: "HOLIDAY ACCESSORIES", label: "Everything\u2019s better together." });
    const macPicksAccessories = macPicks.cards.filter((c) => c.variant === "accessory");
    expect(macPicksAccessories).toHaveLength(9);
    expect(macPicksAccessories[0]).toMatchObject({ eyebrow: "Only at Apple", label: "Rains 14\u201d Utility Sleeve for MacBook and iPad", desc: "S$139.00" });

    const watchPicks = CATEGORY_RAILS.watch[1];
    if (!watchPicks) throw new Error("watch picks missing");
    expect(watchPicks.cards).toHaveLength(11);

    const ways = CATEGORY_RAILS.mac[2];
    if (!ways) throw new Error("mac ways missing");
    expect(ways.cards.map((c) => c.eyebrow)).toEqual(["APPLE TRADE IN", "LOW MONTHLY PAYMENTS", "CERTIFIED REFURBISHED", "EDUCATION"]);
    expect(ways.cards.every((c) => c.variant === "editorial-wide")).toBe(true);

    const onlyAtApple = CATEGORY_RAILS.mac[3];
    if (!onlyAtApple) throw new Error("mac only missing");
    expect(onlyAtApple.cards).toHaveLength(8);
    // the measured short cards carry the reference's themed pairs
    const shortCard = onlyAtApple.cards.find((c) => c.variant === "editorial-short");
    expect(shortCard?.theme).toEqual({ bg: "#420052", fg: "#c4b8eb" });

    const experience = CATEGORY_RAILS.mac[5];
    if (!experience) throw new Error("mac experience missing");
    expect(experience.cards).toHaveLength(11);
    const music = experience.cards.find((c) => c.eyebrow === "APPLE MUSIC");
    expect(music).toMatchObject({ label: "Get 3 months of Apple Music free.", desc: "Included with the purchase of selected Apple devices.", theme: { bg: "#1d1d1f", fg: "#f5f5f7" } });

    const savings = CATEGORY_RAILS.mac[6];
    if (!savings) throw new Error("mac savings missing");
    expect(savings.cards.map((c) => c.eyebrow)).toEqual(["EDUCATION", "SMALL BUSINESS"]);
  });

  it("routes every content card through the established rule and round-trips the router", () => {
    expect(allCards.length).toBeGreaterThan(200);
    for (const card of allCards) {
      expect(card.href).toMatch(/^#\/(product\/[a-z0-9-]+|info\/[a-z0-9-]+)$/);
      expect(routeable(card.href), card.label).toBe(true);
    }
    // catalog-matched content cards route to product pages; the rest to info pages
    // (the reference's label carries a U+2011 non-breaking hyphen in "USB‑C")
    const accessory = CATEGORY_RAILS.mac[1]?.cards.find((c) => c.label.startsWith("Magic Mouse (USB"));
    expect(accessory?.href).toBe("#/info/magic-mouse-usb-c-white-multi-touch-surface");
    const longLabel = allCards.find((c) => c.label.startsWith("Protect your iPad, Apple Pencil"));
    expect(longLabel?.href).toMatch(/^#\/info\/protect-your-ipad/);
    expect(longLabel && longLabel.href.length).toBeLessThanOrEqual("#/info/".length + 130);
  });

  it("exposes the info-routed labels for the INFO_TITLES derivation (sitemap lockstep)", () => {
    expect(CATEGORY_RAIL_INFO_LABELS.length).toBeGreaterThan(150);
    for (const { label, href } of CATEGORY_RAIL_INFO_LABELS) {
      expect(href.startsWith("#/info/")).toBe(true);
      expect(routeable(href)).toBe(true);
      expect(label.length).toBeGreaterThan(0);
    }
    // every info-routed card appears in the export
    const infoCards = allCards.filter((c) => c.href.startsWith("#/info/"));
    expect(new Set(CATEGORY_RAIL_INFO_LABELS.map((l) => l.href)).size).toBe(new Set(infoCards.map((c) => c.href)).size);
  });

  it("keeps the measured card geometry per variant", () => {
    const variants = new Set(allCards.map((c) => c.variant));
    expect(variants).toContain("product");
    expect(variants).toContain("product-wide");
    expect(variants).toContain("accessory");
    expect(variants).toContain("editorial");
    expect(variants).toContain("editorial-wide");
    expect(variants).toContain("editorial-short");
    expect(variants).toContain("editorial-short-wide");
    // product cards are the only ones with buy deep links
    for (const card of allCards) {
      if (card.productId) expect(card.buyHref).toBeDefined();
      else expect(card.buyHref).toBeUndefined();
    }
  });
});
