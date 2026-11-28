/**
 * The six nav-main marketing pages' measured content model — the reference's
 * /sg/{mac,ipad,iphone,watch,apple-vision-pro,home} pages (live capture
 * 2026-11-28, the session-13 D17 surface: the destinations behind the global
 * nav's main links).
 *
 * A page = chapternav chips + a visible h1 + a section sequence: the
 * "Explore the line-up." product gallery (tabbed on mac), the "Why Apple is
 * the best place to shop X." value props, content sections (banner cards /
 * continuity accordions / essentials) and a closing links directory. The
 * vision page is hero-led: statement sections instead of a line-up.
 *
 * Routing follows the clone's established rules:
 *
 * - D10/D12: line-up and hero tiles whose name matches one of this clone's
 *   catalog products (exact or via PRODUCT_ALIASES — the two MacBook Pro
 *   display-size variants) are productId tiles: the measured price is NOT
 *   quoted; the rendered price derives from THIS clone's catalog and the Buy
 *   CTA deep-links the working configurator (?buy).
 * - D11: every other CTA routes to a generated info page, except the special
 *   families: "Accessories" and "X Accessories" route to the per-category
 *   accessories grid (session-12 D16), "Shop X" to the store page, catalog
 *   names to their product pages.
 * - D1: the reference's product photography and video are not reproduced;
 *   the measured text carries the content.
 *
 * Generated from the live captures by the session-13 converter
 * (.scratch/s13/convert.mjs, expired with the sandbox — the scratch area is
 * gitignored). Hand-maintained measured data since session 14: the S14
 * fidelity pass re-measured every patched string against the live reference
 * DOM (the converter's 34/240/260-char caps and <br>-join artifacts fixed;
 * the vision page rebuilt to the measured section structure). Pinned by
 * marketing-pages.test.ts — including the S14-3 text-fidelity guard.
 */
import type { MarketingCategoryId } from "./router";

export interface MarketingChapterChip {
  label: string;
  /** The reference's "New" / "New Colours" chip badge. */
  isNew: boolean;
  href: string;
}

export interface MarketingLineupTile {
  name: string;
  /** The reference's per-tile badge (e.g. "New 14″ with M6"). */
  badge: string | null;
  tagline: string | null;
  /** Measured price — always null on productId tiles (D10: the rendered price
   * derives from this clone's catalog at render). */
  measuredPrice: string | null;
  productId: string | null;
  learnHref: string;
  buyHref: string;
}

export interface MarketingValuePropRow {
  title: string;
  copy: string | null;
  cta: { label: string; href: string } | null;
}

export interface MarketingCard {
  eyebrow: string | null;
  /** Null on the vision page's copy-led Entertainment cards. */
  headline: string | null;
  copy: string | null;
  measuredPrice: string | null;
  productId: string | null;
  ctas: readonly { label: string; href: string }[];
}

export interface MarketingAccordionItem {
  headline: string;
  copy: string | null;
  ctas: readonly { label: string; href: string }[];
}

export type MarketingSection =
  | { kind: "lineup"; heading: string | null; tabs: readonly { chip: string; tiles: readonly MarketingLineupTile[] }[] }
  | { kind: "valueprops"; heading: string | null; headCta: { label: string; href: string } | null; rows: readonly MarketingValuePropRow[] }
  | { kind: "cards"; heading: string | null; tiles: readonly MarketingCard[] }
  | { kind: "accordion"; heading: string | null; items: readonly MarketingAccordionItem[] }
  | { kind: "directory"; heading: string | null; links: readonly { label: string; href: string }[] }
  | { kind: "statement"; heading: string | null; paragraphs: readonly string[]; ctas: readonly { label: string; href: string }[] };

export interface MarketingPage {
  id: MarketingCategoryId;
  /** The document-title base ("Mac" in "Mac - Apple (Singapore)"). */
  title: string;
  h1: string;
  chapternav: readonly MarketingChapterChip[];
  sections: readonly MarketingSection[];
}

