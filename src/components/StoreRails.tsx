import { memo } from "react";
import { getProduct, type Product } from "@/lib/catalog";
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
