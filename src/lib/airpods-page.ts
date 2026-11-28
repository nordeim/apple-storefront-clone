import { routeHref } from "./router";
import { slugify } from "./slug";

/**
 * The AirPods marketing page's measured content model — the reference's
 * `/sg/airpods/` (the nav's AirPods destination; live capture 2026-11-28,
 * the session-11 parity surface named by the session-10 log's D13).
 *
 * The page is a marketing family, not a store shelf sequence: a chapternav,
 * three product heroes, a compare module, a consider rail and an Apple Music
 * promo. Routing follows the clone's established rules:
 *
 * - D12: the AirPods Pro 3 hero and its compare column ARE this clone's
 *   catalog product — their Buy CTAs deep-link the working configurator
 *   (`#/product/airpods-pro-3?buy`; the reference's Buy is a marketing link).
 * - D6/D11: every non-catalog destination (AirPods 5, AirPods Max 2, the
 *   Wireless Charging Case) routes to a generated info page, matching the
 *   airpods flyout's own shop routing (`Shop AirPods 5` → info, etc.).
 * - D1: the reference's hero photography, "View in AR" links and footnote
 *   markers (◊ and trailing digits) are not reproduced — the taglines carry
 *   the measured text with the markers trimmed.
 */

export interface AirPodsChapterLink {
  label: string;
  /** The reference's "New" tag on the first item; absent otherwise. */
  note?: string;
  href: string;
}

export interface AirPodsHero {
  id: string;
  /** The measured h2 ("AirPods 5" at 80px; the chapter hero at 25.5px). */
  headline: string;
  headlineSize: "display" | "chapter";
  theme: "dark" | "light";
  tagline: string;
  /** Measured price for info-routed heroes; derived at render when productId is
   * set (D10 — the compare column's rule, applied to the hero, session-12 S12-2). */
  price?: string;
  learnHref: string;
  buyHref: string;
  /** Set when the hero names one of this clone's catalog products (D12). */
  productId?: string;
}

export interface AirPodsCompareColumn {
  /** The reference's "New" tag; absent otherwise. */
  eyebrow?: string;
  name: string;
  tagline: string;
  /** Measured price for info-routed columns; derived at render when productId is set (D10). */
  price?: string;
  learnHref: string;
  buyHref?: string;
  productId?: string;
}

export interface AirPodsFeature {
  /** The measured kicker line (the coloured intro above the headline). */
  kicker: string;
  headline: string;
  body: string;
}

const info = (label: string): string => routeHref.info(slugify(label));

export const AIRPODS_CHAPTERNAV: readonly AirPodsChapterLink[] = [
  { label: "AirPods", note: "New", href: info("AirPods 5") },
  { label: "AirPods Pro", href: routeHref.product("airpods-pro-3") },
  { label: "AirPods Max", href: info("AirPods Max 2") },
  { label: "Compare", href: info("Compare AirPods") },
  { label: "Accessories", href: routeHref.store("accessories") },
  { label: "Apple Music", href: info("Apple Music") },
];

export const AIRPODS_HEROES: readonly AirPodsHero[] = [
  {
    id: "airpods-5",
    headline: "AirPods 5",
    headlineSize: "display",
    theme: "dark",
    tagline: "Discover the magic of Active Noise Cancellation.",
    price: "Starting at S$199",
    learnHref: info("AirPods 5"),
    buyHref: info("Shop AirPods 5"),
  },
  {
    id: "airpods-pro-3",
    headline: "AirPods Pro 3",
    headlineSize: "display",
    theme: "light",
    tagline: "The world\u2019s best in-ear Active Noise Cancellation.",
    learnHref: routeHref.product("airpods-pro-3"),
    buyHref: routeHref.productBuy("airpods-pro-3"),
    productId: "airpods-pro-3",
  },
  {
    id: "airpods-max-2",
    headline: "AirPods Max 2",
    headlineSize: "chapter",
    theme: "light",
    tagline: "Listening. Remastered.",
    price: "S$749",
    learnHref: info("AirPods Max 2"),
    buyHref: info("Shop AirPods Max 2"),
  },
];