const MAC_PAGE: MarketingPage = {
  id: "mac",
  title: "Mac",
  h1: "Mac",
  chapternav: [
    { label: "MacBook Neo", isNew: false, href: "#/info/macbook-neo" },
    { label: "MacBook Air", isNew: false, href: "#/info/macbook-air" },
    { label: "MacBook Pro", isNew: true, href: "#/product/macbook-pro-m6" },
    { label: "iMac", isNew: true, href: "#/info/imac" },
    { label: "Mac mini", isNew: true, href: "#/info/mac-mini" },
    { label: "Mac Studio", isNew: true, href: "#/info/mac-studio" },
    { label: "Compare", isNew: false, href: "#/info/compare" },
    { label: "Displays", isNew: false, href: "#/info/displays" },
    { label: "Accessories", isNew: false, href: "#/store/mac/accessories" },
    { label: "Shop Mac", isNew: false, href: "#/store/mac" },
    { label: "Golden Gate", isNew: false, href: "#/info/golden-gate" },
  ],
  sections: [
    {
      kind: "lineup",
      heading: "Explore the line-up.",
      tabs: [
        { chip: "All products", tiles: [
          {
            name: "MacBook Neo",
            badge: null,
            tagline: "The magic of Mac at a surprising price.",
            measuredPrice: "From S$999",
            productId: null,
            learnHref: "#/info/macbook-neo",
            buyHref: "#/info/macbook-neo",
          },
          {
            name: "MacBook Air 13″ a⁠n⁠d⁠ 1⁠5⁠″",
            badge: null,
            tagline: "Thin. Fast. Powerful and portable.",
            measuredPrice: "From S$1,899",
            productId: null,
            learnHref: "#/info/macbook-air-13-a-n-d-1-5",
            buyHref: "#/info/macbook-air-13-a-n-d-1-5",
          },
          {
            name: "MacBook Pro 14″ a⁠n⁠d⁠ 1⁠6⁠″",
            badge: "New 14″ with M6",
            tagline: "A powerful laptop for every kind of pro.",
            measuredPrice: null,
            productId: "macbook-pro-m6",
            learnHref: "#/product/macbook-pro-m6",
            buyHref: "#/product/macbook-pro-m6?buy",
          },
          {
            name: "MacBook Pro 14” a⁠n⁠d⁠ ⁠1⁠6⁠”",
            badge: "New",
            tagline: "The most advanced MacBook Pro with the world’s best laptop display.",
            measuredPrice: null,
            productId: "macbook-pro-proled",
            learnHref: "#/product/macbook-pro-proled",
            buyHref: "#/product/macbook-pro-proled?buy",
          },
          {
            name: "iMac",
            badge: "New",
            tagline: "An all-in-one desktop for creativity and productivity.",
            measuredPrice: "From S$2,099",
            productId: null,
            learnHref: "#/info/imac",
            buyHref: "#/info/imac",
          },
          {
            name: "Mac mini",
            badge: "New",
            tagline: "The mini-est, most affordable Mac desktop.",
            measuredPrice: "From S$1,299",
            productId: null,
            learnHref: "#/info/mac-mini",
            buyHref: "#/info/mac-mini",
          },
          {
            name: "Mac Studio",
            badge: "New",
            tagline: "Powerful performance and connectivity for pros.",
            measuredPrice: "From S$3,499",
            productId: null,
            learnHref: "#/info/mac-studio",
            buyHref: "#/info/mac-studio",
          },
          {
            name: "Studio Display",
            badge: null,
            tagline: "A 5K Retina display that’s perfect for Mac.",
            measuredPrice: "From S$2,199",
            productId: null,
            learnHref: "#/info/studio-display",
            buyHref: "#/info/studio-display",
          },
          {
            name: "Studio Display XDR",
            badge: null,
            tagline: "The ultimate 5K Retina XDR display for creative and pro workflows.",
            measuredPrice: "From S$4,499",
            productId: null,
            learnHref: "#/info/studio-display-xdr",
            buyHref: "#/info/studio-display-xdr",
          }
        ] },
        { chip: "Laptops", tiles: [
          {
            name: "MacBook Neo",
            badge: null,
            tagline: "The magic of Mac at a surprising price.",
            measuredPrice: "From S$999",
            productId: null,
            learnHref: "#/info/macbook-neo",
            buyHref: "#/info/macbook-neo",
          },
          {
            name: "MacBook Air 13″ a⁠n⁠d⁠ 1⁠5⁠″",
            badge: null,
            tagline: "Thin. Fast. Powerful and portable.",
            measuredPrice: "From S$1,899",
            productId: null,
            learnHref: "#/info/macbook-air-13-a-n-d-1-5",
            buyHref: "#/info/macbook-air-13-a-n-d-1-5",
          },
          {
            name: "MacBook Pro 14″ a⁠n⁠d⁠ 1⁠6⁠″",
            badge: "New 14″ with M6",
            tagline: "A powerful laptop for every kind of pro.",
            measuredPrice: null,
            productId: "macbook-pro-m6",
            learnHref: "#/product/macbook-pro-m6",
            buyHref: "#/product/macbook-pro-m6?buy",
          },
          {
            name: "MacBook Pro 14” a⁠n⁠d⁠ ⁠1⁠6⁠”",
            badge: "New",
            tagline: "The most advanced MacBook Pro with the world’s best laptop display.",
            measuredPrice: null,
            productId: "macbook-pro-proled",
            learnHref: "#/product/macbook-pro-proled",
            buyHref: "#/product/macbook-pro-proled?buy",
          }
        ] },
        { chip: "Desktops", tiles: [
          {
            name: "iMac",
            badge: "New",
            tagline: "An all-in-one desktop for creativity and productivity.",
            measuredPrice: "From S$2,099",
            productId: null,
            learnHref: "#/info/imac",
            buyHref: "#/info/imac",
          },
          {
            name: "Mac mini",
            badge: "New",
            tagline: "The mini-est, most affordable Mac desktop.",
            measuredPrice: "From S$1,299",
            productId: null,
            learnHref: "#/info/mac-mini",
            buyHref: "#/info/mac-mini",
          },
          {
            name: "Mac Studio",
            badge: "New",
            tagline: "Powerful performance and connectivity for pros.",
            measuredPrice: "From S$3,499",
            productId: null,
            learnHref: "#/info/mac-studio",
            buyHref: "#/info/mac-studio",
          }
        ] },
        { chip: "Displays", tiles: [
          {
            name: "Studio Display",
            badge: null,
            tagline: "A 5K Retina display that’s perfect for Mac.",
            measuredPrice: "From S$2,199",
            productId: null,
            learnHref: "#/info/studio-display",
            buyHref: "#/info/studio-display",
          },
          {
            name: "Studio Display XDR",
            badge: null,
            tagline: "The ultimate 5K Retina XDR display for creative and pro workflows.",
            measuredPrice: "From S$4,499",
            productId: null,
            learnHref: "#/info/studio-display-xdr",
            buyHref: "#/info/studio-display-xdr",
          }
        ] },
      ],
    },
    {
      kind: "valueprops",
      heading: "Why Apple is the best place to shop Mac.",
      headCta: { label: "Shop Mac", href: "#/store/mac" },
      rows: [
        { title: "Financing", copy: "Pay 0% interest for up to 24 months.",
          cta: null },
        { title: "Education Pricing", copy: "Save on a new Mac with e⁠d⁠u⁠c⁠a⁠t⁠i⁠o⁠n⁠ ⁠p⁠r⁠i⁠c⁠i⁠n⁠g⁠.*",
          cta: null },
        { title: "Personal Setup", copy: "Meet your new Mac with Personal Setup.",
          cta: null },
        { title: "Customise Your Mac", copy: "Customise your Mac.",
          cta: null },
        { title: "Delivery and Pickup", copy: "Free delivery and pickup.",
          cta: null },
        { title: "Guided Shopping", copy: "Get help finding what’s right for you.",
          cta: null },
        { title: "Apple Store App", copy: "Explore a shopping experience designed a⁠r⁠o⁠u⁠n⁠d⁠ ⁠y⁠o⁠u⁠.",
          cta: null },
      ],
    },
    {
      kind: "cards",
      heading: "Switch to Mac.",
      tiles: [
        {
          eyebrow: null, headline: "Give us the old. Save on the new.",
          copy: "With A⁠p⁠p⁠l⁠e⁠ ⁠T⁠r⁠a⁠d⁠e⁠ ⁠I⁠n⁠, you can get a great value for your current device and apply it towards a new one. If your device isn’t eligible for credit, we’ll recycle it f⁠o⁠r⁠ ⁠f⁠r⁠e⁠e⁠.2", measuredPrice: null,
          productId: null,
          ctas: [{ label: "See what your device is worth", href: "#/info/give-us-the-old-save-on-the-new" }],
        },
        {
          eyebrow: null, headline: "Mac does that.",
          copy: "See how easy it is to move t⁠o⁠ M⁠a⁠c⁠.", measuredPrice: null,
          productId: null,
          ctas: [{ label: "Learn more", href: "#/info/mac-does-that" }],
        }
      ],
    },
    {
      kind: "cards",
      heading: "Mac essentials.",
      tiles: [
        {
          eyebrow: null, headline: "Mac accessories",
          copy: "Explore keyboards, mice and other essentials.", measuredPrice: null,
          productId: null,
          ctas: [{ label: "Shop Mac accessories", href: "#/store/mac/accessories" }],
        },
        {
          eyebrow: null, headline: "Studio Display",
          copy: "The 27-inch 5K Retina display pairs beautifully with Mac.", measuredPrice: null,
          productId: null,
          ctas: [{ label: "Learn more", href: "#/info/studio-display" }],
        }
      ],
    },
    {
      kind: "cards",
      heading: "Unlock the world of Apple.",
      tiles: [
        {
          eyebrow: null, headline: "Mac and iPhone",
          copy: "Answer calls or messages from your iPhone directly on your Mac. See and control what’s on your iPhone from your Mac with iPhone Mirroring and Live Activities. Use Universal Clipboard to copy images, video or text from your iPhone, then paste into another app on your nearby Mac. And thanks to iCloud, you can access your files from either your iPhone or your Mac. And so m⁠u⁠c⁠h⁠ ⁠m⁠o⁠r⁠e⁠.", measuredPrice: null,
          productId: null,
          ctas: [],
        },
        {
          eyebrow: null, headline: "Mac and iPad",
          copy: "Sketch on your iPad and have it appear instantly on your Mac. Or use your iPad as a second display, so you can work on one screen while you reference the other. You can even start something on your iPad — like a presentation or an email — and continue it on your Mac.", measuredPrice: null,
          productId: null,
          ctas: [],
        },
        {
          eyebrow: null, headline: "Mac and Apple Watch",
          copy: "Automatically log in to your Mac when you’re wearing your Apple Watch with Auto Unlock. No password t⁠y⁠p⁠i⁠n⁠g⁠ ⁠r⁠e⁠q⁠u⁠i⁠r⁠e⁠d⁠.", measuredPrice: null,
          productId: null,
          ctas: [],
        }
      ],
    },
    {
      kind: "directory",
      heading: "Mac",
      links: [
        { label: "Explore All Mac", href: "#/info/explore-all-mac" },
        { label: "MacBook Neo", href: "#/info/macbook-neo" },
        { label: "MacBook Air", href: "#/info/macbook-air" },
        { label: "MacBook Pro", href: "#/product/macbook-pro-m6" },
        { label: "iMac", href: "#/info/imac" },
        { label: "Mac mini", href: "#/info/mac-mini" },
        { label: "Mac Studio", href: "#/info/mac-studio" },
        { label: "Displays", href: "#/info/displays" },
        { label: "Compare Mac", href: "#/info/compare-mac" },
        { label: "Switch from PC to Mac", href: "#/info/switch-from-pc-to-mac" },
        { label: "Shop Mac", href: "#/store/mac" },
        { label: "Mac Accessories", href: "#/store/mac/accessories" },
        { label: "Apple Trade In", href: "#/info/apple-trade-in" },
        { label: "Financing", href: "#/info/financing" },
        { label: "Personal Setup", href: "#/info/personal-setup" },
        { label: "Mac Support", href: "#/info/mac-support" },
        { label: "AppleCare", href: "#/info/applecare" },
        { label: "macOS 27", href: "#/info/macos-27" },
        { label: "Apple Intelligence and Siri", href: "#/info/apple-intelligence-and-siri" },
        { label: "Apps by Apple", href: "#/info/apps-by-apple" },
        { label: "Apple Creator Studio", href: "#/info/apple-creator-studio" },
        { label: "Better with iPhone", href: "#/info/better-with-iphone" },
        { label: "iCloud+", href: "#/info/icloud" },
        { label: "Mac for Business", href: "#/info/mac-for-business" },
        { label: "Education", href: "#/info/education" },
        { label: "Apple at Work", href: "#/info/apple-at-work" },
      ],
    }
  ],
};

