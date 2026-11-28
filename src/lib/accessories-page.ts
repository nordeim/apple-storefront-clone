import { routeHref } from "./router";
import { slugify } from "./slug";
import { railCardHref } from "./store-rails";

/**
 * The Accessories filtered-grid page's measured content model \u2014 the
 * reference's `/sg/shop/accessories/all` (live capture 2026-11-28, the
 * session-11 parity surface named by the session-10 log's D13).
 *
 * The page is a grid family, not a shelf sequence: a chapter nav of product
 * chips, a media gallery, a curated tabbed grid, a value-props row and an
 * index-nav directory. Routing follows the clone's established rules:
 *
 * - D10/D12: the three catalog products the reference's grids actually carry
 *   (AirTag 4 pack, AirPods Pro 3, MagSafe Charger (1m)) are productId cards
 *   whose prices derive from THIS clone's catalog at render \u2014 the
 *   reference's measured strings (S$149 / S$349 / S$59) are NOT quoted where
 *   they contradict it (the AirTag and MagSafe prices differ).
 * - D11: every other curated card carries its measured label + price routed
 *   to a generated info page (the recomm-card rule); the gallery's Buy CTAs
 *   route to product pages only for clone products (Apple TV 4K).
 * - D1: the reference's product photography (gallery backdrops, the curated
 *   cards' colour-swatch strips) and its footnote markers are not reproduced;
 *   the measured text carries with the markers trimmed.
 */

export interface AccessoriesChapterChip {
  label: string;
  /** The reference's accessible name carries " - Accessories" on every chip. */
  ariaLabel: string;
  href: string;
}

export interface AccessoriesGalleryCta {
  label: string;
  href: string;
  /** Set when the CTA names one of this clone's catalog products (D12). */
  productId?: string;
}

export interface AccessoriesGalleryCard {
  theme: "dark" | "light";
  eyebrow?: string;
  headline: string;
  body: string;
  cta: AccessoriesGalleryCta;
}

export interface AccessoriesCuratedCard {
  kind: "card";
  /** The reference's measured badge (New / Only at Apple / Online only / Free engraving). */
  badge?: string;
  label: string;
  /** Measured price for info-routed cards; absent for productId cards (derived, D10) and the reference's one priceless card. */
  price?: string;
  href: string;
  productId?: string;
}

export interface AccessoriesCuratedPromo {
  kind: "promo";
  /** The reference's eyebrow on the in-grid promo cards (the tab's name or "Apple TV"). */
  eyebrow: string;
  headline: string;
  ctaLabel: string;
  href: string;
}

export type AccessoriesCuratedItem = AccessoriesCuratedCard | AccessoriesCuratedPromo;

export interface AccessoriesCuratedTab {
  label: string;
  cards: readonly AccessoriesCuratedItem[];
}

export interface AccessoriesValueProp {
  headline: string;
  body: string;
  linkName: string;
  href: string;
}

export interface AccessoriesIndexLink {
  label: string;
  href: string;
}

export interface AccessoriesIndexGroup {
  headline: string;
  links: readonly AccessoriesIndexLink[];
}

const info = (label: string): string => routeHref.info(slugify(label));

/** The measured chapter nav. The reference's device chips route to per-category
 * accessory grids; the clone's honest destinations are the category pages that
 * carry their measured accessory shelves (D15) \u2014 AirTag and Beats have no
 * clone category, so they route to generated info pages (the flyout pattern). */
export const ACCESSORIES_CHAPTERNAV: readonly AccessoriesChapterChip[] = [
  { label: "iPhone", ariaLabel: "iPhone - Accessories", href: routeHref.store("iphone") },
  { label: "iPad", ariaLabel: "iPad - Accessories", href: routeHref.store("ipad") },
  { label: "Mac", ariaLabel: "Mac - Accessories", href: routeHref.store("mac") },
  { label: "Apple Watch", ariaLabel: "Apple Watch - Accessories", href: routeHref.store("watch") },
  { label: "Apple Vision Pro", ariaLabel: "Apple Vision Pro - Accessories", href: routeHref.store("vision") },
  { label: "AirPods", ariaLabel: "AirPods - Accessories", href: routeHref.store("airpods") },
  { label: "Home", ariaLabel: "Home - Accessories", href: routeHref.store("home") },
  { label: "AirTag", ariaLabel: "AirTag - Accessories", href: info("AirTag Accessories") },
  { label: "Beats", ariaLabel: "Beats - Accessories", href: info("Beats Accessories") },
];

