import { memo } from "react";
import { CATEGORY_RAILS, type CategoryRail, type CategoryRailCard } from "@/lib/category-rails";
import { getProduct, type CategoryId, type Product } from "@/lib/catalog";
import { RAIL_HEADER_COLOR, STORE_QUICK_LINKS, STORE_RAILS, productPriceLabel, type StoreRail, type StoreRailCard } from "@/lib/store-rails";
import { ProductArt } from "./ProductArt";
import { ChevronRightIcon } from "./Icons";

/** The neutral art surface for rail cards that carry no catalog product —
 * a light wash in the clone's own canvas tones (deviation D1: no reference
 * imagery; the reference's product/accessory photography is replaced). */
const NEUTRAL_SURFACE = "linear-gradient(180deg, #f5f5f7 0%, #e8e8ed 60%, #dcdce1 100%)";

function RailCardArt({ productId }: { productId: string | undefined }) {
  const product: Product | undefined = productId ? getProduct(productId) : undefined;
  return (
    <div className="rail-card-art" aria-hidden="true">
      {product ? (
        <ProductArt id={product.art} />
      ) : (
        <div className="rail-card-art-neutral" style={{ background: NEUTRAL_SURFACE }} />
      )}
    </div>
  );
}

const RailCard = memo(function RailCard({ card }: { card: StoreRailCard }) {
  const product = card.productId ? getProduct(card.productId) : undefined;
  const price = product ? productPriceLabel(product) : card.desc;
  const accessory = card.variant === "accessory";
  const theme = card.theme ?? { bg: "#ffffff", fg: "#1d1d1f" };
  return (
    <li className={`m-0 list-none ${accessory ? "rail-card-accessory" : "rail-card"}`}>
      <a
        href={card.href}
        className={`block h-full no-underline ${accessory ? "rail-card-accessory" : "rail-card"}${
          card.variant === "editorial" ? " rail-card-editorial" : ""
        }`}
        style={card.variant === "editorial" ? { background: theme.bg, color: theme.fg } : undefined}
      >
        {card.variant !== "editorial" && <RailCardArt productId={card.productId} />}
        <div className={`rail-card-info ${card.variant === "editorial" ? "" : "rail-card-info-on-art"}`}>
          {card.eyebrow && <p className="rail-card-eyebrow m-0">{card.eyebrow}</p>}
          <p className={`rail-card-name m-0 ${accessory ? "rail-card-name-accessory" : ""}`}>{card.label}</p>
          {price && <p className="rail-card-desc m-0">{price}</p>}
        </div>
        <span className="rail-card-chevron" aria-hidden="true">
          <ChevronRightIcon />
        </span>
      </a>
    </li>
  );
});

const StoreRailSection = memo(function StoreRailSection({ rail }: { rail: StoreRail }) {
  const headingId = `store-rail-${rail.header.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase()}`;
  return (
    <section aria-labelledby={headingId} className="store-rail">
      <h2 id={headingId} className="store-rail-header m-0">
        <span style={{ color: RAIL_HEADER_COLOR }}>{rail.header}</span>{" "}
        <span className="text-[#6e6e73]">{rail.subhead}</span>
      </h2>
      <ul role="list" className="rail-scroller m-0 p-0">
        {rail.cards.map((card) => (
          <RailCard key={`${rail.header}-${card.label}`} card={card} />
        ))}
      </ul>
    </section>
  );
});

/** The seven measured editorial rails of the reference's store index page —
 * rendered only on the store index (no category); the superset product grid
 * follows below. */
export function StoreRails() {
  return (
    <div className="store-rails">
      {STORE_RAILS.map((rail) => (
        <StoreRailSection key={rail.header} rail={rail} />
      ))}
    </div>
  );
}

