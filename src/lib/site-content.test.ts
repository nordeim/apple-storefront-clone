import { describe, expect, it } from "vitest";
import { NAV_LINKS } from "./site-content";
import { flyoutSections, INFO_TITLES, type FlyoutSection } from "./site-content";
import { productsByCategory } from "./catalog";

const nav = (id: string) => {
  const link = NAV_LINKS.find((l) => l.id === id);
  if (!link) throw new Error(`no nav link ${id}`);
  return link;
};

const headings = (sections: FlyoutSection[]) => sections.map((s) => s.heading);

/** The hash-route grammar every flyout href must satisfy — routeHref factories only. */
const ROUTE_RE = /^#\/(store(\/[a-z0-9-]+)?|product\/[a-z0-9-]+|info\/[a-z0-9-]+|entertainment|support|bag|search\?.+)$/;

describe("flyoutSections", () => {
  it("gives every category the reference's three-section structure", () => {
    for (const id of ["mac", "ipad", "iphone", "watch", "vision", "airpods", "home", "accessories"]) {
      expect(headings(flyoutSections(nav(id)))).toEqual([`Explore ${nav(id).label}`, `Shop ${nav(id).label}`, `More from ${nav(id).label}`]);
    }
  });

  it("models the Store flyout on the captured live sections", () => {
    expect(headings(flyoutSections(nav("store")))).toEqual(["Shop", "Quick Links", "Shop Special Stores"]);
    const shop = flyoutSections(nav("store"))[0].links.map((l) => l.label);
    expect(shop).toContain("Shop All");
    expect(shop).toContain("Apple Watch");
    expect(shop).toContain("Apple Vision Pro");
    const quick = flyoutSections(nav("store"))[1].links.map((l) => l.label);
    expect(quick).toEqual(["Find a Store", "Order Status", "Apple Trade In", "Financing", "Personal Setup"]);
    const special = flyoutSections(nav("store"))[2].links.map((l) => l.label);
    expect(special).toEqual(["Certified Refurbished", "Education", "Business"]);
  });

  it("models the Support flyout on the captured live sections", () => {
    expect(headings(flyoutSections(nav("support")))).toEqual(["Explore Support", "Get Help", "Helpful Topics"]);
    const getHelp = flyoutSections(nav("support"))[1].links.map((l) => l.label);
    expect(getHelp).toEqual(["Community", "Check Coverage", "Genius Bar", "Repair"]);
  });

  it("leaves Entertainment with no flyout (reference parity)", () => {
    expect(flyoutSections(nav("entertainment"))).toEqual([]);
  });

  it("lists the category's real catalog products in the Explore section", () => {
    const explore = flyoutSections(nav("mac"))[0].links;
    expect(explore[0]).toEqual({ label: "Explore All Mac", href: "#/store/mac" });
    for (const p of productsByCategory("mac")) {
      expect(explore.some((l) => l.label === p.name && l.href === `#/product/${p.id}`)).toBe(true);
    }
  });

  it("carries the captured reference extras for Mac and iPhone", () => {
    const macLinks = flyoutSections(nav("mac")).flatMap((s) => s.links.map((l) => l.label));
    expect(macLinks).toContain("macOS 27");
    expect(macLinks).toContain("Switch from PC to Mac");
    expect(macLinks).toContain("Better with iPhone");
    const iphoneLinks = flyoutSections(nav("iphone")).flatMap((s) => s.links.map((l) => l.label));
    expect(iphoneLinks).toContain("iOS 27");
    expect(iphoneLinks).toContain("Switch from Android");
    expect(iphoneLinks).toContain("iPhone Privacy");
    expect(iphoneLinks).toContain("Better with Mac");
  });

  it("emits only routeHref-factory hrefs — never hand-built strings", () => {
    for (const link of NAV_LINKS) {
      for (const section of flyoutSections(link)) {
        for (const item of section.links) {
          expect(item.href, `${link.id} / ${section.heading} / ${item.label}`).toMatch(ROUTE_RE);
        }
      }
    }
  });

  it("resolves every informational link against the INFO_TITLES map (no dead slugs)", () => {
    for (const link of NAV_LINKS) {
      for (const section of flyoutSections(link)) {
        for (const item of section.links) {
          if (item.href.startsWith("#/info/")) {
            const slug = item.href.slice("#/info/".length);
            expect(INFO_TITLES.has(slug), `${item.label} -> ${slug}`).toBe(true);
          }
        }
      }
    }
  });

  it("routes Shop-section rows through the store (Shop X, X Accessories) and info pages", () => {
    const shop = flyoutSections(nav("iphone"))[1].links;
    expect(shop).toEqual([
      { label: "Shop iPhone", href: "#/store/iphone" },
      { label: "iPhone Accessories", href: "#/store/accessories" },
      { label: "Apple Trade In", href: "#/info/apple-trade-in" },
      { label: "Financing", href: "#/info/financing" },
      { label: "Personal Setup", href: "#/info/personal-setup" },
    ]);
  });
});
