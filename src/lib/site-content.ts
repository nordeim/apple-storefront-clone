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

/** slug -> display title for every footer/legal destination. */
export const INFO_TITLES: ReadonlyMap<string, string> = new Map([
  ...[...FOOTER_GROUPS.flat().flatMap((s) => s.links), ...LEGAL_LINKS].map((l) => [slugify(l.label), l.label] as const),
  ["singapore", "Singapore"] as const,
]);

export const SUPPORT_PHONE_DISPLAY = "1800‐692‐7753";
export const SUPPORT_PHONE_TEL = "tel:18006927753";
