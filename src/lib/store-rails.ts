import { PRODUCTS, type Product } from "./catalog";
import { routeHref } from "./router";
import { formatSgd } from "./money";
import { slugify } from "./slug";

/**
 * The store index page's editorial rails — the reference's measured content
 * model (live capture 2026-11-28, apple.com/sg/store; the session-9 parity
 * surface named by the session-8 log). Seven rails: "The latest." /
 * "Personalisation." / "Holiday picks." / "Colourful finds." /
 * "Home essentials." / "Only at Apple." / "Savings and offers."
 *
 * Routing follows the flyout rule (deviation D4/D6, the `familyLink` pattern):
 * a reference label that names one of THIS clone's catalog products routes to
 * its product page — everything else routes to a generated info page. Prices on
 * catalog-matched cards derive from THIS clone's catalog at render time
 * (deviation D10: the clone's illustrative prices stay internally consistent —
 * a rail card never quotes a number its product page contradicts); every other
 * card carries the reference's measured price/desc text as editorial content.
 *
 * The reference's accessory recommendation cards (`.rf-recommcard`, third-party
 * accessories) are carried with their measured labels and prices, info-routed —
 * the reference's own rotating recommendations, modeled as content (D11).
 */

export interface StoreRailTheme {
  /** Measured card background (the reference's paired colour themes). */
  bg: string;
  /** Measured text colour on that background. */
  fg: string;
}

export interface StoreRailCard {
  /** The reference's measured eyebrow ("NEW", "FREE ENGRAVING", ...); absent when it carries none. */
  eyebrow?: string;
  label: string;
  /** Measured desc/price for non-catalog cards; undefined for catalog-matched cards (the price derives at render). */
  desc?: string;
  href: string;
  /** Set when the reference's card names one of this clone's catalog products. */
  productId?: string;
  /** The reference's two card anatomies: product/editorial cards are 400×500 with a 28px name; accessory recommendation cards are narrower with a 17px name. */
  variant: "product" | "editorial" | "accessory";
  /** Measured theme for editorial cards (product cards are white; accessory cards are white). */
  theme?: StoreRailTheme;
}

export interface StoreRail {
  header: string;
  subhead: string;
  cards: readonly StoreRailCard[];
}

export interface StoreQuickLink {
  label: string;
  href: string;
}

/** Reference rail-card labels that name a clone catalog product under a variant
 * spelling or a "- New"/"- Free engraving" annotation — the exact-name rule
 * alone can't see these (measured live capture). Exported since session 12:
 * the accessories-category-pages spec mirrors this rule for its D10 guard
 * (the session-11 PRODUCT_EYEBROWS precedent — a private map's keys are
 * unpinnable). */
export const PRODUCT_ALIASES: Readonly<Record<string, string>> = {
  "MacBook Pro PROLED XDR Display": "macbook-pro-proled",
  "AirTag 4 pack": "airtag-4-pack",
  "AirTag 4 pack - Free engraving": "airtag-4-pack",
  "AirPods Pro 3 - Free engraving": "airpods-pro-3",
  "Apple HomeView - New": "apple-homeview",
  "iPhone 18 Pro - New": "iphone-18-pro",
  "Apple TV 4K - New": "apple-tv-4k",
  // the accessories grid quotes the charger with its cable length (session-11)
  "MagSafe Charger (1m)": "magsafe-charger",
};

function findProduct(label: string): Product | undefined {
  const exact = PRODUCTS.find((p) => p.name === label);
  if (exact) return exact;
  const aliasId = PRODUCT_ALIASES[label];
  return aliasId ? PRODUCTS.find((p) => p.id === aliasId) : undefined;
}

/** The rail-card routing rule — the flyout `familyLink` pattern, exported for the seam spec. */
export function railCardHref(label: string): string {
  const product = findProduct(label);
  return product ? routeHref.product(product.id) : routeHref.info(slugify(label));
}

const productCard = (label: string, eyebrow: string, desc?: string): StoreRailCard => {
  const href = railCardHref(label);
  const productId = href.startsWith("#/product/") ? href.slice("#/product/".length) : undefined;
  return productId ? { label, eyebrow, href, productId, variant: "product" } : { label, eyebrow, desc, href, variant: "product" };
};

const accessoryCard = (label: string, price: string): StoreRailCard => {
  const href = railCardHref(label);
  const productId = href.startsWith("#/product/") ? href.slice("#/product/".length) : undefined;
  return productId ? { label, href, productId, variant: "accessory" } : { label, desc: price, href, variant: "accessory" };
};

const editorialCard = (eyebrow: string | undefined, label: string, desc: string | undefined, theme: StoreRailTheme): StoreRailCard => ({
  eyebrow,
  label,
  desc,
  href: routeHref.info(slugify(label)),
  variant: "editorial",
  theme,
});

/** The rail header colour the reference ships on its store rails this season
 * (measured live: rgb(129, 8, 49) — the holiday theme's burgundy). */
export const RAIL_HEADER_COLOR = "#810831";

