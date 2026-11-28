export type CategoryId = "mac" | "ipad" | "iphone" | "watch" | "vision" | "airpods" | "home" | "accessories";

/** The device categories (every category except accessories itself) — the
 * categories with a per-category accessories grid (session-12 D16), a
 * nav-main marketing page (session-13 D17) and a store shelf family. */
export type DeviceCategoryId = Exclude<CategoryId, "accessories">;
export const DEVICE_CATEGORY_IDS: readonly DeviceCategoryId[] = ["mac", "ipad", "iphone", "watch", "vision", "airpods", "home"];

export type ArtId =
  | "holiday"
  | "iphone-duo"
  | "iphone-18-pro"
  | "homeview"
  | "ipad"
  | "watch"
  | "macbook-proled"
  | "macbook-m6"
  | "airpods"
  | "vision"
  | "tv"
  | "airtag"
  | "charger";

export interface Category {
  id: CategoryId;
  label: string;
  blurb: string;
}

export interface OptionChoice {
  id: string;
  label: string;
  /** Price difference in SGD relative to the first (default) choice. */
  deltaSgd: number;
  /** Present for colour options so the UI can render a swatch. */
  hex?: string;
}

export interface ProductOption {
  id: string;
  label: string;
  choices: OptionChoice[];
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  tagline: string;
  summary: string;
  art: ArtId;
  /** GST-inclusive starting price in SGD. Illustrative demo data, not Apple's pricing. */
  basePrice: number;
  options: ProductOption[];
  highlights: string[];
}

export const CATEGORIES: readonly Category[] = [
  { id: "mac", label: "Mac", blurb: "Power and portability, redefined." },
  { id: "ipad", label: "iPad", blurb: "Touch, draw and type on one magical device." },
  { id: "iphone", label: "iPhone", blurb: "The most advanced iPhone lineup yet." },
  { id: "watch", label: "Watch", blurb: "Health, fitness and connection on your wrist." },
  { id: "vision", label: "Vision", blurb: "Spatial computing, up close." },
  { id: "airpods", label: "AirPods", blurb: "Wireless audio that disappears into your day." },
  { id: "home", label: "Home", blurb: "Smarter living, beautifully connected." },
  { id: "accessories", label: "Accessories", blurb: "Everything that completes the set." },
];

const storage = (ids: ReadonlyArray<readonly [string, string, number]>): ProductOption => ({
  id: "storage",
  label: "Storage",
  choices: ids.map(([id, label, deltaSgd]) => ({ id, label, deltaSgd })),
});

