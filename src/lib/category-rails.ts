import { productsByCategory, type CategoryId } from "./catalog";
import { routeHref } from "./router";
import { railCardHref, type StoreRailTheme } from "./store-rails";

/**
 * The category store pages' shelf models — the reference's measured content
 * (live capture 2026-11-28, apple.com/sg/shop/buy-{mac,ipad,iphone,watch,
 * vision,home}; the session-10 parity surface named by the session-9 log).
 *
 * Every device category page is a shelf sequence: the first shelf
 * ("All models." — "Apple Vision Pro." / "Apple Home." on those pages) carries
 * the products, then per-category picks/service rails follow. Two rules:
 *
 * - D12 (the honesty rule): the first shelf's product cards derive from THIS
 *   clone's catalog at module scope — a card with a price and a Buy pill must
 *   be a product the clone can actually configure and sell. The reference's
 *   non-catalog models stay reachable through the flyout family links (D6).
 *   Measured per-product eyebrow tags ("NEW 14" WITH M6") carry onto the
 *   catalog-matched cards.
 * - The content shelves (picks / ways to save / only at Apple / setup /
 *   experience / savings / the watch-specific shelves) carry the reference's
 *   measured text verbatim, routed by the established `railCardHref` rule —
 *   a label naming a clone product routes to its product page, everything
 *   else to a generated info page.
 *
 * The airpods and accessories categories carry no shelves — their reference
 * pages are different families, each modeled by its own session-11 seam
 * (src/lib/airpods-page.ts — the marketing page; src/lib/accessories-page.ts
 * — the filtered grid) and rendered by StorePage above the superset grid.
 */

export type CategoryRailCardVariant =
  | "product"
  | "product-wide"
  | "accessory"
  | "editorial"
  | "editorial-wide"
  | "editorial-short"
  | "editorial-short-wide";

export interface CategoryRailCard {
  /** The reference's measured eyebrow ("NEW", "APPLE TRADE IN", a recomm badge); absent when it carries none. */
  eyebrow?: string;
  label: string;
  /** Measured desc / measured price text for non-catalog cards. */
  desc?: string;
  href: string;
  /** Set when the card IS one of this clone's catalog products (D12). */
  productId?: string;
  /** The product variant's Buy pill deep link (the working configurator). */
  buyHref?: string;
  variant: CategoryRailCardVariant;
  /** Measured theme for themed editorial cards (absent = white). */
  theme?: StoreRailTheme;
}

export interface CategoryRail {
  header: string;
  subhead: string;
  cards: readonly CategoryRailCard[];
}

/** The reference's measured per-product tags on the first shelves, for the
 * clone's catalog-matched products (live capture; see the session-10 plan).
 * Exported for the spec's dead-key guard: every key must be a catalog product
 * id (the session-11 audit's M-1 caught a key carrying the Watch card's ArtId
 * instead — its measured tag silently never rendered). */
export const PRODUCT_EYEBROWS: Readonly<Record<string, string>> = {
  "macbook-pro-m6": "NEW 14\u201d WITH M6",
  "macbook-pro-proled": "NEW",
  "iphone-duo": "NEW",
  "iphone-18-pro": "NEW",
  "apple-watch-series-12": "NEW",
  "apple-homeview": "NEW",
  "apple-tv-4k": "NEW",
};

/** The measured dark/colored card themes (bg/fg pairs converted from the
 * reference's computed styles; the store-rails colour family, per-page values). */
const INK_51: StoreRailTheme = { bg: "#333336", fg: "#f5f5f7" };
const INK_ON_DARK: StoreRailTheme = { bg: "#1d1d1f", fg: "#f5f5f7" };
const WHITE_ON_BLACK: StoreRailTheme = { bg: "#000000", fg: "#ffffff" };
const SKY: StoreRailTheme = { bg: "#71cfff", fg: "#00224d" };
const PLUM: StoreRailTheme = { bg: "#420052", fg: "#c4b8eb" };
const LILAC: StoreRailTheme = { bg: "#c4b8eb", fg: "#420052" };
const PINK: StoreRailTheme = { bg: "#ffc1db", fg: "#5a122c" };
const GOLD: StoreRailTheme = { bg: "#fae492", fg: "#57161a" };
const SAGE: StoreRailTheme = { bg: "#9bceaa", fg: "#1a4c44" };
const NAVY: StoreRailTheme = { bg: "#113679", fg: "#b3ceea" };

