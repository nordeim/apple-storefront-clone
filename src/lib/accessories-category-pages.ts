import { routeHref } from "./router";
import { slugify } from "./slug";
import type {
  AccessoriesChapterChip,
  AccessoriesCuratedTab,
  AccessoriesGalleryCard,
  AccessoriesIndexGroup,
  AccessoriesValueProp,
} from "./accessories-page";

/**
 * The seven per-category accessories grid pages' measured content model — the
 * reference's /sg/shop/{cat}/accessories (live capture 2026-11-28, the
 * session-12 D16 surface: the destinations behind the flyouts' "X Accessories"
 * links and the all-accessories chapternav's device chips).
 *
 * The pages are the same family as the modeled all-accessories grid
 * (session-11): a per-category chapter nav, a media gallery, a curated tabbed
 * grid, a value-props row and an index-nav directory. Routing follows the
 * clone's established rules:
 *
 * - D10/D12: curated cards whose label names one of this clone's catalog
 *   products (AirPods Pro 3, MagSafe Charger (1m), Apple TV 4K — incl. its
 *   gallery Buy CTA) are productId items whose prices derive from THIS clone's
 *   catalog at render; the reference's measured price strings are NOT quoted
 *   where they contradict it (the reference quotes S$399 for the Apple TV 4K
 *   card; this catalog says From S$229).
 * - D11: every other card, promo, chip, value prop and index link carries its
 *   measured text routed to a generated info page.
 * - D16: the index-nav "Shop by Product" group's seven device links route to
 *   the per-category accessories pages themselves; "All Accessories" routes to
 *   #/store/accessories; AirTag/Beats route to the all-page chapternav's own
 *   info destinations.
 * - D1: the reference's product photography (gallery backdrops, the colour
 *   swatches, the one video promo's video) is not reproduced; the video promo
 *   is modeled as a text promo with its caption (the session-11 Beats 360
 *   pattern); footnote markers are trimmed (D11).
 *
 * Generated from the live captures by the session-12 converter
 * (.scratch/s12/convert.mjs) and hand-verified against the raw DOM extraction.
 */

// The chip anatomy is the all-page family's (session-13 S13-4: one interface,
// re-exported — the duplicated local definition dropped).
export type { AccessoriesChapterChip } from "./accessories-page";

export interface AccessoriesCategoryPage {
  /** The category whose accessories grid this page models. */
  id: (typeof DEVICE_CATEGORY_IDS)[number];
  /** The measured h1 ("Mac Accessories"). */
  h1: string;
  chapternav: readonly AccessoriesChapterChip[];
  gallery: { headline: string; cards: readonly AccessoriesGalleryCard[] };
  curated: { headline: string; tabs: readonly AccessoriesCuratedTab[] };
  valueProps: { headline: string; items: readonly AccessoriesValueProp[] };
  indexNav: { headline: string; groups: readonly AccessoriesIndexGroup[] };
}

/** The categories with a per-category accessories grid — every device category
 * (the accessories category itself is the all-accessories page). One constant
 * shared with the catalog seam (session-13 S13-3/S13-4: single source). */
export { DEVICE_CATEGORY_IDS } from "./catalog";
import { DEVICE_CATEGORY_IDS } from "./catalog";

const info = (label: string): string => routeHref.info(slugify(label));

const MAC_PAGE: AccessoriesCategoryPage = {
  id: "mac",
  h1: "Mac Accessories",
  chapternav: [
    { label: "Cases & Protection", ariaLabel: "Cases & Protection - Mac Accessories", href: "#/info/cases-protection-mac-accessories" },
    { label: "Mice & Keyboards", ariaLabel: "Mice & Keyboards - Mac Accessories", href: "#/info/mice-keyboards-mac-accessories" },
    { label: "Chargers & Adapters", ariaLabel: "Chargers & Adapters - Mac Accessories", href: "#/info/chargers-adapters-mac-accessories" },
    { label: "Office Accessories", ariaLabel: "Office Accessories - Mac Accessories", href: "#/info/office-accessories-mac-accessories" },
    { label: "Hard Drives & Storage", ariaLabel: "Hard Drives & Storage - Mac Accessories", href: "#/info/hard-drives-storage-mac-accessories" },
    { label: "Software", ariaLabel: "Software - Mac Accessories", href: "#/info/software-mac-accessories" },
    { label: "Content Creation", ariaLabel: "Content Creation - Mac Accessories", href: "#/info/content-creation-mac-accessories" },
    { label: "Gaming", ariaLabel: "Gaming - Mac Accessories", href: "#/info/gaming-mac-accessories" },
    { label: "Headphones & Speakers", ariaLabel: "Headphones & Speakers - Mac Accessories", href: "#/info/headphones-speakers-mac-accessories" },
  ],
  gallery: {
    headline: "Just in for Mac.",
    cards: [
      { theme: "light", headline: "Works like magic.", body: "Discover Magic accessories — a collection of wireless keyboards, mice and trackpads.", cta: { label: "Shop all", href: "#/info/mice-keyboards-mac-accessories" } },
      { theme: "dark", headline: "AirPods 5", body: "Discover the magic of Active Noise Cancellation.", cta: { label: "Shop", href: "#/info/airpods-5" } },
    ],
  },
  curated: {
    headline: "More to love for Mac.",
    tabs: [
      { label: "Gear Up", cards: [
        { kind: "card", badge: "Only at Apple", label: "Rains 14” Utility Sleeve for MacBook and iPad", price: "S$139.00", href: "#/info/rains-14-utility-sleeve-for-macbook-and-ipad" },
        { kind: "card", label: "Incase Edge Hardshell Case for 13” MacBook Air", price: "S$69.00", href: "#/info/incase-edge-hardshell-case-for-13-macbook-air" },
        { kind: "card", label: "MOFT Carry Sleeve for 14” MacBook Pro", price: "S$99.00", href: "#/info/moft-carry-sleeve-for-14-macbook-pro" },
        { kind: "card", label: "mophie Slim Hardshell Case for 14\" MacBook Pro", price: "S$79.00", href: "#/info/mophie-slim-hardshell-case-for-14-macbook-pro" },
        { kind: "card", label: "Kensington UltraThin Magnetic Privacy Screen Filter for 14” MacBook Pro", price: "S$94.85", href: "#/info/kensington-ultrathin-magnetic-privacy-screen-filter-for-14-macbook-pro" },
        { kind: "promo", eyebrow: "Cases & Sleeves", headline: "Protect your tech.", ctaLabel: "Learn more", href: "#/info/protect-your-tech" },
        { kind: "card", label: "Tech21 EvoShell Case for 16” MacBook Pro", price: "S$79.00", href: "#/info/tech21-evoshell-case-for-16-macbook-pro" },
        { kind: "card", badge: "Online only", label: "Herschel Cloudform Sleeve for 14” MacBook", price: "S$79.00", href: "#/info/herschel-cloudform-sleeve-for-14-macbook" },
        { kind: "card", label: "Kensington UltraThin Magnetic Privacy Screen for 13\" MacBook Air", price: "S$74.95", href: "#/info/kensington-ultrathin-magnetic-privacy-screen-for-13-macbook-air" },
        { kind: "card", badge: "Online only", label: "Native Union Active Organizer", price: "S$49.00", href: "#/info/native-union-active-organizer" },
        { kind: "card", badge: "Online only", label: "Herschel Cloudform Backpack XL for MacBook", price: "S$139.00", href: "#/info/herschel-cloudform-backpack-xl-for-macbook" },
        { kind: "card", badge: "Only at Apple", label: "Rains Backpack Mini for iPad and MacBook", price: "S$179.00", href: "#/info/rains-backpack-mini-for-ipad-and-macbook" },
      ] },
      { label: "Power Picks", cards: [
        { kind: "promo", eyebrow: "Chargers & Adapters", headline: "Make the perfect connection.", ctaLabel: "Learn more", href: "#/info/make-the-perfect-connection" },
        { kind: "card", label: "USB-C to USB Adapter", price: "S$29.00", href: "#/info/usb-c-to-usb-adapter" },
        { kind: "card", label: "240W USB-C Charge Cable (2m)", price: "S$39.00", href: "#/info/240w-usb-c-charge-cable-2m" },
        { kind: "card", label: "USB-C Digital AV Multiport Adapter", price: "S$89.00", href: "#/info/usb-c-digital-av-multiport-adapter" },
        { kind: "card", label: "40W Dynamic Power Adapter with 60W Max", price: "S$55.00", href: "#/info/40w-dynamic-power-adapter-with-60w-max" },
        { kind: "card", badge: "New", label: "70W Power Adapter", price: "S$79.00", href: "#/info/70w-power-adapter" },
        { kind: "card", label: "USB-C to MagSafe 3 Cable (2m) - Sky Blue", price: "S$65.00", href: "#/info/usb-c-to-magsafe-3-cable-2m-sky-blue" },
        { kind: "card", label: "Thunderbolt 5 (USB‑C) Pro Cable (1m)", price: "S$89.00", href: "#/info/thunderbolt-5-usb-c-pro-cable-1m" },
        { kind: "card", label: "USB-C to SD Card Reader", price: "S$55.00", href: "#/info/usb-c-to-sd-card-reader" },
        { kind: "card", badge: "New", label: "World Travel Adapter Kit", price: "S$55.00", href: "#/info/world-travel-adapter-kit" },
        { kind: "card", badge: "New", label: "Power Adapter Extension Cable (AC Connector 2)", price: "S$29.00", href: "#/info/power-adapter-extension-cable-ac-connector-2" },
        { kind: "card", badge: "New", label: "Beats USB-C to USB-C Woven Cable (3 m / 10 ft) – Power Pink", price: "S$39.00", href: "#/info/beats-usb-c-to-usb-c-woven-cable-3-m-10-ft-power-pink" },
      ] },
      { label: "Mac Must-Haves", cards: [
        { kind: "card", label: "Magic Keyboard with Touch ID and Numeric Keypad for Mac models with Apple silicon (USB‑C) - US English - Black Keys", price: "S$269.00", href: "#/info/magic-keyboard-with-touch-id-and-numeric-keypad-for-mac-models-with-apple-silicon-usb-c-us-english-black-keys" },
        { kind: "card", label: "Magic Mouse (USB‑C) - Black Multi-Touch Surface", price: "S$129.00", href: "#/info/magic-mouse-usb-c-black-multi-touch-surface" },
        { kind: "card", badge: "Free engraving", label: "AirPods Max 2 - Midnight", price: "S$749.00", href: "#/info/airpods-max-2-midnight" },
        { kind: "card", label: "Magic Keyboard with Touch ID for Mac models with Apple silicon (USB–C) - US English", price: "S$199.00", href: "#/info/magic-keyboard-with-touch-id-for-mac-models-with-apple-silicon-usb-c-us-english" },
        { kind: "card", label: "Magic Trackpad (USB‑C) - White Multi‑Touch Surface", price: "S$159.00", href: "#/info/magic-trackpad-usb-c-white-multi-touch-surface" },
        { kind: "card", badge: "Free engraving", label: "AirPods Pro 3", productId: "airpods-pro-3", href: "#/product/airpods-pro-3" },
        { kind: "card", label: "Studio Display XDR - Nano-texture glass - Tilt- and height-adjustable stand", price: "S$4,899.00", href: "#/info/studio-display-xdr-nano-texture-glass-tilt-and-height-adjustable-stand" },
        { kind: "card", label: "Twelve South Curve Stand for MacBook", price: "S$79.70", href: "#/info/twelve-south-curve-stand-for-macbook" },
        { kind: "card", label: "Microsoft 365 Personal (One-Year Subscription)", price: "S$159.00", href: "#/info/microsoft-365-personal-one-year-subscription" },
        { kind: "card", badge: "New", label: "Beats 360 Over‑Ear Headphones – Pink with Pink Performance Knit Cushions", price: "S$429.00", href: "#/info/beats-360-over-ear-headphones-pink-with-pink-performance-knit-cushions" },
        { kind: "card", label: "LaCie 1TB Rugged USB-C Portable Hard Drive", price: "S$189.00", href: "#/info/lacie-1tb-rugged-usb-c-portable-hard-drive" },
        { kind: "card", badge: "Only at Apple", label: "Satechi Multiport Pro Adapter V2 (with Ethernet)", price: "S$119.00", href: "#/info/satechi-multiport-pro-adapter-v2-with-ethernet" },
      ] },
      { label: "The Perfect Match", cards: [
        { kind: "card", badge: "Only at Apple", label: "Tech21 EvoShell for MacBook Neo", price: "S$79.00", href: "#/info/tech21-evoshell-for-macbook-neo" },
        { kind: "card", badge: "Only at Apple", label: "Belkin UltraCharge Pro 20K Power Bank with Integrated Cable", price: "S$139.00", href: "#/info/belkin-ultracharge-pro-20k-power-bank-with-integrated-cable" },
        { kind: "card", badge: "Only at Apple", label: "Belkin BoostCharge Slim Magnetic Power Bank 5K with Stand", price: "S$79.00", href: "#/info/belkin-boostcharge-slim-magnetic-power-bank-5k-with-stand" },
      ] },
    ],
  },
  valueProps: {
    headline: "Why Apple is the best place to buy accessories.",
    items: [
      { headline: "Free delivery and pickup.", body: "Get free delivery or pick up at your Apple Store.", linkName: "Learn more", href: "#/info/free-delivery-and-pickup" },
      { headline: "Holiday Returns", body: "Free extended returns between now and 08/01", linkName: "Learn more", href: "#/info/holiday-returns" },
      { headline: "Pay 0% interest for up to 24 months.", body: "With an eligible credit card, you can choose the financing option that works for you.", linkName: "Learn more", href: "#/info/financing" },
    ],
  },
  indexNav: {
    headline: "Accessories",
    groups: [
      {
        headline: "Shop by Product",
        links: [
          { label: "All Accessories", href: "#/store/accessories" },
          { label: "iPhone", href: "#/store/iphone/accessories" },
          { label: "iPad", href: "#/store/ipad/accessories" },
          { label: "Mac", href: "#/store/mac/accessories" },
          { label: "Apple Watch", href: "#/store/watch/accessories" },
          { label: "Apple Vision Pro", href: "#/store/vision/accessories" },
          { label: "AirPods", href: "#/store/airpods/accessories" },
          { label: "AirTag", href: "#/info/airtag-accessories" },
          { label: "Beats", href: "#/info/beats-accessories" },
        ],
      },
      {
        headline: "Shop by Mac Category",
        links: [
          { label: "Gaming", href: "#/info/gaming-mac-accessories" },
          { label: "Content Creation", href: "#/info/content-creation-mac-accessories" },
          { label: "Office Accessories", href: "#/info/office-accessories-mac-accessories" },
          { label: "Cases & Protection", href: "#/info/cases-protection-mac-accessories" },
          { label: "Headphones & Speakers", href: "#/info/headphones-speakers-mac-accessories" },
          { label: "MacBook Neo Essentials", href: "#/info/macbook-neo-essentials" },
          { label: "Software", href: "#/info/software-mac-accessories" },
          { label: "Hard Drives & Storage", href: "#/info/hard-drives-storage-mac-accessories" },
          { label: "Chargers & Adapters", href: "#/info/chargers-adapters-mac-accessories" },
          { label: "Mice & Keyboards", href: "#/info/mice-keyboards-mac-accessories" },
        ],
      },
      {
        headline: "Explore More Accessories",
        links: [
          { label: "New Arrivals", href: "#/info/new-arrivals" },
          { label: "College Essentials", href: "#/info/college-essentials" },
        ],
      },
    ],
  },
};

