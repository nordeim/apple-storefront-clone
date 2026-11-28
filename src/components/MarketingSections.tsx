import { memo, useState } from "react";
import { getProduct } from "@/lib/catalog";
import { productPriceLabel } from "@/lib/store-rails";
import type { MarketingLineupTile, MarketingPage, MarketingSection } from "@/lib/marketing-pages";

/** The nav-main marketing pages' section family (session-13 D17; measured off
 * apple.com/sg/{mac,ipad,iphone,watch,apple-vision-pro,home}). Every section
 * renders its measured content model; product tiles naming clone catalog
 * products derive their prices at render (D10) and their Buy CTAs deep-link
 * the working configurator (D12). The reference's photography drops (D1) —
 * the measured text and the clone's own SVG art carry the pages. */

const derivedPrice = (tile: { productId: string | null; measuredPrice: string | null }): string | null => {
  if (tile.productId) {
    const product = getProduct(tile.productId);
    return product ? productPriceLabel(product) : null;
  }
  return tile.measuredPrice;
};

/** The reference's chapter nav: product-family chips with "New" badges, a
 * horizontal strip above the h1's section (the accessories family's anatomy). */
export const MarketingChapterNav = memo(function MarketingChapterNav({
  chips,
  navLabel,
}: {
  chips: MarketingPage["chapternav"];
  navLabel: string;
}) {
  return (
    <nav aria-label={navLabel} className="accessories-chapternav">
      <ul role="list" className="m-0 flex list-none flex-wrap items-center justify-center gap-2 p-0">
        {chips.map((chip) => (
          <li key={chip.label} className="m-0 list-none">
            <a href={chip.href} className="accessories-chip">
              {chip.label}
              {chip.isNew ? <span className="marketing-chip-badge">New</span> : null}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
});

const LineupTile = memo(function LineupTile({ tile }: { tile: MarketingLineupTile }) {
  const price = derivedPrice(tile);
  return (
    <li className="marketing-tile">
      <div className="marketing-tile-head">
        {tile.badge ? <p className="marketing-eyebrow">{tile.badge}</p> : null}
        <h3 className="marketing-tile-name">{tile.name}</h3>
      </div>
      {tile.tagline ? <p className="marketing-tile-tagline">{tile.tagline}</p> : null}
      {price ? <p className="marketing-tile-price">{price}</p> : null}
      <p className="marketing-tile-ctas">
        <a href={tile.learnHref} className="link-cta">
          Learn more
        </a>
        <a href={tile.buyHref} className="marketing-buy-pill">
          Buy
        </a>
      </p>
    </li>
  );
});

/** The "Explore the line-up." gallery — a tabbed filter gallery on Mac (the
 * WAI-ARIA tabs pattern the accessories family uses), a plain grid elsewhere. */
export const LineupGallery = memo(function LineupGallery({ section }: { section: Extract<MarketingSection, { kind: "lineup" }> }) {
  const [active, setActive] = useState(0);
  const multiTab = section.tabs.length > 1;
  const headingId = "marketing-lineup-heading";
  return (
    <section aria-labelledby={headingId} className="marketing-section">
      <div className="mx-auto max-w-[1024px] px-[22px]">
        <h2 id={headingId} className="marketing-section-header">
          {section.heading}
        </h2>
        {multiTab ? (
          <div role="tablist" aria-label="Product filter" className="marketing-tabs">
            {section.tabs.map((tab, i) => (
              <button
                key={tab.chip}
                type="button"
                role="tab"
                id={`marketing-tab-${i}`}
                aria-selected={i === active}
                aria-controls={`marketing-panel-${i}`}
                tabIndex={i === active ? 0 : -1}
                className={`marketing-tab${i === active ? " marketing-tab-active" : ""}`}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    const next = (i + 1) % section.tabs.length;
                    setActive(next);
                    document.getElementById(`marketing-tab-${next}`)?.focus();
                  } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    const prev = (i - 1 + section.tabs.length) % section.tabs.length;
                    setActive(prev);
                    document.getElementById(`marketing-tab-${prev}`)?.focus();
                  }
                }}
              >
                {tab.chip}
              </button>
            ))}
          </div>
        ) : null}
        {multiTab ? (
          <div
            key={active}
            role="tabpanel"
            id={`marketing-panel-${active}`}
            aria-labelledby={`marketing-tab-${active}`}
            className="marketing-lineup"
          >
            <ul role="list" className="m-0 grid list-none gap-5 p-0">
              {section.tabs[active].tiles.map((tile) => (
                <LineupTile key={tile.name} tile={tile} />
              ))}
            </ul>
          </div>
        ) : (
          <ul role="list" className="m-0 grid list-none gap-5 p-0">
            {section.tabs[0].tiles.map((tile) => (
              <LineupTile key={tile.name} tile={tile} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
});

/** The "Why Apple is the best place to shop X." icon-row family. */
export const ValueProps = memo(function ValueProps({ section }: { section: Extract<MarketingSection, { kind: "valueprops" }> }) {
  return (
    <section aria-labelledby="marketing-valueprops-heading" className="marketing-section marketing-valueprops">
      <div className="mx-auto max-w-[1024px] px-[22px]">
        <h2 id="marketing-valueprops-heading" className="marketing-section-header">
          {section.heading}
          {section.headCta ? (
            <>
              {" "}
              <a href={section.headCta.href} className="link-cta">
                {section.headCta.label}
              </a>
            </>
          ) : null}
        </h2>
        <ul role="list" className="m-0 grid list-none gap-8 p-0 tablet:grid-cols-2 wide:grid-cols-3">
          {section.rows.map((row) => (
            <li key={row.title} className="marketing-valueprop">
              <h3 className="marketing-valueprop-title">{row.title}</h3>
              {row.copy ? <p className="marketing-valueprop-copy">{row.copy}</p> : null}
              {row.cta ? (
                <a href={row.cta.href} className="link-cta">
                  {row.cta.label}
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
});

/** The banner-card / hero-card families (Switch to Mac, essentials, the
 * iPhone Duo hero, the vision Entertainment cards). */
export const MarketingCards = memo(function MarketingCards({ section }: { section: Extract<MarketingSection, { kind: "cards" }> }) {
  return (
    <section aria-labelledby="marketing-cards-heading" className="marketing-section">
      <div className="mx-auto max-w-[1024px] px-[22px]">
        {section.heading ? (
          <h2 id="marketing-cards-heading" className="marketing-section-header">
            {section.heading}
          </h2>
        ) : null}
        <ul role="list" className="m-0 grid list-none gap-5 p-0 tablet:grid-cols-2">
          {section.tiles.map((tile, i) => {
            const price = derivedPrice(tile);
            return (
              <li key={tile.headline ?? `card-${i}`} className="marketing-card">
                {tile.eyebrow ? <p className="marketing-eyebrow">{tile.eyebrow}</p> : null}
                {tile.headline ? <h3 className="marketing-card-headline">{tile.headline}</h3> : null}
                {tile.copy ? <p className="marketing-card-copy">{tile.copy}</p> : null}
                {price ? <p className="marketing-tile-price">{price}</p> : null}
                {tile.ctas.length ? (
                  <p className="marketing-tile-ctas">
                    {tile.ctas.map((cta) => (
                      <a key={`${cta.label}-${cta.href}`} href={cta.href} className={cta.label === "Buy" ? "marketing-buy-pill" : "link-cta"}>
                        {cta.label}
                      </a>
                    ))}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
});

/** The continuity accordion ("Unlock the world of Apple", "Significant
 * others") — the clone's footer-accordion conventions: independent toggles,
 * conditional mounting (never JS-toggled display utilities — the v4 trap). */
export const MarketingAccordion = memo(function MarketingAccordion({ section }: { section: Extract<MarketingSection, { kind: "accordion" }> }) {
  const [open, setOpen] = useState(0);
  return (
    <section aria-labelledby="marketing-accordion-heading" className="marketing-section">
      <div className="mx-auto max-w-[1024px] px-[22px]">
        <h2 id="marketing-accordion-heading" className="marketing-section-header">
          {section.heading}
        </h2>
        <ul role="list" className="m-0 list-none p-0">
          {section.items.map((item, i) => {
            const expanded = open === i;
            return (
              <li key={item.headline} className="marketing-accordion-item">
                <h3 className="m-0">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`marketing-acc-panel-${i}`}
                    id={`marketing-acc-row-${i}`}
                    className="marketing-accordion-row"
                    onClick={() => setOpen(expanded ? -1 : i)}
                  >
                    {item.headline}
                    <span aria-hidden="true" className="marketing-accordion-chevron">
                      {expanded ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                {expanded ? (
                  <div id={`marketing-acc-panel-${i}`} role="region" aria-labelledby={`marketing-acc-row-${i}`} className="marketing-accordion-panel">
                    {item.copy ? <p className="marketing-card-copy">{item.copy}</p> : null}
                    {item.ctas.map((cta) => (
                      <a key={cta.href} href={cta.href} className="link-cta">
                        {cta.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
});

/** The closing links directory (the reference's "More from X" strip). */
export const MarketingDirectory = memo(function MarketingDirectory({ section }: { section: Extract<MarketingSection, { kind: "directory" }> }) {
  return (
    <section aria-labelledby="marketing-directory-heading" className="marketing-directory">
      <div className="mx-auto max-w-[1024px] px-[22px]">
        <h2 id="marketing-directory-heading" className="marketing-directory-header">
          {section.heading}
        </h2>
        <ul role="list" className="m-0 grid list-none gap-x-8 gap-y-2 p-0 tablet:grid-cols-2 wide:grid-cols-3">
          {section.links.map((link) => (
            <li key={`${link.label}-${link.href}`} className="m-0">
              <a href={link.href} className="marketing-directory-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
});

/** The vision page's hero-led statement sections: measured headline + copy
 * + CTAs (the reference's imagery drops, D1). */
export const StatementSection = memo(function StatementSection({ section }: { section: Extract<MarketingSection, { kind: "statement" }> }) {
  return (
    <section aria-labelledby="marketing-statement-heading" className="marketing-section marketing-statement">
      <div className="mx-auto max-w-[820px] px-[22px] text-center">
        {section.heading ? (
          <h2 id="marketing-statement-heading" className="marketing-statement-headline">
            {section.heading}
          </h2>
        ) : null}
        {section.paragraphs.map((para, i) => (
          <p key={i} className="marketing-statement-copy">
            {para}
          </p>
        ))}
        {section.ctas.length ? (
          <p className="marketing-tile-ctas marketing-statement-ctas">
            {section.ctas.map((cta) => (
              <a key={`${cta.label}-${cta.href}`} href={cta.href} className={cta.label === "Buy" ? "marketing-buy-pill" : "link-cta"}>
                {cta.label}
              </a>
            ))}
          </p>
        ) : null}
      </div>
    </section>
  );
});

/** Composes a marketing page's measured sections in order. */
export function MarketingPageSections({ page }: { page: MarketingPage }) {
  return (
    <>
      {page.sections.map((section, i) => {
        switch (section.kind) {
          case "lineup":
            return <LineupGallery key={i} section={section} />;
          case "valueprops":
            return <ValueProps key={i} section={section} />;
          case "cards":
            return <MarketingCards key={i} section={section} />;
          case "accordion":
            return <MarketingAccordion key={i} section={section} />;
          case "directory":
            return <MarketingDirectory key={i} section={section} />;
          case "statement":
            return <StatementSection key={i} section={section} />;
        }
      })}
    </>
  );
}