const IPAD_PAGE: MarketingPage = {
  id: "ipad",
  title: "iPad",
  h1: "iPad",
  chapternav: [
    { label: "iPad Pro", isNew: false, href: "#/info/ipad-pro" },
    { label: "iPad Air", isNew: false, href: "#/info/ipad-air" },
    { label: "iPad", isNew: false, href: "#/product/ipad" },
    { label: "iPad mini", isNew: true, href: "#/info/ipad-mini" },
    { label: "Compare", isNew: false, href: "#/info/compare" },
    { label: "Apple Pencil", isNew: false, href: "#/info/apple-pencil" },
    { label: "Keyboards", isNew: false, href: "#/info/keyboards" },
    { label: "Accessories", isNew: false, href: "#/store/ipad/accessories" },
    { label: "iPadOS 27", isNew: false, href: "#/info/ipados-27" },
    { label: "Shop iPad", isNew: false, href: "#/store/ipad" },
  ],
  sections: [
    {
      kind: "lineup",
      heading: "Explore the line-up.",
      tabs: [
        { chip: "All", tiles: [
          {
            name: "iPad Pro",
            badge: null,
            tagline: "The ultimate iPad experience with the most advanced technology.",
            measuredPrice: "From S$1,799",
            productId: null,
            learnHref: "#/info/ipad-pro",
            buyHref: "#/info/ipad-pro",
          },
          {
            name: "iPad Air",
            badge: null,
            tagline: "Serious performance in a thin and light design.",
            measuredPrice: "From S$1,149",
            productId: null,
            learnHref: "#/info/ipad-air",
            buyHref: "#/info/ipad-air",
          },
          {
            name: "iPad",
            badge: null,
            tagline: "The colourful, all‑screen iPad for the things you do every day.",
            measuredPrice: null,
            productId: "ipad",
            learnHref: "#/product/ipad",
            buyHref: "#/product/ipad?buy",
          },
          {
            name: "iPad mini",
            badge: "New",
            tagline: "The full iPad experience in an ultra‑portable design.",
            measuredPrice: "From S$999",
            productId: null,
            learnHref: "#/info/ipad-mini",
            buyHref: "#/info/ipad-mini",
          }
        ] },
      ],
    },
    {
      kind: "valueprops",
      heading: "Why Apple is the best place to buy iPad.",
      headCta: { label: "Shop iPad", href: "#/store/ipad" },
      rows: [
        { title: "Financing", copy: "Pay 0% interest for up to 24 months.",
          cta: null },
        { title: "Apple Trade In", copy: "Save up to S$1,880 with Apple Trade In.",
          cta: null },
        { title: "Education", copy: "Save on iPad with education pricing.*",
          cta: null },
        { title: "Personal Setup", copy: "Meet your new iPad with Personal Setup.",
          cta: null },
        { title: "Delivery and Pickup", copy: "Free delivery and pickup.",
          cta: null },
        { title: "Engraving", copy: "Personalise your iPad for free.",
          cta: null },
        { title: "Guided Shopping", copy: "Shop one on one with a Specialist online.",
          cta: null },
        { title: "Apple Store App", copy: "Explore a shopping experience designed around you.",
          cta: null },
      ],
    },
    {
      kind: "cards",
      heading: "iPad essentials.",
      tiles: [
        {
          eyebrow: null, headline: "Apple Pencil",
          copy: "Dream it up. Jot it down.", measuredPrice: null,
          productId: null,
          ctas: [{ label: "Learn more", href: "#/info/apple-pencil" }],
        },
        {
          eyebrow: null, headline: "Keyboards for iPad",
          copy: "Type it out. Take it with you.", measuredPrice: null,
          productId: null,
          ctas: [{ label: "Learn more", href: "#/info/keyboards-for-ipad" }],
        }
      ],
    },
    {
      kind: "cards",
      heading: "Significant others.",
      tiles: [
        {
          eyebrow: null, headline: "iPad and iPhone",
          copy: "iPad is perfect for taking the content you capture on iPhone and bringing it to life on an immersive canvas. You can shoot videos and photos on your iPhone and use the large display of your iPad to edit, add animations and more. You can also pick up wherever you left off with Handoff.", measuredPrice: null,
          productId: null,
          ctas: [],
        },
        {
          eyebrow: null, headline: "iPad and Mac",
          copy: "iPad and Mac are designed to work together to form the ultimate creative setup. Sketch on your iPad and have it appear instantly on your Mac with Sidecar. Then use your iPad for drawing or editing with Apple Pencil or as a second display. Extend your workflow to new places, and when you return to your desk, Universal Control allows you to use one mouse or trackpad seamlessly across both devices.", measuredPrice: null,
          productId: null,
          ctas: [],
        },
        {
          eyebrow: null, headline: "iPad and Apple Watch",
          copy: "iPad is a great way to optimise your workouts while tracking your progress on Apple Watch. See personal metrics from Apple Watch integrated on the screen of your iPad in real time. The sensors in Apple Watch combine with advanced algorithms to provide data that keeps you motivated. And see it all come together in the Health app on iPad.", measuredPrice: null,
          productId: null,
          ctas: [],
        }
      ],
    },
    {
      kind: "directory",
      heading: "iPad",
      links: [
        { label: "Explore All iPad", href: "#/info/explore-all-ipad" },
        { label: "iPad Pro", href: "#/info/ipad-pro" },
        { label: "iPad Air", href: "#/info/ipad-air" },
        { label: "iPad", href: "#/product/ipad" },
        { label: "iPad mini", href: "#/info/ipad-mini" },
        { label: "Apple Pencil", href: "#/info/apple-pencil" },
        { label: "Keyboards", href: "#/info/keyboards" },
        { label: "Compare iPad", href: "#/info/compare-ipad" },
        { label: "Shop iPad", href: "#/store/ipad" },
        { label: "iPad Accessories", href: "#/store/ipad/accessories" },
        { label: "Apple Trade In", href: "#/info/apple-trade-in" },
        { label: "Financing", href: "#/info/financing" },
        { label: "Personal Setup", href: "#/info/personal-setup" },
        { label: "iPad Support", href: "#/info/ipad-support" },
        { label: "AppleCare", href: "#/info/applecare" },
        { label: "iPadOS 27", href: "#/info/ipados-27" },
        { label: "Apple Intelligence and Siri", href: "#/info/apple-intelligence-and-siri" },
        { label: "Apps by Apple", href: "#/info/apps-by-apple" },
        { label: "Apple Creator Studio", href: "#/info/apple-creator-studio" },
        { label: "iCloud+", href: "#/info/icloud" },
        { label: "Education", href: "#/info/education" },
        { label: "Apple at Work", href: "#/info/apple-at-work" },
      ],
    }
  ],
};