const IPAD_PAGE: AccessoriesCategoryPage = {
  id: "ipad",
  h1: "iPad Accessories",
  chapternav: [
    { label: "Apple Pencil", ariaLabel: "Apple Pencil - iPad Accessories", href: "#/info/apple-pencil-ipad-accessories" },
    { label: "Keyboards", ariaLabel: "Keyboards - iPad Accessories", href: "#/info/keyboards-ipad-accessories" },
    { label: "Cases & Protection", ariaLabel: "Cases & Protection - iPad Accessories", href: "#/info/cases-protection-ipad-accessories" },
    { label: "Chargers & Adapters", ariaLabel: "Chargers & Adapters - iPad Accessories", href: "#/info/chargers-adapters-ipad-accessories" },
    { label: "Displays & Stands", ariaLabel: "Displays & Stands - iPad Accessories", href: "#/info/displays-stands-ipad-accessories" },
    { label: "Headphones & Speakers", ariaLabel: "Headphones & Speakers - iPad Accessories", href: "#/info/headphones-speakers-ipad-accessories" },
    { label: "Content Creation", ariaLabel: "Content Creation - iPad Accessories", href: "#/info/content-creation-ipad-accessories" },
  ],
  gallery: {
    headline: "Just in for iPad.",
    cards: [
      { theme: "dark", headline: "Dream it up. Jot it down.", body: "Get pixel-perfect precision, tilt sensitivity and more. See which Apple Pencil is right for you.", cta: { label: "Learn more", href: "#/info/dream-it-up-jot-it-down" } },
      { theme: "light", headline: "From tap to type.", body: "Discover keyboards designed to complement your iPad.", cta: { label: "Learn more", href: "#/info/from-tap-to-type" } },
      { theme: "dark", headline: "AirPods 5", body: "Discover the magic of Active Noise Cancellation.", cta: { label: "Shop", href: "#/info/airpods-5" } },
    ],
  },
  curated: {
    headline: "Tap in to top picks for iPad.",
    tabs: [
      { label: "iPad Pro", cards: [
        { kind: "card", badge: "Free engraving", label: "Apple Pencil Pro", price: "S$199.00", href: "#/info/apple-pencil-pro" },
        { kind: "card", label: "Apple Pencil (USB-C)", price: "S$119.00", href: "#/info/apple-pencil-usb-c" },
        { kind: "promo", headline: "Which Apple Pencil is right for you?", ctaLabel: "Learn more", href: "#/info/which-apple-pencil-is-right-for-you" },
        { kind: "card", label: "Smart Folio for iPad Pro 11-inch (M5) - Denim", price: "S$119.00", href: "#/info/smart-folio-for-ipad-pro-11-inch-m5-denim" },
        { kind: "card", label: "Magic Keyboard for iPad Pro 11‑inch (M5) - US English - White", price: "S$449.00", href: "#/info/magic-keyboard-for-ipad-pro-11-inch-m5-us-english-white" },
        { kind: "promo", eyebrow: "iPad Pro Cases & Protection", headline: "Styled for success.", ctaLabel: "Learn more", href: "#/info/styled-for-success" },
        { kind: "card", label: "Magic Mouse (USB‑C) - White Multi-Touch Surface", price: "S$99.00", href: "#/info/magic-mouse-usb-c-white-multi-touch-surface" },
        { kind: "card", badge: "Only at Apple", label: "Tech21 FlexFolio Case for 13” iPad Pro", price: "S$79.00", href: "#/info/tech21-flexfolio-case-for-13-ipad-pro" },
        { kind: "card", badge: "New", label: "Beats 360 Over‑Ear Headphones – Black with Black Performance Knit Cushions", price: "S$429.00", href: "#/info/beats-360-over-ear-headphones-black-with-black-performance-knit-cushions" },
        { kind: "card", label: "Logitech Combo Touch Keyboard Case for iPad Pro 11-inch (M5)", price: "S$339.00", href: "#/info/logitech-combo-touch-keyboard-case-for-ipad-pro-11-inch-m5" },
        { kind: "card", label: "MOFT Float Folio for 11” iPad Pro", price: "S$89.00", href: "#/info/moft-float-folio-for-11-ipad-pro" },
        { kind: "card", badge: "New", label: "AirPods 5", price: "S$199.00", href: "#/info/airpods-5" },
      ] },
      { label: "iPad Air", cards: [
        { kind: "promo", eyebrow: "iPad Air Cases & Protection", headline: "Fresh looks built to last.", ctaLabel: "Learn more", href: "#/info/fresh-looks-built-to-last" },
        { kind: "card", label: "Smart Folio for iPad Air 11-inch (M4) - Sage", price: "S$119.00", href: "#/info/smart-folio-for-ipad-air-11-inch-m4-sage" },
        { kind: "card", label: "Magic Keyboard for iPad Air 11‑inch (M4) - US English - Black", price: "S$399.00", href: "#/info/magic-keyboard-for-ipad-air-11-inch-m4-us-english-black" },
        { kind: "card", label: "Magic Mouse (USB‑C) - White Multi-Touch Surface", price: "S$99.00", href: "#/info/magic-mouse-usb-c-white-multi-touch-surface" },
        { kind: "card", badge: "Only at Apple", label: "mophie Knit Air Folio Case for 11‑inch iPad Air", price: "S$109.00", href: "#/info/mophie-knit-air-folio-case-for-11-inch-ipad-air" },
        { kind: "card", badge: "Free engraving", label: "Apple Pencil Pro", price: "S$199.00", href: "#/info/apple-pencil-pro" },
        { kind: "card", label: "Apple Pencil (USB-C)", price: "S$119.00", href: "#/info/apple-pencil-usb-c" },
        { kind: "promo", headline: "Which Apple Pencil is right for you?", ctaLabel: "Learn more", href: "#/info/which-apple-pencil-is-right-for-you" },
        { kind: "card", label: "Logitech Flip Folio Keyboard Case for 11‑inch iPad Air and iPad Pro - International English", price: "S$229.00", href: "#/info/logitech-flip-folio-keyboard-case-for-11-inch-ipad-air-and-ipad-pro-international-english" },
        { kind: "card", label: "Satechi Foldable Aluminium Stand", price: "S$59.50", href: "#/info/satechi-foldable-aluminium-stand" },
        { kind: "card", label: "35W Dual Port Power Adapter", price: "S$79.00", href: "#/info/35w-dual-port-power-adapter" },
        { kind: "card", badge: "New", label: "Beats 360 Over‑Ear Headphones – Cloud with Cloud Performance Knit Cushions", price: "S$429.00", href: "#/info/beats-360-over-ear-headphones-cloud-with-cloud-performance-knit-cushions" },
      ] },
      { label: "iPad", cards: [
        { kind: "card", label: "Magic Keyboard Folio for iPad (A16) - US English", price: "S$379.00", href: "#/info/magic-keyboard-folio-for-ipad-a16-us-english" },
        { kind: "card", label: "Tech21 iPad (A16) FlexFolio", price: "S$79.00", href: "#/info/tech21-ipad-a16-flexfolio" },
        { kind: "card", label: "Smart Folio for iPad (A16) – Watermelon", price: "S$119.00", href: "#/info/smart-folio-for-ipad-a16-watermelon" },
        { kind: "promo", headline: "Which Apple Pencil is right for you?", ctaLabel: "Learn more", href: "#/info/which-apple-pencil-is-right-for-you" },
        { kind: "card", label: "Apple Pencil (1st Generation)", price: "S$149.00", href: "#/info/apple-pencil-1st-generation" },
        { kind: "card", label: "Apple Pencil (USB-C)", price: "S$119.00", href: "#/info/apple-pencil-usb-c" },
        { kind: "card", label: "Logitech Slim Folio Keyboard for iPad (A16)", price: "S$150.35", href: "#/info/logitech-slim-folio-keyboard-for-ipad-a16" },
        { kind: "card", badge: "Online only", label: "Herschel Cloudform Backpack XL for MacBook", price: "S$139.00", href: "#/info/herschel-cloudform-backpack-xl-for-macbook" },
        { kind: "card", label: "35W Dual Port Power Adapter", price: "S$79.00", href: "#/info/35w-dual-port-power-adapter" },
        { kind: "card", label: "60W USB-C Charge Cable (1m)", price: "S$29.00", href: "#/info/60w-usb-c-charge-cable-1m" },
        { kind: "card", label: "USB-C to Apple Pencil Adapter", price: "S$15.00", href: "#/info/usb-c-to-apple-pencil-adapter" },
        { kind: "card", badge: "New", label: "AirPods 5", price: "S$199.00", href: "#/info/airpods-5" },
        { kind: "card", label: "Beats Solo 4 – On-Ear Wireless Headphones – Slate Blue", price: "S$269.00", href: "#/info/beats-solo-4-on-ear-wireless-headphones-slate-blue" },
        { kind: "card", label: "Magic Mouse (USB‑C) - White Multi-Touch Surface", price: "S$99.00", href: "#/info/magic-mouse-usb-c-white-multi-touch-surface" },
      ] },
      { label: "iPad mini", cards: [
        { kind: "promo", headline: "Which Apple Pencil is right for you?", ctaLabel: "Learn more", href: "#/info/which-apple-pencil-is-right-for-you" },
        { kind: "card", badge: "Free engraving", label: "Apple Pencil Pro", price: "S$199.00", href: "#/info/apple-pencil-pro" },
        { kind: "card", label: "Apple Pencil (USB-C)", price: "S$119.00", href: "#/info/apple-pencil-usb-c" },
        { kind: "card", label: "USB-C Digital AV Multiport Adapter", price: "S$89.00", href: "#/info/usb-c-digital-av-multiport-adapter" },
        { kind: "card", label: "35W Dual Port Power Adapter", price: "S$79.00", href: "#/info/35w-dual-port-power-adapter" },
        { kind: "card", badge: "New", label: "Smart Folio for iPad mini (A20 Pro) - Navy Blue", price: "S$119.00", href: "#/info/smart-folio-for-ipad-mini-a20-pro-navy-blue" },
        { kind: "card", badge: "New", label: "AirPods 5", price: "S$199.00", href: "#/info/airpods-5" },
        { kind: "card", label: "240W USB-C Charge Cable (2m)", price: "S$39.00", href: "#/info/240w-usb-c-charge-cable-2m" },
      ] },
    ],
  },
  valueProps: {
    headline: "Why Apple is the best place to buy accessories.",
    items: [
      { headline: "Free delivery and pickup.", body: "Get free delivery or pick up at your Apple Store.", linkName: "Learn more", href: "#/info/free-delivery-and-pickup" },
      { headline: "Holiday Returns", body: "Free extended returns between now and 08/01", linkName: "Learn more", href: "#/info/holiday-returns" },
      { headline: "Pay 0% interest for up to 24 months.", body: "With an eligible credit card, you can choose the financing option that works for you.", linkName: "Learn more", href: "#/info/financing" },
      { headline: "Make them yours.", body: "Engrave selected products with your initials or favourite emoji — free. Only at Apple.", linkName: "Learn more", href: "#/info/make-them-yours" },
    ],
  },
  indexNav: {
    headline: "Accessories",
    groups: [
      {
        headline: "Shop by Product",
        links: [
          { label: "All Accessories", href: "#/store/accessories" },
          { label: "iPhone", href: "#/store/iphone/accessories" },
          { label: "iPad", href: "#/store/ipad/accessories" },
          { label: "Mac", href: "#/store/mac/accessories" },
          { label: "Apple Watch", href: "#/store/watch/accessories" },
          { label: "Apple Vision Pro", href: "#/store/vision/accessories" },
          { label: "AirPods", href: "#/store/airpods/accessories" },
          { label: "AirTag", href: "#/info/airtag-accessories" },
          { label: "Beats", href: "#/info/beats-accessories" },
        ],
      },
      {
        headline: "Shop by iPad Category",
        links: [
          { label: "Content Creation", href: "#/info/content-creation-ipad-accessories" },
          { label: "Chargers & Adapters", href: "#/info/chargers-adapters-ipad-accessories" },
          { label: "Keyboards", href: "#/info/keyboards-ipad-accessories" },
          { label: "Headphones & Speakers", href: "#/info/headphones-speakers-ipad-accessories" },
          { label: "Apple Pencil", href: "#/info/apple-pencil-ipad-accessories" },
          { label: "Cases & Protection", href: "#/info/cases-protection-ipad-accessories" },
          { label: "Displays & Stands", href: "#/info/displays-stands-ipad-accessories" },
        ],
      },
      {
        headline: "Explore More Accessories",
        links: [
          { label: "New Arrivals", href: "#/info/new-arrivals" },
          { label: "College Essentials", href: "#/info/college-essentials" },
        ],
      },
    ],
  },
};