/** The measured media gallery \u2014 eight themed cards in the scroller family.
 * The Beats 360 card's body is the reference's video caption (the video itself
 * is not reproduced, D1). */
export const ACCESSORIES_GALLERY: { headline: string; cards: readonly AccessoriesGalleryCard[] } = {
  headline: "Say hello to what\u2019s new.",
  cards: [
    {
      theme: "dark",
      headline: "Everything\u2019s better together.",
      body: "Get them set for the season with the latest accessories.",
      cta: { label: "Shop Christmas Picks", href: info("Shop Christmas Picks") },
    },
    {
      theme: "light",
      eyebrow: "New",
      headline: "HomePod mini 2",
      body: "HomePod mini 2 delivers surprisingly big 360-degree sound in a compact design.",
      cta: { label: "Buy", href: info("HomePod mini 2") },
    },
    {
      theme: "light",
      eyebrow: "New",
      headline: "Apple TV 4K",
      body: "The ultimate cinematic experience with immersive sound and stunning picture quality.",
      cta: { label: "Buy", href: routeHref.productBuy("apple-tv-4k"), productId: "apple-tv-4k" },
    },
    {
      theme: "light",
      headline: "Customise your Beats 360.",
      body: "Beats 360 headphones in Cloud with color-matched Performance Knit Cushion Kit in Cloud.",
      cta: { label: "Shop Beats 360", href: info("Shop Beats 360") },
    },
    {
      theme: "light",
      headline: "Made for iPhone Duo.",
      body: "Protect your device with a thin, light case for iPhone Duo. Available in fresh new colours.",
      cta: { label: "Shop", href: info("Made for iPhone Duo") },
    },
    {
      theme: "dark",
      headline: "AirPods 5",
      body: "Discover the magic of Active Noise Cancellation.",
      cta: { label: "Shop", href: info("Shop AirPods 5") },
    },
    {
      theme: "light",
      headline: "Mix it. Match it. Make it yours.",
      body: "Pair your iPhone with a MagSafe case or wallet, Wrist Strap or Crossbody Strap in a new mix of colours and textures.",
      cta: { label: "Shop all", href: routeHref.store("iphone") },
    },
    {
      theme: "light",
      headline: "Meet your match.",
      body: "Style your Apple Watch your way with straps in fresh colours and materials.",
      cta: { label: "Shop all", href: routeHref.store("watch") },
    },
  ],
};

/** The measured curated grid \u2014 five pill tabs over 53 items (47 cards
 * including the reference's one priceless Smart Folio card, plus 6 in-grid
 * promos). The three catalog-matched cards derive their prices (D10/D12). */
