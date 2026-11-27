import { describe, expect, it } from "vitest";
import { NAV_LINKS } from "./site-content";
import { flyoutSections, INFO_TITLES, STORE_CHIPS, type FlyoutSection } from "./site-content";

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

  it("models the Home flyout on the reference's measured three-section structure", () => {
    // session-4 capture: the live reference restructured Home from the single
    // Quick-Links row (session 3) to the full category model.
    expect(headings(flyoutSections(nav("home")))).toEqual(["Explore Home", "Shop Home", "More from Home"]);
    const [explore, shop, more] = flyoutSections(nav("home"));
    expect(explore.links.map((l) => l.label)).toEqual(["Explore Home", "Apple HomeView", "Apple TV 4K", "HomePod", "HomePod mini 2"]);
    expect(explore.links[0]).toEqual({ label: "Explore Home", href: "#/store/home" });
    expect(explore.links[1]).toEqual({ label: "Apple HomeView", href: "#/product/apple-homeview" });
    expect(explore.links[2]).toEqual({ label: "Apple TV 4K", href: "#/product/apple-tv-4k" });
    expect(shop.links.map((l) => l.label)).toEqual(["Shop Home", "Shop Home Accessories", "Personal Setup"]);
    expect(shop.links[0]).toEqual({ label: "Shop Home", href: "#/store/home" });
    expect(shop.links[1]).toEqual({ label: "Shop Home Accessories", href: "#/store/accessories" });
    expect(more.links.map((l) => l.label)).toEqual([
      "Home Support",
      "AppleCare for Apple TV",
      "AppleCare for HomePod",
      "Apple TV app",
      "Apple TV",
      "Home app",
      "Apple Music",
      "AirPlay",
    ]);
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

  it("lists the reference's measured product family in the Explore section (D6 revised)", () => {
    const explore = flyoutSections(nav("mac"))[0].links;
    expect(explore[0]).toEqual({ label: "Explore All Mac", href: "#/store/mac" });
    expect(explore.map((l) => l.label)).toEqual([
      "Explore All Mac",
      "MacBook Neo",
      "MacBook Air",
      "MacBook Pro",
      "iMac",
      "Mac mini",
      "Mac Studio",
      "Displays",
      "Compare Mac",
      "Switch from PC to Mac",
    ]);
    // the label that matches a catalog product routes to its product page
    expect(explore.find((l) => l.label === "MacBook Pro")).toEqual({ label: "MacBook Pro", href: "#/product/macbook-pro-m6" });
  });

  it("carries the reference's measured family rows for iPad", () => {
    const explore = flyoutSections(nav("ipad"))[0].links;
    expect(explore.map((l) => l.label)).toEqual([
      "Explore All iPad",
      "iPad Pro",
      "iPad Air",
      "iPad",
      "iPad mini",
      "Apple Pencil",
      "Keyboards",
      "Compare iPad",
    ]);
    expect(explore.find((l) => l.label === "iPad")).toEqual({ label: "iPad", href: "#/product/ipad" });
  });

  it("carries the reference's measured family rows for iPhone", () => {
    const explore = flyoutSections(nav("iphone"))[0].links;
    expect(explore.map((l) => l.label)).toEqual([
      "Explore All iPhone",
      "iPhone Duo",
      "iPhone 18 Pro",
      "iPhone Air",
      "iPhone 17",
      "iPhone 17e",
      "iPhone 16",
      "Compare iPhone",
      "Switch from Android",
    ]);
    expect(explore.find((l) => l.label === "iPhone Duo")).toEqual({ label: "iPhone Duo", href: "#/product/iphone-duo" });
    expect(explore.find((l) => l.label === "iPhone 18 Pro")).toEqual({ label: "iPhone 18 Pro", href: "#/product/iphone-18-pro" });
  });

  it("carries the reference's measured family rows for Watch", () => {
    const explore = flyoutSections(nav("watch"))[0].links;
    expect(explore.map((l) => l.label)).toEqual([
      "Explore All Apple Watch",
      "Apple Watch Series 12",
      "Apple Watch Ultra 4",
      "Apple Watch SE 3",
      "Apple Watch Nike",
      "Apple Watch Hermès",
      "Compare Watch",
      "Why Apple Watch",
    ]);
    expect(explore.find((l) => l.label === "Apple Watch Series 12")).toEqual({ label: "Apple Watch Series 12", href: "#/product/apple-watch-series-12" });
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
    expect(shop.links.map((l) => l.label)).toEqual([
      "Shop AirPods 5",
      "Shop AirPods Pro 3",
      "Shop AirPods Max 2",
      "AirPods Accessories",
    ]);
    expect(shop.links[1]).toEqual({ label: "Shop AirPods Pro 3", href: "#/product/airpods-pro-3" });
    expect(more.links.map((l) => l.label)).toEqual(["AirPods Support", "AppleCare", "Hearing Health", "Apple Music", "Apple Fitness+"]);
    expect(explore.links.find((l) => l.label === "Compare AirPods")).toBeTruthy();
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

  it("carries the reference's measured family rows for AirPods", () => {
    const explore = flyoutSections(nav("airpods"))[0].links;
    expect(explore.map((l) => l.label)).toEqual(["Explore All AirPods", "AirPods 5", "AirPods Pro 3", "AirPods Max 2", "Compare AirPods"]);
    expect(explore.find((l) => l.label === "AirPods Pro 3")).toEqual({ label: "AirPods Pro 3", href: "#/product/airpods-pro-3" });
  });

  it("routes the family rows that match catalog products to product pages and the rest to info routes", () => {
    const expectProductRoute = (category: string, label: string, id: string) => {
      const found = flyoutSections(nav(category))[0].links.find((l) => l.label === label);
      expect(found, `${category} / ${label}`).toEqual({ label, href: `#/product/${id}` });
    };
    expectProductRoute("mac", "MacBook Pro", "macbook-pro-m6");
    expectProductRoute("ipad", "iPad", "ipad");
    expectProductRoute("iphone", "iPhone Duo", "iphone-duo");
    expectProductRoute("watch", "Apple Watch Series 12", "apple-watch-series-12");
    expectProductRoute("airpods", "AirPods Pro 3", "airpods-pro-3");
    // family labels without a clone catalog counterpart route to info pages
    expect(flyoutSections(nav("mac"))[0].links.find((l) => l.label === "MacBook Neo")?.href).toBe("#/info/macbook-neo");
    expect(flyoutSections(nav("home"))[0].links.find((l) => l.label === "HomePod")?.href).toBe("#/info/homepod");
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

describe("store chip row (the reference's measured model)", () => {
  it("carries the measured order, full-form labels and the AirTag chip", () => {
    expect(STORE_CHIPS.map((c) => c.label)).toEqual([
      "All", // the clone's superset affordance — the reference row has none
      "Mac",
      "iPhone",
      "iPad",
      "Apple Watch",
      "Apple Vision Pro",
      "Home",
      "AirPods",
      "AirTag",
      "Accessories",
    ]);
    expect(STORE_CHIPS.find((c) => c.label === "AirTag")?.href).toBe("#/info/airtag");
    expect(STORE_CHIPS.find((c) => c.label === "Apple Watch")?.href).toBe("#/store/watch");
  });

  it("routes category chips to their store pages with the filter category attached", () => {
    for (const chip of STORE_CHIPS) {
      if (chip.category) {
        expect(chip.href, chip.label).toBe(`#/store/${chip.category}`);
      }
    }
    expect(STORE_CHIPS.find((c) => c.label === "All")?.href).toBe("#/store");
    expect(STORE_CHIPS.find((c) => c.label === "All")?.category).toBeUndefined();
  });
});