/** "From S$X" when the product carries options (its price varies with them);
 * the flat "S$X" otherwise — the reference's own price grammar, values from
 * this clone's catalog (deviation D10). */
export function productPriceLabel(product: Product): string {
  const price = formatSgd(product.basePrice);
  return product.options.length > 0 ? `From ${price}` : price;
}

const INK: StoreRailTheme = { bg: "#ffffff", fg: "#1d1d1f" };
const INK_ON_DARK: StoreRailTheme = { bg: "#1d1d1f", fg: "#f5f5f7" };
const WHITE_ON_BLACK: StoreRailTheme = { bg: "#000000", fg: "#ffffff" };

export const STORE_RAILS: readonly StoreRail[] = [
  {
    header: "The latest.",
    subhead: "Wonderful and colourful choices.",
    cards: [
      productCard("iPhone 18 Pro", "NEW"),
      productCard("Apple Watch Series 12", "NEW"),
      productCard("MacBook Pro", "NEW 14” WITH M6"),
      productCard("Apple HomeView", "NEW"),
      productCard("iPad mini", "NEW", "From S$999"),
      productCard("iPhone Duo", "NEW"),
      productCard("Apple Watch Ultra 4", "NEW", "From S$1,199"),
      productCard("MacBook Pro PROLED XDR Display", "NEW", "From S$3,999"),
      productCard("Apple TV 4K", "NEW"),
      productCard("AirPods 5", "NEW", "From S$199"),
      productCard("HomePod mini 2", "NEW", "S$199"),
      productCard("iMac", "NEW", "From S$2,099"),
    ],
  },
  {
    header: "Personalisation.",
    subhead: "Leave a lasting impression.",
    cards: [
      editorialCard("FREE ENGRAVING", "It’s your thought that counts.", undefined, INK_ON_DARK),
      editorialCard(undefined, "Style an Apple Watch just for them.", "Select a case. Pick a strap. Make their Apple Watch unique.", INK),
      editorialCard(undefined, "Customise their Mac.", "Choose the chip, memory, storage and even colour.", INK_ON_DARK),
      accessoryCard("AirPods Pro 3 - Free engraving", "S$349.00"),
      accessoryCard("iPad", "From S$649"),
      accessoryCard("AirTag 4 pack - Free engraving", "S$149.00"),
      accessoryCard("46mm Magenta Sport Loop - New", "S$69.00"),
      accessoryCard("Belkin BoostCharge Pro Power Bank 10K with Apple Watch Charger", "S$139.00"),
      accessoryCard("MacBook Neo", "From S$999"),
      accessoryCard("Belkin UltraCharge Pro 20K Power Bank with Integrated Cable", "S$139.00"),
    ],
  },
  {
    header: "Holiday picks.",
    subhead: "Get them all decked out.",
    cards: [
      editorialCard("HOLIDAY ACCESSORIES", "Everything’s better together.", undefined, INK_ON_DARK),
      editorialCard("ALL ACCESSORIES", "Make their joy full.", undefined, INK),
      accessoryCard("iPhone 18 Pro - New", "From S$1,899"),
      accessoryCard("Tech21 FlexPulse Fauxven Art Case for iPhone 17 (MagSafe compatible)", "S$69.00"),
      accessoryCard("iPhone 17", "From S$1,449"),
      accessoryCard("MOFT Snap Field MagSafe Wallet Stand - Only at Apple", "S$69.00"),
      accessoryCard("Powerbeats Pro 2 – High-Performance Earbuds – Quick Sand", "S$329.00"),
      accessoryCard("AirTag FineWoven Key Ring – Dark Olive - New", "S$55.00"),
      accessoryCard("ShiftCam SnapPocket Light 2 Magnetic LED Ring Light - New", "S$59.00"),
      accessoryCard("mophie Knit Air Folio Case for 11‑inch iPad Air - Only at Apple", "S$109.00"),
      accessoryCard("Smart Folio for iPad mini (A20 Pro) - Taupe - New", "S$119.00"),
      accessoryCard("Rains 14” Utility Sleeve for MacBook and iPad - Only at Apple", "S$139.00"),
    ],
  },
  {
    header: "Colourful finds.",
    subhead: "Delight up the holiday season.",
    cards: [
      editorialCard("COLOUR ACCESSORIES", "Lots of bright ideas.", undefined, INK),
      accessoryCard("iPhone 18 Pro TechWoven Case with MagSafe – Burgundy - New", "S$89.00"),
      accessoryCard("mophie Frost Case with Kickstand for iPhone 18 Pro - Only at Apple", "S$69.00"),
      accessoryCard("iPhone 18 Pro Max Silicone Case with MagSafe – Magenta - New", "S$75.00"),
      accessoryCard("42mm Chambray Blue Sport Loop - New", "S$69.00"),
      accessoryCard("Tech21 FlexFolio Case for 11” iPad Pro - Only at Apple", "S$79.00"),
      accessoryCard("40mm Burgundy Sport Band - M/L - New", "S$69.00"),
      accessoryCard("Beats 360 Over‑Ear Headphones – Pink with Pink Performance Knit Cushions", "S$429.00"),
      accessoryCard("49mm Burgundy Trail Loop - M/L - Black Titanium Finish - New", "S$139.00"),
      accessoryCard("Herschel Cloudform Sleeve for 14” MacBook - Online only", "S$79.00"),
    ],
  },
  {
    header: "Home essentials.",
    subhead: "More room to amaze.",
    cards: [
      editorialCard("APPLE HOME APP", "See how one app can control your entire home.", undefined, WHITE_ON_BLACK),
      editorialCard("APPLE MUSIC", "Get 3 months of Apple Music free.", "Included with the purchase of selected Apple devices.", INK_ON_DARK),
      editorialCard("APPLE TV", "Get 3 months of Apple TV free when you buy an eligible Apple device.", undefined, WHITE_ON_BLACK),
      editorialCard("APPLE ARCADE", "Get 3 months of Apple Arcade free.", "Play Sneaky Sasquatch and over 200 fun games with no ads. Included with the purchase of selected Apple devices.", INK),
      accessoryCard("Apple HomeView - New", "From S$399"),
      accessoryCard("HomePod mini 2 - Green - New", "S$199.00"),
      accessoryCard("HomePod - White", "S$499.00"),
      accessoryCard("AirPods 5 - New", "S$199.00"),
      accessoryCard("AirPods Pro 3 - Free engraving", "S$349.00"),
      accessoryCard("AirPods Max 2 - Orange - Free engraving", "S$749.00"),
      accessoryCard("Apple TV 4K - New", "S$399.00"),
      accessoryCard("Backbone One Mobile Gaming Controller (USB-C) - 2nd Generation", "S$190.75"),
    ],
  },
  {
    header: "Only at Apple.",
    subhead: "The total package.",
    cards: [
      editorialCard("APPLE STORE APP", "Put your bow on it.", "Make the gift unmistakably theirs with a personalised message created especially for them.", { bg: "#fae492", fg: "#57161a" }),
      editorialCard(undefined, "Trade in your device, get credit towards a new one.", undefined, { bg: "#420052", fg: "#c4b8eb" }),
      editorialCard(undefined, "Pay in full or pay over time. Your choice.", undefined, { bg: "#c4b8eb", fg: "#420052" }),
      editorialCard(undefined, "Free extended returns between now and 8/1/2027.", undefined, { bg: "#9bceaa", fg: "#1a4c44" }),
      editorialCard(undefined, "Set up your new device with help from a Specialist.", undefined, { bg: "#113679", fg: "#b3ceea" }),
      editorialCard("TODAY AT APPLE", "Join the fun at Apple Camp", "Create a helpful superhero in a free session on iPad. For kids 6–10.", INK),
      editorialCard(undefined, "Get gifts in time for the holidays with free delivery or easy pickup.", undefined, { bg: "#71cfff", fg: "#00224d" }),
      editorialCard("APPLE SPECIALIST", "Find gifts with an Apple Specialist in a store or online.", undefined, { bg: "#ffc1db", fg: "#5a122c" }),
      editorialCard(undefined, "Get expert service and support at the Genius Bar.", undefined, INK),
    ],
  },
  {
    header: "Savings and offers.",
    subhead: "Exclusive deals, special stores and more.",
    cards: [
      editorialCard("EDUCATION", "Save on a new Mac, iPad, and Apple Watch with education pricing", undefined, INK),
      editorialCard("CERTIFIED REFURBISHED", "Shop refurbished Apple products backed by a one-year warranty.", undefined, INK),
      editorialCard("SMALL BUSINESS", "Simple solutions for all the ways you work.", undefined, WHITE_ON_BLACK),
    ],
  },
];

/** The reference's measured quick-links strip under the store h1 (live
 * capture: Shop Gifts · Find a Store · AirPods · Apple Intelligence ·
 * Apple Trade In). The AirPods quick link routes to the clone's AirPods
 * category page — the clone HAS that destination (the reference's own
 * quick link goes to /sg/airpods/); every other label is info-routed. */
export const STORE_QUICK_LINKS: readonly StoreQuickLink[] = [
  { label: "Shop Gifts", href: routeHref.info(slugify("Shop Gifts")) },
  { label: "Find a Store", href: routeHref.info(slugify("Find a Store")) },
  { label: "AirPods", href: routeHref.store("airpods") },
  { label: "Apple Intelligence", href: routeHref.info(slugify("Apple Intelligence")) },
  { label: "Apple Trade In", href: routeHref.info(slugify("Apple Trade In")) },
];

/** Every info-routed rail label — feeds the INFO_TITLES derivation so the
 * sitemap's info routes and the rail content can never drift apart. */
export const RAIL_INFO_LABELS: readonly { label: string; href: string }[] = [
  ...STORE_RAILS.flatMap((rail) => rail.cards),
  ...STORE_QUICK_LINKS,
].filter((card) => card.href.startsWith(routeHref.info("")));