const IPHONE_PAGE: MarketingPage = {
  id: "iphone",
  title: "iPhone",
  h1: "iPhone",
  chapternav: [
    { label: "iPhone Duo", isNew: true, href: "#/product/iphone-duo" },
    { label: "iPhone 18 Pro", isNew: true, href: "#/product/iphone-18-pro" },
    { label: "iPhone Air", isNew: false, href: "#/info/iphone-air" },
    { label: "iPhone 17", isNew: false, href: "#/info/iphone-17" },
    { label: "iPhone 17e", isNew: false, href: "#/info/iphone-17e" },
    { label: "iPhone 16", isNew: false, href: "#/info/iphone-16" },
    { label: "Compare", isNew: false, href: "#/info/compare" },
    { label: "Accessories", isNew: false, href: "#/store/iphone/accessories" },
    { label: "Shop iPhone", isNew: false, href: "#/store/iphone" },
    { label: "iOS 27", isNew: false, href: "#/info/ios-27" },
  ],
  sections: [
    {
      kind: "cards",
      heading: "iPhone Duo",
      tiles: [
        {
          eyebrow: null, headline: "iPhone Duo",
          copy: "Hello, hello.", measuredPrice: null,
          productId: "iphone-duo",
          ctas: [{ label: "Buy", href: "#/product/iphone-duo?buy" }, { label: "Learn more", href: "#/product/iphone-duo" }],
        },
        {
          eyebrow: null, headline: "iPhone 18 Pro",
          copy: "Pro further.", measuredPrice: null,
          productId: "iphone-18-pro",
          ctas: [{ label: "Buy", href: "#/product/iphone-18-pro?buy" }, { label: "Learn more", href: "#/product/iphone-18-pro" }],
        }
      ],
    },
    {
      kind: "lineup",
      heading: "Explore the line-up.",
      tabs: [
        { chip: "All", tiles: [
          {
            name: "iPhone Duo",
            badge: "New",
            tagline: "The largest display of any iPhone. Foldable. Posable. And durable.",
            measuredPrice: null,
            productId: "iphone-duo",
            learnHref: "#/product/iphone-duo",
            buyHref: "#/product/iphone-duo?buy",
          },
          {
            name: "iPhone 18 Pro",
            badge: "New",
            tagline: "The ultimate performance and camera of any iPhone, with exceptional battery life.",
            measuredPrice: null,
            productId: "iphone-18-pro",
            learnHref: "#/product/iphone-18-pro",
            buyHref: "#/product/iphone-18-pro?buy",
          },
          {
            name: "iPhone Air",
            badge: null,
            tagline: "Incredibly light and thin with pro performance.",
            measuredPrice: "From S$1,749",
            productId: null,
            learnHref: "#/info/iphone-air",
            buyHref: "#/info/iphone-air",
          },
          {
            name: "iPhone 17",
            badge: null,
            tagline: "Powerful, durable and delightful.",
            measuredPrice: "From S$1,449",
            productId: null,
            learnHref: "#/info/iphone-17",
            buyHref: "#/info/iphone-17",
          },
          {
            name: "iPhone 17e",
            badge: null,
            tagline: "Feature stacked. Value packed.",
            measuredPrice: "From S$1,099",
            productId: null,
            learnHref: "#/info/iphone-17e",
            buyHref: "#/info/iphone-17e",
          },
          {
            name: "iPhone 16",
            badge: null,
            tagline: "Amazing performance. Durable design.",
            measuredPrice: "From S$1,249",
            productId: null,
            learnHref: "#/info/iphone-16",
            buyHref: "#/info/iphone-16",
          }
        ] },
      ],
    },
    {
      kind: "valueprops",
      heading: "Why Apple is the best place to buy iPhone.",
      headCta: { label: "Shop iPhone", href: "#/store/iphone" },
      rows: [
        { title: "Apple Trade In", copy: "Save on a new iPhone with a trade‑in.",
          cta: null },
        { title: "Financing", copy: "Pay 0% interest for up to 24 months.",
          cta: null },
        { title: "Personal Setup", copy: "Meet your new iPhone with Personal Setup.",
          cta: null },
        { title: "Delivery and Pickup", copy: "Free delivery and pickup.",
          cta: null },
        { title: "Guided Shopping", copy: "Shop one on one with a Specialist online.",
          cta: null },
        { title: "Apple Store App", copy: "Explore a shopping experience designed around you.",
          cta: null },
      ],
    },
    {
      kind: "valueprops",
      heading: "Why Apple is the best place to buy iPhone.",
      headCta: { label: "Shop iPhone", href: "#/store/iphone" },
      rows: [
        { title: "Apple Trade In", copy: "You can get up to S$515 for your Android smartphone.*",
          cta: null },
        { title: "Financing", copy: "Pay 0% interest for up to 24 months.",
          cta: null },
        { title: "Personal Setup", copy: "Meet your new iPhone with Personal Setup.",
          cta: null },
        { title: "Delivery and Pickup", copy: "Free delivery and pickup.",
          cta: null },
        { title: "Guided Shopping", copy: "Shop one on one with a Specialist online.",
          cta: null },
        { title: "Apple Store App", copy: "Explore a shopping experience designed around you.",
          cta: null },
      ],
    },
    {
      kind: "cards",
      heading: "Upgrade to iPhone.",
      tiles: [
        {
          eyebrow: null, headline: "Discover how easy it is to switch.",
          copy: null, measuredPrice: null,
          productId: null,
          ctas: [{ label: "Learn more", href: "#/info/discover-how-easy-it-is-to-switch" }],
        }
      ],
    },
    {
      kind: "cards",
      heading: "iPhone essentials.",
      tiles: [
        {
          eyebrow: null, headline: "iPhone accessories",
          copy: "Protect and personalise your iPhone with fresh accessories like a MagSafe case, iPhone Duo Folio with Kickstand, MagSafe Charger and more.", measuredPrice: null,
          productId: null,
          ctas: [{ label: "Shop iPhone accessories", href: "#/store/iphone/accessories" }],
        },
        {
          eyebrow: null, headline: "AirTag",
          copy: "Now with a 50% louder speaker and up to a 1.5x greater Precision Finding range,1 it’s easier than ever to keep track of what matters.", measuredPrice: null,
          productId: null,
          ctas: [{ label: "Buy", href: "#/product/airtag-4-pack?buy" }],
        }
      ],
    },
    {
      kind: "accordion",
      heading: "Significant others.",
      items: [
        { headline: "iPhone and Mac", copy: "With iPhone Mirroring, you can view your iPhone screen on your Mac and control it without picking up your phone. Continuity features also let you answer calls or messages directly from your Mac. You can even copy images, video or text from your iPhone and paste it all into a different app on your Mac. And with iCloud, you can access your files from either device.",
          ctas: [] },
        { headline: "iPhone and Apple Watch", copy: "Misplaced your iPhone? The latest Apple Watch models can show you its approximate distance and direction.2 To set up a group photo on your iPhone, join the group and use Apple Watch as a viewfinder to snap the shot. And when you take a call on your Apple Watch, just tap your iPhone to continue the conversation there.",
          ctas: [] },
        { headline: "iPhone and AirPods", copy: "Set up AirPods on iPhone with just a tap. You’ll love Adaptive Audio, which automatically tailors the noise control for you to provide the best listening experience across different environments and interactions throughout the day.",
          ctas: [] },
      ],
    },
    {
      kind: "directory",
      heading: "iPhone",
      links: [
        { label: "Explore All iPhone", href: "#/info/explore-all-iphone" },
        { label: "iPhone Duo", href: "#/product/iphone-duo" },
        { label: "iPhone 18 Pro", href: "#/product/iphone-18-pro" },
        { label: "iPhone Air", href: "#/info/iphone-air" },
        { label: "iPhone 17", href: "#/info/iphone-17" },
        { label: "iPhone 17e", href: "#/info/iphone-17e" },
        { label: "iPhone 16", href: "#/info/iphone-16" },
        { label: "Compare iPhone", href: "#/info/compare-iphone" },
        { label: "Switch from Android", href: "#/info/switch-from-android" },
        { label: "Shop iPhone", href: "#/store/iphone" },
        { label: "iPhone Accessories", href: "#/store/iphone/accessories" },
        { label: "Apple Trade In", href: "#/info/apple-trade-in" },
        { label: "Financing", href: "#/info/financing" },
        { label: "Personal Setup", href: "#/info/personal-setup" },
        { label: "iPhone Support", href: "#/info/iphone-support" },
        { label: "AppleCare", href: "#/info/applecare" },
        { label: "iOS 27", href: "#/info/ios-27" },
        { label: "Apple Intelligence and Siri", href: "#/info/apple-intelligence-and-siri" },
        { label: "Apps by Apple", href: "#/info/apps-by-apple" },
        { label: "iPhone Privacy", href: "#/info/iphone-privacy" },
        { label: "Better with Mac", href: "#/info/better-with-mac" },
        { label: "iCloud+", href: "#/info/icloud" },
        { label: "Wallet, Pay", href: "#/info/wallet-pay" },
        { label: "Apple at Work", href: "#/info/apple-at-work" },
      ],
    }
  ],
};