const IPHONE_PAGE: AccessoriesCategoryPage = {
  id: "iphone",
  h1: "iPhone Accessories",
  chapternav: [
    { label: "Cases & Protection", ariaLabel: "Cases & Protection - iPhone Accessories", href: "#/info/cases-protection-iphone-accessories" },
    { label: "Chargers & Adapters", ariaLabel: "Chargers & Adapters - iPhone Accessories", href: "#/info/chargers-adapters-iphone-accessories" },
    { label: "MagSafe", ariaLabel: "MagSafe - iPhone Accessories", href: "#/info/magsafe-iphone-accessories" },
    { label: "Headphones& Speakers", ariaLabel: "Headphones& Speakers - iPhone Accessories", href: "#/info/headphones-speakers-iphone-accessories" },
    { label: "Content Creation", ariaLabel: "Content Creation - iPhone Accessories", href: "#/info/content-creation-iphone-accessories" },
    { label: "Gaming", ariaLabel: "Gaming - iPhone Accessories", href: "#/info/gaming-iphone-accessories" },
    { label: "Health & Fitness", ariaLabel: "Health & Fitness - iPhone Accessories", href: "#/info/health-fitness-iphone-accessories" },
  ],
  gallery: {
    headline: "In the spotlight.",
    cards: [
      { theme: "light", headline: "Made for iPhone Duo.", body: "Protect your device with a thin, light case for iPhone Duo. Available in fresh new colours.", cta: { label: "Shop", href: "#/info/made-for-iphone-duo" } },
      { theme: "light", headline: "Mix it. Match it. Make it yours.", body: "Pair your iPhone with a MagSafe case or wallet, Wrist Strap or Crossbody Strap in a new mix of colours and textures.", cta: { label: "Shop all", href: "#/info/cases-protection-iphone-accessories" } },
      { theme: "light", headline: "Accessorise in a snap.", body: "Find a MagSafe case, wallet or charger that’s right for you.", cta: { label: "Shop all", href: "#/info/magsafe-iphone-accessories" } },
      { theme: "dark", headline: "AirPods 5", body: "Discover the magic of Active Noise Cancellation.", cta: { label: "Shop", href: "#/info/airpods-5" } },
    ],
  },
  curated: {
    headline: "Find your next everything.",
    tabs: [
      { label: "Mix & Match", cards: [
        { kind: "promo", eyebrow: "Cases & Protection", headline: "Find your colour story.", ctaLabel: "Learn more", href: "#/info/find-your-colour-story" },
        { kind: "card", badge: "New", label: "iPhone 18 Pro TechWoven Case with MagSafe – Burgundy", price: "S$89.00", href: "#/info/iphone-18-pro-techwoven-case-with-magsafe-burgundy" },
        { kind: "card", badge: "New", label: "iPhone 18 Pro Max Silicone Case with MagSafe - Navy Blue", price: "S$75.00", href: "#/info/iphone-18-pro-max-silicone-case-with-magsafe-navy-blue" },
        { kind: "card", badge: "Only at Apple", label: "MOFT Snap Field MagSafe Wallet Stand", price: "S$69.00", href: "#/info/moft-snap-field-magsafe-wallet-stand" },
        { kind: "card", badge: "New", label: "iPhone 18 Pro Clear Case with MagSafe", price: "S$75.00", href: "#/info/iphone-18-pro-clear-case-with-magsafe" },
        { kind: "card", badge: "New", label: "Wrist Strap – Crisp Blue", price: "S$39.00", href: "#/info/wrist-strap-crisp-blue" },
        { kind: "card", badge: "New", label: "Crossbody Strap – Burgundy", price: "S$89.00", href: "#/info/crossbody-strap-burgundy" },
        { kind: "promo", headline: "Crossbody Straps & Wristlets", ctaLabel: "Learn more", href: "#/info/crossbody-straps-wristlets" },
        { kind: "promo", eyebrow: "Cases & Protection", headline: "Snaps on. Stands up.", ctaLabel: "Learn more", href: "#/info/snaps-on-stands-up" },
        { kind: "card", badge: "New", label: "iPhone Duo Case – Sand", price: "S$109.00", href: "#/info/iphone-duo-case-sand" },
        { kind: "card", badge: "New", label: "iPhone Duo Folio with Kickstand – Taupe", price: "S$179.00", href: "#/info/iphone-duo-folio-with-kickstand-taupe" },
      ] },
      { label: "Power Picks", cards: [
        { kind: "card", label: "MagSafe Charger (1m)", productId: "magsafe-charger", href: "#/product/magsafe-charger" },
        { kind: "card", label: "60W USB-C Charge Cable (1m)", price: "S$29.00", href: "#/info/60w-usb-c-charge-cable-1m" },
        { kind: "card", label: "240W USB-C Charge Cable (2m)", price: "S$39.00", href: "#/info/240w-usb-c-charge-cable-2m" },
        { kind: "card", label: "40W Dynamic Power Adapter with 60W Max", price: "S$55.00", href: "#/info/40w-dynamic-power-adapter-with-60w-max" },
        { kind: "card", label: "20W USB-C Power Adapter", price: "S$29.00", href: "#/info/20w-usb-c-power-adapter" },
        { kind: "card", label: "Beats USB-C to USB-C Woven Cable (1.5 m / 5 ft) – Nitro Navy", price: "S$29.00", href: "#/info/beats-usb-c-to-usb-c-woven-cable-1-5-m-5-ft-nitro-navy" },
        { kind: "card", label: "Beats USB‑C to USB‑C Woven Short Cable (20 cm / 8 in.) – Bolt Black", price: "S$29.00", href: "#/info/beats-usb-c-to-usb-c-woven-short-cable-20-cm-8-in-bolt-black" },
        { kind: "card", badge: "Only at Apple", label: "Belkin UltraCharge Pro 3-in-1 Magnetic Charging Dock", price: "S$199.00", href: "#/info/belkin-ultracharge-pro-3-in-1-magnetic-charging-dock" },
        { kind: "card", label: "mophie 3-in-1 Wireless Charge Stand", price: "S$209.00", href: "#/info/mophie-3-in-1-wireless-charge-stand" },
        { kind: "card", label: "iPhone Air MagSafe Battery", price: "S$139.00", href: "#/info/iphone-air-magsafe-battery" },
        { kind: "card", label: "USB-C Digital AV Multiport Adapter", price: "S$89.00", href: "#/info/usb-c-digital-av-multiport-adapter" },
        { kind: "card", label: "Thunderbolt 5 (USB‑C) Pro Cable (1m)", price: "S$89.00", href: "#/info/thunderbolt-5-usb-c-pro-cable-1m" },
      ] },
      { label: "Travel Ready", cards: [
        { kind: "card", badge: "New", label: "Wrist Strap – Burgundy", price: "S$39.00", href: "#/info/wrist-strap-burgundy" },
        { kind: "card", badge: "Free engraving", label: "AirPods Max 2 - Midnight", price: "S$749.00", href: "#/info/airpods-max-2-midnight" },
        { kind: "card", badge: "Free engraving", label: "AirTag", price: "S$45.00", href: "#/info/airtag" },
        { kind: "card", label: "iPhone FineWoven Wallet with MagSafe – Navy", price: "S$89.00", href: "#/info/iphone-finewoven-wallet-with-magsafe-navy" },
        { kind: "card", badge: "New", label: "Crossbody Strap – Crisp Blue", price: "S$89.00", href: "#/info/crossbody-strap-crisp-blue" },
        { kind: "card", badge: "New", label: "AirTag FineWoven Key Ring – Burgundy", price: "S$55.00", href: "#/info/airtag-finewoven-key-ring-burgundy" },
        { kind: "card", badge: "Free engraving", label: "AirPods Pro 3", productId: "airpods-pro-3", href: "#/product/airpods-pro-3" },
        { kind: "card", label: "iPhone Air MagSafe Battery", price: "S$139.00", href: "#/info/iphone-air-magsafe-battery" },
        { kind: "card", badge: "Only at Apple", label: "mophie Magnetic Wireless Charging Car Vent Mount (MagSafe compatible)", price: "S$99.00", href: "#/info/mophie-magnetic-wireless-charging-car-vent-mount-magsafe-compatible" },
        { kind: "card", badge: "Only at Apple", label: "Anker MagGo Power Bank (5K, Slim)", price: "S$79.00", href: "#/info/anker-maggo-power-bank-5k-slim" },
        { kind: "card", badge: "Only at Apple", label: "Twelve South Airfly Pro 2 Deluxe Bluetooth Transmitter", price: "S$99.00", href: "#/info/twelve-south-airfly-pro-2-deluxe-bluetooth-transmitter" },
        { kind: "card", label: "Tech21 EvoClear Case for AirPods 5 – Clear", price: "S$49.95", href: "#/info/tech21-evoclear-case-for-airpods-5-clear" },
        { kind: "card", label: "MOFT Find My MagSafe Wallet Stand", price: "S$69.00", href: "#/info/moft-find-my-magsafe-wallet-stand" },
        { kind: "card", label: "mophie 3-in-1 Wireless Charge Stand", price: "S$209.00", href: "#/info/mophie-3-in-1-wireless-charge-stand" },
      ] },
      { label: "Personal Audio", cards: [
        { kind: "card", badge: "New", label: "AirPods 5 with Wireless Charging Case", price: "S$219.00", href: "#/info/airpods-5-with-wireless-charging-case" },
        { kind: "card", badge: "New", label: "AirPods 5", price: "S$199.00", href: "#/info/airpods-5" },
        { kind: "promo", eyebrow: "AirPods Max 2", headline: "New intelligent features. More immersive listening.", ctaLabel: "Learn more", href: "#/info/new-intelligent-features-more-immersive-listening" },
        { kind: "card", badge: "Free engraving", label: "AirPods Pro 3", productId: "airpods-pro-3", href: "#/product/airpods-pro-3" },
        { kind: "card", label: "Powerbeats Pro 2 – High-Performance Earbuds – Hyper Purple", price: "S$329.00", href: "#/info/powerbeats-pro-2-high-performance-earbuds-hyper-purple" },
        { kind: "promo", headline: "More sound. More possibilities.", ctaLabel: "Learn more", href: "#/info/more-sound-more-possibilities" },
        { kind: "card", label: "Beats Flex – All-Day Wireless Earphones - Yuzu Yellow", price: "S$99.90", href: "#/info/beats-flex-all-day-wireless-earphones-yuzu-yellow" },
        { kind: "card", label: "Beats Pill – Wireless Bluetooth® Speaker – Champagne Gold", price: "S$189.00", href: "#/info/beats-pill-wireless-bluetooth-speaker-champagne-gold" },
        { kind: "card", label: "HomePod - Midnight", price: "S$499.00", href: "#/info/homepod-midnight" },
        { kind: "card", badge: "New", label: "Beats 360 Over‑Ear Headphones – Cloud with Cloud Performance Knit Cushions", price: "S$429.00", href: "#/info/beats-360-over-ear-headphones-cloud-with-cloud-performance-knit-cushions" },
        { kind: "promo", headline: "Apple Music", ctaLabel: "Learn more", href: "#/info/apple-music" },
      ] },
      { label: "For Creators", cards: [
        { kind: "card", label: "ShiftCam SnapStand Max Full Height Mobile Tripod", price: "S$119.00", href: "#/info/shiftcam-snapstand-max-full-height-mobile-tripod" },
        { kind: "card", label: "Lightning to USB 3 Camera Adapter", price: "S$59.00", href: "#/info/lightning-to-usb-3-camera-adapter" },
        { kind: "card", badge: "New", label: "ShiftCam SnapTravel Kit Pro 2 Compact 3‑in‑1 Setup", price: "S$229.00", href: "#/info/shiftcam-snaptravel-kit-pro-2-compact-3-in-1-setup" },
        { kind: "card", label: "USB-C to SD Card Reader", price: "S$55.00", href: "#/info/usb-c-to-sd-card-reader" },
        { kind: "card", label: "Nimble Wally Pro Stretch 30W Wall Charger", price: "S$89.00", href: "#/info/nimble-wally-pro-stretch-30w-wall-charger" },
        { kind: "card", badge: "New", label: "ShiftCam SnapPocket Light 2 Magnetic LED Ring Light", price: "S$59.00", href: "#/info/shiftcam-snappocket-light-2-magnetic-led-ring-light" },
        { kind: "card", badge: "Online only", label: "Insta360 Flow 2 Pro Stabiliser", price: "S$249.00", href: "#/info/insta360-flow-2-pro-stabiliser" },
        { kind: "card", badge: "Only at Apple", label: "Anker MagGo Power Bank (5K, Slim)", price: "S$79.00", href: "#/info/anker-maggo-power-bank-5k-slim" },
      ] },
    ],
  },
  valueProps: {
    headline: "Why Apple is the best place to buy accessories.",
    items: [
      { headline: "Free delivery and pickup.", body: "Get free delivery or pick up at your Apple Store.", linkName: "Learn more", href: "#/info/free-delivery-and-pickup" },
      { headline: "Holiday Returns", body: "Free extended returns between now and 08/01", linkName: "Learn more", href: "#/info/holiday-returns" },
      { headline: "Pay 0% interest for up to 24 months.", body: "With an eligible credit card, you can choose the financing option that works for you.", linkName: "Learn more", href: "#/info/financing" },
      { headline: "Make them yours.", body: "Engrave selected products with your initials or favourite emoji — free. Only at Apple.", linkName: "Learn more", href: "#/info/make-them-yours" },
    ],
  },
  indexNav: {
    headline: "Accessories",
    groups: [
      {
        headline: "Shop by Product",
        links: [
          { label: "All Accessories", href: "#/store/accessories" },
          { label: "iPhone", href: "#/store/iphone/accessories" },
          { label: "iPad", href: "#/store/ipad/accessories" },
          { label: "Mac", href: "#/store/mac/accessories" },
          { label: "Apple Watch", href: "#/store/watch/accessories" },
          { label: "Apple Vision Pro", href: "#/store/vision/accessories" },
          { label: "AirPods", href: "#/store/airpods/accessories" },
          { label: "AirTag", href: "#/info/airtag-accessories" },
          { label: "Beats", href: "#/info/beats-accessories" },
        ],
      },
      {
        headline: "Shop by iPhone Category",
        links: [
          { label: "Gaming", href: "#/info/gaming-iphone-accessories" },
          { label: "Health & Fitness", href: "#/info/health-fitness-iphone-accessories" },
          { label: "Content Creation", href: "#/info/content-creation-iphone-accessories" },
          { label: "MagSafe", href: "#/info/magsafe-iphone-accessories" },
          { label: "Crossbody Straps & Wristlets", href: "#/info/crossbody-straps-wristlets" },
          { label: "Headphones & Speakers", href: "#/info/headphones-speakers-iphone-accessories" },
          { label: "Cases & Protection", href: "#/info/cases-protection-iphone-accessories" },
          { label: "Chargers & Adapters", href: "#/info/chargers-adapters-iphone-accessories" },
        ],
      },
      {
        headline: "Explore More Accessories",
        links: [
          { label: "New Arrivals", href: "#/info/new-arrivals" },
          { label: "New Colours", href: "#/info/new-colours" },
          { label: "College Essentials", href: "#/info/college-essentials" },
        ],
      },
    ],
  },
};

