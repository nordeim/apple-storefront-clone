import { memo, useState } from "react";
import { getProduct } from "@/lib/catalog";
import { productPriceLabel } from "@/lib/store-rails";
import {
  ACCESSORIES_CHAPTERNAV,
  ACCESSORIES_CURATED,
  ACCESSORIES_GALLERY,
  ACCESSORIES_INDEX_NAV,
  ACCESSORIES_VALUE_PROPS,
  type AccessoriesCuratedItem,
  type AccessoriesCuratedTab,
  type AccessoriesGalleryCard,
  type AccessoriesIndexGroup,
  type AccessoriesValueProp,
} from "@/lib/accessories-page";
import type { AccessoriesCategoryPage } from "@/lib/accessories-category-pages";

/** The Accessories filtered-grid page's section family (session-11; measured
 * off apple.com/sg/shop/accessories/all). The page renders above the clone's
 * superset store block — the measured parity surface on top, the working
 * store below. Session-12 parameterizes the five sections by an optional
 * model prop (the all-page constants as defaults — the pinned all-page
 * rendering is byte-identical) so the seven per-category pages
 * (#/store/{cat}/accessories, D16) render the same family from their own
 * measured models. */

/** The reference's chapter nav: product chips ("iPhone - Accessories"
 * accessible names), a horizontal strip under the h1. */