const WATCH_PAGE: MarketingPage = {
  id: "watch",
  title: "Apple Watch",
  h1: "Apple Watch",
  chapternav: [
    { label: "Apple Watch Series 12", isNew: true, href: "#/product/apple-watch-series-12" },
    { label: "Apple Watch Ultra 4", isNew: true, href: "#/info/apple-watch-ultra-4" },
    { label: "Apple Watch SE 3", isNew: false, href: "#/info/apple-watch-se-3" },
    { label: "Apple Watch Nike", isNew: true, href: "#/info/apple-watch-nike" },
    { label: "Apple Watch Hermès", isNew: true, href: "#/info/apple-watch-herm-s" },
    { label: "Compare", isNew: false, href: "#/info/compare" },
    { label: "Straps", isNew: true, href: "#/info/apple-watch-straps" },
    { label: "Accessories", isNew: false, href: "#/store/watch/accessories" },
    { label: "Apple Fitness+", isNew: false, href: "#/info/apple-fitness" },
    { label: "Shop Watch", isNew: false, href: "#/store/watch" },
    { label: "watchOS 27", isNew: false, href: "#/info/watchos-27" },
  ],
  sections: [
    {
      kind: "lineup",
      heading: "Explore the line-up.",
      tabs: [
        { chip: "All", tiles: [
          {
            name: "Apple Watch Series 12",
            badge: "New",
            tagline: "The ultimate way to watch your health.",
            measuredPrice: null,
            productId: "apple-watch-series-12",
            learnHref: "#/product/apple-watch-series-12",
            buyHref: "#/product/apple-watch-series-12?buy",
          },
          {
            name: "Apple Watch Ultra 4",
            badge: "New",
            tagline: "The ultimate sports and adventure watch.",
            measuredPrice: "From S$1,199",
            productId: null,
            learnHref: "#/info/apple-watch-ultra-4",
            buyHref: "#/info/apple-watch-ultra-4",
          },
          {
            name: "Apple Watch SE 3",
            badge: null,
            tagline: "Essential health features at a great value.",
            measuredPrice: "From S$349",
            productId: null,
            learnHref: "#/info/apple-watch-se-3",
            buyHref: "#/info/apple-watch-se-3",
          }
        ] },
      ],
    },
    {
      kind: "valueprops",
      heading: "Why Apple is the best place to buy Apple Watch.",
      headCta: { label: "Shop Apple Watch", href: "#/store/watch" },
      rows: [
        { title: "Financing", copy: "Pay 0% interest for up to 24 months.",
          cta: null },
        { title: "Apple Trade In", copy: "Save on a new Apple Watch with a trade-in.",
          cta: null },
        { title: "Education", copy: "Save on Apple Watch1 with e⁠d⁠u⁠c⁠a⁠t⁠i⁠o⁠n⁠ ⁠p⁠r⁠i⁠c⁠i⁠n⁠g⁠.*",
          cta: null },
        { title: "Delivery and Pickup", copy: "Fast, free delivery.",
          cta: null },
        { title: "Personal Setup", copy: "Join an online Personal Setup session.",
          cta: null },
        { title: "Guided Shopping", copy: "Shop one on one with a Specialist.",
          cta: null },
        { title: "Apple Store App", copy: "Explore a shopping experience designed around you.",
          cta: null },
      ],
    },
    {
      kind: "cards",
      heading: "Apple Watch essentials.",
      tiles: [
        {
          eyebrow: null, headline: "Make it personal. Make it pop.",
          copy: "Discover new straps in a fresh mix of materials, colours and patterns.", measuredPrice: null,
          productId: null,
          ctas: [{ label: "Shop Apple Watch straps", href: "#/info/shop-apple-watch-straps" }],
        }
      ],
    },
    {
      kind: "cards",
      heading: "Made for each other.",
      tiles: [
        {
          eyebrow: null, headline: "Apple Watch and iPhone",
          copy: "Combining Apple Watch and iPhone opens up a world of features that make each device better. You can do things like create a custom route with Maps on your iPhone, then download it to your watch to use anytime. Or start a workout on your watch and see your metrics automatically appear as a Live Activity on your iPhone.", measuredPrice: null,
          productId: null,
          ctas: [],
        },
        {
          eyebrow: null, headline: "Apple Watch and AirPods",
          copy: "You can do so much with just Apple Watch and AirPods — all without your iPhone. Take calls, stream music and podcasts, hear incoming notifications. Even respond to messages with Siri.", measuredPrice: null,
          productId: null,
          ctas: [],
        },
        {
          eyebrow: null, headline: "Apple Watch and Apple Fitness+",
          copy: "Apple Watch supercharges your Fitness+ experience with real‑time, personalised metrics on screen, like your heart rate, calories burned and Activity rings.3 And you get the freedom of audio‑guided walks, runs and meditations with just your watch and AirPods.", measuredPrice: null,
          productId: null,
          ctas: [],
        }
      ],
    },
    {
      kind: "directory",
      heading: "Apple Watch",
      links: [
        { label: "Explore All Apple Watch", href: "#/info/explore-all-apple-watch" },
        { label: "Apple Watch Series 12", href: "#/product/apple-watch-series-12" },
        { label: "Apple Watch Ultra 4", href: "#/info/apple-watch-ultra-4" },
        { label: "Apple Watch SE 3", href: "#/info/apple-watch-se-3" },
        { label: "Apple Watch Nike", href: "#/info/apple-watch-nike" },
        { label: "Apple Watch Hermès", href: "#/info/apple-watch-herm-s" },
        { label: "Compare Watch", href: "#/info/compare-watch" },
        { label: "Why Apple Watch", href: "#/info/why-apple-watch" },
        { label: "Shop Apple Watch", href: "#/store/watch" },
        { label: "Apple Watch Straps", href: "#/info/apple-watch-straps" },
        { label: "Apple Watch Accessories", href: "#/store/watch/accessories" },
        { label: "Apple Trade In", href: "#/info/apple-trade-in" },
        { label: "Financing", href: "#/info/financing" },
        { label: "Personal Setup", href: "#/info/personal-setup" },
        { label: "Apple Watch Support", href: "#/info/apple-watch-support" },
        { label: "AppleCare", href: "#/info/applecare" },
        { label: "watchOS 27", href: "#/info/watchos-27" },
        { label: "Apple Watch For Your Kids", href: "#/info/apple-watch-for-your-kids" },
        { label: "Apps by Apple", href: "#/info/apps-by-apple" },
        { label: "Apple Fitness+", href: "#/info/apple-fitness" },
        { label: "Education", href: "#/info/education" },
      ],
    }
  ],
};