const WATCH_PAGE: AccessoriesCategoryPage = {
  id: "watch",
  h1: "Apple Watch Accessories",
  chapternav: [
    { label: "Apple Watch Straps", ariaLabel: "Apple Watch Straps - Apple Watch Accessories", href: "#/info/apple-watch-straps-apple-watch-accessories" },
    { label: "Chargers& Adapters", ariaLabel: "Chargers& Adapters - Apple Watch Accessories", href: "#/info/chargers-adapters-apple-watch-accessories" },
    { label: "Health& Fitness", ariaLabel: "Health& Fitness - Apple Watch Accessories", href: "#/info/health-fitness-apple-watch-accessories" },
    { label: "Headphones& Speakers", ariaLabel: "Headphones& Speakers - Apple Watch Accessories", href: "#/info/headphones-speakers-apple-watch-accessories" },
  ],
  gallery: {
    headline: "In the spotlight.",
    cards: [
      { theme: "light", headline: "Meet your match.", body: "Style your Apple Watch your way with straps in fresh colours and materials.", cta: { label: "Shop all", href: "#/info/apple-watch-straps-apple-watch-accessories" } },
    ],
  },
  curated: {
    headline: "Find your fit. Right on time.",
    tabs: [
      { label: "Sport Mode", cards: [
        { kind: "card", badge: "New", label: "49mm Dark Umber Trail Loop - M/L - Black Titanium Finish", price: "S$139.00", href: "#/info/49mm-dark-umber-trail-loop-m-l-black-titanium-finish" },
        { kind: "card", badge: "New", label: "42mm Pavement Grey Nike Sport Band - S/M", price: "S$69.00", href: "#/info/42mm-pavement-grey-nike-sport-band-s-m" },
        { kind: "promo", eyebrow: "Apple Watch Straps", headline: "Styles you can run with.", ctaLabel: "Learn more", href: "#/info/styles-you-can-run-with" },
        { kind: "card", badge: "New", label: "46mm Magenta Sport Loop", price: "S$69.00", href: "#/info/46mm-magenta-sport-loop" },
        { kind: "card", badge: "Free engraving", label: "AirPods Pro 3", productId: "airpods-pro-3", href: "#/product/airpods-pro-3" },
        { kind: "card", badge: "New", label: "46mm Burgundy Sport Band - M/L", price: "S$69.00", href: "#/info/46mm-burgundy-sport-band-m-l" },
        { kind: "card", badge: "New", label: "49mm Desert Alpine Loop - Medium - Natural Titanium Finish", price: "S$139.00", href: "#/info/49mm-desert-alpine-loop-medium-natural-titanium-finish" },
        { kind: "promo", headline: "Apple Fitness+", ctaLabel: "Learn more", href: "#/info/apple-fitness" },
        { kind: "card", label: "Powerbeats Pro 2 – High-Performance Earbuds – Electric Orange", price: "S$329.00", href: "#/info/powerbeats-pro-2-high-performance-earbuds-electric-orange" },
        { kind: "card", badge: "Only at Apple", label: "Scosche WatchIt Keychain Apple Watch Magnetic Fast Charger - White", price: "S$49.00", href: "#/info/scosche-watchit-keychain-apple-watch-magnetic-fast-charger-white" },
        { kind: "card", badge: "New", label: "49mm Translucent Grey Ocean Band - Black Titanium Finish", price: "S$139.00", href: "#/info/49mm-translucent-grey-ocean-band-black-titanium-finish" },
        { kind: "card", badge: "New", label: "40mm Chalk Calm Nike Sport Loop", price: "S$69.00", href: "#/info/40mm-chalk-calm-nike-sport-loop" },
        { kind: "promo", headline: "Apple Music", ctaLabel: "Learn more", href: "#/info/apple-music" },
      ] },
      { label: "Classic Style", cards: [
        { kind: "card", badge: "New", label: "46mm Dark Bronze Milanese Loop - S/M", price: "S$139.00", href: "#/info/46mm-dark-bronze-milanese-loop-s-m" },
        { kind: "card", badge: "New", label: "42mm Sage Modern Buckle - Medium", price: "S$279.00", href: "#/info/42mm-sage-modern-buckle-medium" },
        { kind: "card", label: "49mm Black Titanium Milanese Loop - Medium", price: "S$279.00", href: "#/info/49mm-black-titanium-milanese-loop-medium" },
        { kind: "card", badge: "New", label: "42mm Radiant Gold Link Bracelet", price: "S$499.00", href: "#/info/42mm-radiant-gold-link-bracelet" },
        { kind: "card", badge: "Free engraving", label: "AirPods Max 2 - Starlight", price: "S$749.00", href: "#/info/airpods-max-2-starlight" },
        { kind: "promo", eyebrow: "Apple Watch Straps", headline: "Timeless by design.", ctaLabel: "Learn more", href: "#/info/timeless-by-design" },
        { kind: "card", label: "Beats Studio Pro Wireless Headphones – Sandstone", price: "S$379.00", href: "#/info/beats-studio-pro-wireless-headphones-sandstone" },
        { kind: "card", badge: "New", label: "46mm Camel Magnetic Link - S/M", price: "S$139.00", href: "#/info/46mm-camel-magnetic-link-s-m" },
      ] },
      { label: "Power Picks", cards: [
        { kind: "card", label: "mophie 3-in-1 Wireless Charge Stand", price: "S$209.00", href: "#/info/mophie-3-in-1-wireless-charge-stand" },
        { kind: "card", badge: "Only at Apple", label: "Belkin UltraCharge Pro 2-in-1 Convertible Magnetic Charger", price: "S$199.00", href: "#/info/belkin-ultracharge-pro-2-in-1-convertible-magnetic-charger" },
        { kind: "card", label: "Belkin BoostCharge Pro Power Bank 10K with Apple Watch Charger", price: "S$139.00", href: "#/info/belkin-boostcharge-pro-power-bank-10k-with-apple-watch-charger" },
        { kind: "card", label: "20W USB-C Power Adapter", price: "S$29.00", href: "#/info/20w-usb-c-power-adapter" },
        { kind: "card", badge: "New", label: "Apple Watch Magnetic Fast Charger to USB-C Cable (1 m)", price: "S$39.00", href: "#/info/apple-watch-magnetic-fast-charger-to-usb-c-cable-1-m" },
        { kind: "card", label: "35W Dual Port Power Adapter", price: "S$79.00", href: "#/info/35w-dual-port-power-adapter" },
        { kind: "card", badge: "Only at Apple", label: "Belkin UltraCharge Pro 2-in-1 Convertible Magnetic Charger", price: "S$199.00", href: "#/info/belkin-ultracharge-pro-2-in-1-convertible-magnetic-charger" },
        { kind: "card", label: "Belkin BoostCharge Dual Wall Charger (42W)", price: "S$49.95", href: "#/info/belkin-boostcharge-dual-wall-charger-42w" },
        { kind: "card", badge: "Only at Apple", label: "Anker Charger (50W, 2 Port)", price: "S$69.00", href: "#/info/anker-charger-50w-2-port" },
      ] },
    ],
  },
  valueProps: {
    headline: "Why Apple is the best place to buy accessories.",
    items: [
      { headline: "Free delivery and pickup.", body: "Get free delivery or pick up at your Apple Store.", linkName: "Learn more", href: "#/info/free-delivery-and-pickup" },
      { headline: "Holiday Returns", body: "Free extended returns between now and 08/01", linkName: "Learn more", href: "#/info/holiday-returns" },
      { headline: "Pay 0% interest for up to 24 months.", body: "With an eligible credit card, you can choose the financing option that works for you.", linkName: "Learn more", href: "#/info/financing" },
    ],
  },
  indexNav: {
    headline: "Accessories",
    groups: [
      {
        headline: "Shop by Product",
        links: [
          { label: "All Accessories", href: "#/store/accessories" },
          { label: "iPhone", href: "#/store/iphone/accessories" },
          { label: "iPad", href: "#/store/ipad/accessories" },
          { label: "Mac", href: "#/store/mac/accessories" },
          { label: "Apple Watch", href: "#/store/watch/accessories" },
          { label: "Apple Vision Pro", href: "#/store/vision/accessories" },
          { label: "AirPods", href: "#/store/airpods/accessories" },
          { label: "AirTag", href: "#/info/airtag-accessories" },
          { label: "Beats", href: "#/info/beats-accessories" },
        ],
      },
      {
        headline: "Shop by Apple Watch Category",
        links: [
          { label: "Chargers & Adapters", href: "#/info/chargers-adapters-apple-watch-accessories" },
          { label: "Buy Apple Watch Straps", href: "#/info/apple-watch-straps-apple-watch-accessories" },
          { label: "Headphones & Speakers", href: "#/info/headphones-speakers-apple-watch-accessories" },
          { label: "Health & Fitness", href: "#/info/health-fitness-apple-watch-accessories" },
        ],
      },
      {
        headline: "Explore More Accessories",
        links: [
          { label: "New Arrivals", href: "#/info/new-arrivals" },
          { label: "College Essentials", href: "#/info/college-essentials" },
        ],
      },
    ],
  },
};

