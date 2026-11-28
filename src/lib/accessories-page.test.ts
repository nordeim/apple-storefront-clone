import { describe, expect, it } from "vitest";
import { getProduct } from "./catalog";
import { parseHash } from "./router";
import { railCardHref } from "./store-rails";
import {
  ACCESSORIES_CHAPTERNAV,
  ACCESSORIES_CURATED,
  ACCESSORIES_GALLERY,
  ACCESSORIES_INDEX_NAV,
  ACCESSORIES_INFO_LABELS,
  ACCESSORIES_VALUE_PROPS,
} from "./accessories-page";

/** Every generated href must survive the router — the session-10 drift guard,
 *  applied to this seam from day one. */
const routeable = (href: string): boolean => parseHash(href).name !== "not-found";

const curatedCards = ACCESSORIES_CURATED.tabs.flatMap((tab) => tab.cards);

describe("ACCESSORIES_* (the reference's measured /sg/shop/accessories/all grid page)", () => {
  it("models the measured chapter nav (nine product chips)", () => {
    expect(ACCESSORIES_CHAPTERNAV.map((c) => c.label)).toEqual([
      "iPhone",
      "iPad",
      "Mac",
      "Apple Watch",
      "Apple Vision Pro",
      "AirPods",
      "Home",
      "AirTag",
      "Beats",
    ]);
    // every chip's accessible name carries the reference's " - Accessories" suffix
    for (const chip of ACCESSORIES_CHAPTERNAV) {
      expect(chip.ariaLabel).toBe(`${chip.label} - Accessories`);
      expect(routeable(chip.href), chip.label).toBe(true);
    }
    // device chips route to the clone's category pages (the pages that carry
    // their measured accessory shelves — D15); AirTag/Beats route to info pages
    expect(ACCESSORIES_CHAPTERNAV[0]?.href).toBe("#/store/iphone");
    expect(ACCESSORIES_CHAPTERNAV[6]?.href).toBe("#/store/home");
    expect(ACCESSORIES_CHAPTERNAV[7]?.href).toBe("#/info/airtag-accessories");
    expect(ACCESSORIES_CHAPTERNAV[8]?.href).toBe("#/info/beats-accessories");
  });

  it("models the measured media gallery (eight themed cards with CTAs)", () => {
    expect(ACCESSORIES_GALLERY.headline).toBe("Say hello to what\u2019s new.");
    expect(ACCESSORIES_GALLERY.cards).toHaveLength(8);
    const [together, homepod, appletv] = ACCESSORIES_GALLERY.cards;
    expect(together).toMatchObject({ theme: "dark", headline: "Everything\u2019s better together." });
    expect(together?.cta?.label).toBe("Shop Christmas Picks");
    expect(homepod).toMatchObject({ theme: "light", eyebrow: "New", headline: "HomePod mini 2" });
    // HomePod mini 2 is NOT a clone product — its Buy routes to an info page
    expect(homepod?.cta?.productId).toBeUndefined();
    expect(homepod?.cta?.href).toBe("#/info/homepod-mini-2");
    expect(appletv).toMatchObject({ theme: "light", eyebrow: "New", headline: "Apple TV 4K" });
    // the Apple TV 4K IS a clone product — its Buy deep-links the configurator (D12)
    expect(appletv?.cta).toMatchObject({ label: "Buy", productId: "apple-tv-4k" });
    expect(appletv?.cta?.href).toBe("#/product/apple-tv-4k?buy");
    for (const card of ACCESSORIES_GALLERY.cards) {
      expect(card.headline.length).toBeGreaterThan(0);
      expect(card.cta).toBeDefined();
      expect(routeable(card.cta?.href ?? ""), card.headline).toBe(true);
    }
  });

  it("models the measured curated grid (five tabs, the measured card counts)", () => {
    expect(ACCESSORIES_CURATED.headline).toBe("Our top picks. Their next favourites.");
    expect(ACCESSORIES_CURATED.tabs.map((t) => t.label)).toEqual([
      "Holiday Picks",
      "Colourful Finds",
      "Travel Ready",
      "Home Essentials",
      "Power Picks",
    ]);
    expect(ACCESSORIES_CURATED.tabs.map((t) => t.cards.length)).toEqual([11, 11, 11, 11, 9]);
    expect(curatedCards).toHaveLength(53);
  });

  it("carries the measured curated cards (badges, labels, prices) verbatim", () => {
    const holiday = ACCESSORIES_CURATED.tabs[0]?.cards ?? [];
    // the captured labels carry the reference's own non-breaking spaces
    // (U+00A0 inside "iPhone\u00a018 Pro\u00a0Max" — Apple's line-break guard)
    expect(holiday[0]).toMatchObject({
      badge: "New",
      label: "iPhone\u00a018 Pro\u00a0Max Silicone Case with MagSafe - Crisp Blue",
      price: "S$75.00",
    });
    expect(holiday[5]).toMatchObject({ badge: "Only at Apple", label: "mophie Frost Case with Kickstand for iPhone\u00a018 Pro\u00a0Max", price: "S$69.00" });
    const travel = ACCESSORIES_CURATED.tabs[2]?.cards ?? [];
    expect(travel[0]).toMatchObject({ badge: "Free engraving", label: "AirTag 4 pack", productId: "airtag-4-pack" });
    const power = ACCESSORIES_CURATED.tabs[4]?.cards ?? [];
    // D10: the catalog-matched card carries no measured price — it derives from
    // THIS clone's catalog at render (the reference's S$59 contradicted it)
    const magSafe = power[0];
    if (magSafe?.kind !== "card") throw new Error("first Power Picks item is not a card");
    expect(magSafe).toMatchObject({ label: "MagSafe Charger (1m)", productId: "magsafe-charger" });
    expect(magSafe.price).toBeUndefined();
  });

  it("routes the curated cards by the established rule (D10/D11/D12)", () => {
    for (const item of curatedCards) {
      if (item.kind === "promo") continue; // routed by its own headline label
      expect(routeable(item.href), item.label).toBe(true);
      const routesToProduct = railCardHref(item.label).startsWith("#/product/");
      if (routesToProduct) {
        // catalog-named cards derive their price at render — no measured string
        expect(item.productId, `"${item.label}" names a catalog product but is not a productId card`).toBeDefined();
        expect(item.price, `"${item.label}" carries a measured price beside a catalog-matched route`).toBeUndefined();
        expect(getProduct(item.productId ?? "")).toBeDefined();
      } else {
        expect(item.productId).toBeUndefined();
        // the reference carries one priceless card (the Smart Folio); every
        // other info-routed card carries its measured price verbatim
        if (item.price !== undefined) expect(item.price).toMatch(/^S\$/);
      }
    }
    // the three catalog-matched cards the reference's grids actually carry
    const matched = curatedCards.flatMap((c) => (c.kind === "card" && c.productId ? [c.productId] : []));
    expect([...matched].sort()).toEqual(["airpods-pro-3", "airtag-4-pack", "magsafe-charger"]);
  });

  it("models the measured value props (four items)", () => {
    expect(ACCESSORIES_VALUE_PROPS.headline).toBe("Why Apple is the best place to buy accessories.");
    expect(ACCESSORIES_VALUE_PROPS.items.map((i) => i.headline)).toEqual([
      "Free delivery and pickup.",
      "Holiday Returns",
      "Pay 0% interest for up to 24 months.",
      "Free Personal Setup.",
    ]);
    for (const item of ACCESSORIES_VALUE_PROPS.items) {
      expect(item.body.length).toBeGreaterThan(10);
      expect(item.linkName).toBe("Learn more");
      expect(routeable(item.href), item.headline).toBe(true);
    }
  });

  it("models the measured index nav (three groups, the measured link counts)", () => {
    expect(ACCESSORIES_INDEX_NAV.headline).toBe("Accessories");
    expect(ACCESSORIES_INDEX_NAV.groups.map((g) => g.headline)).toEqual([
      "Shop by Product",
      "Shop by Category",
      "Explore More Accessories",
    ]);
    expect(ACCESSORIES_INDEX_NAV.groups.map((g) => g.links.length)).toEqual([9, 11, 4]);
    expect(ACCESSORIES_INDEX_NAV.groups[0]?.links[0]?.label).toBe("iPhone");
    expect(ACCESSORIES_INDEX_NAV.groups[1]?.links[0]?.label).toBe("Cases & Protection");
    expect(ACCESSORIES_INDEX_NAV.groups[2]?.links[3]?.label).toBe("Accessibility");
    const allLinks = ACCESSORIES_INDEX_NAV.groups.flatMap((g) => g.links);
    for (const link of allLinks) {
      expect(routeable(link.href), link.label).toBe(true);
    }
  });

  it("exposes every info-routed label for the INFO_TITLES derivation (sitemap lockstep)", () => {
    expect(ACCESSORIES_INFO_LABELS.length).toBeGreaterThan(40);
    for (const { label, href } of ACCESSORIES_INFO_LABELS) {
      expect(href.startsWith("#/info/"), label).toBe(true);
      expect(routeable(href), label).toBe(true);
    }
    // the label list legitimately carries the reference's own repeats (the
    // Belkin power bank ships in two tabs; HomePod mini 2 names both a gallery
    // CTA and a grid card) — INFO_TITLES dedupes by slug, so the contract is
    // set-equality with the page's info-routed destinations
    const exported = new Set(ACCESSORIES_INFO_LABELS.map((l) => l.href));
    const pageHrefs = new Set([
      ...ACCESSORIES_GALLERY.cards.map((c) => c.cta.href),
      ...curatedCards.flatMap((c) => (c.kind === "promo" ? [c.href] : [c.href])),
      ...ACCESSORIES_VALUE_PROPS.items.map((i) => i.href),
      ...ACCESSORIES_INDEX_NAV.groups.flatMap((g) => g.links.map((l) => l.href)),
      ...ACCESSORIES_CHAPTERNAV.map((c) => c.href),
    ].filter((h) => h.startsWith("#/info/")));
    expect(exported).toEqual(pageHrefs);
  });
});