const VISION_PAGE: MarketingPage = {
  id: "vision",
  title: "Apple Vision Pro",
  h1: "Apple Vision Pro",
  chapternav: [

  ],
  sections: [
    {
      kind: "statement",
      // the reference's section-hero (the D12 pin: Buy deep-links the configurator)
      heading: "New powerful M5 chip and comfortable Dual Knit Band.",
      paragraphs: [
      ],
      ctas: [{ label: "Book a demo", href: "#/info/book-a-demo" }, { label: "Buy", href: "#/product/apple-vision-pro?buy" }],
    },
    {
      kind: "statement",
      // the reference's section-foundation: three display statements, no heading
      heading: null,
      paragraphs: [
        "Apple Vision Pro seamlessly blends digital content with your physical space.",
        "So you can work, watch, relive memories and connect in ways never before possible.",
        "The era of spatial computing is here.",
      ],
      ctas: [],
    },
    {
      kind: "statement",
      // section-design: the video caption pair leads, then the measured drawer copy; the AR quick-look link is the reference's own
      heading: "Take a closer look.",
      paragraphs: [
        "Stream Wolfs on Apple TV with a subscription",
        "PlayStation VR2 Sense controller sold separately.",
        "Apple Vision Pro is the result of decades of high‑performance, mobile and wearable device innovation. Its advanced technology and elegant form deliver an amazing experience every time you put it on.",
        "The new Dual Knit Band combines soft, breathable straps with a counterbalanced design, so you can stay immersed in your favourite spatial experiences longer.",
        "The dual-function Fit Dial lets you easily adjust the band’s upper and lower straps independently for a comfortable, personalised fit.",
        "The Light Seal magnetically attaches to the aluminium alloy frame and gently flexes to conform to your face, delivering a precise fit while blocking out stray light.",
        "Speakers positioned close to your ears deliver rich Spatial Audio that seamlessly blends with real‑world sounds, keeping you aware of your surroundings.",
        "Press the Digital Crown to bring up the Home View, and turn it to control your level of immersion while using Environments.",
        "Apple Vision Pro is powered by an external, aluminium‑encased battery that you can slip into your pocket. It supports up to 2.5 hours of general use and up to 3 hours of video playback.1",
        "ZEISS Optical Inserts can be customised with your vision prescription,2 and they attach to the lenses magnetically for precise viewing and eye tracking.",
        "The optional Solo Knit Band provides cushioning, breathability and stretch.",
      ],
      ctas: [{ label: "Stream Wolfs on Apple TV with a subscription", href: "#/info/stream-wolfs-on-apple-tv-with-a-subscription" }],
    },
    {
      kind: "statement",
      // section-experiences: Entertainment
      heading: "Entertainment",
      paragraphs: [
        "The ultimate theatre. Wherever you are.",
        "Transform any room into your own personal theatre — with more pixels than a 4K TV for each eye. Experience mind‑blowing immersion with Spatial Audio and expand movies, shows and games on a giant screen. Whether you’re on the sofa or a long flight, enjoy stunning content anywhere.",
        "Apple Immersive Video is a 180-degree, 3D 8K recording format captured with Spatial Audio — putting you inside the action and transporting you to places you’ve never been.",
        "Immerse yourself with the Spatial Gallery app — an evolving collection of spatial photos, videos and panoramas curated by Apple. Discover unique perspectives from trailblazing creators, stories from iconic brands and behind-the-scenes moments from Apple Music and Apple TV.",
        "visionOS games offer thrilling ways to play using the space around you. With hand tracking at up to 90Hz, spatial games feel more fluid and responsive than ever. You can also experience selected games, like Pickle Pro, in six degrees of freedom using the PlayStation VR2 Sense controller.3",
        "Enjoy your favourite movies and TV shows from Apple TV and other streaming services. Even watch them with friends using Apple Vision Pro in the same room.4",
        "Apple Vision Pro is fantastic on the move. With Travel Mode, whatever you’re watching will feel smooth — whether on a train, bus, car or at 9,000 metres. And you can seamlessly pair AirPods Pro with Apple Vision Pro so you can focus on what you’re watching.",
      ],
      ctas: [{ label: "Stream Wolfs on Apple TV with a subscription", href: "#/info/stream-wolfs-on-apple-tv-with-a-subscription" }],
    },
    {
      kind: "statement",
      // section-experiences: Productivity
      heading: "Productivity",
      paragraphs: [
        "A workspace with infinite space.",
        "Apple Vision Pro gives you limitless space to do your best work. Bring your Mac workflows into view on a massive screen. Multitask across apps and organise them any way you like. And write, express yourself and get things done effortlessly with Apple Intelligence — all with groundbreaking privacy protections.5",
        "Mac Virtual Display lets you bring your Mac wirelessly into Apple Vision Pro with an expandable, ultra-wide screen and rich stereo sound.6 It’s the equivalent of having two 5K monitors side by side, creating one massive, curved display — everything looks astoundingly sharp and incredibly detailed.",
        "With widgets, you can arrange your favourite information and apps — like Photos, Clock, Music and Calendar — in your space exactly how you want. Customise their frame thickness, colour and depth, and find them just where you left them, every time you put on Apple Vision Pro.",
        "With Apple Intelligence, Writing Tools can proofread your text and rewrite versions until the tone and wording are just right, and summarise selected text with a tap. And Smart Reply in Mail and Messages can quickly draft a response with all the right details — identifying key questions and suggesting relevant answers. Usage limits may apply.",
        "Use Magic Keyboard, Magic Trackpad and other Bluetooth accessories with Apple Vision Pro. Great for things like complex spreadsheets and long emails.",
        "Apple Vision Pro is redefining how businesses run. Collaborate with teams across time zones, build and iterate on prototypes faster and turn complex training into immersive experiences.",
      ],
      ctas: [{ label: "Learn more about Apple Intelligence", href: "#/info/learn-more-about-apple-intelligence" }, { label: "Visit Apple Vision Pro for Enterprise", href: "#/info/visit-apple-vision-pro-for-enterprise" }],
    },
    {
      kind: "statement",
      // section-experiences: Photos and Videos
      heading: "Photos and Videos",
      paragraphs: [
        "Be in the moment. All over again.",
        "With Apple Vision Pro, you can capture magical spatial photos and videos in 3D, then relive those cherished moments all over again. And make your memories come to life by transforming your 2D photos into spatial scenes with just a tap.",
        "Instantly transform 2D photos from your photo library into spatial scenes that feel as if you could lean in and look around — bringing memories to life with natural-looking depth and dimension.",
        "Spatial videos and photos have incredible depth that lets you see into a moment. Expand them to get even closer to your favourite memories.",
        "Apple Intelligence helps you search for photos and videos in the Photos app simply by describing what you’re looking for. And you can revisit your favourite moments by creating a custom memory movie in Photos. Just enter a description, and Apple Intelligence finds the best photos and videos to craft your movie with its own storyline and soundtrack.",
        "With support for native playback of 360-degree, 180-degree and wide field-of-view video captured by action cameras from GoPro, Insta360 and Canon, you can relive and share exciting moments as they were meant to be seen.",
        "The top button makes capturing spatial videos or photos quick and easy. EyeSight signals to those around you that you’re recording or taking photos.",
        "You can also take spatial photos and videos on your iPhone, then relive them on Apple Vision Pro.7",
      ],
      ctas: [],
    },
    {
      kind: "statement",
      // section-experiences: Connection
      heading: "Connection",
      paragraphs: [
        "Share quality time. And space.",
        "Collaborate and connect wherever you are, in more engaging ways than ever. Make a FaceTime call with others and see them in life-sized video tiles. Or use your Persona and feel like co-workers, friends and family are there with you.",
        "With striking realism and expressiveness, your Persona lets others see a dynamic, natural representation of you. You can even work together in the same space using apps like Freeform.",
        "In FaceTime, each participant appears in your space within a tile that you can adjust in scale. Spatial Audio makes the conversation feel more natural by placing each person’s voice in the location of their tile.",
        "With SharePlay, you can stream TV shows, movies and music and play multiplayer games with friends and family, and view photos together during a FaceTime call.",
        "Express yourself visually with Image Playground. Create fun and unique images in seconds based on a description, a concept or even a friend from your Photos library — then share them in Messages or on social media. And create a Genmoji simply by typing a description in the emoji keyboard to match any conversation. All powered by Apple Intelligence. Usage limits may apply.",
      ],
      ctas: [],
    },
    {
      kind: "statement",
      // section-experiences: Apps
      heading: "Apps",
      paragraphs: [
        "Do what you love. Reimagine how you do it.",
        "Featured apps: Visage Ease VP.** For informational purposes only. Not for diagnostic use.",
        "Apple Vision Pro expands the experience of your go‑to apps, making everything from browsing in Safari to chatting in Messages feel more magical. And on the App Store, you’ll discover an ever-growing collection of awe-inspiring spatial apps designed for Apple Vision Pro.",
        "Apple Vision Pro has the familiar apps you know and love — transformed to live in your space. Like Safari, Photos, Music and Messages. And with iCloud, your content is automatically synced with your iPhone, iPad and Mac.",
        "The App Store for Apple Vision Pro features groundbreaking apps built for visionOS with powerful spatial experiences, as well as compatible iPad and iPhone apps. Movies, games, sport, fashion, business — it’s all here.",
        "Apps can expand fully into your space, like during a Mindfulness session, where you can create a private moment of calm.",
      ],
      ctas: [{ label: "Visit the App Store", href: "#/info/visit-the-app-store" }, { label: "Explore apps for Apple Vision Pro", href: "#/info/explore-apps-for-apple-vision-pro" }],
    },
    {
      kind: "statement",
      // section-visionos
      heading: "visionOS",
      paragraphs: [
        "An operating system designed for spatial computing.",
        "Built on the foundation of macOS, iOS and iPadOS, visionOS enables powerful spatial experiences that you navigate naturally using your eyes, hands and voice. And with the latest visionOS, you’ll discover even more magical ways to watch, work, create and connect colleagues, friends and family using Apple Vision Pro.",
        "In visionOS, apps fill the space around you, beyond the boundaries of a display. They move anywhere, scale to the perfect size, react to the lighting in your room and even cast shadows.",
        "Environments magically transform your surroundings with stunning 360-degree landscapes — like Yosemite, Bora Bora and Jupiter — letting apps grow beyond the dimensions of your room and creating the perfect place to focus.",
        "EyeSight lets those nearby know when you’re using apps or fully immersed in an experience. When someone approaches, Apple Vision Pro simultaneously lets you see the person and reveals your eyes to them.",
        "Guest User makes it easy to give others access to your Apple Vision Pro, choose which apps they can see and guide them from your iPhone or iPad with View Mirroring. You can also save your most recent guest’s eye and hand data, so they can skip their next setup and dive back in.",
        "Navigate visionOS just by looking at apps, buttons and text fields — and scroll through Safari web pages and other apps using only your eyes.",
        "Tap your fingers together to make a selection and gently flick to scroll. Apple Vision Pro is designed to understand hand gestures from comfortable positions, like when your hands are resting in your lap or on the sofa.",
        "Simply look at the microphone button in a search field and start speaking to dictate text.",
        "Use Siri to quickly open or close apps, play media and more.",
      ],
      ctas: [{ label: "Learn more about visionOS", href: "#/info/learn-more-about-visionos" }],
    },
    {
      kind: "statement",
      // section-technology
      heading: "Technology",
      paragraphs: [
        "Innovation you can see, hear and feel.",
        "Pushing boundaries from the inside out.",
        "More pixels than a 4K TV. For each eye.",
        "The custom micro‑OLED display system features 23 million pixels, delivering stunning resolution and colours. And a specially designed three‑element lens creates the feeling of a display that’s everywhere you look.",
        "Our most advanced Spatial Audio system ever.",
        "Dual-driver audio pods positioned next to each ear deliver personalised sound while letting you hear what’s around you. Spatial Audio makes sounds feel like they’re coming from your surroundings. Audio ray tracing analyses your room’s acoustic properties to adapt and match sound to your space. And if you want to use headphones with Apple Vision Pro, AirPods Pro 3 and AirPods 4 offer the perfect experience — featuring Lossless Audio with ultra-low latency, supported by the H2‑to‑H2 connection across devices.",
        "Responsive, precision eye tracking.",
        "A high‑performance eye-tracking system of LEDs and infrared cameras projects invisible light patterns onto each eye. This advanced system provides ultra-precise input, so you can accurately select elements just by looking at them.",
        "A sophisticated sensor array.",
        "A pair of high-resolution cameras transmit over 1 billion pixels per second to the displays so you can see the world around you clearly. The system also helps deliver precise head and hand tracking and real‑time 3D mapping, all while understanding your hand gestures from a wide range of positions.",
        "Revolutionary dual‑chip performance. Now powered by M5.",
        "Apple Vision Pro makes a giant leap in chip performance with the new M5. It simultaneously runs visionOS, executes advanced computer vision algorithms and delivers stunning graphics. And the R1 chip is specifically dedicated to process input from the cameras, sensors and microphones, streaming images to the displays within 12 milliseconds — for a virtually lag‑free, real‑time view of the world. With the extra power and efficiency provided by M5, Apple Vision Pro delivers even more incredible spatial experiences.",
        "Enables up to 120Hz refresh rates",
        "Renders 10% more pixels8",
        "Delivers up to 3 hours video playback1",
        "The M5 chip supercharges Apple Vision Pro to deliver the best spatial experiences yet — including faster load times for apps and widgets, more responsive web browsing, sharper details across text and visuals8 and up to 2x faster AI workloads.9",
        "A specially designed thermal system gently moves air through Apple Vision Pro, so it can deliver phenomenal performance while remaining cool and quiet.",
        "Infrared flood illuminators work with the external sensors to enhance hand‑tracking performance in low‑light conditions.",
      ],
      ctas: [],
    },
    {
      kind: "statement",
      // section-values
      heading: "Values",
      paragraphs: [
        "Designed to make a difference.",
        "Our values lead the way.",
        "Use Optic ID to authorise purchases and unlock passwords with the uniqueness of your iris. Optic ID data is private and encrypted, and it never leaves your device. It’s accessible only to the Secure Enclave processor.",
        "Data from cameras and sensors is processed at the system level, so individual apps don’t need to see your surroundings to enable spatial experiences.",
        "Eye input is not shared with Apple, third-party apps or websites. Only your final selections are transmitted when you tap your fingers together.",
        "Inclusive by design, Apple Vision Pro comes with built-in features like Smart Colour Invert, Reduce Transparency Support, Cochlear Implant Support, Live Captions10 and Live Recognition, which can describe surroundings, find objects and read documents in real time.",
        "Apple Vision Pro contains 100 per cent recycled aluminium in the frame and battery enclosure.",
      ],
      ctas: [{ label: "Apple and the environment", href: "#/info/apple-and-the-environment" }],
    },
    {
      kind: "statement",
      // section-routers: the accessories router
      heading: "Explore Apple Vision Pro accessories.",
      paragraphs: [
      ],
      ctas: [{ label: "Shop", href: "#/store/vision/accessories" }],
    },
    {
      kind: "statement",
      // section-routers: the developer router
      heading: "An exciting new platform. A world of new opportunities for developers.",
      paragraphs: [
        "The opportunities for what developers can dream up and build for Apple Vision Pro are endless. And with familiar tools and frameworks like Xcode, SwiftUI, RealityKit and ARKit, as well as support for Unity and the 3D-content preparation app Reality Composer Pro, developers have everything they need to create amazing spatial experiences.",
      ],
      ctas: [{ label: "Learn more about developing for visionOS", href: "#/info/learn-more-about-developing-for-visionos" }],
    },
  ],
};

