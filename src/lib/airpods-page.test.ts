import { describe, expect, it } from "vitest";
import { getProduct } from "./catalog";
import { parseHash } from "./router";
import {
  AIRPODS_CHAPTERNAV,
  AIRPODS_COMPARE,
  AIRPODS_CONSIDER,
  AIRPODS_HEROES,
  AIRPODS_INFO_LABELS,
  AIRPODS_MUSIC,
} from "./airpods-page";

/** Every generated href must survive the router — the session-10 drift guard,
 *  applied to this seam from day one (the session-10 H-1 lesson). */
const routeable = (href: string): boolean => parseHash(href).name !== "not-found";

describe("AIRPODS_* (the reference's measured /sg/airpods/ marketing page)", () => {
  it("models the measured chapternav (six links)", () => {
    expect(AIRPODS_CHAPTERNAV.map((l) => l.label)).toEqual([
      "AirPods",
      "AirPods Pro",
      "AirPods Max",
      "Compare",
      "Accessories",
      "Apple Music",
    ]);
    expect(AIRPODS_CHAPTERNAV[0]?.note).toBe("New");
    for (const link of AIRPODS_CHAPTERNAV) {
      expect(routeable(link.href), link.label).toBe(true);
    }
    // the flyout's own routing: the Pro item is the clone's catalog product
    expect(AIRPODS_CHAPTERNAV[1]?.href).toBe("#/product/airpods-pro-3");
    expect(AIRPODS_CHAPTERNAV[3]?.href).toBe("#/info/compare-airpods");
    expect(AIRPODS_CHAPTERNAV[4]?.href).toBe("#/store/accessories");
    expect(AIRPODS_CHAPTERNAV[5]?.href).toBe("#/info/apple-music");
  });

  it("models the three measured heroes with the reference's themes and CTAs", () => {
    expect(AIRPODS_HEROES).toHaveLength(3);
    const [five, pro, max] = AIRPODS_HEROES;
    expect(five).toMatchObject({
      headline: "AirPods 5",
      headlineSize: "display",
      theme: "dark",
      tagline: "Discover the magic of Active Noise Cancellation.",
      price: "Starting at S$199",
    });
    expect(pro).toMatchObject({
      headline: "AirPods Pro 3",
      headlineSize: "display",
      theme: "light",
      tagline: "The world\u2019s best in-ear Active Noise Cancellation.",
      price: "S$349",
      productId: "airpods-pro-3",
    });
    expect(max).toMatchObject({
      headline: "AirPods Max 2",
      headlineSize: "chapter",
      theme: "light",
      tagline: "Listening. Remastered.",
      price: "S$749",
    });
    // D12: the catalog-matched hero's Buy deep-links the working configurator
    expect(pro.buyHref).toBe("#/product/airpods-pro-3?buy");
    expect(getProduct(pro.productId ?? "")?.name).toBe("AirPods Pro 3");
    // non-catalog heroes route their CTAs to generated info pages (D6/D11),
    // matching the flyout's own shop routing
    expect(five.buyHref).toBe("#/info/shop-airpods-5");
    expect(five.learnHref).toBe("#/info/airpods-5");
    expect(max.buyHref).toBe("#/info/shop-airpods-max-2");
    expect(max.learnHref).toBe("#/info/airpods-max-2");
    for (const hero of AIRPODS_HEROES) {
      expect(routeable(hero.learnHref), hero.headline).toBe(true);
      expect(routeable(hero.buyHref ?? ""), hero.headline).toBe(true);
    }
  });

  it("models the measured compare module (four columns, footnotes trimmed)", () => {
    expect(AIRPODS_COMPARE.headline).toBe("Compare AirPods models");
    expect(AIRPODS_COMPARE.columns).toHaveLength(4);
    const [five, wirelessCase, pro, max] = AIRPODS_COMPARE.columns;
    expect(five).toMatchObject({ eyebrow: "New", name: "AirPods 5", price: "S$199" });
    expect(wirelessCase).toMatchObject({
      eyebrow: "New",
      name: "AirPods 5 Wireless Charging Case",
      price: "S$219",
    });
    expect(pro).toMatchObject({ name: "AirPods Pro 3", productId: "airpods-pro-3" });
    expect(max).toMatchObject({ name: "AirPods Max 2", price: "S$749" });
    // D10: the catalog-matched column derives its price from the catalog —
    // the measured string is carried only for info-routed columns
    expect(pro.price).toBeUndefined();
    expect(pro.buyHref).toBe("#/product/airpods-pro-3?buy");
    // the reference's footnote markers (the compare taglines carry \u25ca) are
    // trimmed per the D11 footnote rule
    for (const column of AIRPODS_COMPARE.columns) {
      expect(column.tagline).not.toMatch(/[\u2020\u2021\u00a7\u00b1\u25ca]/);
      expect(routeable(column.learnHref), column.name).toBe(true);
      if (column.buyHref) expect(routeable(column.buyHref), column.name).toBe(true);
    }
  });

  it("models the measured consider rail (five feature cards, footnote digits trimmed)", () => {
    expect(AIRPODS_CONSIDER.headline).toBe("Get to know AirPods.");
    expect(AIRPODS_CONSIDER.features.map((f) => f.headline)).toEqual([
      "Active Noise Cancellation",
      "Live Translation",
      "Heart Rate Sensing",
      "Hearing Health",
      "Personalised Spatial Audio",
    ]);
    expect(AIRPODS_CONSIDER.features[0]?.kicker).toBe("Control what you hear. And what you don\u2019t.");
    expect(AIRPODS_CONSIDER.features[2]?.body).toContain("256 times per second");
    // the reference's footnote digits trail some bodies — trimmed (D11)
    for (const feature of AIRPODS_CONSIDER.features) {
      expect(feature.body).not.toMatch(/\.\d/);
      expect(feature.body.length).toBeGreaterThan(40);
    }
  });

  it("models the measured Apple Music promo", () => {
    expect(AIRPODS_MUSIC.label).toBe("Apple Music");
    expect(AIRPODS_MUSIC.desc).toContain("Get three months of Apple Music free");
    expect(AIRPODS_MUSIC.href).toBe("#/info/apple-music");
    expect(routeable(AIRPODS_MUSIC.href)).toBe(true);
  });

  it("exposes every info-routed label for the INFO_TITLES derivation (sitemap lockstep)", () => {
    expect(AIRPODS_INFO_LABELS.length).toBeGreaterThan(4);
    for (const { label, href } of AIRPODS_INFO_LABELS) {
      expect(href.startsWith("#/info/"), label).toBe(true);
      expect(routeable(href), label).toBe(true);
      expect(label.length).toBeGreaterThan(0);
    }
    const hrefs = new Set(AIRPODS_INFO_LABELS.map((l) => l.href));
    expect(hrefs.size).toBe(AIRPODS_INFO_LABELS.length);
  });
});
