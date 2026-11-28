import { describe, expect, it } from "vitest";
import { PRODUCTS } from "./catalog";
import { MARKETING_ROUTE_CATEGORIES, parseHash, routeHref } from "./router";
import {
  MARKETING_INFO_LABELS,
  MARKETING_PAGES,
  type MarketingLineupTile,
  type MarketingPage,
  type MarketingSection,
} from "./marketing-pages";
import { slugify } from "./slug";

/** Every generated href must survive the router — the session-10 drift guard,
 * applied to this seam from day one (the S13-2 lesson: shape checks are not
 * round-trips). */
const routeable = (href: string): boolean => parseHash(href).name !== "not-found";

const PAGES = MARKETING_ROUTE_CATEGORIES.map((id) => MARKETING_PAGES[id]);

type SectionOfKind<K extends MarketingSection["kind"]> = Extract<MarketingSection, { kind: K }>;

const sectionsOf = <K extends MarketingSection["kind"]>(page: MarketingPage, kind: K): SectionOfKind<K>[] =>
  page.sections.filter((s): s is SectionOfKind<K> => s.kind === kind);

const lineupTiles = (page: MarketingPage): MarketingLineupTile[] => {
  const out: MarketingLineupTile[] = [];
  for (const section of sectionsOf(page, "lineup")) {
    for (const tab of section.tabs) out.push(...tab.tiles);
  }
  return out;
};

const everyHref = (page: MarketingPage): string[] => {
  const hrefs: string[] = [];
  for (const chip of page.chapternav) hrefs.push(chip.href);
  for (const section of page.sections) {
    if (section.kind === "lineup") {
      for (const tab of section.tabs) for (const t of tab.tiles) hrefs.push(t.learnHref, t.buyHref);
    } else if (section.kind === "valueprops") {
      if (section.headCta) hrefs.push(section.headCta.href);
      for (const r of section.rows) if (r.cta) hrefs.push(r.cta.href);
    } else if (section.kind === "cards") {
      for (const t of section.tiles) for (const c of t.ctas) hrefs.push(c.href);
    } else if (section.kind === "accordion") {
      for (const it of section.items) for (const c of it.ctas) hrefs.push(c.href);
    } else if (section.kind === "directory") {
      for (const l of section.links) hrefs.push(l.href);
    } else {
      for (const c of section.ctas) hrefs.push(c.href);
    }
  }
  return hrefs;
};