export const ACCESSORIES_CURATED: { headline: string; tabs: readonly AccessoriesCuratedTab[] } = {
  headline: "Our top picks. Their next favourites.",
  tabs: [
  {
    label: "Holiday Picks",
    cards: [
      { kind: "card", badge: "New", label: "iPhone 18 Pro Max Silicone Case with MagSafe - Crisp Blue", price: "S$75.00", href: railCardHref("iPhone 18 Pro Max Silicone Case with MagSafe - Crisp Blue") },
      { kind: "card", badge: "New", label: "Wrist Strap – Crisp Blue", price: "S$39.00", href: railCardHref("Wrist Strap – Crisp Blue") },
      { kind: "card", badge: undefined, label: "AirPods 5", price: "S$199", href: railCardHref("AirPods 5") },
      { kind: "promo", eyebrow: "Holiday Picks", headline: "Everything’s better together.", ctaLabel: "Learn more", href: railCardHref("Everything’s better together.") },
      { kind: "card", badge: "New", label: "iPhone Duo Case – Navy Blue", price: "S$109.00", href: railCardHref("iPhone Duo Case – Navy Blue") },
      { kind: "card", badge: "Only at Apple", label: "mophie Frost Case with Kickstand for iPhone 18 Pro Max", price: "S$69.00", href: railCardHref("mophie Frost Case with Kickstand for iPhone 18 Pro Max") },
      { kind: "card", badge: "Only at Apple", label: "MOFT Snap Field MagSafe Wallet Stand", price: "S$69.00", href: railCardHref("MOFT Snap Field MagSafe Wallet Stand") },
      { kind: "card", badge: "Only at Apple", label: "mophie Knit Air Folio Case for 11‑inch iPad Air", price: "S$109.00", href: railCardHref("mophie Knit Air Folio Case for 11‑inch iPad Air") },
      { kind: "card", badge: "Only at Apple", label: "Belkin BoostCharge Slim Magnetic Power Bank 5K with Stand", price: "S$79.00", href: railCardHref("Belkin BoostCharge Slim Magnetic Power Bank 5K with Stand") },
      { kind: "card", badge: "New", label: "ShiftCam SnapPocket Light 2 Magnetic LED Ring Light", price: "S$59.00", href: railCardHref("ShiftCam SnapPocket Light 2 Magnetic LED Ring Light") },
      { kind: "card", badge: undefined, label: "Crossbody Strap", price: "S$89", href: railCardHref("Crossbody Strap") },
    ],
  },

  {
    label: "Colourful Finds",
    cards: [
      { kind: "card", badge: "New", label: "AirTag FineWoven Key Ring – Burgundy", price: "S$55.00", href: railCardHref("AirTag FineWoven Key Ring – Burgundy") },
      { kind: "card", badge: "Online only", label: "Herschel Cloudform Backpack XL for MacBook", price: "S$139.00", href: railCardHref("Herschel Cloudform Backpack XL for MacBook") },
      { kind: "card", badge: undefined, label: "AirTag", price: "S$45.00", href: railCardHref("AirTag") },
      { kind: "promo", eyebrow: "Colourful Finds", headline: "Lots of bright ideas.", ctaLabel: "Learn more", href: railCardHref("Lots of bright ideas.") },
      { kind: "card", badge: undefined, label: "Herschel Cloud Sling for iPhone", price: "S$89.00", href: railCardHref("Herschel Cloud Sling for iPhone") },
      { kind: "card", badge: "Only at Apple", label: "Tech21 FlexPulse Fauxven Art Case for iPhone 18 Pro (MagSafe compatible)", price: "S$69.00", href: railCardHref("Tech21 FlexPulse Fauxven Art Case for iPhone 18 Pro (MagSafe compatible)") },
      { kind: "card", badge: "New", label: "46mm Burgundy Braided Solo Loop - Size 3", price: "S$139.00", href: railCardHref("46mm Burgundy Braided Solo Loop - Size 3") },
      { kind: "card", badge: "New", label: "Crossbody Strap – Burgundy", price: "S$89.00", href: railCardHref("Crossbody Strap – Burgundy") },
      { kind: "card", badge: "Only at Apple", label: "Tech21 FlexFolio Case for 11” iPad Air", price: "S$79.00", href: railCardHref("Tech21 FlexFolio Case for 11” iPad Air") },
      { kind: "card", badge: "Only at Apple", label: "Belkin BoostCharge Slim Magnetic Power Bank 5K with Stand", price: "S$79.00", href: railCardHref("Belkin BoostCharge Slim Magnetic Power Bank 5K with Stand") },
      { kind: "card", badge: undefined, label: "Smart Folio for iPad", href: railCardHref("Smart Folio for iPad") },
    ],
  },

  {
    label: "Travel Ready",
    cards: [
      { kind: "card", badge: "Free engraving", label: "AirTag 4 pack", href: routeHref.product("airtag-4-pack"), productId: "airtag-4-pack" },
      { kind: "card", badge: "New", label: "AirTag FineWoven Key Ring – Dark Olive", price: "S$55.00", href: railCardHref("AirTag FineWoven Key Ring – Dark Olive") },
      { kind: "card", badge: undefined, label: "AirPods Pro 3", href: routeHref.product("airpods-pro-3"), productId: "airpods-pro-3" },
      { kind: "promo", eyebrow: "Travel Ready", headline: "Gifts that go the extra mile.", ctaLabel: "Learn more", href: railCardHref("Gifts that go the extra mile.") },
      { kind: "card", badge: "Only at Apple", label: "Twelve South Airfly Pro 2 Deluxe Bluetooth Transmitter", price: "S$99.00", href: railCardHref("Twelve South Airfly Pro 2 Deluxe Bluetooth Transmitter") },
      { kind: "card", badge: "Only at Apple", label: "Belkin UltraCharge Pro 20K Power Bank with Integrated Cable", price: "S$139.00", href: railCardHref("Belkin UltraCharge Pro 20K Power Bank with Integrated Cable") },
      { kind: "card", badge: "New", label: "Wrist Strap – Olive", price: "S$39.00", href: railCardHref("Wrist Strap – Olive") },
      { kind: "card", badge: undefined, label: "Twelve South PowerClip Power Bank & Charger", price: "S$59.00", href: railCardHref("Twelve South PowerClip Power Bank & Charger") },
      { kind: "card", badge: "Online only", label: "Herschel Cloudform Sleeve for 16” MacBook", price: "S$79.00", href: railCardHref("Herschel Cloudform Sleeve for 16” MacBook") },
      { kind: "card", badge: undefined, label: "mophie Roam 3‑in‑1 Travel Charger", price: "S$209.00", href: railCardHref("mophie Roam 3‑in‑1 Travel Charger") },
      { kind: "card", badge: undefined, label: "Smart Folio for iPad mini (A20 Pro)", price: "S$119", href: railCardHref("Smart Folio for iPad mini (A20 Pro)") },
    ],
  },

  {
    label: "Home Essentials",
    cards: [
      { kind: "card", badge: undefined, label: "Belkin Ultra HD High Speed 4K / 8K HDMI Cable (2m)", price: "S$44.40", href: railCardHref("Belkin Ultra HD High Speed 4K / 8K HDMI Cable (2m)") },
      { kind: "card", badge: "New", label: "Siri Remote", price: "S$79.00", href: railCardHref("Siri Remote") },
      { kind: "promo", eyebrow: "Apple TV", headline: "Get 3 months of Apple TV free when you buy an eligible Apple device.", ctaLabel: "Learn more", href: railCardHref("Get 3 months of Apple TV free when you buy an eligible Apple device.") },
      { kind: "promo", eyebrow: "Home Essentials", headline: "Gifts sweet gifts.", ctaLabel: "Learn more", href: railCardHref("Gifts sweet gifts.") },
      { kind: "card", badge: undefined, label: "Nanoleaf Essentials Matter E27 Smart Bulb - Thread & Matter-Enabled Smart LED Light Bulb - White and Color (3 Pack)", price: "S$79.70", href: railCardHref("Nanoleaf Essentials Matter E27 Smart Bulb - Thread & Matter-Enabled Smart LED Light Bulb - White and Color (3 Pack)") },
      { kind: "card", badge: undefined, label: "Beats Pill – Wireless Bluetooth® Speaker – Matt Black", price: "S$189.00", href: railCardHref("Beats Pill – Wireless Bluetooth® Speaker – Matt Black") },
      { kind: "card", badge: "Free engraving", label: "AirPods Max 2 - Blue", price: "S$749.00", href: railCardHref("AirPods Max 2 - Blue") },
      { kind: "card", badge: "New", label: "Beats 360 Over‑Ear Headphones – Cloud with Cloud Performance Knit Cushions", price: "S$429.00", href: railCardHref("Beats 360 Over‑Ear Headphones – Cloud with Cloud Performance Knit Cushions") },
      { kind: "card", badge: undefined, label: "SteelSeries Nimbus Dual-Mode Cloud Controller", price: "S$219.00", href: railCardHref("SteelSeries Nimbus Dual-Mode Cloud Controller") },
      { kind: "card", badge: "Free engraving", label: "AirPods Max 2 - Orange", price: "S$749.00", href: railCardHref("AirPods Max 2 - Orange") },
      { kind: "card", badge: undefined, label: "HomePod mini 2", price: "S$199", href: railCardHref("HomePod mini 2") },
    ],
  },

  {
    label: "Power Picks",
    cards: [
      { kind: "card", badge: undefined, label: "MagSafe Charger (1m)", href: routeHref.product("magsafe-charger"), productId: "magsafe-charger" },
      { kind: "card", badge: undefined, label: "iPhone Air MagSafe Battery", price: "S$139.00", href: railCardHref("iPhone Air MagSafe Battery") },
      { kind: "card", badge: undefined, label: "60W USB-C Charge Cable (1m)", price: "S$29.00", href: railCardHref("60W USB-C Charge Cable (1m)") },
      { kind: "card", badge: undefined, label: "40W Dynamic Power Adapter with 60W Max", price: "S$55.00", href: railCardHref("40W Dynamic Power Adapter with 60W Max") },
      { kind: "card", badge: undefined, label: "Belkin BoostCharge Pro Power Bank 10K with Apple Watch Charger", price: "S$139.00", href: railCardHref("Belkin BoostCharge Pro Power Bank 10K with Apple Watch Charger") },
      { kind: "promo", eyebrow: "Power Picks", headline: "Full power ahead.", ctaLabel: "Learn more", href: railCardHref("Full power ahead.") },
      { kind: "card", badge: "Only at Apple", label: "Scosche WatchIt Keychain Apple Watch Magnetic Fast Charger - White", price: "S$49.00", href: railCardHref("Scosche WatchIt Keychain Apple Watch Magnetic Fast Charger - White") },
      { kind: "card", badge: undefined, label: "35W Dual Port Power Adapter", price: "S$79.00", href: railCardHref("35W Dual Port Power Adapter") },
      { kind: "card", badge: undefined, label: "Nimble Podium 3-in-1 Wireless Charger", price: "S$189.00", href: railCardHref("Nimble Podium 3-in-1 Wireless Charger") },
    ],
  }
  ],
};