const VISION_PAGE: AccessoriesCategoryPage = {
  id: "vision",
  h1: "Apple Vision Pro Accessories",
  chapternav: [
    { label: "Apple Vision Pro Essentials", ariaLabel: "Apple Vision Pro Essentials - Apple Vision Pro Accessories", href: "#/info/apple-vision-pro-essentials-apple-vision-pro-accessories" },
    { label: "Cases & Protection", ariaLabel: "Cases & Protection - Apple Vision Pro Accessories", href: "#/info/cases-protection-apple-vision-pro-accessories" },
    { label: "Chargers & Adapters", ariaLabel: "Chargers & Adapters - Apple Vision Pro Accessories", href: "#/info/chargers-adapters-apple-vision-pro-accessories" },
    { label: "Controllers, Keyboards & Trackpads", ariaLabel: "Controllers, Keyboards & Trackpads - Apple Vision Pro Accessories", href: "#/info/controllers-keyboards-trackpads-apple-vision-pro-accessories" },
    { label: "Headphones", ariaLabel: "Headphones - Apple Vision Pro Accessories", href: "#/info/headphones-apple-vision-pro-accessories" },
  ],
  gallery: {
    headline: "In the spotlight.",
    cards: [
      { theme: "light", headline: "Logitech Muse", body: "Enhance the way you work, create and collaborate.", cta: { label: "Shop", href: "#/info/logitech-muse" } },
      { theme: "light", headline: "ZEISS Optical Inserts", body: "Answer a few questions to find which type of optical inserts you may need.", cta: { label: "Get started", href: "#/info/zeiss-optical-inserts" } },
    ],
  },
  curated: {
    headline: "More to explore for Apple Vision Pro.",
    tabs: [
      { label: "Essential Picks", cards: [
        { kind: "promo", eyebrow: "Apple Vision Pro Dual Knit Band", headline: "Designed for comfort and stability.", ctaLabel: "Learn more", href: "#/info/designed-for-comfort-and-stability" },
        { kind: "card", badge: "Only at Apple", label: "Apple Vision Pro Battery", price: "S$299.00", href: "#/info/apple-vision-pro-battery" },
        { kind: "card", label: "ZEISS Optical Inserts", href: "#/info/zeiss-optical-inserts" },
        { kind: "card", badge: "Only at Apple", label: "Belkin Travel Bag for Apple Vision Pro", price: "S$149.00", href: "#/info/belkin-travel-bag-for-apple-vision-pro" },
        { kind: "card", badge: "Only at Apple", label: "Apple Vision Pro Light Seal", href: "#/info/apple-vision-pro-light-seal" },
        { kind: "card", badge: "Only at Apple", label: "Belkin Battery Holder for Apple Vision Pro", price: "S$79.00", href: "#/info/belkin-battery-holder-for-apple-vision-pro" },
        { kind: "card", badge: "Only at Apple", label: "Apple Vision Pro Solo Knit Band — S", price: "S$149.00", href: "#/info/apple-vision-pro-solo-knit-band-s" },
      ] },
      { label: "Work & Play", cards: [
        { kind: "card", badge: "New", label: "AirPods 5", price: "S$199.00", href: "#/info/airpods-5" },
        { kind: "card", badge: "New", label: "Logitech Muse", price: "S$179.00", href: "#/info/logitech-muse" },
        { kind: "card", label: "DualSense™ Wireless Controller", price: "S$119.00", href: "#/info/dualsense-wireless-controller" },
        { kind: "card", label: "Magic Keyboard (USB–C) - US English", price: "S$129.00", href: "#/info/magic-keyboard-usb-c-us-english" },
        { kind: "card", label: "Magic Trackpad (USB‑C) - White Multi‑Touch Surface", price: "S$159.00", href: "#/info/magic-trackpad-usb-c-white-multi-touch-surface" },
        { kind: "card", label: "Magic Mouse (USB‑C) - White Multi-Touch Surface", price: "S$99.00", href: "#/info/magic-mouse-usb-c-white-multi-touch-surface" },
        { kind: "card", badge: "Free engraving", label: "AirPods Pro 3", productId: "airpods-pro-3", href: "#/product/airpods-pro-3" },
        { kind: "card", badge: "Free engraving", label: "AirTag", price: "S$45.00", href: "#/info/airtag" },
        { kind: "card", label: "240W USB-C Charge Cable (2m)", price: "S$39.00", href: "#/info/240w-usb-c-charge-cable-2m" },
      ] },
    ],
  },
  valueProps: {
    headline: "Why Apple is the best place to buy accessories.",
    items: [
      { headline: "Free delivery and pickup.", body: "Get free delivery or pick up at your Apple Store.", linkName: "Learn more", href: "#/info/free-delivery-and-pickup" },
      { headline: "Holiday Returns", body: "Free extended returns between now and 08/01", linkName: "Learn more", href: "#/info/holiday-returns" },
      { headline: "Pay 0% interest for up to 24 months.", body: "With an eligible credit card, you can choose the financing option that works for you.", linkName: "Learn more", href: "#/info/financing" },
    ],
  },
  indexNav: {
    headline: "Accessories",
    groups: [
      {
        headline: "Shop by Product",
        links: [
          { label: "All Accessories", href: "#/store/accessories" },
          { label: "iPhone", href: "#/store/iphone/accessories" },
          { label: "iPad", href: "#/store/ipad/accessories" },
          { label: "Mac", href: "#/store/mac/accessories" },
          { label: "Apple Watch", href: "#/store/watch/accessories" },
          { label: "Apple Vision Pro", href: "#/store/vision/accessories" },
          { label: "AirPods", href: "#/store/airpods/accessories" },
          { label: "AirTag", href: "#/info/airtag-accessories" },
          { label: "Beats", href: "#/info/beats-accessories" },
        ],
      },
      {
        headline: "Shop by Apple Vision Pro Category",
        links: [
          { label: "Apple Vision Pro Essentials", href: "#/info/apple-vision-pro-essentials-apple-vision-pro-accessories" },
          { label: "Controllers, Keyboards & Trackpads", href: "#/info/controllers-keyboards-trackpads-apple-vision-pro-accessories" },
          { label: "Headphones", href: "#/info/headphones-apple-vision-pro-accessories" },
          { label: "Cases & Protection", href: "#/info/cases-protection-apple-vision-pro-accessories" },
          { label: "Chargers & Adapters", href: "#/info/chargers-adapters-apple-vision-pro-accessories" },
        ],
      },
      {
        headline: "Explore More Accessories",
        links: [
          { label: "New Arrivals", href: "#/info/new-arrivals" },
        ],
      },
    ],
  },
};

