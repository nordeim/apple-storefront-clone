import { CATEGORIES, productsByCategory, type CategoryId } from "./catalog";
import { routeHref } from "./router";

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

export function flyoutLinks(category: CategoryId): FlyoutLink[] {
  return productsByCategory(category).map((p) => ({ label: p.name, href: routeHref.product(p.id) }));
}

export interface FlyoutSection {
  heading: string;
  links: FlyoutLink[];
}

/**
 * Informational flyout labels captured from the live reference's flyouts that
 * have no dedicated route in this clone. They resolve to generated info pages
 * and join the INFO_TITLES derivation, so the sitemap and the flyout content
 * stay derived from one source and can never drift apart.
 */
const FLYOUT_INFO_LABELS: readonly string[] = [
  "AppleCare",
  "Get AppleCare",
  "macOS 27",
  "iOS 27",
  "Apple Intelligence and Siri",
  "Apps by Apple",
  "Apple Creator Studio",
  "Better with iPhone",
  "Better with Mac",
  "iCloud+",
  "Mac for Business",
  "Apple at Work",
  "iPhone Privacy",
  "Switch from PC to Mac",
  "Switch from Android",
  "Personal Setup",
  "Community",
  "Check Coverage",
  "Repair",
  "Apple Account and Password",
  "Billing & Subscriptions",
  "Music",
  "TV",
  "Explore Support",
  "Business",
  "Compare Mac",
  "Compare iPad",
  "Compare iPhone",
  "Compare Apple Watch",
  "Compare Apple Vision Pro",
  "Compare AirPods",
  "Compare Home",
  "Compare Accessories",
  "Mac Support",
  "iPad Support",
  "iPhone Support",
  "Apple Watch Support",
  "Apple Vision Pro Support",
  "AirPods Support",
  "Home Support",
  "Accessories Support",
];

const infoLink = (label: string): FlyoutLink => ({ label, href: routeHref.info(slugify(label)) });

/** The reference's full-label forms for the store flyout's category rows. */
const STORE_CATEGORY_LABELS: Readonly<Record<CategoryId, string>> = {
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
 * The three-section flyout content model, measured off the live reference
 * (docs/REMEDIATION_PLAN.md, session-2 evidence): every category carries
 * "Explore X" / "Shop X" / "More from X"; Store carries
 * "Shop" / "Quick Links" / "Shop Special Stores"; Support carries
 * "Explore Support" / "Get Help" / "Helpful Topics"; Entertainment has no
 * flyout. Product rows come from the live catalog (deviation D6); every
 * other row uses the reference's own labels routed to this clone's honest
 * destinations.
 */
export function flyoutSections(link: NavLinkSpec): FlyoutSection[] {
  if (link.id === "store") {
    return [
      {
        heading: "Shop",
        links: [
          { label: "Shop All", href: routeHref.store() },
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
  }
  if (link.id === "support") {
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
          { label: "Home", href: routeHref.store("home") },
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
  }
  if (!link.category) return [];
  const c = link.category;
  const label = STORE_CATEGORY_LABELS[c];
  const explore: FlyoutLink[] = [
    { label: `Explore All ${label}`, href: routeHref.store(c) },
    ...flyoutLinks(c),
    infoLink(`Compare ${label}`),
  ];
  if (c === "mac") explore.push(infoLink("Switch from PC to Mac"));
  if (c === "iphone") explore.push(infoLink("Switch from Android"));
  const more: FlyoutLink[] = [infoLink(`${label} Support`), infoLink("AppleCare"), infoLink("Apple Intelligence and Siri"), infoLink("Apps by Apple"), infoLink("iCloud+")];
  if (c === "mac") more.unshift(infoLink("macOS 27"));
  if (c === "iphone") more.unshift(infoLink("iOS 27"), infoLink("iPhone Privacy"));
  if (c === "mac") more.push(infoLink("Apple Creator Studio"), infoLink("Better with iPhone"), infoLink("Mac for Business"), infoLink("Apple at Work"));
  if (c === "iphone") more.push(infoLink("Better with Mac"), infoLink("Apple at Work"));
  return [
    { heading: `Explore ${link.label}`, links: explore },
    {
      heading: `Shop ${link.label}`,
      links: [
        { label: `Shop ${label}`, href: routeHref.store(c) },
        { label: `${label} Accessories`, href: routeHref.store("accessories") },
        infoLink("Apple Trade In"),
        infoLink("Financing"),
        infoLink("Personal Setup"),
      ],
    },
    { heading: `More from ${link.label}`, links: more },
  ];
}

export function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

/** slug -> display title for every footer/legal/flyout destination. */
export const INFO_TITLES: ReadonlyMap<string, string> = new Map([
  ...[...FOOTER_GROUPS.flat().flatMap((s) => s.links), ...LEGAL_LINKS, ...FLYOUT_INFO_LABELS.map((label) => info(label))].map((l) => [slugify(l.label), l.label] as const),
  ["singapore", "Singapore"] as const,
]);

export const SUPPORT_PHONE_DISPLAY = "1800‐692‐7753";
export const SUPPORT_PHONE_TEL = "tel:18006927753";