export const AIRPODS_COMPARE: {
  headline: string;
  columns: readonly AirPodsCompareColumn[];
} = {
  headline: "Compare AirPods models",
  columns: [
    {
      eyebrow: "New",
      name: "AirPods 5",
      tagline: "Discover the magic of Active Noise Cancellation.",
      price: "S$199",
      learnHref: info("AirPods 5"),
      buyHref: info("Shop AirPods 5"),
    },
    {
      eyebrow: "New",
      name: "AirPods 5 Wireless Charging Case",
      tagline: "Active Noise Cancellation, volume swipe and longer battery life.",
      price: "S$219",
      learnHref: info("AirPods 5 Wireless Charging Case"),
      buyHref: info("AirPods 5 Wireless Charging Case"),
    },
    {
      name: "AirPods Pro 3",
      tagline: "The world\u2019s best in-ear Active Noise Cancellation, with heart rate sensing during workouts.",
      learnHref: routeHref.product("airpods-pro-3"),
      buyHref: routeHref.productBuy("airpods-pro-3"),
      productId: "airpods-pro-3",
    },
    {
      name: "AirPods Max 2",
      tagline: "The ultimate over-ear personal listening experience.",
      price: "S$749",
      learnHref: info("AirPods Max 2"),
      buyHref: info("Shop AirPods Max 2"),
    },
  ],
};

export const AIRPODS_CONSIDER: { headline: string; features: readonly AirPodsFeature[] } = {
  headline: "Get to know AirPods.",
  features: [
    {
      kicker: "Control what you hear. And what you don\u2019t.",
      headline: "Active Noise Cancellation",
      body: "Active Noise Cancellation reduces unwanted sounds so you can immerse yourself in what you\u2019re listening to or simply stay focused. And Transparency lets you comfortably hear the world around you.",
    },
    {
      kicker: "Easily communicate across languages.",
      headline: "Live Translation",
      body: "Live Translation lets you communicate across languages like never before. While having a conversation with someone, their speech is automatically translated into your preferred language with AirPods 5, AirPods Pro 3 and AirPods Max 2. To respond, speak naturally and your iPhone will display your translated words. And if you\u2019re both wearing compatible AirPods, you can have a back-and-forth, hands-free conversation.",
    },
    {
      kicker: "Track your heart rate and calories burned during workouts.",
      headline: "Heart Rate Sensing",
      body: "With AirPods Pro 3, you can keep track of your heart rate and calories burned during workouts. Using LEDs that pulse invisible light 256 times per second \u2014 and sensor fusion from the accelerometers \u2014 AirPods Pro 3 give you incredibly accurate data from the treadmill to the trail.",
    },
    {
      kicker: "Keep in touch with your hearing.",
      headline: "Hearing Health",
      body: "With AirPods Pro 3, you can now take a scientifically validated Hearing Test in a broader range of background conditions. The Hearing Aid feature now has 67 per cent more battery life in Transparency on a single charge. And Loud Sound Reduction minimises your exposure to loud environmental noise. Feature availability varies by region.",
    },
    {
      kicker: "Immersive sound. Fine-tuned to you.",
      headline: "Personalised Spatial Audio",
      body: "Personalised Spatial Audio brings you 3D sound suited to your specific ear shape for a theatre-like experience that surrounds you with sound.",
    },
  ],
};

export const AIRPODS_MUSIC: { label: string; desc: string; href: string } = {
  label: "Apple Music",
  desc: "Get three months of Apple Music free with your AirPods.",
  href: info("Apple Music"),
};

/** Every info-routed label on the page — feeds the INFO_TITLES derivation so
 * the sitemap's info routes and this page's content can never drift apart
 * (labels are the source of truth; hrefs derive through the one slug grammar).
 * The set-equality spec pins this list against the models' info hrefs — the
 * session-12 S12-1 guard (a dropped label is a test failure, never a silent
 * dead route). */
const INFO_LABELS: readonly string[] = [
  // the chapternav's info-routed destinations (AirPods → "AirPods 5",
  // Compare → "Compare AirPods"; Pro routes to the product page and
  // Accessories to the store — neither seeds an info route)
  "AirPods 5",
  "AirPods Max 2",
  "Compare AirPods",
  "Apple Music",
  // the heroes' info-routed CTAs (the Pro 3 hero routes to the product)
  "Shop AirPods 5",
  "Shop AirPods Max 2",
  // the compare module's info-routed columns (the Pro 3 column is productId)
  "AirPods 5 Wireless Charging Case",
];

export const AIRPODS_INFO_LABELS: readonly { label: string; href: string }[] = INFO_LABELS.map((label) => ({
  label,
  href: info(label),
}));