const AIRPODS_PAGE: AccessoriesCategoryPage = {
  id: "airpods",
  h1: "AirPods & Accessories",
  chapternav: [
    { label: "AirPods", ariaLabel: "AirPods - AirPods & Accessories", href: "#/info/airpods-airpods-accessories" },
    { label: "AirPods Essentials", ariaLabel: "AirPods Essentials - AirPods & Accessories", href: "#/info/airpods-essentials-airpods-accessories" },
    { label: "Chargers& Adapters", ariaLabel: "Chargers& Adapters - AirPods & Accessories", href: "#/info/chargers-adapters-airpods-accessories" },
  ],
  gallery: {
    headline: "In the spotlight.",
    cards: [
      { theme: "dark", headline: "AirPods 5", body: "Discover the magic of Active Noise Cancellation.", cta: { label: "Shop", href: "#/info/airpods-5" } },
    ],
  },
  curated: {
    headline: "Top finds that speak volumes.",
    tabs: [
      { label: "AirPods & Essentials", cards: [
        { kind: "card", badge: "Free engraving", label: "AirPods Max 2 - Blue", price: "S$749.00", href: "#/info/airpods-max-2-blue" },
        { kind: "promo", eyebrow: "Free engraving", headline: "AirPods Pro 3", ctaLabel: "Learn more", href: "#/info/airpods-pro-3" },
        { kind: "card", badge: "New", label: "Wrist Strap – Black", price: "S$39.00", href: "#/info/wrist-strap-black" },
        { kind: "card", badge: "New", label: "AirPods 5", price: "S$199.00", href: "#/info/airpods-5" },
        { kind: "card", badge: "New", label: "AirPods 5 with Wireless Charging Case", price: "S$219.00", href: "#/info/airpods-5-with-wireless-charging-case" },
        { kind: "card", label: "AirPods Max Ear Cushions - Purple", price: "S$95.00", href: "#/info/airpods-max-ear-cushions-purple" },
        { kind: "card", label: "Belkin AirPods Cleaning Kit", price: "S$19.95", href: "#/info/belkin-airpods-cleaning-kit" },
        { kind: "card", label: "AirPods Pro 3 Ear Tips - 2 sets (XXS)", price: "S$15.00", href: "#/info/airpods-pro-3-ear-tips-2-sets-xxs" },
        { kind: "card", label: "Tech21 EvoClear Case for AirPods Pro 3", price: "S$49.00", href: "#/info/tech21-evoclear-case-for-airpods-pro-3" },
        { kind: "promo", headline: "Apple Music", ctaLabel: "Learn more", href: "#/info/apple-music" },
        { kind: "promo", eyebrow: "Compare", headline: "Which AirPods 5 are right for you?", ctaLabel: "Learn more", href: "#/info/which-airpods-5-are-right-for-you" },
      ] },
      { label: "Stay Charged", cards: [
        { kind: "card", badge: "Only at Apple", label: "Scosche WatchIt Keychain Apple Watch Magnetic Fast Charger - White", price: "S$49.00", href: "#/info/scosche-watchit-keychain-apple-watch-magnetic-fast-charger-white" },
        { kind: "card", label: "Nimble Podium 3-in-1 Wireless Charger", price: "S$189.00", href: "#/info/nimble-podium-3-in-1-wireless-charger" },
        { kind: "card", badge: "Only at Apple", label: "Belkin UltraCharge Pro 3-in-1 Magnetic Charging Dock", price: "S$199.00", href: "#/info/belkin-ultracharge-pro-3-in-1-magnetic-charging-dock" },
        { kind: "card", label: "60W USB-C Charge Cable (1m)", price: "S$29.00", href: "#/info/60w-usb-c-charge-cable-1m" },
        { kind: "card", label: "20W USB-C Power Adapter", price: "S$29.00", href: "#/info/20w-usb-c-power-adapter" },
        { kind: "promo", eyebrow: "Wireless charging", headline: "Choose the right wireless charger.", ctaLabel: "Learn more", href: "#/info/choose-the-right-wireless-charger" },
        { kind: "card", badge: "New", label: "Apple Watch Magnetic Fast Charger to USB-C Cable (1 m)", price: "S$39.00", href: "#/info/apple-watch-magnetic-fast-charger-to-usb-c-cable-1-m" },
        { kind: "card", label: "MagSafe Charger (1m)", productId: "magsafe-charger", href: "#/product/magsafe-charger" },
        { kind: "card", label: "Twelve South PowerClip Power Bank & Charger", price: "S$59.00", href: "#/info/twelve-south-powerclip-power-bank-charger" },
        { kind: "card", label: "Belkin BoostCharge Pro Power Bank 10K with Apple Watch Charger", price: "S$139.00", href: "#/info/belkin-boostcharge-pro-power-bank-10k-with-apple-watch-charger" },
        { kind: "card", label: "Twelve South ButterFly SE 2-in-1 USB-C Qi 2.2 Travel Charger", price: "S$119.00", href: "#/info/twelve-south-butterfly-se-2-in-1-usb-c-qi-2-2-travel-charger" },
        { kind: "card", label: "Nimble SharePower Portable Battery Charger", price: "S$109.00", href: "#/info/nimble-sharepower-portable-battery-charger" },
      ] },
    ],
  },
  valueProps: {
    headline: "Why Apple is the best place to buy accessories.",
    items: [
      { headline: "Make them yours.", body: "Engrave selected products with your initials or favourite emoji — free. Only at Apple.", linkName: "Learn more", href: "#/info/make-them-yours" },
      { headline: "Free delivery and pickup.", body: "Get free delivery or pick up at your Apple Store.", linkName: "Learn more", href: "#/info/free-delivery-and-pickup" },
      { headline: "Holiday Returns", body: "Free extended returns between now and 08/01", linkName: "Learn more", href: "#/info/holiday-returns" },
      { headline: "Pay 0% interest for up to 24 months.", body: "With an eligible credit card, you can choose the financing option that works for you.", linkName: "Learn more", href: "#/info/financing" },
    ],
  },
  indexNav: {
    headline: "Accessories",
    groups: [
      {
        headline: "Shop by Product",
        links: [
          { label: "All Accessories", href: "#/store/accessories" },
          { label: "iPhone", href: "#/store/iphone/accessories" },
          { label: "iPad", href: "#/store/ipad/accessories" },
          { label: "Mac", href: "#/store/mac/accessories" },
          { label: "Apple Watch", href: "#/store/watch/accessories" },
          { label: "Apple Vision Pro", href: "#/store/vision/accessories" },
          { label: "AirPods", href: "#/store/airpods/accessories" },
          { label: "AirTag", href: "#/info/airtag-accessories" },
          { label: "Beats", href: "#/info/beats-accessories" },
        ],
      },
      {
        headline: "Shop by AirPods Category",
        links: [
          { label: "AirPods Essentials", href: "#/info/airpods-essentials-airpods-accessories" },
          { label: "Chargers & Adapters", href: "#/info/chargers-adapters-airpods-accessories" },
          { label: "AirPods", href: "#/info/airpods-airpods-accessories" },
        ],
      },
      {
        headline: "Explore More Accessories",
        links: [
          { label: "New Arrivals", href: "#/info/new-arrivals" },
        ],
      },
    ],
  },
};