export const AccessoriesChapterNav = memo(function AccessoriesChapterNav({
  chips = ACCESSORIES_CHAPTERNAV,
  navLabel = "Accessories by product",
}: {
  chips?: readonly { label: string; ariaLabel: string; href: string }[];
  navLabel?: string;
}) {
  return (
    <nav aria-label={navLabel} className="accessories-chapternav">
      <ul role="list" className="m-0 flex list-none flex-wrap items-center justify-center gap-2 p-0">
        {chips.map((chip) => (
          <li key={chip.label} className="m-0 list-none">
            <a href={chip.href} aria-label={chip.ariaLabel} className="accessories-chip">
              {chip.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
});

/** The measured media gallery: themed cards in the scroller family
 * (headline, body, CTA; the reference's photography drops, D1 — the theme
 * background carries the card). */
export const AccessoriesGallery = memo(function AccessoriesGallery({
  gallery = ACCESSORIES_GALLERY,
}: {
  gallery?: { headline: string; cards: readonly AccessoriesGalleryCard[] };
}) {
  return (
    <section aria-labelledby="accessories-gallery" className="store-rail">
      <h2 id="accessories-gallery" className="accessories-section-header m-0">
        {gallery.headline}
      </h2>
      <ul role="list" className="rail-scroller m-0 p-0">
        {gallery.cards.map((card) => (
          <li
            key={card.headline}
            className={`accessories-gallery-card m-0 list-none ${card.theme === "dark" ? "accessories-gallery-dark" : "accessories-gallery-light"}`}
          >
            <div className="accessories-gallery-copy">
              {card.eyebrow && <p className="accessories-gallery-eyebrow m-0">{card.eyebrow}</p>}
              <h3 className="accessories-gallery-headline m-0">{card.headline}</h3>
              <p className="accessories-gallery-body m-0">{card.body}</p>
              <a
                href={card.cta.href}
                className={`link-cta ${card.theme === "dark" ? "accessories-link-dark" : ""}`}
                aria-label={card.cta.productId ? `${card.cta.label} ${card.headline}` : card.cta.label}
              >
                {card.cta.label}
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
});

const CuratedCard = memo(function CuratedCard({ item }: { item: AccessoriesCuratedItem }) {
  if (item.kind === "promo") {
    return (
      <li className="accessories-curated-card accessories-curated-promo m-0 list-none">
        {item.eyebrow && <p className="accessories-curated-eyebrow m-0">{item.eyebrow}</p>}
        <p className="accessories-curated-headline m-0">{item.headline}</p>
        {item.ctaLabel && (
          <a href={item.href} className="accessories-curated-link">
            {item.ctaLabel}
          </a>
        )}
      </li>
    );
  }
  const product = item.productId ? getProduct(item.productId) : undefined;
  const price = product ? productPriceLabel(product) : item.price;
  return (
    <li className="accessories-curated-card m-0 list-none">
      <a href={item.href} className="accessories-curated-card-link">
        {item.badge && <span className="accessories-curated-badge">{item.badge}</span>}
        <span className="accessories-curated-name">{item.label}</span>
        {price && <span className="accessories-curated-price">{price}</span>}
      </a>
    </li>
  );
});

/** The measured curated grid: pill tabs over the measured items. The tab
 * strip implements the WAI-ARIA tabs pattern (roving tabindex, arrow keys,
 * aria-selected + labelled panels). */
export const AccessoriesCurated = memo(function AccessoriesCurated({
  curated = ACCESSORIES_CURATED,
}: {
  curated?: { headline: string; tabs: readonly AccessoriesCuratedTab[] };
}) {
  const [active, setActive] = useState(0);
  const tabs = curated.tabs;
  const onKey = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = event.key === "ArrowRight" ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length;
    setActive(next);
    document.getElementById(`accessories-tab-${next}`)?.focus();
  };
  return (
    <section aria-labelledby="accessories-curated" className="accessories-curated">
      <h2 id="accessories-curated" className="accessories-section-header m-0">
        {curated.headline}
      </h2>
      <div className="accessories-tablist-row">
        <div role="tablist" aria-label="Accessory picks" className="flex flex-wrap gap-2">
          {tabs.map((tab, index) => {
            const selected = index === active;
            return (
              <button
                key={tab.label}
                id={`accessories-tab-${index}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`accessories-panel-${index}`}
                tabIndex={selected ? 0 : -1}
                className={`accessories-tab ${selected ? "accessories-tab-active" : ""}`}
                onClick={() => setActive(index)}
                onKeyDown={(event) => onKey(event, index)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.label}
          id={`accessories-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`accessories-tab-${index}`}
          hidden={index !== active}
        >
          <ul role="list" className="accessories-curated-grid m-0 grid list-none gap-5 p-0 tablet:grid-cols-2 wide:grid-cols-4">
            {tab.cards.map((item, i) => (
              // the index joins the key: the reference repeats the Belkin power
              // bank across two tabs and duplicates labels within a panel
              <CuratedCard key={`${tab.label}-${i}-${item.kind === "card" ? item.label : item.headline}`} item={item} />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
});

/** The measured value-props row (each item with a Learn more link). */
export const AccessoriesValueProps = memo(function AccessoriesValueProps({
  valueProps = ACCESSORIES_VALUE_PROPS,
}: {
  valueProps?: { headline: string; items: readonly AccessoriesValueProp[] };
}) {
  return (
    <section aria-labelledby="accessories-value-props" className="accessories-value-props">
      <h2 id="accessories-value-props" className="accessories-section-header m-0">
        {valueProps.headline}
      </h2>
      <ul role="list" className="m-0 grid list-none gap-8 p-0 tablet:grid-cols-2 wide:grid-cols-4">
        {valueProps.items.map((item) => (
          <li key={item.headline} className="m-0 list-none">
            <h3 className="accessories-value-headline m-0">{item.headline}</h3>
            <p className="accessories-value-body m-0">{item.body}</p>
            <a href={item.href} className="link-cta">
              {item.linkName}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
});

/** The measured index-nav directory: three groups of links (the page's
 * closing "Accessories" section). */
export const AccessoriesIndexNav = memo(function AccessoriesIndexNav({
  indexNav = ACCESSORIES_INDEX_NAV,
}: {
  indexNav?: { headline: string; groups: readonly AccessoriesIndexGroup[] };
}) {
  return (
    <section aria-labelledby="accessories-index-nav" className="accessories-index-nav">
      <h2 id="accessories-index-nav" className="accessories-index-headline m-0">
        {indexNav.headline}
      </h2>
      <div className="grid gap-10 tablet:grid-cols-3">
        {indexNav.groups.map((group) => (
          <div key={group.headline}>
            <h3 className="accessories-index-group m-0">{group.headline}</h3>
            <ul role="list" className="m-0 grid list-none gap-3 p-0">
              {group.links.map((link) => (
                <li key={link.label} className="m-0 list-none">
                  <a href={link.href} className="text-[14px] text-[#0066cc] no-underline hover:underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
});

/** The full measured grid-page sequence (chapternav → gallery → curated tabs
 * → value props → index nav). The page's h1 lives in StorePage. */
export function AccessoriesPageSections() {
  return (
    <>
      <AccessoriesChapterNav />
      <AccessoriesGallery />
      <AccessoriesCurated />
      <AccessoriesValueProps />
      <AccessoriesIndexNav />
    </>
  );
}

/** The per-category accessories grid sequence (session-12 D16): the same
 * section family over a per-category measured model. The page's h1 lives in
 * StorePage. */
export function AccessoriesCategoryPageSections({ page }: { page: AccessoriesCategoryPage }) {
  return (
    <>
      <AccessoriesChapterNav chips={page.chapternav} navLabel={`${page.h1} by category`} />
      <AccessoriesGallery gallery={page.gallery} />
      <AccessoriesCurated curated={page.curated} />
      <AccessoriesValueProps valueProps={page.valueProps} />
      <AccessoriesIndexNav indexNav={page.indexNav} />
    </>
  );
}