export const PRODUCTS: readonly Product[] = [
  {
    id: "iphone-duo",
    name: "iPhone Duo",
    category: "iphone",
    tagline: "Hello, hello.",
    summary: "An open, two-panel iPhone that turns photos on one side and apps on the other into a single canvas.",
    art: "iphone-duo",
    basePrice: 2799,
    options: [
      {
        id: "color",
        label: "Finish",
        choices: [
          { id: "star-white", label: "Star White", deltaSgd: 0, hex: "#f2f1ee" },
          { id: "midnight", label: "Midnight", deltaSgd: 0, hex: "#2b2d33" },
        ],
      },
      storage([
        ["256", "256GB", 0],
        ["512", "512GB", 300],
        ["1tb", "1TB", 600],
      ]),
    ],
    highlights: ["Open landscape canvas", "Photos left, apps right", "All-day battery"],
  },
  {
    id: "iphone-18-pro",
    name: "iPhone 18 Pro",
    category: "iphone",
    tagline: "Pro further.",
    summary: "Our most capable iPhone, with a Pro camera system and a titanium-class design in three deep finishes.",
    art: "iphone-18-pro",
    basePrice: 1799,
    options: [
      {
        id: "color",
        label: "Finish",
        choices: [
          { id: "black", label: "Black", deltaSgd: 0, hex: "#1c1c1e" },
          { id: "glacier", label: "Glacier", deltaSgd: 0, hex: "#b9d3e6" },
          { id: "burgundy", label: "Burgundy", deltaSgd: 0, hex: "#6b2233" },
        ],
      },
      storage([
        ["256", "256GB", 0],
        ["512", "512GB", 300],
        ["1tb", "1TB", 600],
        ["2tb", "2TB", 1200],
      ]),
    ],
    highlights: ["Pro camera system", "Always-On display", "Fast-charging battery"],
  },
  {
    id: "macbook-pro-proled",
    name: "MacBook Pro with PROLED XDR Display",
    category: "mac",
    tagline: "PROLED XDR Display",
    summary: "The 14- and 16-inch MacBook Pro in space black, with an extreme dynamic range display for pro workflows.",
    art: "macbook-proled",
    basePrice: 3299,
    options: [
      {
        id: "size",
        label: "Display size",
        choices: [
          { id: "14", label: "14-inch", deltaSgd: 0 },
          { id: "16", label: "16-inch", deltaSgd: 500 },
        ],
      },
      storage([
        ["512", "512GB", 0],
        ["1tb", "1TB", 300],
        ["2tb", "2TB", 800],
      ]),
    ],
    highlights: ["PROLED XDR Display", "Space Black finish", "Up to 22 hours battery life"],
  },
  {
    id: "macbook-pro-m6",
    name: "MacBook Pro",
    category: "mac",
    tagline: "14-inch model now with M6.",
    summary: "The 14-inch MacBook Pro with the M6 chip and a Liquid Retina XDR display.",
    art: "macbook-m6",
    basePrice: 2299,
    options: [
      {
        id: "memory",
        label: "Memory",
        choices: [
          { id: "16", label: "16GB", deltaSgd: 0 },
          { id: "24", label: "24GB", deltaSgd: 300 },
          { id: "32", label: "32GB", deltaSgd: 600 },
        ],
      },
      storage([
        ["512", "512GB", 0],
        ["1tb", "1TB", 300],
        ["2tb", "2TB", 800],
      ]),
    ],
    highlights: ["M6 chip", "Liquid Retina XDR display", "Three Thunderbolt ports"],
  },
  {
    id: "ipad",
    name: "iPad",
    category: "ipad",
    tagline: "Now with the speed of the A16 chip and double the starting storage.",
    summary: "The iPad for everyday creativity, learning and play, with a bright Liquid Retina display.",
    art: "ipad",
    basePrice: 549,
    options: [
      {
        id: "color",
        label: "Finish",
        choices: [
          { id: "blue", label: "Blue", deltaSgd: 0, hex: "#8fb4d9" },
          { id: "pink", label: "Pink", deltaSgd: 0, hex: "#f0b4c4" },
          { id: "silver", label: "Silver", deltaSgd: 0, hex: "#d9d9dc" },
        ],
      },
      storage([
        ["128", "128GB", 0],
        ["256", "256GB", 200],
        ["512", "512GB", 500],
      ]),
    ],
    highlights: ["A16 chip", "11-inch Liquid Retina display", "12MP front Center Stage camera"],
  },
  {
    id: "apple-watch-series-12",
    name: "Apple Watch Series 12",
    category: "watch",
    tagline: "The most accurate heart rate sensing in a wearable.",
    summary: "Advanced health sensing, a bright always-on display and all-day battery life.",
    art: "watch",
    basePrice: 579,
    options: [
      {
        id: "case",
        label: "Case size",
        choices: [
          { id: "42", label: "42mm", deltaSgd: 0 },
          { id: "46", label: "46mm", deltaSgd: 50 },
        ],
      },
      {
        id: "color",
        label: "Case colour",
        choices: [
          { id: "jet-black", label: "Jet Black", deltaSgd: 0, hex: "#1d1d1f" },
          { id: "rose-gold", label: "Rose Gold", deltaSgd: 0, hex: "#e3b8a8" },
          { id: "silver", label: "Silver", deltaSgd: 0, hex: "#d4d4d8" },
        ],
      },
    ],
    highlights: ["Most accurate heart rate sensing*", "Always-On Retina display", "Fast charging"],
  },
  {
    id: "airpods-pro-3",
    name: "AirPods Pro 3",
    category: "airpods",
    tagline: "The world’s best in-ear Active Noise Cancellation.",
    summary: "Active Noise Cancellation, Adaptive Audio and a secure fit in a pocketable charging case.",
    art: "airpods",
    basePrice: 349,
    options: [],
    highlights: ["Active Noise Cancellation", "Adaptive Audio", "Up to 6 hours listening time"],
  },
  {
    id: "apple-vision-pro",
    name: "Apple Vision Pro",
    category: "vision",
    tagline: "Welcome to the era of spatial computing.",
    summary: "A wearable spatial computer that blends digital content with the world around you.",
    art: "vision",
    basePrice: 5199,
    options: [
      storage([
        ["256", "256GB", 0],
        ["512", "512GB", 200],
        ["1tb", "1TB", 400],
      ]),
    ],
    highlights: ["Micro-OLED displays", "Eye and hand input", "Spatial photos and video"],
  },
  {
    id: "apple-homeview",
    name: "Apple HomeView",
    category: "home",
    tagline: "Designed for life at home.",
    summary: "A home display that keeps your widgets, controls, calls and family notes within glance.",
    art: "homeview",
    basePrice: 449,
    options: [
      {
        id: "color",
        label: "Finish",
        choices: [
          { id: "white", label: "White", deltaSgd: 0, hex: "#f2f2f4" },
          { id: "graphite", label: "Graphite", deltaSgd: 0, hex: "#3a3a3d" },
        ],
      },
    ],
    highlights: ["Smart home controls", "Video calls", "Widgets at a glance"],
  },
  {
    id: "apple-tv-4k",
    name: "Apple TV 4K",
    category: "home",
    tagline: "The Apple experience. On the big screen.",
    summary: "Cinematic 4K HDR streaming, games and Apple TV+ with Dolby Atmos support.",
    art: "tv",
    basePrice: 229,
    options: [
      storage([
        ["64", "64GB", 0],
        ["128", "128GB", 40],
      ]),
    ],
    highlights: ["4K Dolby Vision", "Dolby Atmos", "Siri Remote"],
  },
  {
    id: "airtag-4-pack",
    name: "AirTag (4 Pack)",
    category: "accessories",
    tagline: "Lose your knack for losing things.",
    summary: "Keep track of keys, bags and more with Precision Finding in the Find My app.",
    art: "airtag",
    basePrice: 135,
    options: [],
    highlights: ["Precision Finding", "Replaceable battery", "Water resistant"],
  },
  {
    id: "magsafe-charger",
    name: "MagSafe Charger",
    category: "accessories",
    tagline: "Snap on. Charge faster.",
    summary: "A magnetic wireless charger that aligns perfectly with your iPhone every time.",
    art: "charger",
    basePrice: 65.5,
    options: [
      {
        id: "length",
        label: "Cable length",
        choices: [
          { id: "1m", label: "1 m", deltaSgd: 0 },
          { id: "2m", label: "2 m", deltaSgd: 15 },
        ],
      },
    ],
    highlights: ["Magnetic alignment", "Up to 25W charging", "USB-C cable"],
  },
];

const PRODUCT_INDEX: ReadonlyMap<string, Product> = new Map(PRODUCTS.map((p) => [p.id, p]));

export function getProduct(id: string): Product | undefined {
  return PRODUCT_INDEX.get(id);
}

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function isCategoryId(value: string): value is CategoryId {
  return CATEGORIES.some((c) => c.id === value);
}

export function productsByCategory(category: CategoryId): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

/** AND-match of whitespace-separated tokens as plain substrings (never as a regex). */
export function searchCatalog(query: string, limit = 8): Product[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0 || limit <= 0) return [];

  const scored: Array<{ product: Product; rank: number }> = [];
  for (const product of PRODUCTS) {
    const name = product.name.toLowerCase();
    const haystack = `${name} ${product.tagline} ${product.summary} ${product.category}`.toLowerCase();
    if (!tokens.every((t) => haystack.includes(t))) continue;
    scored.push({ product, rank: tokens.every((t) => name.includes(t)) ? 0 : 1 });
  }
  return scored.sort((a, b) => a.rank - b.rank).slice(0, limit).map((s) => s.product);
}
