import { MarketingChapterNav, MarketingPageSections } from "@/components/MarketingSections";
import { PageShell, PageTitle } from "@/components/PageShell";
import { routeHref, type MarketingCategoryId } from "@/lib/router";
import { MARKETING_PAGES } from "@/lib/marketing-pages";
import { STORE_CATEGORY_LABELS } from "@/lib/site-content";

/** A nav-main marketing page (session-13 D17): the reference's /sg/{x}/
 * family — chapternav chips, the visible 80px-family h1, the measured
 * section sequence — closed by the clone's superset affordance: a "Shop X"
 * band routing to the working store category page (the measured parity
 * surface on top, the working store one click below). */
export function MarketingPage({ category }: { category: MarketingCategoryId }) {
  const page = MARKETING_PAGES[category];
  const storeLabel = STORE_CATEGORY_LABELS[category];
  return (
    <>
      <MarketingChapterNav chips={page.chapternav} navLabel={`${page.h1} family`} />
      <PageShell>
        <PageTitle>{page.h1}</PageTitle>
      </PageShell>
      <MarketingPageSections page={page} />
      <PageShell>
        <div className="marketing-shop-band">
          <h2 className="marketing-shop-band-headline">Shop {storeLabel}.</h2>
          <p className="marketing-shop-band-copy">Browse the full line-up, compare models and configure your own.</p>
          <a href={routeHref.store(category)} className="marketing-buy-pill marketing-shop-band-cta">
            Shop {storeLabel}
          </a>
        </div>
      </PageShell>
    </>
  );
}