const HOME_PAGE: AccessoriesCategoryPage = {
  id: "home",
  h1: "Home Accessories",
  chapternav: [
    { label: "Apple TV Essentials", ariaLabel: "Apple TV Essentials - Home Accessories", href: "#/info/apple-tv-essentials-home-accessories" },
    { label: "Headphones& Speakers", ariaLabel: "Headphones& Speakers - Home Accessories", href: "#/info/headphones-speakers-home-accessories" },
    { label: "Home Security", ariaLabel: "Home Security - Home Accessories", href: "#/info/home-security-home-accessories" },
    { label: "Lighting", ariaLabel: "Lighting - Home Accessories", href: "#/info/lighting-home-accessories" },
    { label: "Smart Home Accessories", ariaLabel: "Smart Home Accessories - Home Accessories", href: "#/info/smart-home-accessories-home-accessories" },
    { label: "HomeView Mounts and Cables", ariaLabel: "HomeView Mounts and Cables - Home Accessories", href: "#/info/homeview-mounts-and-cables-home-accessories" },
  ],
  gallery: {
    headline: "In the spotlight.",
    cards: [
      { theme: "light", eyebrow: "New", headline: "HomePod mini 2", body: "HomePod mini 2 delivers surprisingly big 360‑degree sound in a compact design.", cta: { label: "Buy", href: "#/info/homepod-mini-2" } },
      { theme: "light", eyebrow: "New", headline: "Apple TV 4K", body: "The ultimate cinematic experience with immersive sound and stunning picture quality.", cta: { label: "Buy", href: "#/product/apple-tv-4k?buy", productId: "apple-tv-4k" } },
      { theme: "light", headline: "Smart home accessories", body: "A world of smart home accessories you can connect and control from your Apple devices.", cta: { label: "Shop smart home accessories", href: "#/info/smart-home-accessories-home-accessories" } },
    ],
  },
  curated: {
    headline: "Intelligent design comes home",
    tabs: [
      { label: "Home Essentials", cards: [
        { kind: "promo", eyebrow: "Home app", headline: "Manage your smart home.", ctaLabel: "Learn more", href: "#/info/manage-your-smart-home" },
        { kind: "card", label: "HomePod - Midnight", price: "S$499.00", href: "#/info/homepod-midnight" },
        { kind: "card", badge: "New", label: "HomePod mini 2 - Pink", price: "S$199.00", href: "#/info/homepod-mini-2-pink" },
        { kind: "card", badge: "New", label: "Apple TV 4K", productId: "apple-tv-4k", href: "#/product/apple-tv-4k" },
        { kind: "card", label: "Belkin Ultra HD High Speed 4K / 8K HDMI Cable (2m)", price: "S$44.40", href: "#/info/belkin-ultra-hd-high-speed-4k-8k-hdmi-cable-2m" },
        { kind: "promo", eyebrow: "Home Cinema", headline: "Set the scene for a cinematic experience.", ctaLabel: "Learn more", href: "#/info/set-the-scene-for-a-cinematic-experience" },
        { kind: "promo", eyebrow: "Apple TV", headline: "Watch new Apple Originals every month.", ctaLabel: "Learn more", href: "#/info/watch-new-apple-originals-every-month" },
        { kind: "card", label: "DualSense™ Wireless Controller", price: "S$119.00", href: "#/info/dualsense-wireless-controller" },
        { kind: "card", label: "SteelSeries Nimbus Dual-Mode Cloud Controller", price: "S$219.00", href: "#/info/steelseries-nimbus-dual-mode-cloud-controller" },
        { kind: "card", label: "Nanoleaf Essentials Matter Smart Multicolour HD Lightstrip 5 m (16.4 ft)", price: "S$99.00", href: "#/info/nanoleaf-essentials-matter-smart-multicolour-hd-lightstrip-5-m-16-4-ft" },
        { kind: "card", badge: "New", label: "Beats 360 Over‑Ear Headphones – Cloud with Cloud Performance Knit Cushions", price: "S$429.00", href: "#/info/beats-360-over-ear-headphones-cloud-with-cloud-performance-knit-cushions" },
        { kind: "card", label: "Nanoleaf Essentials Matter E27 Smart Bulb - Thread & Matter-Enabled Smart LED Light Bulb - White and Color (3 Pack)", price: "S$79.70", href: "#/info/nanoleaf-essentials-matter-e27-smart-bulb-thread-matter-enabled-smart-led-light-bulb-white-and-color-3-pack" },
      ] },
      { label: "Security", cards: [
        { kind: "card", badge: "Online only", label: "Aqara G100 Indoor Camera", price: "S$59.00", href: "#/info/aqara-g100-indoor-camera" },
        { kind: "card", label: "Aqara Presence Multi-Sensor FP300", price: "S$69.00", href: "#/info/aqara-presence-multi-sensor-fp300" },
      ] },
      { label: "Lighting", cards: [
        { kind: "card", label: "Nanoleaf Essentials Matter E27 Smart Bulb - Thread & Matter-Enabled Smart LED Light Bulb - White and Color (3 Pack)", price: "S$79.70", href: "#/info/nanoleaf-essentials-matter-e27-smart-bulb-thread-matter-enabled-smart-led-light-bulb-white-and-color-3-pack" },
        { kind: "card", label: "Nanoleaf Essentials Matter Smart Multicolour HD Lightstrip 5 m (16.4 ft)", price: "S$99.00", href: "#/info/nanoleaf-essentials-matter-smart-multicolour-hd-lightstrip-5-m-16-4-ft" },
      ] },
    ],
  },
  valueProps: {
    headline: "Why Apple is the best place to buy accessories.",
    items: [
      { headline: "Free delivery and pickup.", body: "Get free delivery or pick up at your Apple Store.", linkName: "Learn more", href: "#/info/free-delivery-and-pickup" },
      { headline: "Holiday Returns", body: "Free extended returns between now and 08/01", linkName: "Learn more", href: "#/info/holiday-returns" },
      { headline: "Pay 0% interest for up to 24 months.", body: "With an eligible credit card, you can choose the financing option that works for you.", linkName: "Learn more", href: "#/info/financing" },
      { headline: "Free Personal Setup.", body: "Get help setting up your new device with free online Personal Setup.", linkName: "Learn more", href: "#/info/personal-setup" },
    ],
  },
  indexNav: {
    headline: "Accessories",
    groups: [
      {
        headline: "Shop by Product",
        links: [
          { label: "All Accessories", href: "#/store/accessories" },
          { label: "iPhone", href: "#/store/iphone/accessories" },
          { label: "iPad", href: "#/store/ipad/accessories" },
          { label: "Mac", href: "#/store/mac/accessories" },
          { label: "Apple Watch", href: "#/store/watch/accessories" },
          { label: "Apple Vision Pro", href: "#/store/vision/accessories" },
          { label: "AirPods", href: "#/store/airpods/accessories" },
          { label: "Home", href: "#/store/home/accessories" },
          { label: "AirTag", href: "#/info/airtag-accessories" },
          { label: "Beats", href: "#/info/beats-accessories" },
        ],
      },
      {
        headline: "Shop by Home Category",
        links: [
          { label: "Lighting", href: "#/info/lighting-home-accessories" },
          { label: "Climate", href: "#/info/climate" },
          { label: "Smart Home Accessories", href: "#/info/smart-home-accessories-home-accessories" },
          { label: "HomeView Mounts and Cables", href: "#/info/homeview-mounts-and-cables-home-accessories" },
          { label: "Home Security", href: "#/info/home-security-home-accessories" },
          { label: "Apple TV Essentials", href: "#/info/apple-tv-essentials-home-accessories" },
          { label: "Headphones & Speakers", href: "#/info/headphones-speakers-home-accessories" },
        ],
      },
      {
        headline: "Explore More Accessories",
        links: [
          { label: "New Arrivals", href: "#/info/new-arrivals" },
          { label: "Home app", href: "#/info/home-app" },
        ],
      },
    ],
  },
};

export const ACCESSORIES_CATEGORY_PAGES: Readonly<Record<(typeof DEVICE_CATEGORY_IDS)[number], AccessoriesCategoryPage>> = {
  mac: MAC_PAGE,
  ipad: IPAD_PAGE,
  iphone: IPHONE_PAGE,
  watch: WATCH_PAGE,
  vision: VISION_PAGE,
  airpods: AIRPODS_PAGE,
  home: HOME_PAGE,
};

/** Every info-routed label across the seven pages — feeds the INFO_TITLES
 * derivation so the sitemap's info routes and these pages' content can never
 * drift apart (labels are the source of truth; hrefs derive through the one
 * slug grammar; the spec pins set-equality with the models' info hrefs — the
 * reference's own label repeats dedupe by slug in INFO_TITLES). */