const HOME_PAGE: MarketingPage = {
  id: "home",
  title: "Home",
  h1: "Home",
  chapternav: [

  ],
  sections: [
    {
      kind: "lineup",
      heading: "Explore the lineup.",
      tabs: [
        { chip: "All", tiles: [
          {
            name: "Apple HomeView",
            badge: "New",
            tagline: "Keep the whole home connected, entertained, and in the know.",
            measuredPrice: null,
            productId: "apple-homeview",
            learnHref: "#/product/apple-homeview",
            buyHref: "#/product/apple-homeview?buy",
          },
          {
            name: "Apple TV 4K",
            badge: "New",
            tagline: "The ultimate cinematic experience.",
            measuredPrice: null,
            productId: "apple-tv-4k",
            learnHref: "#/product/apple-tv-4k",
            buyHref: "#/product/apple-tv-4k?buy",
          },
          {
            name: "HomePod mini 2",
            badge: "New",
            tagline: "Room-filling sound in a compact design.",
            measuredPrice: "S$199",
            productId: null,
            learnHref: "#/info/homepod-mini-2",
            buyHref: "#/info/homepod-mini-2",
          },
          {
            name: "HomePod",
            badge: null,
            tagline: "Immersive, high-fidelity audio. Profound sound.",
            measuredPrice: "S$499",
            productId: null,
            learnHref: "#/info/homepod",
            buyHref: "#/info/homepod",
          }
        ] },
      ],
    },
    {
      kind: "valueprops",
      heading: "Why Apple is the best place to shop Apple Home.",
      headCta: { label: "Shop Apple Home", href: "#/store/home" },
      rows: [
        { title: "Guided Shopping", copy: "Shop live with a Specialist.",
          cta: null },
        { title: "Personal Setup", copy: "Get your new Apple HomeView set up with help from a Specialist.",
          cta: null },
        { title: "Delivery and Pickup", copy: "Free delivery and pickup.",
          cta: null },
        { title: "Apple Store App", copy: "Explore a shopping experience designed around you.",
          cta: null },
      ],
    },
    {
      kind: "statement",
      heading: "Get to know Apple Home.",
      paragraphs: [
        "Get to know Apple Home.",
        "Delightful and connected",
        "Products built to elevate your living space.",
        "Delightful and connected",
        "Apple Home devices connect seamlessly and work better together. HomePod, HomePod mini 2, Apple TV 4K, and Apple HomeView all bring you integrated entertainment and effortless smart home assistance.",
        "Personal assistance",
        "Siri AI. More personal. More powerful.1",
        "Personal assistance",
        "Truly helpful AI that’s centered around you and your needs, grounded in your context, and private at every step. Siri AI is rolling out in English. Usage limits may apply.",
        "Effortless entertainment",
        "Everything you love to hear and see. In exceptional quality.",
        "Effortless entertainment",
        "Setting up your home theater is easy with Apple Home devices. HomePod mini 2 and HomePod deliver high-fidelity sound, taking your audio from big to bigger. And Apple TV 4K (4th generation) provides stunning picture with a stunningly simple set up. As a connected system, they deliver a truly cinematic audio and visual experience. And it’s easier than ever to discover relevant entertainment from the world of Apple services — just ask Siri.",
        "Keep in touch",
        "Stay connected with friends and family, wherever they are.",
        "Keep in touch",
        "Apple HomeView brings crystal-clear audio and video to your FaceTime calls. Quickly respond to Messages on HomePod and HomeView with just your voice — and use Intercom to communicate with people through Apple devices in other parts of the house. Quality time has never looked or sounded so good.",
        "Seamless smart home",
        "Simple control. Peace of mind.",
        "Seamless smart home",
        "It’s easy to control your smart home accessories using an Apple Home device as a hub. The accessories integrate with the Home app on your Apple devices. So you can manage and check in on your home, wherever you are.",
        "Privacy",
        "The privacy every home and everyone deserves.",
        "Privacy",
        "Apple Home devices come with privacy protections built in at every step and are designed to keep everyone’s personal information secure.",
      ],
      ctas: [],
    },
    {
      kind: "cards",
      heading: "Home accessories.",
      tiles: [
        {
          eyebrow: null, headline: null,
          copy: "Get peace of mind with smart home accessories for monitoring and access.", measuredPrice: null,
          productId: null,
          ctas: [{ label: "Shop Cameras, Locks, and Sensors", href: "#/info/shop-cameras-locks-and-sensors" }],
        },
        {
          eyebrow: null, headline: null,
          copy: "Discover a range of smart bulbs, switches, timers, and more. Simply brilliant.", measuredPrice: null,
          productId: null,
          ctas: [{ label: "Shop Lighting", href: "#/info/shop-lighting" }],
        }
      ],
    },
    {
      kind: "directory",
      heading: "Home",
      links: [
        { label: "Explore Home", href: "#/info/explore-home" },
        { label: "Apple HomeView", href: "#/product/apple-homeview" },
        { label: "Apple TV 4K", href: "#/product/apple-tv-4k" },
        { label: "HomePod", href: "#/info/homepod" },
        { label: "HomePod mini 2", href: "#/info/homepod-mini-2" },
        { label: "Shop Home", href: "#/store/home" },
        { label: "Shop Home Accessories", href: "#/store/home/accessories" },
        { label: "Personal Setup", href: "#/info/personal-setup" },
        { label: "Home Support", href: "#/info/home-support" },
        { label: "AppleCare for Apple TV", href: "#/info/applecare-for-apple-tv" },
        { label: "AppleCare for HomePod", href: "#/info/applecare-for-homepod" },
        { label: "Apple TV app", href: "#/info/apple-tv-app" },
        { label: "Apple TV", href: "#/info/apple-tv" },
        { label: "Home app", href: "#/info/home-app" },
        { label: "Apple Music", href: "#/info/apple-music" },
        { label: "AirPlay", href: "#/info/airplay" },
      ],
    }
  ],
};