/** The reference's measured quick-links strip under the store h1. */
export function StoreQuickLinks() {
  return (
    <nav aria-label="Store quick links" className="store-quick-links">
      <ul role="list" className="m-0 flex list-none flex-wrap items-center gap-x-6 gap-y-2 p-0">
        {STORE_QUICK_LINKS.map((link) => (
          <li key={link.label} className="m-0 list-none">
            <a href={link.href} className="text-[14px] text-[#0066cc] no-underline hover:underline">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------- The category pages' shelf family (session-10; measured off
 * apple.com/sg/shop/buy-*) ---------- */

/** The measured card-geometry class per variant. The "product" family is the
 * "All models." anatomy (name/tag at top, art mid, price + Buy pill at the
 * bottom); the content family reuses the store-rails anatomy at the measured
 * widths/heights. */
const CATEGORY_CARD_CLASS: Readonly<Record<CategoryRailCard["variant"], string>> = {
  product: "rail-card-product",
  "product-wide": "rail-card-product rail-card-product-wide",
  accessory: "rail-card-accessory",
  editorial: "rail-card",
  "editorial-wide": "rail-card-wide",
  "editorial-short": "rail-card-short",
  "editorial-short-wide": "rail-card-short-wide",
};

/** The D12 product card: the measured "All models." anatomy over the clone's
 * catalog product — clone-honest price, and the Buy pill deep-links the
 * working configurator (the reference's Buy is a marketing link; this one
 * opens `#/product/<id>?buy`). The card body is one link (the Tile pattern);
 * the Buy pill is a second link above it. */
const CategoryProductCard = memo(function CategoryProductCard({ card }: { card: CategoryRailCard }) {
  const product = card.productId ? getProduct(card.productId) : undefined;
  if (!product || !card.buyHref) return null; // the seam guarantees both (D12)
  return (
    <li className={`m-0 list-none ${CATEGORY_CARD_CLASS[card.variant]}`}>
      <a
        href={card.href}
        className="rail-card-product-link"
        aria-label={`${card.label}. ${productPriceLabel(product)}.`}
      />
      <div className="rail-card-art" aria-hidden="true">
        <ProductArt id={product.art} />
      </div>
      <div className="rail-card-info">
        {card.eyebrow && <p className="rail-card-eyebrow m-0">{card.eyebrow}</p>}
        <p className="rail-card-name m-0">{card.label}</p>
      </div>
      <div className="rail-card-product-foot">
        <span className="rail-card-price">{productPriceLabel(product)}</span>
        <a href={card.buyHref} className="rail-card-buy" aria-label={`Buy ${card.label}`}>
          Buy
        </a>
      </div>
    </li>
  );
});

/** The content cards: the store-rails anatomy (themed editorial, accessory
 * recomm, measured geometry) — one link, one chevron. A card that names a
 * catalog product (productId set, no Buy pill — the S11-2 D10 rule) derives
 * its price from the catalog at render, exactly like the store-rails cards. */
const CategoryContentCard = memo(function CategoryContentCard({ card }: { card: CategoryRailCard }) {
  const accessory = card.variant === "accessory";
  const theme = card.theme ?? { bg: "#ffffff", fg: "#1d1d1f" };
  const themed = card.theme !== undefined;
  const product = card.productId ? getProduct(card.productId) : undefined;
  const price = product ? productPriceLabel(product) : card.desc;
  return (
    <li className={`m-0 list-none ${CATEGORY_CARD_CLASS[card.variant]}`}>
      <a
        href={card.href}
        className={`block h-full no-underline ${CATEGORY_CARD_CLASS[card.variant]}${themed ? " rail-card-editorial" : ""}`}
        style={themed ? { background: theme.bg, color: theme.fg } : undefined}
      >
        {!themed && <RailCardArt productId={card.productId} />}
        <div className={`rail-card-info ${!themed ? "rail-card-info-on-art" : ""}`}>
          {card.eyebrow && <p className="rail-card-eyebrow m-0">{card.eyebrow}</p>}
          <p className={`rail-card-name m-0 ${accessory ? "rail-card-name-accessory" : ""}`}>{card.label}</p>
          {price && <p className="rail-card-desc m-0">{price}</p>}
        </div>
        <span className="rail-card-chevron" aria-hidden="true">
          <ChevronRightIcon />
        </span>
      </a>
    </li>
  );
});

const CategoryShelfCard = memo(function CategoryShelfCard({ card }: { card: CategoryRailCard }) {
  return card.productId && card.buyHref ? <CategoryProductCard card={card} /> : <CategoryContentCard card={card} />;
});

const headingIdFor = (header: string): string =>
  `category-shelf-${header.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase()}`;

/** One measured category shelf: header + secondary header + the scroller. */
const CategoryShelfSection = memo(function CategoryShelfSection({ shelf }: { shelf: CategoryRail }) {
  const headingId = headingIdFor(shelf.header);
  return (
    <section aria-labelledby={headingId} className="store-rail">
      <h2 id={headingId} className="store-rail-header m-0">
        <span style={{ color: RAIL_HEADER_COLOR }}>{shelf.header}</span>{" "}
        <span className="text-[#6e6e73]">{shelf.subhead}</span>
      </h2>
      <ul role="list" className="rail-scroller m-0 p-0">
        {shelf.cards.map((card, i) => (
          // The key carries the index: the reference ships at least one
          // duplicated card (iPhone experience's CONTINUITY pair) and the
          // measured content is a frozen list — index keys are stable here.
          <CategoryShelfCard key={`${shelf.header}-${i}-${card.label}`} card={card} />
        ))}
      </ul>
    </section>
  );
});

/** A category page's measured shelf sequence (session-10). Categories with
 * no shelves (D13: airpods/accessories) render nothing. */
export function CategoryShelves({ category }: { category: CategoryId }) {
  const shelves = CATEGORY_RAILS[category];
  if (shelves.length === 0) return null;
  return (
    <div className="store-rails">
      {shelves.map((shelf) => (
        <CategoryShelfSection key={shelf.header} shelf={shelf} />
      ))}
    </div>
  );
}
