import { describe, expect, it } from "vitest";
import { parseHash, routeHref } from "./router";
import {
  ACCESSORIES_CATEGORY_INFO_LABELS,
  ACCESSORIES_CATEGORY_PAGES,
  DEVICE_CATEGORY_IDS,
  type AccessoriesCategoryPage,
} from "./accessories-category-pages";
import { findProductId } from "./store-rails";

/** Every generated href must survive the router — the session-10 drift guard
 *  (H-1's lesson), applied to this seam from day one. */
const routeable = (href: string): boolean => parseHash(href).name !== "not-found";

const PAGES = DEVICE_CATEGORY_IDS.map((id) => ACCESSORIES_CATEGORY_PAGES[id]);

const everyCard = (page: AccessoriesCategoryPage) =>
  page.curated.tabs.flatMap((tab) => tab.cards.map((card) => ({ tab: tab.label, card })));

describe("ACCESSORIES_CATEGORY_PAGES (the reference's measured /sg/shop/{cat}/accessories grids)", () => {
  it("models the seven per-category pages with their measured h1s (D16)", () => {
    expect(DEVICE_CATEGORY_IDS).toEqual(["mac", "ipad", "iphone", "watch", "vision", "airpods", "home"]);
    const h1s = PAGES.map((p) => p.h1);
    expect(h1s).toEqual([
      "Mac Accessories",
      "iPad Accessories",
      "iPhone Accessories",
      "Apple Watch Accessories",
      "Apple Vision Pro Accessories",
      "AirPods & Accessories",
      "Home Accessories",
    ]);
    for (const page of PAGES) {
      expect(page.id, page.h1).toBeTruthy();
      expect(page.chapternav.length, page.h1).toBeGreaterThan(0);
      expect(page.gallery.cards.length, page.h1).toBeGreaterThan(0);
      expect(page.curated.tabs.length, page.h1).toBeGreaterThan(0);
      expect(page.valueProps.items.length, page.h1).toBeGreaterThanOrEqual(3);
      expect(page.indexNav.groups.length, page.h1).toBe(3);
    }
  });

  it("models the measured chapternav chips (labels + the reference's accessible names)", () => {
    const counts: Record<string, number> = { mac: 9, ipad: 7, iphone: 7, watch: 4, vision: 5, airpods: 3, home: 6 };
    for (const page of PAGES) {
      expect(page.chapternav, page.id).toHaveLength(counts[page.id] ?? -1);
      for (const chip of page.chapternav) {
        // the accessible name carries the " - {h1}" suffix (the reference's own pattern)
        expect(chip.ariaLabel, chip.label).toBe(`${chip.label} - ${page.h1}`);
        expect(chip.href.startsWith("#/info/"), chip.ariaLabel).toBe(true);
        expect(routeable(chip.href), chip.ariaLabel).toBe(true);
      }
    }
    // the chip spacing is running text: the session-12 textContent capture
    // had joined the reference's <br>-split words ("Apple WatchStraps") —
    // corrected in S14-9 (the S14-9 guard pins the class)
    expect(ACCESSORIES_CATEGORY_PAGES.mac.chapternav[0]?.ariaLabel).toBe("Cases & Protection - Mac Accessories");
    expect(ACCESSORIES_CATEGORY_PAGES.watch.chapternav[0]?.ariaLabel).toBe("Apple Watch Straps - Apple Watch Accessories");
  });

  it("models the measured media galleries (headlines, themes, CTAs)", () => {
    expect(ACCESSORIES_CATEGORY_PAGES.mac.gallery.headline).toBe("Just in for Mac.");
    expect(ACCESSORIES_CATEGORY_PAGES.iphone.gallery.headline).toBe("In the spotlight.");
    expect(ACCESSORIES_CATEGORY_PAGES.mac.gallery.cards.map((c) => c.headline)).toEqual(["Works like magic.", "AirPods 5"]);
    // the reference's "New" eyebrows on the home page's two product cards
    expect(ACCESSORIES_CATEGORY_PAGES.home.gallery.cards.map((c) => c.eyebrow)).toEqual(["New", "New", undefined]);
    for (const page of PAGES) {
      for (const card of page.gallery.cards) {
        expect(["dark", "light"], card.headline).toContain(card.theme);
        expect(card.cta.href, card.headline).toBeTruthy();
        expect(routeable(card.cta.href), card.headline).toBe(true);
      }
    }
  });

  it("models the measured curated grids (tabs, the measured card counts)", () => {
    const expected: Record<string, { tabs: string[]; counts: number[] }> = {
      mac: { tabs: ["Gear Up", "Power Picks", "Mac Must-Haves", "The Perfect Match"], counts: [12, 12, 12, 3] },
      ipad: { tabs: ["iPad Pro", "iPad Air", "iPad", "iPad mini"], counts: [12, 12, 14, 8] },
      iphone: { tabs: ["Mix & Match", "Power Picks", "Travel Ready", "Personal Audio", "For Creators"], counts: [11, 12, 14, 11, 8] },
      watch: { tabs: ["Sport Mode", "Classic Style", "Power Picks"], counts: [13, 8, 9] },
      vision: { tabs: ["Essential Picks", "Work & Play"], counts: [7, 9] },
      airpods: { tabs: ["AirPods & Essentials", "Stay Charged"], counts: [11, 12] },
      home: { tabs: ["Home Essentials", "Security", "Lighting"], counts: [12, 2, 2] },
    };
    for (const page of PAGES) {
      const want = expected[page.id];
      expect(page.curated.tabs.map((t) => t.label), page.id).toEqual(want.tabs);
      expect(page.curated.tabs.map((t) => t.cards.length), page.id).toEqual(want.counts);
      expect(page.curated.headline, page.id).toBeTruthy();
    }
    // 226 measured items: 200 cards + 26 promos
    const cards = PAGES.flatMap((p) => everyCard(p));
    expect(cards.filter((c) => c.card.kind === "card")).toHaveLength(200);
    expect(cards.filter((c) => c.card.kind === "promo")).toHaveLength(26);
  });

  it("carries the measured badges at the measured totals", () => {
    const badges = PAGES.flatMap((p) => everyCard(p))
      .flatMap(({ card }) => (card.kind === "card" && card.badge ? [card.badge] : []));
    const counts = badges.reduce<Record<string, number>>((acc, b) => ({ ...acc, [b]: (acc[b] ?? 0) + 1 }), {});
    expect(counts).toEqual({ "Only at Apple": 25, "Online only": 6, New: 47, "Free engraving": 14 });
  });

  it("routes the curated cards by the established rule (D10/D11/D12)", () => {
    for (const page of PAGES) {
      for (const { card } of everyCard(page)) {
        if (card.kind === "promo") {
          expect(card.headline, page.id).toBeTruthy();
          expect(routeable(card.href), card.headline).toBe(true);
          continue;
        }
        expect(card.label, page.id).toBeTruthy();
        expect(routeable(card.href), card.label).toBe(true);
        const catalogId = findProductId(card.label);
        if (catalogId) {
          // D10/D12: a card that names a catalog product IS that product — no
          // measured price, href to the product page
          expect(card.productId, card.label).toBe(catalogId);
          expect(card.price, card.label).toBeUndefined();
          expect(card.href, card.label).toBe(routeHref.product(catalogId));
        } else {
          // D11: everything else carries its measured price + an info route —
          // except the reference's own priceless cards (the vision page's two,
          // the all-page Smart Folio pattern)
          expect(card.productId, card.label).toBeUndefined();
          if (card.price) expect(card.price, card.label).toMatch(/^S\$/);
          expect(card.href.startsWith("#/info/"), card.label).toBe(true);
        }
      }
    }
    // the reference quotes S$399 for the Apple TV 4K card while this catalog
    // says From S$229 — the card must derive (D10), never quote
    const tvCard = ACCESSORIES_CATEGORY_PAGES.home.curated.tabs[0]?.cards.find(
      (c) => c.kind === "card" && c.label === "Apple TV 4K",
    );
    expect(tvCard).toMatchObject({ kind: "card", productId: "apple-tv-4k" });
    if (tvCard?.kind === "card") expect(tvCard.price).toBeUndefined();
  });

  it("routes the gallery CTAs by the established rule (D12 for catalog buy pages)", () => {
    for (const page of PAGES) {
      for (const card of page.gallery.cards) {
        if (card.cta.productId) {
          expect(card.cta.href, card.headline).toBe(routeHref.productBuy(card.cta.productId));
        } else {
          expect(card.cta.href.startsWith("#/"), card.headline).toBe(true);
        }
        expect(routeable(card.cta.href), card.headline).toBe(true);
      }
    }
    // the home page's Apple TV 4K gallery card deep-links the configurator
    const tvGallery = ACCESSORIES_CATEGORY_PAGES.home.gallery.cards.find((c) => c.headline === "Apple TV 4K");
    expect(tvGallery?.cta).toMatchObject({ productId: "apple-tv-4k", href: "#/product/apple-tv-4k?buy" });
  });

  it("models the measured value props (the shared service set, footnotes trimmed)", () => {
    for (const page of PAGES) {
      expect(page.valueProps.headline, page.id).toBe("Why Apple is the best place to buy accessories.");
      for (const item of page.valueProps.items) {
        expect(item.linkName, item.headline).toBe("Learn more");
        expect(item.body, item.headline).not.toMatch(/Footnote|[\u2206\u25ca\u2020\u2021\u00a7\u00b1]/);
        expect(routeable(item.href), item.headline).toBe(true);
      }
    }
    // the financing/returns props reuse the flyout's own destinations (the
    // all-page pattern — deduped by slug in INFO_TITLES)
    expect(ACCESSORIES_CATEGORY_PAGES.mac.valueProps.items[2]?.href).toBe("#/info/financing");
    expect(ACCESSORIES_CATEGORY_PAGES.mac.valueProps.items[0]?.href).toBe("#/info/free-delivery-and-pickup");
  });

  it("routes the index-nav 'Shop by Product' group to the per-category pages (D16)", () => {
    for (const page of PAGES) {
      const shopByProduct = page.indexNav.groups[0];
      expect(shopByProduct?.headline, page.id).toBe("Shop by Product");
      for (const link of shopByProduct?.links ?? []) {
        expect(routeable(link.href), link.label).toBe(true);
      }
      // the seven device links route to the per-category accessories pages
      const mac = shopByProduct?.links.find((l) => l.label === "Mac");
      expect(mac?.href).toBe("#/store/mac/accessories");
      const all = shopByProduct?.links.find((l) => l.label === "All Accessories");
      expect(all?.href).toBe("#/store/accessories");
    }
    // the home page's index carries the Home link too (10 links, measured)
    expect(ACCESSORIES_CATEGORY_PAGES.home.indexNav.groups[0]?.links).toHaveLength(10);
    expect(ACCESSORIES_CATEGORY_PAGES.mac.indexNav.groups[0]?.links).toHaveLength(9);
  });

  it("exposes every info-routed label for the INFO_TITLES derivation (sitemap lockstep)", () => {
    expect(ACCESSORIES_CATEGORY_INFO_LABELS.length).toBeGreaterThan(100);
    for (const { label, href } of ACCESSORIES_CATEGORY_INFO_LABELS) {
      expect(href.startsWith("#/info/"), label).toBe(true);
      expect(routeable(href), label).toBe(true);
      expect(label.length).toBeGreaterThan(0);
    }
    // set-equality with the info hrefs the pages actually render (the S12-1
    // guard pattern — a label used in a href but missing from the export
    // would be a silently-404ing link)
    const pageHrefs = new Set(
      PAGES.flatMap((page) => [
        ...page.chapternav.map((c) => c.href),
        ...page.gallery.cards.map((c) => c.cta.href),
        ...everyCard(page).map(({ card }) => card.href),
        ...page.valueProps.items.map((i) => i.href),
        ...page.indexNav.groups.flatMap((g) => g.links.map((l) => l.href)),
      ]).filter((href) => href.startsWith("#/info/")),
    );
    expect(new Set(ACCESSORIES_CATEGORY_INFO_LABELS.map((l) => l.href))).toEqual(pageHrefs);
    // the longest measured label slugifies well under the router's 130 cap
    let longest = 0;
    for (const { label } of ACCESSORIES_CATEGORY_INFO_LABELS) {
      longest = Math.max(longest, label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").length);
    }
    expect(longest).toBeLessThanOrEqual(130);
  });

  it("round-trips every generated href through the router (the S10-1 drift guard)", () => {
    for (const page of PAGES) {
      const hrefs = [
        ...page.chapternav.map((c) => c.href),
        ...page.gallery.cards.map((c) => c.cta.href),
        ...everyCard(page).map(({ card }) => card.href),
        ...page.valueProps.items.map((i) => i.href),
        ...page.indexNav.groups.flatMap((g) => g.links.map((l) => l.href)),
      ];
      for (const href of hrefs) {
        const route = parseHash(href);
        expect(route.name !== "not-found", `${page.id}: ${href}`).toBe(true);
      }
    }
  });
});

describe("ACCESSORIES_CATEGORY_PAGES text fidelity (the S14-9 guard)", () => {
  /** The session-12 converter's textContent capture dropped the spaces around
   *  the chip labels' separators and word boundaries ("Cases &Protection",
   *  "OfficeAccessories", "Controllers,Keyboards &Trackpads"). The chip labels
   *  are display text: these three patterns make the class unshippable. */
  const collectText = (value: unknown, out: string[] = []): string[] => {
    if (typeof value === "string") {
      if (!value.startsWith("#/")) out.push(value);
    } else if (Array.isArray(value)) {
      for (const v of value) collectText(v, out);
    } else if (value && typeof value === "object") {
      for (const v of Object.values(value)) collectText(v, out);
    }
    return out;
  };

  const texts = collectText(ACCESSORIES_CATEGORY_PAGES);

  it("no label joins '&' or ',' to the next word without a space ('Cases &Protection', 'Controllers,Keyboards')", () => {
    const offenders = texts.filter((t) => /&[A-Z]/.test(t) || /,[A-Z]/.test(t));
    expect(offenders).toEqual([]);
  });

  it("no label carries a dropped word boundary ('OfficeAccessories', 'WatchStraps', 'ProEssentials', 'Mountsand'…)", () => {
    const joins = [
      "OfficeAccessories", "WatchStraps", "ProEssentials", "TVEssentials",
      "SmartHomeAccessories", "ContentCreation", "Mountsand", "AirPodsEssentials",
    ];
    const offenders = texts.filter((t) => joins.some((j) => t.includes(j)));
    expect(offenders).toEqual([]);
  });
});
