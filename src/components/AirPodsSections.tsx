import { memo } from "react";
import { getProduct } from "@/lib/catalog";
import { productPriceLabel } from "@/lib/store-rails";
import { AIRPODS_CHAPTERNAV, AIRPODS_COMPARE, AIRPODS_CONSIDER, AIRPODS_HEROES, AIRPODS_MUSIC, type AirPodsHero } from "@/lib/airpods-page";

/** The AirPods marketing page's section family (session-11; measured off
 * apple.com/sg/airpods/). The page renders above the clone's superset store
 * block — the measured parity surface on top, the working store below. */

const heroId = (headline: string): string =>
  `airpods-hero-${headline.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase()}`;

/** The reference's chapternav: a six-link strip under the global nav. */
export const AirPodsChapterNav = memo(function AirPodsChapterNav() {
  return (
    <nav aria-label="AirPods" className="airpods-chapternav">
      <ul role="list" className="m-0 flex list-none items-center justify-center gap-x-10 gap-y-2 p-0">
        {AIRPODS_CHAPTERNAV.map((link) => (
          <li key={link.label} className="m-0 list-none">
            <a href={link.href} className="airpods-chapternav-link">
              {link.label}
              {link.note && <span className="airpods-chapternav-note">{link.note}</span>}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
});

const Hero = memo(function Hero({ hero }: { hero: AirPodsHero }) {
  const dark = hero.theme === "dark";
  return (
    <section
      aria-labelledby={heroId(hero.headline)}
      className={`airpods-hero ${dark ? "airpods-hero-dark" : "airpods-hero-light"}`}
    >
      <div className="airpods-hero-copy">
        <h2 id={heroId(hero.headline)} className={`airpods-hero-headline m-0 ${hero.headlineSize === "chapter" ? "airpods-hero-headline-chapter" : ""}`}>
          {hero.headline}
        </h2>
        <p className="airpods-hero-tagline m-0">{hero.tagline}</p>
        <p className="airpods-hero-price m-0">{hero.price}</p>
        <div className="airpods-hero-ctas flex flex-wrap items-center gap-4">
          <a href={hero.learnHref} className="link-cta">
            Learn more
          </a>
          {/* D12: the catalog-matched hero's Buy opens the working configurator;
              the reference's own Buy is a marketing link. */}
          <a href={hero.buyHref} className={`button ${dark ? "button-secondary" : ""}`} aria-label={`Buy ${hero.headline}`}>
            Buy
          </a>
        </div>
      </div>
    </section>
  );
});

/** The three measured product heroes (dark AirPods 5 / light Pro 3 / the
 * chapter-style Max 2). */
export const AirPodsHeroes = memo(function AirPodsHeroes() {
  return (
    <div className="airpods-heroes">
      {AIRPODS_HEROES.map((hero) => (
        <Hero key={hero.id} hero={hero} />
      ))}
    </div>
  );
});

/** The measured compare module: four columns (name, tagline, price, CTAs).
 * The Pro 3 column derives its price from the catalog (D10). */
export const AirPodsCompare = memo(function AirPodsCompare() {
  return (
    <section aria-labelledby="airpods-compare" className="airpods-compare">
      <h2 id="airpods-compare" className="airpods-section-header m-0">
        {AIRPODS_COMPARE.headline}
      </h2>
      <ul role="list" className="airpods-compare-columns m-0 grid list-none gap-6 p-0 tablet:grid-cols-2 wide:grid-cols-4">
        {AIRPODS_COMPARE.columns.map((column) => {
          const product = column.productId ? getProduct(column.productId) : undefined;
          const price = product ? productPriceLabel(product) : column.price;
          return (
            <li key={column.name} className="airpods-compare-column m-0 list-none">
              {column.eyebrow && <p className="rail-card-eyebrow m-0">{column.eyebrow}</p>}
              <h3 className="airpods-compare-name m-0">{column.name}</h3>
              <p className="airpods-compare-tagline m-0">{column.tagline}</p>
              {price && <p className="airpods-compare-price m-0">{price}</p>}
              <div className="flex flex-wrap items-center gap-4">
                {column.buyHref && (
                  <a href={column.buyHref} className="button" aria-label={`Buy ${column.name}`}>
                    Buy
                  </a>
                )}
                <a href={column.learnHref} className="link-cta">
                  Learn more
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
});

/** The measured consider rail: five feature cards in the scroller family
 * (kicker, headline, body — the reference's photography drops, D1). The
 * scroller is keyboard-focusable: unlike the store rails its cards carry no
 * links, so without focus there is no way to scroll it by keyboard (the axe
 * tier's scrollable-region-focusable rule — session-11). */
export const AirPodsConsider = memo(function AirPodsConsider() {
  return (
    <section aria-labelledby="airpods-consider" className="store-rail airpods-consider">
      <h2 id="airpods-consider" className="airpods-section-header m-0">
        {AIRPODS_CONSIDER.headline}
      </h2>
      <ul role="list" aria-label="AirPods features" tabIndex={0} className="rail-scroller m-0 p-0">
        {AIRPODS_CONSIDER.features.map((feature) => (
          <li
            key={feature.headline}
            className="airpods-feature-card m-0 list-none"
          >
            <p className="airpods-feature-kicker m-0">{feature.kicker}</p>
            <h3 className="airpods-feature-headline m-0">{feature.headline}</h3>
            <p className="airpods-feature-body m-0">{feature.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
});

/** The measured Apple Music promo block. */
export const AirPodsMusic = memo(function AirPodsMusic() {
  return (
    <section aria-labelledby="airpods-music" className="airpods-music">
      <h2 id="airpods-music" className="airpods-music-label m-0">
        {AIRPODS_MUSIC.label}
      </h2>
      <p className="airpods-music-desc m-0">{AIRPODS_MUSIC.desc}</p>
      <a href={AIRPODS_MUSIC.href} className="link-cta">
        Learn more
      </a>
    </section>
  );
});

/** The full measured marketing sequence (chapternav → heroes → compare →
 * consider → music). The page's h1 lives in StorePage (the sr-only pattern). */
export function AirPodsPageSections() {
  return (
    <>
      <AirPodsChapterNav />
      <AirPodsHeroes />
      <AirPodsCompare />
      <AirPodsConsider />
      <AirPodsMusic />
    </>
  );
}
