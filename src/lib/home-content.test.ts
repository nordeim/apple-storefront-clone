import { describe, expect, it } from "vitest";
import { HERO_TILES, PROMO_TILES, TV_GALLERY, type TileSpec } from "./home-content";
import { getProduct } from "./catalog";
import { parseHash } from "./router";

/** Every tile CTA href must satisfy the hash-route grammar and route somewhere real. */
const CTA_ROUTE_RE = /^#\/(store(\/[a-z0-9-]+)?|product\/[a-z0-9-]+(\?buy)?|info\/[a-z0-9-]+|entertainment|support|bag)$/;

const allTiles: readonly TileSpec[] = [...HERO_TILES, ...PROMO_TILES];

describe("home tiles", () => {
  it("gives every tile at least one CTA with a router-grammar href", () => {
    expect(allTiles.length).toBeGreaterThanOrEqual(9);
    for (const tile of allTiles) {
      expect(tile.ctas.length, tile.id).toBeGreaterThanOrEqual(1);
      for (const cta of tile.ctas) {
        expect(cta.href, `${tile.id} / ${cta.label}`).toMatch(CTA_ROUTE_RE);
      }
    }
  });

  it("routes every product CTA to a real catalog product (Learn more and Buy deep link)", () => {
    for (const tile of allTiles) {
      for (const cta of tile.ctas) {
        const productMatch = cta.href.match(/^#\/product\/([a-z0-9-]+)/);
        if (!productMatch) continue;
        const [, id] = productMatch;
        expect(getProduct(id), `${tile.id} / ${cta.label} -> ${id}`).toBeTruthy();
      }
    }
  });

  it("points the Buy CTAs at the configurator via the ?buy deep link", () => {
    const iphoneHero = HERO_TILES.find((t) => t.id === "iphone-18-pro");
    expect(iphoneHero).toBeDefined();
    const buy = iphoneHero!.ctas.find((cta) => cta.label === "Buy");
    expect(buy).toBeDefined();
    expect(buy!.href).toBe("#/product/iphone-18-pro?buy");
    // the deep link still parses to the product route (the ?buy flag is a scroll hint)
    expect(parseHash(buy!.href)).toEqual({ name: "product", id: "iphone-18-pro" });
  });

  it("keeps the hero count and the holiday tile's store CTA stable", () => {
    expect(HERO_TILES.map((t) => t.id)).toEqual(["holiday-2026", "iphone-duo", "iphone-18-pro"]);
    expect(HERO_TILES[0].ctas[0].href).toBe("#/store");
    expect(PROMO_TILES.length).toBe(6);
  });
});

describe("TV gallery", () => {
  it("carries the reference's nine titles with absolute TV+ hrefs", () => {
    expect(TV_GALLERY.length).toBe(9);
    for (const item of TV_GALLERY) {
      expect(item.href, item.title).toMatch(/^https:\/\/tv\.apple\.com\/sg$/);
      expect(item.title.length).toBeGreaterThan(0);
    }
  });
});
