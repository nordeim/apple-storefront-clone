import { CATEGORIES, PRODUCTS, type CategoryId } from "./catalog";
import { routeHref } from "./router";
import { RAIL_INFO_LABELS } from "./store-rails";
import { slugify } from "./slug";

export { slugify } from "./slug";

export interface NavLinkSpec {
  id: string;
  label: string;
  href: string;
  /** Present for items that open a flyout on desktop. */
  category?: CategoryId;
}

export const NAV_LINKS: readonly NavLinkSpec[] = [
  { id: "store", label: "Store", href: routeHref.store() },
  ...CATEGORIES.filter((c) => c.id !== "accessories").map((c) => ({
    id: c.id,
    label: c.label,
    href: routeHref.store(c.id),
    category: c.id,
  })),
  { id: "entertainment", label: "Entertainment", href: routeHref.entertainment },
  { id: "accessories", label: "Accessories", href: routeHref.store("accessories"), category: "accessories" as const },
  { id: "support", label: "Support", href: routeHref.support },
];

export interface FlyoutLink {
  label: string;
  href: string;
}

export interface FlyoutSection {
  heading: string;
  links: FlyoutLink[];
}

/**
 * A reference product-family label routes to the clone's catalog product when
 * one carries the exact name; every other family label routes to an
 * informational page (deviation D6, revised session 4: the flyout models the
 * reference's family rows — catalog-only products stay reachable via the store).
 */
const familyLink = (label: string): FlyoutLink => {
  const product = PRODUCTS.find((p) => p.name === label);
  return product ? { label, href: routeHref.product(product.id) } : infoLink(label);
};

/** The reference's measured Explore product-family rows per category
 * (session-4 live capture, docs/REMEDIATION_PLAN.md). */
const EXPLORE_FAMILY: Readonly<Partial<Record<CategoryId, readonly string[]>>> = {
  mac: ["MacBook Neo", "MacBook Air", "MacBook Pro", "iMac", "Mac mini", "Mac Studio", "Displays"],
  ipad: ["iPad Pro", "iPad Air", "iPad", "iPad mini", "Apple Pencil", "Keyboards"],
  iphone: ["iPhone Duo", "iPhone 18 Pro", "iPhone Air", "iPhone 17", "iPhone 17e", "iPhone 16"],
  watch: ["Apple Watch Series 12", "Apple Watch Ultra 4", "Apple Watch SE 3", "Apple Watch Nike", "Apple Watch Hermès"],
  airpods: ["AirPods 5", "AirPods Pro 3", "AirPods Max 2"],
};

export interface StoreChip {
  label: string;
  href: string;
  /** The category page this chip marks active; undefined for the All view. */
  category?: CategoryId;
}

/** The reference's measured store chip row — order and full-form labels
 * (session-4 capture, /sg/store at 1440×900). The leading All chip is the
 * clone's superset affordance (the reference row carries none); the AirTag
 * chip routes to its informational page (the clone's AirTag products live in
 * the accessories store). */
export const STORE_CHIPS: readonly StoreChip[] = [
  { label: "All", href: routeHref.store() },
  { label: "Mac", href: routeHref.store("mac"), category: "mac" },
  { label: "iPhone", href: routeHref.store("iphone"), category: "iphone" },
  { label: "iPad", href: routeHref.store("ipad"), category: "ipad" },
  { label: "Apple Watch", href: routeHref.store("watch"), category: "watch" },
  { label: "Apple Vision Pro", href: routeHref.store("vision"), category: "vision" },
  { label: "Home", href: routeHref.store("home"), category: "home" },
  { label: "AirPods", href: routeHref.store("airpods"), category: "airpods" },
  { label: "AirTag", href: routeHref.info("airtag") },
  { label: "Accessories", href: routeHref.store("accessories"), category: "accessories" },
];

/**
 * Informational flyout labels routed to generated info pages — captured from
 * the live reference (2026-11-27 full-sweep, docs/REMEDIATION_PLAN.md session 3).
 * Resolved against the INFO_TITLES derivation, so the sitemap and the flyout
 * content stay derived from one source and can never drift apart.
 */