export const MARKETING_PAGES: Readonly<Record<MarketingCategoryId, MarketingPage>> = {
  mac: MAC_PAGE,
  ipad: IPAD_PAGE,
  iphone: IPHONE_PAGE,
  watch: WATCH_PAGE,
  vision: VISION_PAGE,
  home: HOME_PAGE,
};

/** Every informational destination this seam routes to — joins the
 * INFO_TITLES derivation (site-content.ts) so the sitemap and the info pages
 * can never drift apart. Source of truth: every info(label) call the
 * converter made (the sibling seams' shape: label + the built href). */
export const MARKETING_INFO_LABELS: readonly { label: string; href: string }[] = [
  { label: "AirPlay", href: "#/info/airplay" },
  { label: "Apple and the environment", href: "#/info/apple-and-the-environment" },
  { label: "Apple at Work", href: "#/info/apple-at-work" },
  { label: "Apple Creator Studio", href: "#/info/apple-creator-studio" },
  { label: "Apple Fitness+", href: "#/info/apple-fitness" },
  { label: "Apple Intelligence and Siri", href: "#/info/apple-intelligence-and-siri" },
  { label: "Apple Music", href: "#/info/apple-music" },
  { label: "Apple Pencil", href: "#/info/apple-pencil" },
  { label: "Apple Trade In", href: "#/info/apple-trade-in" },
  { label: "Apple TV", href: "#/info/apple-tv" },
  { label: "Apple TV app", href: "#/info/apple-tv-app" },
  { label: "Apple Watch For Your Kids", href: "#/info/apple-watch-for-your-kids" },
  { label: "Apple Watch Hermès", href: "#/info/apple-watch-herm-s" },
  { label: "Apple Watch Nike", href: "#/info/apple-watch-nike" },
  { label: "Apple Watch SE 3", href: "#/info/apple-watch-se-3" },
  { label: "Apple Watch Straps", href: "#/info/apple-watch-straps" },
  { label: "Apple Watch Support", href: "#/info/apple-watch-support" },
  { label: "Apple Watch Ultra 4", href: "#/info/apple-watch-ultra-4" },
  { label: "AppleCare", href: "#/info/applecare" },
  { label: "AppleCare for Apple TV", href: "#/info/applecare-for-apple-tv" },
  { label: "AppleCare for HomePod", href: "#/info/applecare-for-homepod" },
  { label: "Apps by Apple", href: "#/info/apps-by-apple" },
  { label: "Better with iPhone", href: "#/info/better-with-iphone" },
  { label: "Better with Mac", href: "#/info/better-with-mac" },
  { label: "Book a demo", href: "#/info/book-a-demo" },
  { label: "Compare", href: "#/info/compare" },
  { label: "Compare iPad", href: "#/info/compare-ipad" },
  { label: "Compare iPhone", href: "#/info/compare-iphone" },
  { label: "Compare Mac", href: "#/info/compare-mac" },
  { label: "Compare Watch", href: "#/info/compare-watch" },
  { label: "Discover how easy it is to switch.", href: "#/info/discover-how-easy-it-is-to-switch" },
  { label: "Displays", href: "#/info/displays" },
  { label: "Education", href: "#/info/education" },
  { label: "Explore All Apple Watch", href: "#/info/explore-all-apple-watch" },
  { label: "Explore All iPad", href: "#/info/explore-all-ipad" },
  { label: "Explore All iPhone", href: "#/info/explore-all-iphone" },
  { label: "Explore All Mac", href: "#/info/explore-all-mac" },
  { label: "Explore apps for Apple Vision Pro", href: "#/info/explore-apps-for-apple-vision-pro" },
  { label: "Explore Home", href: "#/info/explore-home" },
  { label: "Financing", href: "#/info/financing" },
  { label: "Give us the old. Save on the new.", href: "#/info/give-us-the-old-save-on-the-new" },
  { label: "Golden Gate", href: "#/info/golden-gate" },
  { label: "Home app", href: "#/info/home-app" },
  { label: "Home Support", href: "#/info/home-support" },
  { label: "HomePod", href: "#/info/homepod" },
  { label: "HomePod mini 2", href: "#/info/homepod-mini-2" },
  { label: "iCloud+", href: "#/info/icloud" },
  { label: "iMac", href: "#/info/imac" },
  { label: "iOS 27", href: "#/info/ios-27" },
  { label: "iPad Air", href: "#/info/ipad-air" },
  { label: "iPad mini", href: "#/info/ipad-mini" },
  { label: "iPad Pro", href: "#/info/ipad-pro" },
  { label: "iPad Support", href: "#/info/ipad-support" },
  { label: "iPadOS 27", href: "#/info/ipados-27" },
  { label: "iPhone 16", href: "#/info/iphone-16" },
  { label: "iPhone 17", href: "#/info/iphone-17" },
  { label: "iPhone 17e", href: "#/info/iphone-17e" },
  { label: "iPhone Air", href: "#/info/iphone-air" },
  { label: "iPhone Privacy", href: "#/info/iphone-privacy" },
  { label: "iPhone Support", href: "#/info/iphone-support" },
  { label: "Keyboards", href: "#/info/keyboards" },
  { label: "Keyboards for iPad", href: "#/info/keyboards-for-ipad" },
  { label: "Learn more about Apple Intelligence", href: "#/info/learn-more-about-apple-intelligence" },
  { label: "Learn more about developing for visionOS", href: "#/info/learn-more-about-developing-for-visionos" },
  { label: "Learn more about visionOS", href: "#/info/learn-more-about-visionos" },
  { label: "Mac does that.", href: "#/info/mac-does-that" },
  { label: "Mac for Business", href: "#/info/mac-for-business" },
  { label: "Mac mini", href: "#/info/mac-mini" },
  { label: "Mac Studio", href: "#/info/mac-studio" },
  { label: "Mac Support", href: "#/info/mac-support" },
  { label: "MacBook Air", href: "#/info/macbook-air" },
  { label: "MacBook Air 13″ a⁠n⁠d⁠ 1⁠5⁠″", href: "#/info/macbook-air-13-a-n-d-1-5" },
  { label: "MacBook Neo", href: "#/info/macbook-neo" },
  { label: "macOS 27", href: "#/info/macos-27" },
  { label: "Personal Setup", href: "#/info/personal-setup" },
  { label: "Shop Apple Watch straps", href: "#/info/shop-apple-watch-straps" },
  { label: "Shop Cameras, Locks, and Sensors", href: "#/info/shop-cameras-locks-and-sensors" },
  { label: "Shop Lighting", href: "#/info/shop-lighting" },
  { label: "Stream Wolfs on Apple TV with a subscription", href: "#/info/stream-wolfs-on-apple-tv-with-a-subscription" },
  { label: "Studio Display", href: "#/info/studio-display" },
  { label: "Studio Display XDR", href: "#/info/studio-display-xdr" },
  { label: "Switch from Android", href: "#/info/switch-from-android" },
  { label: "Switch from PC to Mac", href: "#/info/switch-from-pc-to-mac" },
  { label: "Visit Apple Vision Pro for Enterprise", href: "#/info/visit-apple-vision-pro-for-enterprise" },
  { label: "Visit the App Store", href: "#/info/visit-the-app-store" },
  { label: "Wallet, Pay", href: "#/info/wallet-pay" },
  { label: "watchOS 27", href: "#/info/watchos-27" },
  { label: "Why Apple Watch", href: "#/info/why-apple-watch" },
];