describe("MARKETING_PAGES (the reference's measured /sg/{x}/ marketing pages)", () => {
  it("carries the six nav-main pages with their measured titles and h1s (D17)", () => {
    expect(PAGES.map((p) => p.id)).toEqual(["mac", "ipad", "iphone", "watch", "vision", "home"]);
    expect(MARKETING_PAGES.mac.title).toBe("Mac");
    expect(MARKETING_PAGES.watch.title).toBe("Apple Watch");
    expect(MARKETING_PAGES.vision.title).toBe("Apple Vision Pro");
    for (const page of PAGES) expect(page.h1).toBe(page.title);
  });

  it("models each page's measured section sequence", () => {
    expect(MARKETING_PAGES.mac.sections.map((s) => s.kind)).toEqual([
      "lineup", "valueprops", "cards", "cards", "cards", "directory",
    ]);
    expect(MARKETING_PAGES.ipad.sections.map((s) => s.kind)).toEqual([
      "lineup", "valueprops", "cards", "cards", "directory",
    ]);
    expect(MARKETING_PAGES.iphone.sections.map((s) => s.kind)).toEqual([
      "cards", "lineup", "valueprops", "valueprops", "cards", "cards", "accordion", "directory",
    ]);
    expect(MARKETING_PAGES.watch.sections.map((s) => s.kind)).toEqual([
      "lineup", "valueprops", "cards", "cards", "directory",
    ]);
    // the vision page is hero-led: no line-up, statement sections carry it
    // (the Entertainment section is its one cards family)
    expect(MARKETING_PAGES.vision.sections.map((s) => s.kind)).toEqual([
      "statement", "statement", "cards", "statement", "statement", "statement", "statement", "statement", "statement",
    ]);
    expect(MARKETING_PAGES.home.sections.map((s) => s.kind)).toEqual([
      "lineup", "valueprops", "statement", "cards", "directory",
    ]);
  });

  it("carries the measured chapternav chips (mac 11, ipad 10, iphone 10, watch 11; vision/home have none)", () => {
    expect(MARKETING_PAGES.mac.chapternav).toHaveLength(11);
    expect(MARKETING_PAGES.ipad.chapternav).toHaveLength(10);
    expect(MARKETING_PAGES.iphone.chapternav).toHaveLength(10);
    expect(MARKETING_PAGES.watch.chapternav).toHaveLength(11);
    expect(MARKETING_PAGES.vision.chapternav).toHaveLength(0);
    expect(MARKETING_PAGES.home.chapternav).toHaveLength(0);
    // badge extraction: the reference's "New" chips
    expect(MARKETING_PAGES.mac.chapternav.find((c) => c.label === "MacBook Pro")?.isNew).toBe(true);
    expect(MARKETING_PAGES.watch.chapternav.find((c) => c.label === "Apple Watch Nike")?.isNew).toBe(true);
    expect(MARKETING_PAGES.mac.chapternav.find((c) => c.label === "Compare")?.isNew).toBe(false);
  });

  it("routes the chapternav's special families (Accessories -> the grid, Shop X -> the store, catalog names -> products)", () => {
    expect(MARKETING_PAGES.mac.chapternav.find((c) => c.label === "Accessories")?.href).toBe("#/store/mac/accessories");
    expect(MARKETING_PAGES.mac.chapternav.find((c) => c.label === "Shop Mac")?.href).toBe("#/store/mac");
    expect(MARKETING_PAGES.watch.chapternav.find((c) => c.label === "Accessories")?.href).toBe("#/store/watch/accessories");
    // the family labels that name clone catalog products route to them (D6)
    expect(MARKETING_PAGES.mac.chapternav.find((c) => c.label === "MacBook Pro")?.href).toBe("#/product/macbook-pro-m6");
    expect(MARKETING_PAGES.iphone.chapternav.find((c) => c.label === "iPhone Duo")?.href).toBe("#/product/iphone-duo");
  });

  it("carries the measured line-up galleries (mac 4 tabs 9/4/3/2; the others single-tab)", () => {
    const macLineup = sectionsOf(MARKETING_PAGES.mac, "lineup")[0];
    expect(macLineup.tabs.map((t) => t.chip)).toEqual(["All products", "Laptops", "Desktops", "Displays"]);
    expect(macLineup.tabs.map((t) => t.tiles.length)).toEqual([9, 4, 3, 2]);
    expect(lineupTiles(MARKETING_PAGES.ipad)).toHaveLength(4);
    expect(lineupTiles(MARKETING_PAGES.iphone)).toHaveLength(6);
    expect(lineupTiles(MARKETING_PAGES.watch)).toHaveLength(3);
    expect(lineupTiles(MARKETING_PAGES.home)).toHaveLength(4);
  });

  it("D10: a productId tile never carries a measured price — the rendered price derives from this clone's catalog", () => {
    for (const page of PAGES) {
      for (const tile of lineupTiles(page)) {
        if (tile.productId) {
          expect(tile.measuredPrice, `${page.id}: ${tile.name}`).toBeNull();
          expect(PRODUCTS.find((p) => p.id === tile.productId), `${page.id}: ${tile.productId}`).toBeTruthy();
        }
      }
      for (const section of sectionsOf(page, "cards")) {
        for (const tile of section.tiles) {
          if (tile.productId) {
            expect(tile.measuredPrice, `${page.id}: ${tile.headline}`).toBeNull();
            expect(PRODUCTS.find((p) => p.id === tile.productId), `${page.id}: ${tile.productId}`).toBeTruthy();
          }
        }
      }
    }
  });

  it("D12: every productId tile's Buy CTA deep-links the working configurator of THAT product", () => {
    for (const page of PAGES) {
      for (const tile of lineupTiles(page)) {
        if (!tile.productId) continue;
        expect(tile.buyHref, `${page.id}: ${tile.name}`).toBe(routeHref.productBuy(tile.productId));
        expect(tile.learnHref).toBe(routeHref.product(tile.productId));
      }
    }
  });

  it("derives the catalog matches the reference's line-up actually names (the D17 conversion map)", () => {
    // the "All products" tab (index 0) is the canonical line-up; the Laptops
    // tab repeats the two MacBook Pros.
    const macAll = sectionsOf(MARKETING_PAGES.mac, "lineup")[0].tabs[0].tiles.filter((t) => t.productId).map((t) => t.productId);
    expect(macAll).toEqual(["macbook-pro-m6", "macbook-pro-proled"]);
    const iphone = lineupTiles(MARKETING_PAGES.iphone).filter((t) => t.productId).map((t) => t.productId);
    expect(iphone).toEqual(["iphone-duo", "iphone-18-pro"]);
    const home = lineupTiles(MARKETING_PAGES.home).filter((t) => t.productId).map((t) => t.productId);
    expect(home).toEqual(["apple-homeview", "apple-tv-4k"]);
    const watch = lineupTiles(MARKETING_PAGES.watch).filter((t) => t.productId).map((t) => t.productId);
    expect(watch).toEqual(["apple-watch-series-12"]);
    const ipad = lineupTiles(MARKETING_PAGES.ipad).filter((t) => t.productId).map((t) => t.productId);
    expect(ipad).toEqual(["ipad"]);
    // the iPhone Duo hero tiles are productId cards too
    const hero = sectionsOf(MARKETING_PAGES.iphone, "cards")[0];
    expect(hero.tiles.filter((t) => t.productId).map((t) => t.productId)).toEqual(["iphone-duo", "iphone-18-pro"]);
  });

  it("MARKETING_INFO_LABELS set-equality: exactly every #/info/ label the pages render (the S10-1 guard)", () => {
    const expected = new Set<string>();
    for (const page of PAGES) {
      for (const href of everyHref(page)) {
        if (!href.startsWith("#/info/")) continue;
        const slug = href.replace("#/info/", "");
        const label = MARKETING_INFO_LABELS.find((l) => slugify(l.label) === slug);
        expect(label, `${page.id}: no label for ${slug}`).toBeTruthy();
        if (label) expected.add(label.label);
      }
    }
    expect(new Set(MARKETING_INFO_LABELS.map((l) => l.label))).toEqual(expected);
    // every entry's href is the info route of its own label (the shape the
    // INFO_TITLES derivation filters on)
    for (const l of MARKETING_INFO_LABELS) {
      expect(l.href).toBe(routeHref.info(slugify(l.label)));
    }
  });

  it("round-trips every generated href through parseHash (no dead routes, no sitemap pollution)", () => {
    for (const page of PAGES) {
      for (const href of everyHref(page)) {
        expect(routeable(href), `${page.id}: dead href ${href}`).toBe(true);
      }
    }
  });
});