const editorialVariantCard = (
  variant: CategoryRailCardVariant,
  eyebrow: string | undefined,
  label: string,
  desc: string | undefined,
  theme?: StoreRailTheme,
): CategoryRailCard => ({ eyebrow, label, desc, href: railCardHref(label), variant, theme });

const editorialCard = (eyebrow: string | undefined, label: string, desc: string | undefined, theme?: StoreRailTheme): CategoryRailCard =>
  editorialVariantCard("editorial", eyebrow, label, desc, theme);
const editorialWideCard = (eyebrow: string | undefined, label: string, desc: string | undefined, theme?: StoreRailTheme): CategoryRailCard =>
  editorialVariantCard("editorial-wide", eyebrow, label, desc, theme);
const editorialShortCard = (eyebrow: string | undefined, label: string, desc: string | undefined, theme?: StoreRailTheme): CategoryRailCard =>
  editorialVariantCard("editorial-short", eyebrow, label, desc, theme);
const editorialShortWideCard = (eyebrow: string | undefined, label: string, desc: string | undefined, theme?: StoreRailTheme): CategoryRailCard =>
  editorialVariantCard("editorial-short-wide", eyebrow, label, desc, theme);

/** The reference's accessory recommendation cards: measured badge + label +
 * price, routed by the established rule (D11: measured text as content). */
const accessoryCard = (eyebrow: string | undefined, label: string, price: string): CategoryRailCard => ({
  eyebrow,
  label,
  desc: price,
  href: railCardHref(label),
  variant: "accessory",
});

/** D12: the first shelf's product cards derive from THIS clone's catalog —
 * clone-honest prices (rendered from `productPriceLabel`), the card links to
 * the product page, and the Buy pill deep-links the working configurator.
 * The vision page renders its single product at the measured 646px hero width. */
function categoryProductCards(category: CategoryId): CategoryRailCard[] {
  return productsByCategory(category).map((product) => ({
    eyebrow: PRODUCT_EYEBROWS[product.id],
    label: product.name,
    href: routeHref.product(product.id),
    productId: product.id,
    buyHref: routeHref.productBuy(product.id),
    variant: category === "vision" ? "product-wide" : "product",
  }));
}