const INFO_LABELS: readonly string[] = [
  "Cases & Protection - Mac Accessories",
  "Mice & Keyboards - Mac Accessories",
  "Chargers & Adapters - Mac Accessories",
  "Office Accessories - Mac Accessories",
  "Hard Drives & Storage - Mac Accessories",
  "Software - Mac Accessories",
  "Content Creation - Mac Accessories",
  "Gaming - Mac Accessories",
  "Headphones & Speakers - Mac Accessories",
  "AirPods 5",
  "Rains 14” Utility Sleeve for MacBook and iPad",
  "Incase Edge Hardshell Case for 13” MacBook Air",
  "MOFT Carry Sleeve for 14” MacBook Pro",
  "mophie Slim Hardshell Case for 14\" MacBook Pro",
  "Kensington UltraThin Magnetic Privacy Screen Filter for 14” MacBook Pro",
  "Protect your tech.",
  "Tech21 EvoShell Case for 16” MacBook Pro",
  "Herschel Cloudform Sleeve for 14” MacBook",
  "Kensington UltraThin Magnetic Privacy Screen for 13\" MacBook Air",
  "Native Union Active Organizer",
  "Herschel Cloudform Backpack XL for MacBook",
  "Rains Backpack Mini for iPad and MacBook",
  "Make the perfect connection.",
  "USB-C to USB Adapter",
  "240W USB-C Charge Cable (2m)",
  "USB-C Digital AV Multiport Adapter",
  "40W Dynamic Power Adapter with 60W Max",
  "70W Power Adapter",
  "USB-C to MagSafe 3 Cable (2m) - Sky Blue",
  "Thunderbolt 5 (USB‑C) Pro Cable (1m)",
  "USB-C to SD Card Reader",
  "World Travel Adapter Kit",
  "Power Adapter Extension Cable (AC Connector 2)",
  "Beats USB-C to USB-C Woven Cable (3 m / 10 ft) – Power Pink",
  "Magic Keyboard with Touch ID and Numeric Keypad for Mac models with Apple silicon (USB‑C) - US English - Black Keys",
  "Magic Mouse (USB‑C) - Black Multi-Touch Surface",
  "AirPods Max 2 - Midnight",
  "Magic Keyboard with Touch ID for Mac models with Apple silicon (USB–C) - US English",
  "Magic Trackpad (USB‑C) - White Multi‑Touch Surface",
  "Studio Display XDR - Nano-texture glass - Tilt- and height-adjustable stand",
  "Twelve South Curve Stand for MacBook",
  "Microsoft 365 Personal (One-Year Subscription)",
  "Beats 360 Over‑Ear Headphones – Pink with Pink Performance Knit Cushions",
  "LaCie 1TB Rugged USB-C Portable Hard Drive",
  "Satechi Multiport Pro Adapter V2 (with Ethernet)",
  "Tech21 EvoShell for MacBook Neo",
  "Belkin UltraCharge Pro 20K Power Bank with Integrated Cable",
  "Belkin BoostCharge Slim Magnetic Power Bank 5K with Stand",
  "Free delivery and pickup",
  "Holiday Returns",
  "Financing",
  "AirTag Accessories",
  "Beats Accessories",
  "MacBook Neo Essentials",
  "New Arrivals",
  "College Essentials",
  "Apple Pencil - iPad Accessories",
  "Keyboards - iPad Accessories",
  "Cases & Protection - iPad Accessories",
  "Chargers & Adapters - iPad Accessories",
  "Displays & Stands - iPad Accessories",
  "Headphones & Speakers - iPad Accessories",
  "Content Creation - iPad Accessories",
  "Dream it up. Jot it down",
  "From tap to type",
  "Apple Pencil Pro",
  "Apple Pencil (USB-C)",
  "Which Apple Pencil is right for you?",
  "Smart Folio for iPad Pro 11-inch (M5) - Denim",
  "Magic Keyboard for iPad Pro 11‑inch (M5) - US English - White",
  "Styled for success.",
  "Magic Mouse (USB‑C) - White Multi-Touch Surface",
  "Tech21 FlexFolio Case for 13” iPad Pro",
  "Beats 360 Over‑Ear Headphones – Black with Black Performance Knit Cushions",
  "Logitech Combo Touch Keyboard Case for iPad Pro 11-inch (M5)",
  "MOFT Float Folio for 11” iPad Pro",
  "Fresh looks built to last.",
  "Smart Folio for iPad Air 11-inch (M4) - Sage",
  "Magic Keyboard for iPad Air 11‑inch (M4) - US English - Black",
  "mophie Knit Air Folio Case for 11‑inch iPad Air",
  "Logitech Flip Folio Keyboard Case for 11‑inch iPad Air and iPad Pro - International English",
  "Satechi Foldable Aluminium Stand",
  "35W Dual Port Power Adapter",
  "Beats 360 Over‑Ear Headphones – Cloud with Cloud Performance Knit Cushions",
  "Magic Keyboard Folio for iPad (A16) - US English",
  "Tech21 iPad (A16) FlexFolio",
  "Smart Folio for iPad (A16) – Watermelon",
  "Apple Pencil (1st Generation)",
  "Logitech Slim Folio Keyboard for iPad (A16)",
  "60W USB-C Charge Cable (1m)",
  "USB-C to Apple Pencil Adapter",
  "Beats Solo 4 – On-Ear Wireless Headphones – Slate Blue",
  "Smart Folio for iPad mini (A20 Pro) - Navy Blue",
  "Make them yours",
  "Cases & Protection - iPhone Accessories",
  "Chargers & Adapters - iPhone Accessories",
  "MagSafe - iPhone Accessories",
  "Headphones& Speakers - iPhone Accessories",
  "Content Creation - iPhone Accessories",
  "Gaming - iPhone Accessories",
  "Health & Fitness - iPhone Accessories",
  "Made for iPhone Duo",
  "Find your colour story.",
  "iPhone 18 Pro TechWoven Case with MagSafe – Burgundy",
  "iPhone 18 Pro Max Silicone Case with MagSafe - Navy Blue",
  "MOFT Snap Field MagSafe Wallet Stand",
  "iPhone 18 Pro Clear Case with MagSafe",
  "Wrist Strap – Crisp Blue",
  "Crossbody Strap – Burgundy",
  "Crossbody Straps & Wristlets",
  "Snaps on. Stands up.",
  "iPhone Duo Case – Sand",
  "iPhone Duo Folio with Kickstand – Taupe",
  "20W USB-C Power Adapter",
  "Beats USB-C to USB-C Woven Cable (1.5 m / 5 ft) – Nitro Navy",
  "Beats USB‑C to USB‑C Woven Short Cable (20 cm / 8 in.) – Bolt Black",
  "Belkin UltraCharge Pro 3-in-1 Magnetic Charging Dock",
  "mophie 3-in-1 Wireless Charge Stand",
  "iPhone Air MagSafe Battery",
  "Wrist Strap – Burgundy",
  "AirTag",
  "iPhone FineWoven Wallet with MagSafe – Navy",
  "Crossbody Strap – Crisp Blue",
  "AirTag FineWoven Key Ring – Burgundy",
  "mophie Magnetic Wireless Charging Car Vent Mount (MagSafe compatible)",
  "Anker MagGo Power Bank (5K, Slim)",
  "Twelve South Airfly Pro 2 Deluxe Bluetooth Transmitter",
  "Tech21 EvoClear Case for AirPods 5 – Clear",
  "MOFT Find My MagSafe Wallet Stand",
  "AirPods 5 with Wireless Charging Case",
  "New intelligent features. More immersive listening.",
  "Powerbeats Pro 2 – High-Performance Earbuds – Hyper Purple",
  "More sound. More possibilities.",
  "Beats Flex – All-Day Wireless Earphones - Yuzu Yellow",
  "Beats Pill – Wireless Bluetooth® Speaker – Champagne Gold",
  "HomePod - Midnight",
  "Apple Music",
  "ShiftCam SnapStand Max Full Height Mobile Tripod",
  "Lightning to USB 3 Camera Adapter",
  "ShiftCam SnapTravel Kit Pro 2 Compact 3‑in‑1 Setup",
  "Nimble Wally Pro Stretch 30W Wall Charger",
  "ShiftCam SnapPocket Light 2 Magnetic LED Ring Light",
  "Insta360 Flow 2 Pro Stabiliser",
  "New Colours",
  "Apple Watch Straps - Apple Watch Accessories",
  "Chargers& Adapters - Apple Watch Accessories",
  "Health& Fitness - Apple Watch Accessories",
  "Headphones& Speakers - Apple Watch Accessories",
  "49mm Dark Umber Trail Loop - M/L - Black Titanium Finish",
  "42mm Pavement Grey Nike Sport Band - S/M",
  "Styles you can run with.",
  "46mm Magenta Sport Loop",
  "46mm Burgundy Sport Band - M/L",
  "49mm Desert Alpine Loop - Medium - Natural Titanium Finish",
  "Apple Fitness+",
  "Powerbeats Pro 2 – High-Performance Earbuds – Electric Orange",
  "Scosche WatchIt Keychain Apple Watch Magnetic Fast Charger - White",
  "49mm Translucent Grey Ocean Band - Black Titanium Finish",
  "40mm Chalk Calm Nike Sport Loop",
  "46mm Dark Bronze Milanese Loop - S/M",
  "42mm Sage Modern Buckle - Medium",
  "49mm Black Titanium Milanese Loop - Medium",
  "42mm Radiant Gold Link Bracelet",
  "AirPods Max 2 - Starlight",
  "Timeless by design.",
  "Beats Studio Pro Wireless Headphones – Sandstone",
  "46mm Camel Magnetic Link - S/M",
  "Belkin UltraCharge Pro 2-in-1 Convertible Magnetic Charger",
  "Belkin BoostCharge Pro Power Bank 10K with Apple Watch Charger",
  "Apple Watch Magnetic Fast Charger to USB-C Cable (1 m)",
  "Belkin BoostCharge Dual Wall Charger (42W)",
  "Anker Charger (50W, 2 Port)",
  "Apple Vision Pro Essentials - Apple Vision Pro Accessories",
  "Cases & Protection - Apple Vision Pro Accessories",
  "Chargers & Adapters - Apple Vision Pro Accessories",
  "Controllers, Keyboards & Trackpads - Apple Vision Pro Accessories",
  "Headphones - Apple Vision Pro Accessories",
  "Logitech Muse",
  "ZEISS Optical Inserts",
  "Designed for comfort and stability.",
  "Apple Vision Pro Battery",
  "Belkin Travel Bag for Apple Vision Pro",
  "Apple Vision Pro Light Seal",
  "Belkin Battery Holder for Apple Vision Pro",
  "Apple Vision Pro Solo Knit Band — S",
  "DualSense™ Wireless Controller",
  "Magic Keyboard (USB–C) - US English",
  "AirPods - AirPods & Accessories",
  "AirPods Essentials - AirPods & Accessories",
  "Chargers& Adapters - AirPods & Accessories",
  "AirPods Max 2 - Blue",
  "AirPods Pro 3",
  "Wrist Strap – Black",
  "AirPods Max Ear Cushions - Purple",
  "Belkin AirPods Cleaning Kit",
  "AirPods Pro 3 Ear Tips - 2 sets (XXS)",
  "Tech21 EvoClear Case for AirPods Pro 3",
  "Which AirPods 5 are right for you?",
  "Nimble Podium 3-in-1 Wireless Charger",
  "Choose the right wireless charger.",
  "Twelve South PowerClip Power Bank & Charger",
  "Twelve South ButterFly SE 2-in-1 USB-C Qi 2.2 Travel Charger",
  "Nimble SharePower Portable Battery Charger",
  "Apple TV Essentials - Home Accessories",
  "Headphones& Speakers - Home Accessories",
  "Home Security - Home Accessories",
  "Lighting - Home Accessories",
  "Smart Home Accessories - Home Accessories",
  "HomeView Mounts and Cables - Home Accessories",
  "HomePod mini 2",
  "Manage your smart home.",
  "HomePod mini 2 - Pink",
  "Belkin Ultra HD High Speed 4K / 8K HDMI Cable (2m)",
  "Set the scene for a cinematic experience.",
  "Watch new Apple Originals every month.",
  "SteelSeries Nimbus Dual-Mode Cloud Controller",
  "Nanoleaf Essentials Matter Smart Multicolour HD Lightstrip 5 m (16.4 ft)",
  "Nanoleaf Essentials Matter E27 Smart Bulb - Thread & Matter-Enabled Smart LED Light Bulb - White and Color (3 Pack)",
  "Aqara G100 Indoor Camera",
  "Aqara Presence Multi-Sensor FP300",
  "Personal Setup",
  "Climate",
  "Home app",
];

export const ACCESSORIES_CATEGORY_INFO_LABELS: readonly { label: string; href: string }[] = INFO_LABELS.map((label) => ({
  label,
  href: info(label),
}));