const infoLink = (label: string): FlyoutLink => ({ label, href: routeHref.info(slugify(label)) });

/** The reference's full-label forms for the store flyout's category rows — and
 * for the store page's category h1 ("Shop Apple Watch", measured live). */
export const STORE_CATEGORY_LABELS: Readonly<Record<CategoryId, string>> = {
  mac: "Mac",
  ipad: "iPad",
  iphone: "iPhone",
  watch: "Apple Watch",
  vision: "Apple Vision Pro",
  airpods: "AirPods",
  home: "Home",
  accessories: "Accessories",
};

/**
 * The flyout content model, measured off the live reference's eleven flyouts
 * (docs/REMEDIATION_PLAN.md, session-3 full-sweep evidence): device categories
 * carry "Explore X" / "Shop X" / "More from X" with the reference's own label
 * lists; Store carries "Shop" / "Quick Links" / "Shop Special Stores"; Support
 * carries "Explore Support" / "Get Help" / "Helpful Topics"; Home is a single
 * "Quick Links" row; Entertainment is "Explore Entertainment" + "Support";
 * Accessories is "Shop Accessories" + "Explore Accessories". Product rows come
 * from the live catalog (deviation D6); every other row uses the reference's
 * own labels routed to this clone's honest destinations.
 */
export function flyoutSections(link: NavLinkSpec): FlyoutSection[] {
  switch (link.id) {
    case "store":
      return [
        {
          heading: "Shop",
          links: [
            infoLink("Shop Gifts"),
            ...CATEGORIES.map((c) => ({ label: STORE_CATEGORY_LABELS[c.id], href: routeHref.store(c.id) })),
          ],
        },
        {
          heading: "Quick Links",
          links: ["Find a Store", "Order Status", "Apple Trade In", "Financing", "Personal Setup"].map(infoLink),
        },
        {
          heading: "Shop Special Stores",
          links: ["Certified Refurbished", "Education", "Business"].map(infoLink),
        },
      ];
    case "support":
      return [
        {
          heading: "Explore Support",
          links: [
            { label: "iPhone", href: routeHref.store("iphone") },
            { label: "Mac", href: routeHref.store("mac") },
            { label: "iPad", href: routeHref.store("ipad") },
            { label: "Watch", href: routeHref.store("watch") },
            { label: "Apple Vision Pro", href: routeHref.store("vision") },
            { label: "AirPods", href: routeHref.store("airpods") },
            infoLink("Music"),
            infoLink("TV"),
            infoLink("Explore Support"),
          ],
        },
        {
          heading: "Get Help",
          links: ["Community", "Check Coverage", "Genius Bar", "Repair"].map(infoLink),
        },
        {
          heading: "Helpful Topics",
          links: ["Get AppleCare", "Apple Account and Password", "Billing & Subscriptions", "Accessibility"].map(infoLink),
        },
      ];
    case "home":
      // session-4 capture: the reference restructured Home to the full
      // category model (Explore Home / Shop Home / More from Home).
      return [
        {
          heading: "Explore Home",
          links: [
            { label: "Explore Home", href: routeHref.store("home") },
            ...["Apple HomeView", "Apple TV 4K", "HomePod", "HomePod mini 2"].map(familyLink),
          ],
        },
        {
          heading: "Shop Home",
          links: [
            { label: "Shop Home", href: routeHref.store("home") },
            { label: "Shop Home Accessories", href: routeHref.store("accessories") },
            infoLink("Personal Setup"),
          ],
        },
        {
          heading: "More from Home",
          links: [
            "Home Support",
            "AppleCare for Apple TV",
            "AppleCare for HomePod",
            "Apple TV app",
            "Apple TV",
            "Home app",
            "Apple Music",
            "AirPlay",
          ].map(infoLink),
        },
      ];
    case "entertainment":
      return [
        {
          heading: "Explore Entertainment",
          links: [
            { label: "Explore Entertainment", href: routeHref.entertainment },
            ...["Apple TV", "Apple Music", "Apple Arcade", "Apple Fitness+", "Apple Podcasts", "Apple Books", "App Store"].map(infoLink),
          ],
        },
        {
          heading: "Support",
          links: ["Apple TV Support", "Apple Music Support"].map(infoLink),
        },
      ];
    case "accessories":
      return [
        {
          heading: "Shop Accessories",
          links: [
            { label: "Shop All Accessories", href: routeHref.store("accessories") },
            { label: "Mac", href: routeHref.store("mac") },
            { label: "iPad", href: routeHref.store("ipad") },
            { label: "iPhone", href: routeHref.store("iphone") },
            { label: "Apple Watch", href: routeHref.store("watch") },
            { label: "Apple Vision Pro", href: routeHref.store("vision") },
            { label: "AirPods", href: routeHref.store("airpods") },
            { label: "Home", href: routeHref.store("home") },
          ],
        },
        {
          heading: "Explore Accessories",
          links: ["Made by Apple", "Beats", "AirTag"].map(infoLink),
        },
      ];
  }
  if (!link.category) return [];
  const c = link.category;
  const label = STORE_CATEGORY_LABELS[c];

  const exploreExtras: FlyoutLink[] =
    c === "mac"
      ? [infoLink("Compare Mac"), infoLink("Switch from PC to Mac")]
      : c === "iphone"
        ? [infoLink("Compare iPhone"), infoLink("Switch from Android")]
        : c === "watch"
          ? [infoLink("Compare Watch"), infoLink("Why Apple Watch")]
          : c === "airpods"
            ? [infoLink("Compare AirPods")]
            : c === "ipad"
              ? [infoLink("Compare iPad")]
              : [infoLink("Tech Specs")]; // vision — the reference's 2-row Explore
  const explore: FlyoutLink[] =
    c === "vision"
      ? [{ label: "Explore Apple Vision Pro", href: routeHref.store(c) }, ...exploreExtras]
      : [{ label: `Explore All ${label}`, href: routeHref.store(c) }, ...(EXPLORE_FAMILY[c] ?? []).map(familyLink), ...exploreExtras];

  const shop: FlyoutLink[] =
    c === "watch"
      ? [
          { label: `Shop ${label}`, href: routeHref.store(c) },
          infoLink("Apple Watch Straps"),
          { label: `${label} Accessories`, href: routeHref.store("accessories") },
          infoLink("Apple Trade In"),
          infoLink("Financing"),
          infoLink("Personal Setup"),
        ]
      : c === "vision"
        ? [
            { label: `Shop ${label}`, href: routeHref.store(c) },
            { label: `${label} Accessories`, href: routeHref.store("accessories") },
            infoLink("Book a Demo"),
            infoLink("Financing"),
            infoLink("Personal Setup"),
          ]
        : c === "airpods"
          ? [
              infoLink("Shop AirPods 5"),
              { label: "Shop AirPods Pro 3", href: routeHref.product("airpods-pro-3") },
              infoLink("Shop AirPods Max 2"),
              { label: "AirPods Accessories", href: routeHref.store("accessories") },
            ]
          : [
              { label: `Shop ${label}`, href: routeHref.store(c) },
              { label: `${label} Accessories`, href: routeHref.store("accessories") },
              infoLink("Apple Trade In"),
              infoLink("Financing"),
              infoLink("Personal Setup"),
            ];

  const more: FlyoutLink[] =
    c === "mac"
      ? [
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
        ].map(infoLink)
      : c === "ipad"
        ? [
            "iPad Support",
            "AppleCare",
            "iPadOS 27",
            "Apple Intelligence and Siri",
            "Apps by Apple",
            "Apple Creator Studio",
            "iCloud+",
            "Education",
            "Apple at Work",
          ].map(infoLink)
        : c === "iphone"
          ? [
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
            ].map(infoLink)
          : c === "watch"
            ? [
                "Apple Watch Support",
                "AppleCare",
                "watchOS 27",
                "Apple Watch For Your Kids",
                "Apps by Apple",
                "Apple Fitness+",
                "Education",
              ].map(infoLink)
            : c === "vision"
              ? ["Apple Vision Pro Support", "AppleCare", "visionOS 27", "Apple Vision Pro for Enterprise"].map(infoLink)
              : ["AirPods Support", "AppleCare", "Hearing Health", "Apple Music", "Apple Fitness+"].map(infoLink);
  return [
    { heading: `Explore ${link.label}`, links: explore },
    { heading: `Shop ${link.label}`, links: shop },
    { heading: `More from ${link.label}`, links: more },
  ];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

const info = (label: string): FooterLink => ({ label, href: routeHref.info(slugify(label)) });
const store = (label: string, category: CategoryId): FooterLink => ({ label, href: routeHref.store(category) });

export const FOOTER_GROUPS: readonly (readonly FooterSection[])[] = [
  [
    {
      title: "Shop and Learn",
      links: [
        { label: "Store", href: routeHref.store() },
        store("Mac", "mac"),
        store("iPad", "ipad"),
        store("iPhone", "iphone"),
        store("Watch", "watch"),
        store("Vision", "vision"),
        store("AirPods", "airpods"),
        store("Home", "home"),
        info("AirTag"),
        store("Accessories", "accessories"),
      ],
    },
  ],
  [
    { title: "Apple Wallet", links: [info("Wallet"), info("Apple Pay")] },
    { title: "Account", links: [info("Manage Your Apple Account"), info("Apple Store Account"), info("iCloud.com")] },
    {
      title: "Entertainment",
      links: ["Apple TV", "Apple Music", "Apple Arcade", "Apple Fitness+", "Apple Podcasts", "Apple Books", "App Store"].map(info),
    },
  ],
  [
    {
      title: "Apple Store",
      links: [
        "Find a Store",
        "Genius Bar",
        "Today at Apple",
        "Group Reservations",
        "Apple Camp",
        "Apple Store App",
        "Certified Refurbished",
        "Apple Trade In",
        "Financing",
        "Order Status",
        "Shopping Help",
      ].map(info),
    },
  ],
  [
    { title: "For Business", links: ["Apple and Business", "Shop for Business"].map(info) },
    { title: "For Education", links: ["Apple and Education", "Shop for College"].map(info) },
    { title: "For Healthcare", links: [info("Apple and Healthcare")] },
    { title: "For Government", links: [info("Apple and Government")] },
  ],
  [
    {
      title: "Apple Values",
      links: ["Accessibility", "Education", "Environment", "Privacy", "Supply Chain Innovation"].map(info),
    },
    {
      title: "About Apple",
      links: ["Newsroom", "Apple Leadership", "Career Opportunities", "Investors", "Ethics and Compliance", "Events", "Contact Apple"].map(info),
    },
  ],
];

export const LEGAL_LINKS: readonly FooterLink[] = ["Privacy Policy", "Terms of Use", "Sales and Refunds", "Legal", "Site Map"].map(info);

/** slug -> display title for every footer/legal/flyout info destination.
 * Derived only from links that actually route to #/info/ — store-routed
 * footer labels never seed orphan routes. */
const isInfoRouted = (l: { href: string }): boolean => l.href.startsWith(routeHref.info(""));

const FLYOUT_MODEL_INFO_LINKS: readonly FlyoutLink[] = NAV_LINKS.flatMap((link) =>
  flyoutSections(link).flatMap((section) => section.links.filter(isInfoRouted)),
);

export const INFO_TITLES: ReadonlyMap<string, string> = new Map([
  ...[...FOOTER_GROUPS.flat().flatMap((s) => s.links), ...LEGAL_LINKS, ...FLYOUT_MODEL_INFO_LINKS, ...RAIL_INFO_LABELS]
    .filter(isInfoRouted)
    .map((l) => [slugify(l.label), l.label] as const),
  ["singapore", "Singapore"] as const,
]);

export const SUPPORT_PHONE_DISPLAY = "1800‐692‐7753";
export const SUPPORT_PHONE_TEL = "tel:18006927753";