export const CATEGORY_RAILS: Readonly<Record<CategoryId, readonly CategoryRail[]>> = {
  mac: [
    {
      header: "All models.",
      subhead: "Take your pick.",
      cards: [...categoryProductCards("mac"),
        editorialWideCard("COMPARE ALL MODELS", "Which Mac is right for you?", undefined)],
    },
    {
      header: "Mac picks.",
      subhead: "More power to them.",
      cards: [editorialCard("HOLIDAY ACCESSORIES", "Everything’s better together.", undefined, INK_51), accessoryCard("Only at Apple", "Rains 14” Utility Sleeve for MacBook and iPad", "S$139.00"), accessoryCard("Only at Apple", "Belkin UltraCharge Pro 20K Power Bank with Integrated Cable", "S$139.00"), accessoryCard("Free engraving", "AirPods Max 2 - Blue", "S$749.00"), accessoryCard(undefined, "Magic Mouse (USB‑C) - White Multi-Touch Surface", "S$99.00"), accessoryCard(undefined, "Magic Trackpad (USB‑C) - Black Multi-Touch Surface", "S$199.00"), accessoryCard("Online only", "Herschel Cloudform Backpack XL for MacBook", "S$139.00"), accessoryCard(undefined, "Bellroy Cinch Messenger Bag", "S$149.00"), accessoryCard("New", "Beats 360 Over‑Ear Headphones – Sky with Sky Performance Knit Cushions", "S$429.00"), accessoryCard("New", "Herschel Cloudform Sleeve for 14” MacBook", "S$79.00")],
    },
    {
      header: "Ways to save.",
      subhead: "Find what works for you.",
      cards: [editorialWideCard("APPLE TRADE IN", "Save on a new Mac when you trade in an eligible device.", undefined), editorialWideCard("LOW MONTHLY PAYMENTS", "Pay 0% interest for up to 24 months.", undefined), editorialWideCard("CERTIFIED REFURBISHED", "Shop refurbished Apple products backed by a one-year warranty.", undefined), editorialWideCard("EDUCATION", "Save with education pricing when you shop on the Education Store.", undefined)],
    },
    {
      header: "Only at Apple.",
      subhead: "The total package.",
      cards: [editorialCard(undefined, "Get gifts in time for the holidays with free delivery or easy pickup.", undefined, SKY), editorialShortCard(undefined, "Trade in your device, get credit towards a new one.", undefined, PLUM), editorialShortCard(undefined, "Pay in full or pay over time. Your choice.", undefined, LILAC), editorialCard(undefined, "Customise their Mac.", "Choose the chip, memory, storage and even colour.", INK_51), editorialCard("APPLE SPECIALIST", "Find gifts with an Apple Specialist in a store or online.", undefined, PINK), editorialCard("APPLE STORE APP", "Put your bow on it.", "Make the gift unmistakably theirs with a personalised message created especially for them.", GOLD), editorialShortCard(undefined, "Free extended returns between now and 8/1/2027.", undefined, SAGE), editorialShortCard(undefined, "Set up your new device with help from a Specialist.", undefined, NAVY)],
    },
    {
      header: "Setup and support.",
      subhead: "Our Specialists are here to help.",
      cards: [editorialWideCard("PERSONAL SETUP", "Set up your new Mac with help from a Specialist.", "Let us guide you through data transfer, the latest features and more, in online, one-to-one sessions."), editorialWideCard("EASY DATA TRANSFER", "New Mac? See how easy it is to move your content over.", undefined), editorialWideCard("APPLECARE+", "Get accidental damage protection and expert technical support from Apple.", undefined), editorialWideCard("Today at Apple", "Join us to discover the best of Mac.", "Get started or explore what’s new in free sessions at the Apple Store.")],
    },
    {
      header: "The Mac experience.",
      subhead: "Designed to connect with everything Apple.",
      cards: [editorialWideCard(undefined, "Apple Intelligence and Siri AI. More personal. More powerful.", undefined), editorialWideCard("WHY MAC", "If you love iPhone, you’ll love Mac.", undefined), editorialWideCard("MACOS", "Explore what’s new for macOS 27 Golden Gate.", undefined), editorialWideCard("CONTINUITY", "Powerful alone. Superpowered together.", undefined), editorialCard("APPLE MUSIC", "Get 3 months of Apple Music free.", "Included with the purchase of selected Apple devices.", INK_ON_DARK), editorialCard("APPLE TV", "Get 3 months of Apple TV free when you buy an eligible Apple device.", undefined, WHITE_ON_BLACK), editorialCard("APPLE ARCADE", "Get 3 months of Apple Arcade free.", "Play Sneaky Sasquatch and over 200 fun games with no ads. Included with the purchase of selected Apple devices."), editorialWideCard("APPLE CREATOR STUDIO", "Get 3 months free when you buy a Mac.", "Apple Creator Studio includes Final Cut Pro, Logic Pro, Pixelmator Pro, supercharged productivity apps and more.", WHITE_ON_BLACK), editorialShortWideCard("APPLE AT COLLEGE", "Ace it all with Apple.", undefined, WHITE_ON_BLACK), editorialShortWideCard("APPLE AT WORK", "Power your workplace with Apple hardware, software and services.", undefined, WHITE_ON_BLACK), editorialWideCard("ICLOUD+", "All the storage you need. Now with Apple TV and Apple Arcade included.", undefined)],
    },
    {
      header: "Savings and offers.",
      subhead: "Exclusive deals, special stores and more.",
      cards: [editorialCard("EDUCATION", "Save on a new Mac with special education pricing.", undefined), editorialCard("SMALL BUSINESS", "Simple solutions for all the ways you work.", undefined, INK_51)],
    },
  ],
  ipad: [
    {
      header: "All models.",
      subhead: "Take your pick.",
      cards: [...categoryProductCards("ipad"),
        editorialWideCard("COMPARE ALL MODELS", "Which iPad is right for you?", undefined), editorialCard(undefined, "Explore all iPad accessories.", undefined)],
    },
    {
      header: "iPad picks.",
      subhead: "All‑round greats.",
      cards: [editorialCard("HOLIDAY ACCESSORIES", "Everything’s better together.", undefined, INK_51), accessoryCard("Free engraving", "Apple Pencil Pro", "S$199.00"), accessoryCard("Only at Apple", "Tech21 FlexFolio Case for 11” iPad Air", "S$79.00"), accessoryCard(undefined, "Magic Keyboard for iPad Air 13‑inch (M4) - US English - Black", "S$449.00"), accessoryCard("Only at Apple", "mophie Knit Pro Folio Case for 11‑inch iPad Pro", "S$109.00"), accessoryCard(undefined, "Bellroy Cinch Messenger Bag", "S$149.00"), accessoryCard(undefined, "40W Dynamic Power Adapter with 60W Max", "S$55.00"), accessoryCard(undefined, "MOFT Float Folio for 11” iPad Pro", "S$89.00"), accessoryCard(undefined, "Apple Pencil (USB-C)", "S$119.00"), accessoryCard("New", "Beats 360 Over‑Ear Headphones – Black with Black Performance Knit Cushions", "S$429.00"), accessoryCard("New", "AirPods 5", "S$199.00"), accessoryCard(undefined, "Tech21 iPad (A16) FlexFolio", "S$79.00"), accessoryCard(undefined, "Magic Keyboard Folio for iPad (A16) - US English", "S$379.00")],
    },
    {
      header: "Ways to save.",
      subhead: "Find what works for you.",
      cards: [editorialWideCard("APPLE TRADE IN", "Trade in your current iPad and get credit towards a new one.", undefined), editorialWideCard("LOW MONTHLY PAYMENTS", "Pay 0% interest for up to 24 months.", undefined), editorialWideCard("CERTIFIED REFURBISHED", "Shop refurbished Apple products backed by a one-year warranty.", undefined), editorialWideCard("EDUCATION", "Save with education pricing when you shop on the Education Store.", undefined)],
    },
    {
      header: "Only at Apple.",
      subhead: "The total package.",
      cards: [editorialCard(undefined, "Get gifts in time for the holidays with free delivery or easy pickup.", undefined, SKY), editorialShortCard(undefined, "Make it theirs. Engrave a mix of emoji, names and numbers for free.", undefined, PLUM), editorialShortCard(undefined, "Trade in your device, get credit towards a new one.", undefined, LILAC), editorialCard("APPLE SPECIALIST", "Find gifts with an Apple Specialist in a store or online.", undefined, PINK), editorialCard("APPLE STORE APP", "Put your bow on it.", "Make the gift unmistakably theirs with a personalised message created especially for them.", GOLD), editorialShortCard(undefined, "Free extended returns between now and 8/1/2027.", undefined, SAGE), editorialShortCard(undefined, "Pay in full or pay over time. Your choice.", undefined, NAVY)],
    },
    {
      header: "Setup and support.",
      subhead: "Our Specialists are here to help.",
      cards: [editorialWideCard("PERSONAL SETUP", "Set up your new iPad with help from a Specialist.", "Let us guide you through data transfer, the latest features and more, in online, one-to-one sessions."), editorialWideCard("QUICK START SETUP", "Easily set up your new iPad with your current iPad or iPhone.", undefined), editorialWideCard("APPLECARE+", "Protect your iPad, Apple Pencil, and Apple-branded keyboard from accidental drops and spills with AppleCare+ — as often as you need.", undefined), editorialWideCard("Today at Apple", "Join us to discover the best of iPad.", "Get started or explore what’s new in free sessions at the Apple Store.")],
    },
    {
      header: "The iPad experience.",
      subhead: "Designed to connect with everything Apple.",
      cards: [editorialWideCard("TODAY AT APPLE", "Join the fun at Apple Camp", "Create a helpful superhero in a free session on iPad. For kids 6–10."), editorialWideCard(undefined, "Apple Intelligence and Siri AI. Truly helpful. Truly yours.", undefined), editorialWideCard("IPADOS", "Powerfully redesigned. Game‑changing capabilities.", undefined), editorialWideCard("CONTINUITY", "Powerful alone. Superpowered together.", undefined), editorialCard("APPLE MUSIC", "Get 3 months of Apple Music free.", "Included with the purchase of selected Apple devices.", INK_ON_DARK), editorialCard("APPLE TV", "Get 3 months of Apple TV free when you buy an eligible Apple device.", undefined, WHITE_ON_BLACK), editorialCard("APPLE ARCADE", "Get 3 months of Apple Arcade free.", "Play Sneaky Sasquatch and over 200 fun games with no ads. Included with the purchase of selected Apple devices."), editorialWideCard("APPLE CREATOR STUDIO", "Get 3 months free when you buy an iPad.", "Apple Creator Studio includes Final Cut Pro, Logic Pro, Pixelmator Pro, supercharged productivity apps and more.", WHITE_ON_BLACK), editorialShortWideCard("APPLE AT COLLEGE", "Light in your backpack. Heavy on features.", undefined), editorialShortWideCard("APPLE AT WORK", "Breeze through your workflow.", undefined), editorialWideCard("ICLOUD+", "All the storage you need. Now with Apple TV and Apple Arcade included.", undefined), editorialWideCard("APPLE ONE", "Bundle multiple Apple services. And enjoy more for less.", undefined)],
    },
    {
      header: "Savings and offers.",
      subhead: "Exclusive deals, special stores and more.",
      cards: [editorialCard("EDUCATION", "We offer special iPad pricing for students and educators.", undefined), editorialCard("SMALL BUSINESS", "From enterprise to small business, we’ll work with you.", undefined, INK_51)],
    },
  ],
  iphone: [
    {
      header: "All models.",
      subhead: "Take your pick.",
      cards: [...categoryProductCards("iphone"),
        editorialCard("COMPARE ALL MODELS", "Which iPhone is right for you?", undefined), editorialCard(undefined, "Explore iPhone accessories.", undefined)],
    },
    {
      header: "iPhone picks.",
      subhead: "Dial in the perfect gift.",
      cards: [editorialCard("HOLIDAY ACCESSORIES", "Everything’s better together.", undefined), accessoryCard("New", "iPhone 18 Pro TechWoven Case with MagSafe – Burgundy", "S$89.00"), accessoryCard("New", "iPhone Duo Folio with Kickstand – Taupe", "S$179.00"), accessoryCard("Only at Apple", "mophie Frost Case with Kickstand for iPhone 18 Pro Max", "S$69.00"), accessoryCard("Only at Apple", "Tech21 FlexPulse Fauxven Art Case for iPhone 18 Pro (MagSafe compatible)", "S$69.00"), accessoryCard("New", "iPhone Duo Case – Navy Blue", "S$109.00"), accessoryCard(undefined, "40W Dynamic Power Adapter with 60W Max", "S$55.00"), accessoryCard("New", "Wrist Strap – Crisp Blue", "S$39.00"), accessoryCard("New", "iPhone 18 Pro Clear Case with MagSafe", "S$75.00"), accessoryCard("New", "Beats 360 Over‑Ear Headphones – Black with Black Performance Knit Cushions", "S$429.00"), editorialCard(undefined, "Explore MagSafe accessories.", undefined)],
    },
    {
      header: "Ways to save.",
      subhead: "Right here at Apple.",
      cards: [editorialWideCard("APPLE TRADE IN", "Trade in your device, get credit towards a new one.", undefined), editorialWideCard("LOW MONTHLY PAYMENTS", "Pay 0% interest for up to 24 months.", undefined)],
    },
    {
      header: "Only at Apple.",
      subhead: "The total package.",
      cards: [editorialCard(undefined, "Get gifts in time for the holidays with free delivery or easy pickup.", undefined, SKY), editorialShortCard(undefined, "Trade in your device, get credit towards a new one.", undefined, PLUM), editorialShortCard(undefined, "Pay in full or pay over time. Your choice.", undefined, LILAC), editorialCard("APPLE SPECIALIST", "Find gifts with an Apple Specialist in a store or online.", undefined, PINK), editorialCard("APPLE STORE APP", "Put your bow on it.", "Make the gift unmistakably theirs with a personalised message created especially for them.", GOLD), editorialShortCard(undefined, "Free extended returns between now and 8/1/2027.", undefined, SAGE), editorialShortCard(undefined, "Set up your new device with help from a Specialist.", undefined, NAVY)],
    },
    {
      header: "Setup and support.",
      subhead: "Our Specialists are here to help.",
      cards: [editorialWideCard("ESIM ON IPHONE", "iPhone and eSIM — an easier and more secure way to connect to your network provider.", undefined), editorialWideCard("PERSONAL SETUP", "Set up your new iPhone with help from a Specialist.", "Let us guide you through data transfer, the latest features and more, in online, one-to-one sessions."), editorialWideCard("EASY DATA TRANSFER", "Access all the iCloud+ storage you need to move everything over to your new iPhone.", undefined), editorialWideCard("WATCH AND LEARN", "Use Quick Start to set up and transfer data.", "Watch Jeannie’s one‑minute overview on how easy it can be."), editorialWideCard("APPLECARE+", "Protect your iPhone with unlimited repairs for accidental damage.", undefined), editorialWideCard("SWITCH TO IPHONE", "Switching from Android to iPhone is super simple.", undefined), editorialWideCard("Today at Apple", "Join us to discover the best of iPhone.", "Get started or explore what’s new in free sessions at the Apple Store."), editorialWideCard("SMALL BUSINESS", "Simple solutions for all the ways you work.", undefined, WHITE_ON_BLACK)],
    },
    {
      header: "The iPhone experience.",
      subhead: "Designed to connect with everything Apple.",
      cards: [editorialWideCard(undefined, "Apple Intelligence and Siri AI. More personal. More powerful.", undefined), editorialWideCard("Better Together", "Designed to work together.", undefined), editorialWideCard(undefined, "You get more than an iPhone when you get an iPhone.", undefined), editorialCard("APPLE MUSIC", "Get 3 months of Apple Music free.", "Included with the purchase of selected Apple devices.", INK_ON_DARK), editorialCard("APPLE TV", "Get 3 months of Apple TV free when you buy an eligible Apple device.", undefined, WHITE_ON_BLACK), editorialCard("APPLE ARCADE", "Get 3 months of Apple Arcade free.", "Play Sneaky Sasquatch and over 200 fun games with no ads. Included with the purchase of selected Apple devices."), editorialWideCard("AIRPODS", "Magically connect to your iPhone.", undefined), editorialWideCard("CONTINUITY", "Powerful alone. Superpowered together.", undefined), editorialWideCard("CONTINUITY", "Powerful alone. Superpowered together.", undefined), editorialWideCard("AIRTAG", "The most findable AirTag yet.", undefined), editorialWideCard("ICLOUD+", "All the storage you need. Now with Apple TV and Apple Arcade included.", undefined)],
    },
  ],
  watch: [
    {
      header: "All models.",
      subhead: "Take your pick.",
      cards: [...categoryProductCards("watch"),
        editorialWideCard("COMPARE ALL MODELS", "Which Apple Watch is right for you?", undefined), editorialCard(undefined, "Explore all Apple Watch accessories.", undefined)],
    },
    {
      header: "Apple Watch picks.",
      subhead: "Time to celebrate.",
      cards: [editorialCard("HOLIDAY ACCESSORIES", "Everything’s better together.", undefined, INK_ON_DARK), accessoryCard("New", "40mm Burgundy Plaid Sport Loop", "S$69.00"), accessoryCard("New", "42mm Dark Bronze Milanese Loop", "S$139.00"), accessoryCard("New", "40mm Olive Sport Band - S/M", "S$69.00"), accessoryCard("New", "40mm After Dark Black Nike Sport Band - M/L", "S$69.00"), accessoryCard("New", "46mm Pavement Grey Nike Sport Loop", "S$69.00"), accessoryCard("New", "46mm Wildflower Blue Magnetic Link - M/L", "S$139.00"), accessoryCard("New", "49mm Translucent Kelp Ocean Band - Natural Titanium Finish", "S$139.00"), accessoryCard("New", "49mm Burgundy Alpine Loop - Medium - Black Titanium Finish", "S$139.00"), accessoryCard(undefined, "Apple Watch Hermès - 46mm Satiné Grand H - Large", "S$1,939.00"), accessoryCard("New", "Apple Watch Hermès - 42mm Bleu Nuit/Orange Rocabar Club", "S$729.00")],
    },
    {
      header: "Ways to save.",
      subhead: "Find what works for you.",
      cards: [editorialWideCard("LOW MONTHLY PAYMENTS", "Pay 0% interest for up to 24 months.", undefined), editorialWideCard("APPLE TRADE IN", "Trade in your device, get credit towards a new one.", undefined), editorialWideCard("EDUCATION", "Save with education pricing when you shop on the Education Store.", undefined)],
    },
    {
      header: "Only at Apple.",
      subhead: "The total package.",
      cards: [editorialCard(undefined, "Get gifts in time for the holidays with free delivery or easy pickup.", undefined, SKY), editorialShortCard(undefined, "Trade in your device, get credit towards a new one.", undefined, PLUM), editorialShortCard(undefined, "Pay 0% interest for up to 24 months.", undefined, LILAC), editorialCard("APPLE SPECIALIST", "Find gifts with an Apple Specialist in a store or online.", undefined, PINK), editorialCard("APPLE STORE APP", "Put your bow on it.", "Make the gift unmistakably theirs with a personalised message created especially for them.", GOLD), editorialShortCard(undefined, "Free extended returns between now and 8/1/2027.", undefined, SAGE), editorialShortCard(undefined, "Set up your new device with help from a Specialist.", undefined, NAVY)],
    },
    {
      header: "Apple Watch charging essentials.",
      subhead: "Full power ahead.",
      cards: [editorialCard(undefined, "Explore all charging essentials.", undefined), accessoryCard(undefined, "40W Dynamic Power Adapter with 60W Max", "S$55.00"), accessoryCard(undefined, "35W Dual Port Power Adapter", "S$79.00"), accessoryCard("New", "Apple Watch Magnetic Fast Charger to USB-C Cable (1 m)", "S$39.00"), accessoryCard(undefined, "20W USB-C Power Adapter", "S$29.00"), accessoryCard("Only at Apple", "Scosche WatchIt Keychain Apple Watch Magnetic Fast Charger - White", "S$49.00"), accessoryCard(undefined, "Belkin BoostCharge Pro Power Bank 10K with Apple Watch Charger", "S$139.00"), accessoryCard(undefined, "mophie 3-in-1 Wireless Charge Stand", "S$209.00")],
    },
    {
      header: "The Apple Watch experience.",
      subhead: "Designed to connect with everything Apple.",
      cards: [editorialWideCard("HELPFUL AI TOOLS", "Make every day more effortless with Siri AI and Audio Intelligence.", undefined), editorialWideCard("WATCHOS 27", "Check out the latest Apple Watch features.", undefined, INK_51), editorialWideCard(undefined, "You get more than a watch when you get an Apple Watch.", undefined), editorialCard("APPLE MUSIC", "Get 3 months of Apple Music free.", "Included with the purchase of selected Apple devices.", INK_ON_DARK), editorialWideCard("APPLE FITNESS+", "Get three months of Apple Fitness+ free when you buy an Apple Watch.", undefined, WHITE_ON_BLACK), editorialWideCard("APPLE WATCH FOR RUNNERS", "Made to empower every runner.", undefined, WHITE_ON_BLACK), editorialWideCard("APPLE WATCH FOR YOUR KIDS", "Independence for them. Peace of mind for you.", undefined), editorialWideCard("APPLE MUSIC", "Get 3 months of Apple Music free with your Apple Watch.", undefined), editorialWideCard("CONTINUITY", "Power couple.", undefined), editorialWideCard("AIRPODS", "Magically connect to your Apple Watch.", undefined)],
    },
    {
      header: "Setup and support.",
      subhead: "Our Specialists are here to help.",
      cards: [editorialWideCard("PERSONAL SETUP", "Set up your Apple Watch with help from a Specialist.", "From getting started to the latest features, get personalised tips in an online, one-to-one session."), editorialWideCard("GETTING STARTED", "Learn how to set up your new Apple Watch.", undefined), editorialWideCard("APPLECARE+", "Get additional tech support and accidental damage protection.", undefined), editorialWideCard("Today at Apple", "Join us to discover the best of Apple Watch.", "Get started or explore what’s new in free sessions at the Apple Store."), editorialWideCard("BUSINESS", "From enterprise to small business, we’ll work with you.", undefined, WHITE_ON_BLACK)],
    },
    {
      header: "Special stores.",
      subhead: "Get specially designed pricing.",
      cards: [editorialCard("EDUCATION", "Save on a new Apple Watch with education pricing.", undefined)],
    },
  ],
  vision: [
    {
      header: "Apple Vision Pro.",
      subhead: "Welcome to the era of spatial computing.",
      cards: [...categoryProductCards("vision"),
        editorialCard(undefined, "Explore all Apple Vision Pro accessories.", undefined)],
    },
    {
      header: "Shopping guides.",
      subhead: "Learn more and shop like a pro.",
      cards: [editorialWideCard("WATCH AND LEARN", "A quick guide to shopping for Apple Vision Pro.", "Get a one-minute overview from Johnny."), editorialWideCard("SHOPPING TIPS", "A few tips to make buying even easier.", undefined), editorialWideCard("APPLE VISION PRO SPECIALIST", "Shop one on one with a Specialist online.", undefined)],
    },
    {
      header: "Get more from the Apple Store.",
      subhead: "Exclusive offers you’ll only find here.",
      cards: [editorialWideCard("LOW MONTHLY PAYMENTS", "Pay 0% interest for up to 24 months with flexible financing plans.", undefined), editorialWideCard("IN-STORE PICKUP", "Buy Apple Vision Pro online and pick up at a store near you.", undefined), editorialWideCard("APPLE DELIVERY", "Get free delivery.", undefined)],
    },
    {
      header: "Demos.",
      subhead: "Experience Apple Vision Pro in a store near you or online.",
      cards: [editorialWideCard("BOOK A DEMO", "Reserve your place for a one‑to‑one demo.", undefined), editorialWideCard("APPLE IMMERSIVE", "Experience Real Madrid like never before.", "Sign up for an in-store demo of Apple Vision Pro.", INK_51)],
    },
    {
      header: "Setup and support.",
      subhead: "Our Specialists are here to help.",
      cards: [editorialWideCard("PERSONAL SETUP", "Set up Apple Vision Pro with help from a Specialist.", "From getting started to the latest features, get personalised tips in an online, one-to-one session."), editorialWideCard("APPLECARE+", "Enjoy peace of mind when you buy AppleCare+ for Apple Vision Pro.", undefined)],
    },
    {
      header: "Accessories.",
      subhead: "Get the most out of Apple Vision Pro.",
      cards: [editorialCard(undefined, "All the essentials. And then some.", "Check out great accessories for Apple Vision Pro."), accessoryCard("Only at Apple", "Apple Vision Pro Battery", "S$299.00"), accessoryCard("Only at Apple", "Belkin Battery Holder for Apple Vision Pro", "S$79.00"), accessoryCard("New", "Logitech Muse", "S$179.00"), accessoryCard(undefined, "Magic Keyboard (USB–C) - US English", "S$129.00"), accessoryCard(undefined, "Magic Trackpad (USB‑C) - White Multi‑Touch Surface", "S$159.00")],
    },
    {
      header: "The Apple Vision Pro Experience.",
      subhead: "Designed to connect with everything Apple.",
      cards: [editorialWideCard("APPLE VISION PRO", "Enjoy truly immersive experiences.", "Watch, work and connect in ways never before possible."), editorialWideCard("APP STORE", "Explore the App Store for Apple Vision Pro.", "Featuring groundbreaking apps built for visionOS.")],
    },
  ],
  home: [
    {
      header: "Apple Home.",
      subhead: "Explore the lineup.",
      cards: [...categoryProductCards("home"),
        editorialCard(undefined, "Explore all smart home accessories.", undefined)],
    },
    {
      header: "Shopping guides.",
      subhead: "Can’t decide? Start here.",
      cards: [
        // S11-2/L-1: the label names a catalog product, so the card is a
        // productId card — the price derives from the catalog at render (D10:
        // internal consistency beats the reference's measured S$399 string,
        // which contradicted this clone's From S$449 configurator).
        { eyebrow: "NEW", label: "Apple HomeView", href: railCardHref("Apple HomeView"), productId: "apple-homeview", variant: "editorial" },
        editorialWideCard("APPLE HOME SPECIALIST", "Shop one on one with a Specialist. Online or in a store.", undefined),
        editorialWideCard("APPLE TV", "Watch new Apple Originals every month.", undefined, INK_51),
      ],
    },
    {
      header: "The Apple Home experience.",
      subhead: "Home. Made simple.",
      cards: [editorialWideCard(undefined, "Easy setup. Simple controls. Smarter home.", "With Apple Home devices and accessories, it’s never been simpler to set up and control a connected home."), editorialWideCard("SIRI AI", "More personal. More powerful.", undefined), editorialWideCard("PRIVACY", "The privacy every home and everyone deserves.", undefined), editorialWideCard("ICLOUD+", "Upgrade to iCloud+ today.", "Upgrade to iCloud+ to access and review your HomeKit Secure Video footage from anywhere with the Home app.")],
    },
    {
      header: "Setup and support.",
      subhead: "Our Specialists are here to help.",
      cards: [editorialWideCard(undefined, "Set up your Apple Home devices with step-by-step instructions and guides.", undefined), editorialWideCard("PERSONAL SETUP", "Get your new Apple HomeView set up with help from a Specialist.", "From getting started to the latest features, get tips online in a free one-to-one session."), editorialWideCard("APPLECARE", "Handled with AppleCare.", "Protect your Apple Home device with AppleCare+.")],
    },
    {
      header: "Ways to save.",
      subhead: "Find what works for you.",
      cards: [editorialWideCard("CERTIFIED REFURBISHED", "Shop refurbished Apple products backed by a one-year warranty.", undefined)],
    },
  ],
  // D13: the airpods and accessories reference pages are different families
  // (a marketing page and a filtered grid) — no shelves this cycle.
  airpods: [],
  accessories: [],
};

/** Every info-routed category card — feeds the INFO_TITLES derivation so the
 * sitemap's info routes and the shelf content can never drift apart. */
export const CATEGORY_RAIL_INFO_LABELS: readonly { label: string; href: string }[] = Object.values(CATEGORY_RAILS)
  .flat()
  .flatMap((rail) => rail.cards)
  .filter((card) => card.href.startsWith(routeHref.info("")));
