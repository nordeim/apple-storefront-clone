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
  it("gives the device categories the reference's three-section structure", () => {
    for (const id of ["mac", "ipad", "iphone", "watch", "vision", "airpods"]) {
      expect(headings(flyoutSections(nav(id)))).toEqual([`Explore ${nav(id).label}`, `Shop ${nav(id).label}`, `More from ${nav(id).label}`]);
    }
  });

  it("models the Store flyout on the captured live sections", () => {
    expect(headings(flyoutSections(nav("store")))).toEqual(["Shop", "Quick Links", "Shop Special Stores"]);
    const shop = flyoutSections(nav("store"))[0].links.map((l) => l.label);
    expect(shop).toEqual(["Shop Gifts", "Mac", "iPad", "iPhone", "Apple Watch", "Apple Vision Pro", "AirPods", "Home", "Accessories"]);
    const quick = flyoutSections(nav("store"))[1].links.map((l) => l.label);
    expect(quick).toEqual(["Find a Store", "Order Status", "Apple Trade In", "Financing", "Personal Setup"]);
    const special = flyoutSections(nav("store"))[2].links.map((l) => l.label);
    expect(special).toEqual(["Certified Refurbished", "Education", "Business"]);
  });

  it("models the Support flyout on the captured live sections (9 Explore rows, no Home)", () => {
    expect(headings(flyoutSections(nav("support")))).toEqual(["Explore Support", "Get Help", "Helpful Topics"]);
    const explore = flyoutSections(nav("support"))[0].links.map((l) => l.label);
    expect(explore).toEqual(["iPhone", "Mac", "iPad", "Watch", "Apple Vision Pro", "AirPods", "Music", "TV", "Explore Support"]);
    const getHelp = flyoutSections(nav("support"))[1].links.map((l) => l.label);
    expect(getHelp).toEqual(["Community", "Check Coverage", "Genius Bar", "Repair"]);
    const topics = flyoutSections(nav("support"))[2].links.map((l) => l.label);
    expect(topics).toEqual(["Get AppleCare", "Apple Account and Password", "Billing & Subscriptions", "Accessibility"]);
  });

  it("models the Home flyout as the reference's single Quick Links section", () => {
    expect(headings(flyoutSections(nav("home")))).toEqual(["Quick Links"]);
    const links = flyoutSections(nav("home"))[0].links;
    expect(links.map((l) => l.label)).toEqual(["Shop Gifts", "Find a Store", "AirPods", "Apple Intelligence", "Apple Trade In"]);
    expect(links[2]).toEqual({ label: "AirPods", href: "#/store/airpods" });
  });

  it("models the Entertainment flyout (Explore Entertainment + Support)", () => {
    expect(headings(flyoutSections(nav("entertainment")))).toEqual(["Explore Entertainment", "Support"]);
    const explore = flyoutSections(nav("entertainment"))[0].links;
    expect(explore.map((l) => l.label)).toEqual([
      "Explore Entertainment",
      "Apple TV",
      "Apple Music",
      "Apple Arcade",
      "Apple Fitness+",
      "Apple Podcasts",
      "Apple Books",
      "App Store",
    ]);
    expect(explore[0]).toEqual({ label: "Explore Entertainment", href: "#/entertainment" });
    const support = flyoutSections(nav("entertainment"))[1].links.map((l) => l.label);
    expect(support).toEqual(["Apple TV Support", "Apple Music Support"]);
  });

  it("models the Accessories flyout (Shop Accessories + Explore Accessories)", () => {
    expect(headings(flyoutSections(nav("accessories")))).toEqual(["Shop Accessories", "Explore Accessories"]);
    const shop = flyoutSections(nav("accessories"))[0].links;
    expect(shop.map((l) => l.label)).toEqual([
      "Shop All Accessories",
      "Mac",
      "iPad",
      "iPhone",
      "Apple Watch",
      "Apple Vision Pro",
      "AirPods",
      "Home",
    ]);
    expect(shop[0]).toEqual({ label: "Shop All Accessories", href: "#/store/accessories" });
    const explore = flyoutSections(nav("accessories"))[1].links.map((l) => l.label);
    expect(explore).toEqual(["Made by Apple", "Beats", "AirTag"]);
  });

  it("lists the category's real catalog products in the Explore section (deviation D6)", () => {
    const explore = flyoutSections(nav("mac"))[0].links;
    expect(explore[0]).toEqual({ label: "Explore All Mac", href: "#/store/mac" });
    for (const p of productsByCategory("mac")) {
      expect(explore.some((l) => l.label === p.name && l.href === `#/product/${p.id}`)).toBe(true);
    }
  });

  it("carries the captured More-from labels for Mac", () => {
    const more = flyoutSections(nav("mac"))[2].links;
    expect(more.map((l) => l.label)).toEqual([
      "Mac Support",
      "AppleCare",
      "macOS 27",
      "Apple Intelligence and Siri",
      "Apps by Apple",
      "Apple Creator Studio",
      "Better with iPhone",
      "iCloud+",
      "Mac for Business",
      "Education",
      "Apple at Work",
    ]);
  });

  it("carries the captured More-from labels for iPad", () => {
    const more = flyoutSections(nav("ipad"))[2].links;
    expect(more.map((l) => l.label)).toEqual([
      "iPad Support",
      "AppleCare",
      "iPadOS 27",
      "Apple Intelligence and Siri",
      "Apps by Apple",
      "Apple Creator Studio",
      "iCloud+",
      "Education",
      "Apple at Work",
    ]);
  });

  it("carries the captured More-from labels for iPhone (incl. Wallet, Pay)", () => {
    const more = flyoutSections(nav("iphone"))[2].links;
    expect(more.map((l) => l.label)).toEqual([
      "iPhone Support",
      "AppleCare",
      "iOS 27",
      "Apple Intelligence and Siri",
      "Apps by Apple",
      "iPhone Privacy",
      "Better with Mac",
      "iCloud+",
      "Wallet, Pay",
      "Apple at Work",
    ]);
  });

  it("carries the captured Watch sections (Straps, Why Apple Watch, watchOS 27)", () => {
    const [explore, shop, more] = flyoutSections(nav("watch"));
    expect(explore.links.map((l) => l.label)).toContain("Why Apple Watch");
    expect(explore.links.map((l) => l.label)).toContain("Compare Watch");
    expect(shop.links.map((l) => l.label)).toEqual([
      "Shop Apple Watch",
      "Apple Watch Straps",
      "Apple Watch Accessories",
      "Apple Trade In",
      "Financing",
      "Personal Setup",
    ]);
    expect(more.links.map((l) => l.label)).toEqual([
      "Apple Watch Support",
      "AppleCare",
      "watchOS 27",
      "Apple Watch For Your Kids",
      "Apps by Apple",
      "Apple Fitness+",
      "Education",
    ]);
  });

  it("carries the captured Vision sections (Tech Specs, Book a Demo, visionOS 27)", () => {
    const [explore, shop, more] = flyoutSections(nav("vision"));
    expect(explore.links.map((l) => l.label)).toEqual(["Explore Apple Vision Pro", "Tech Specs"]);
    expect(shop.links.map((l) => l.label)).toEqual([
      "Shop Apple Vision Pro",
      "Apple Vision Pro Accessories",
      "Book a Demo",
      "Financing",
      "Personal Setup",
    ]);
    expect(more.links.map((l) => l.label)).toEqual([
      "Apple Vision Pro Support",
      "AppleCare",
      "visionOS 27",
      "Apple Vision Pro for Enterprise",
    ]);
  });

  it("carries the captured AirPods sections (model shops, Hearing Health)", () => {
    const [explore, shop, more] = flyoutSections(nav("airpods"));
    expect(explore.links.map((l) => l.label)).toEqual(["Explore All AirPods", "AirPods Pro 3", "Compare AirPods"]);
    expect(shop.links.map((l) => l.label)).toEqual([
      "Shop AirPods 5",
      "Shop AirPods Pro 3",
      "Shop AirPods Max 2",
      "AirPods Accessories",
    ]);
    expect(shop.links[1]).toEqual({ label: "Shop AirPods Pro 3", href: "#/product/airpods-pro-3" });
    expect(more.links.map((l) => l.label)).toEqual(["AirPods Support", "AppleCare", "Hearing Health", "Apple Music", "Apple Fitness+"]);
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

describe("INFO_TITLES derivation", () => {
  it("seeds info routes only from links that actually route to #/info/ (no orphans)", () => {
    // The nine store-routed footer labels must not seed orphan /info/* routes.
    for (const label of ["Store", "Mac", "iPad", "iPhone", "Watch", "Vision", "AirPods", "Home", "Accessories"]) {
      expect(INFO_TITLES.has(label.toLowerCase()), `orphan: /info/${label.toLowerCase()}`).toBe(false);
    }
    // Real info destinations stay.
    expect(INFO_TITLES.get("find-a-store")).toBe("Find a Store");
    expect(INFO_TITLES.get("shop-gifts")).toBe("Shop Gifts");
    expect(INFO_TITLES.get("wallet-pay")).toBe("Wallet, Pay");
    expect(INFO_TITLES.get("apple-vision-pro-for-enterprise")).toBe("Apple Vision Pro for Enterprise");
    expect(INFO_TITLES.get("singapore")).toBe("Singapore");
  });

  it("keeps every footer/legal info label reachable as a title", () => {
    expect(INFO_TITLES.get("privacy-policy")).toBe("Privacy Policy");
    expect(INFO_TITLES.get("site-map")).toBe("Site Map");
    expect(INFO_TITLES.get("apple-account-and-password")).toBe("Apple Account and Password");
  });
});