/** The measured value props. Financing and Personal Setup reuse the flyout's
 * own info destinations (the same link family); delivery and returns carry
 * their own measured labels. */
export const ACCESSORIES_VALUE_PROPS: { headline: string; items: readonly AccessoriesValueProp[] } = {
  headline: "Why Apple is the best place to buy accessories.",
  items: [
    {
      headline: "Free delivery and pickup.",
      body: "Get free delivery or pick up at your Apple Store.",
      linkName: "Learn more",
      href: info("Free delivery and pickup"),
    },
    {
      headline: "Holiday Returns",
      body: "Free extended returns between now and 08/01",
      linkName: "Learn more",
      href: info("Holiday Returns"),
    },
    {
      headline: "Pay 0% interest for up to 24 months.",
      body: "With an eligible credit card, you can choose the financing option that works for you.",
      linkName: "Learn more",
      href: info("Financing"),
    },
    {
      headline: "Free Personal Setup.",
      body: "Get help setting up your new device with free online Personal Setup.",
      linkName: "Learn more",
      href: info("Personal Setup"),
    },
  ],
};

/** The measured index-nav directory. "Shop by Product" mirrors the chapter
 * nav's routing (the same links, grouped); the other groups route to
 * generated info pages (the flyout pattern). */
export const ACCESSORIES_INDEX_NAV: { headline: string; groups: readonly AccessoriesIndexGroup[] } = {
  headline: "Accessories",
  groups: [
    {
      headline: "Shop by Product",
      links: ACCESSORIES_CHAPTERNAV.map((chip) => ({ label: chip.label, href: chip.href })),
    },
    {
      headline: "Shop by Category",
      links: [
        "Cases & Protection",
        "Mice & Keyboards",
        "Smart Home Accessories",
        "Hard Drives & Storage",
        "Gaming",
        "Health & Fitness",
        "Chargers & Adapters",
        "Content Creation",
        "Office Accessories",
        "Software",
        "Headphones & Speakers",
      ].map((label) => ({ label, href: info(label) })),
    },
    {
      headline: "Explore More Accessories",
      links: ["College Essentials", "New Arrivals", "Made by Apple", "Accessibility"].map((label) => ({
        label,
        href: info(label),
      })),
    },
  ],
};

/** Every info-routed label on the page \u2014 feeds the INFO_TITLES derivation
 * so the sitemap's info routes and this page's content can never drift apart
 * (labels are the source of truth; hrefs derive through the one slug grammar). */
const INFO_LABELS: readonly string[] = [
  // the gallery's five info-routed CTA destinations (the two "Shop all" CTAs
  // route to the store category pages, not info)
  "Shop Christmas Picks",
  "HomePod mini 2",
  "Shop Beats 360",
  "Made for iPhone Duo",
  "Shop AirPods 5",
  // the curated grid: every info-routed card label + every promo headline
  // (the three productId cards route to product pages, not info)
  ...ACCESSORIES_CURATED.tabs.flatMap((tab) =>
    tab.cards.flatMap((item) => (item.kind === "promo" ? [item.headline] : item.productId === undefined ? [item.label] : [])),
  ),
  // the value props' destinations (Financing / Personal Setup reuse the
  // flyout's own labels \u2014 deduped by slug in INFO_TITLES)
  "Free delivery and pickup",
  "Holiday Returns",
  "Financing",
  "Personal Setup",
  // the chapter nav's two info-routed chips (the index nav's first group
  // mirrors the same hrefs) + the directory's category/explore labels
  "AirTag Accessories",
  "Beats Accessories",
  ...ACCESSORIES_INDEX_NAV.groups[1].links.map((l) => l.label),
  ...ACCESSORIES_INDEX_NAV.groups[2].links.map((l) => l.label),
];

export const ACCESSORIES_INFO_LABELS: readonly { label: string; href: string }[] = INFO_LABELS.map((label) => ({
  label,
  href: info(label),
}));
