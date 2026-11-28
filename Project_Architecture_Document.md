# apple-storefront-clone — Master Project Architecture Document (PAD) v1.9

**Classification:** Internal Engineering Reference
**Status:** DEFINITIVE, PRODUCTION-LOCKED BLUEPRINT
**Companion Document:** `README.md` (quick start), `AGENTS.md` (agent traps), `CLAUDE.md` (conventions), `docs/reference-investigation.md` (parity dossier)
**Last Updated:** 2026-11-28
**Audience:** Senior Engineers, Tech Leads, DevOps, and Onboarding Engineers
**Rule:** Every architectural decision in this document traces to a specific rationale.
Nothing is here "because it's popular."

#### Revision Block — v1.9 (the session-10 category-shelves + router-cap cycle)

- `[SR]` The session-10 cycle (2026-11-28, `docs/REMEDIATION_PLAN.md` session-10 section)
  re-verified the pulled tree (e5bbdc2) — baseline gates exactly as documented (11/119 unit ·
  42/42 e2e · 45/45 smoke · 204 routes · 322.34 kB) — plus a read-only audit (**1 HIGH + 1
  MEDIUM + 3 LOW + 8 INFO**; the HIGH: nine session-9 rail cards linked to info slugs the
  router's 60-char cap 404'd — silent dead links every gate was green against) and a
  live-parity sweep: the clone's mobile navigation re-measured working at 390×844, all eleven
  reference flyout models re-extracted and re-diffed via a committed Vite ssrLoadModule
  harness (`scripts/flyout-diff.mjs`) — all match.
- `[FIX]` **The router's info-slug cap rose 60 → 130** (S10-1, RED first): the longest measured
  label slugifies to 126; the boundary is pinned in `router.test.ts` (126 routeable, 131
  404s) and every content seam's spec now round-trips its generated hrefs through
  `parseHash` (the M-1 drift guard — content, sitemap and router can never drift silently
  again). The editorial chevron inherits the card theme on dark cards (the session-9
  eyebrow fix, completed for the chevron).
- `[FEAT]` **The six device category pages' measured shelf models landed** (the session-9
  log's named next surface): a new pure seam `src/lib/category-rails.ts` (360 lines) —
  mac 7 shelves · ipad 7 · iphone 6 · watch 8 · vision 7 · home 5 (233 measured cards; the
  reference's 30 model cards replaced by the clone's 9 catalog products per **D12**, the
  honesty rule: a card with a price and a Buy pill must be a product the clone can
  configure and sell — measured per-product tags like "NEW 14” WITH M6" carry over) + the
  `CategoryShelves` rendering in `StoreRails.tsx` (the measured "All models." product-card
  anatomy: 400×500, name/tag at top, art mid, price bottom-left, the 56×36 #0071e3
  Buy pill bottom-right **deep-linking the working configurator** (`?buy`) — the superset
  play; the vision hero renders at the measured 646×500) + editorial-wide (480×500),
  editorial-short (313×240) and editorial-short-wide (480×240) card variants. The
  airpods/accessories pages keep their pinned structure (**D13**: their reference pages
  are different families — a marketing page and a filtered grid). `CATEGORY_RAIL_INFO_LABELS`
  joins the `INFO_TITLES` derivation — the sitemap grew 204 → 337 routes, all from the seam.
- `[VERIFY]` Full gate green after the change: lint 0 errors · typecheck clean ×2 · unit
  **12 files / 130 tests** · build **349.26 kB / 102.71 kB gzip** (CSS 37,986 bytes /
  579 rules) · e2e **45/45** (32 pins + 13 axe scans, incl. the new `#/store/mac` scan) ·
  smoke 45/45, zero console errors. Live verification: all six category pages render their
  shelves; the Buy pill opens the configurator focused; the reference's duplicated
  CONTINUITY card (measured, shipped twice on the reference's iPhone page) renders without
  key collisions.
- `[CHORE]` README/AGENTS/CLAUDE/PAD/SKILL/DEPLOYMENT swept in lockstep (counts 11/119 →
  12/130 unit, 42 → 45 e2e, 204 → 337 routes / 179 → 312 info pages, 322.34 → 349.26 kB,
  CSS 35,782 → 37,986 bytes); the audit's stale-doc LOWs fixed (PAD §11 line counts, the
  SKILL Appendix B session title); the 20-shot screenshot family re-captured
  (+19/+20 the category shelves); `scripts/flyout-diff.mjs` committed as the standing
  drift harness; worklog Task 122.

#### Revision Block — v1.8 (the session-9 store editorial-rails cycle)

- `[SR]` The session-9 cycle (2026-11-28, `docs/REMEDIATION_PLAN.md` session-9 section)
  re-verified the pulled tree (af88a0d) — baseline gates exactly as documented (10/108 unit ·
  40/40 e2e · 45/45 smoke · 156 routes · 310.71 kB) — plus a read-only audit (0
  CRITICAL/HIGH/MEDIUM; 1 LOW + 5 INFO) and a live-parity sweep: the clone's mobile navigation
  re-measured working at 390×844, **all eleven reference flyout models re-extracted from the
  live DOM and programmatically re-diffed against `flyoutSections()` — all match** (a rebuilt
  Vite ssrLoadModule harness), hero/promo/chip-row/category-h1 surfaces re-measured matching,
  and the reference's `/sg/store` measured in full for this cycle's feature.
- `[FEAT]` **The store index's seven editorial rails landed** (the session-8 log's named
  next-cycle surface): a new pure seam `src/lib/store-rails.ts` (253 lines — 7 rails × the
  measured header/subhead/card model; `railCardHref` applies the flyout `familyLink` rule —
  exact catalog-name match (plus a documented alias map for the reference's variant
  spellings/annotations) routes to product pages, everything else to info pages;
  `productPriceLabel` derives `From S$X`/`S$X` from THIS clone's catalog — deviation D10) +
  `src/components/StoreRails.tsx` (98 lines) rendering the measured rail anatomy (400×500
  white product cards with a 28px/600 name, 313×500 accessory cards, theme-coloured editorial
  cards with the reference's measured bg/fg pairs; 28px/600 burgundy `#810831` rail headers;
  20px gaps, a horizontal snap scroller, a 119px rail rhythm) + the quick-links strip (5
  measured labels; AirPods routes to the clone's category page). The store index now follows
  the reference's measured order (h1 → quick links → chips → rails) with the superset
  product grid below ("All products." + the sort control); category pages keep their pinned
  structure. `slugify` moved to `src/lib/slug.ts` (9 lines) so the seam shares the grammar
  without a module cycle; `RAIL_INFO_LABELS` joins the `INFO_TITLES` derivation — the
  sitemap grew 156 → 204 routes, all from the seam.
- `[FEAT]` The axe tier drove a real fix on the new markup: the rail-card eyebrow's
  `#424245` (measured on the reference's white product cards) failed contrast on the dark
  editorial cards — editorial eyebrows now inherit the card theme's fg colour.
- `[VERIFY]` Full gate green after the change: lint 0 errors · typecheck clean ×2 · unit
  11 files / 119 tests (the 11-test `store-rails` spec, RED first) · build 322.34 kB / 97.42 kB
  gzip (CSS 35,782 bytes / 553 rules) · e2e 42/42 (30 pins + 12 axe scans; +2 rail pins) ·
  smoke 45/45, zero console errors. The rails verified live on both the dev server and the
  built artifact; mobile rails re-checked at 390×844 (no horizontal overflow — pinned).
- `[CHORE]` README/AGENTS/CLAUDE/PAD/SKILL/DEPLOYMENT swept in lockstep (counts 10/108 →
  11/119 unit, 40 → 42 e2e, 156 → 204 routes, 310.71 → 322.34 kB, CSS 33,720 → 35,782
  bytes); the audit's stale PAD §11 row fixed (ErrorBoundary 51 → 67); the 18-shot
  screenshot family re-captured (+18-desktop-store-rails.png); worklog Task 121.

#### Revision Block — v1.7 (the session-8 a11y-tier + crash-recovery cycle)

- `[SR]` The session-8 cycle (2026-11-28, `docs/REMEDIATION_PLAN.md` session-8 section)
  re-verified the pulled tree (1a3b13d) — baseline gates exactly as documented (10/105 unit ·
  28/28 e2e · 45/45 smoke · 156 routes) — plus a read-only audit (0 CRITICAL/HIGH; **1 MEDIUM**
  + 5 LOW + 4 INFO) and a fresh agent-browser parity sweep: the clone's mobile navigation
  re-measured working at 390×844 and **all eleven reference flyout models re-extracted from
  the live DOM and programmatically re-diffed against `flyoutSections()` — all match** (the
  Home item's flyout lives in the reference's legacy `globalnav-item-tv` container); the TV+
  gallery rail lazy-loaded into this session's headless render (9/9 titles — closing the
  session-7 environment-limited gap); hero/promo sequences, resting-bar pins, the store chip
  row and the category-page h1 all re-measured matching — zero reference drift.
- `[FIX]` Audit M-1 (the session-7 boundary's real gap): `ErrorBoundary` latched `failed`
  forever — `App.tsx` rendered it unkeyed and the class had no reset, so after one route-render
  crash every in-app navigation kept the fallback until a full reload. The boundary now owns a
  `resetKey` prop (`componentDidUpdate` clears the latch when it changes — the
  react-error-boundary `resetKeys` pattern) and `App.tsx` passes the route path; the spec
  grew the re-arm and re-latch cases (RED observed on both).
- `[FEAT]` **The axe-core e2e tier landed** (the session-7 deferred debt): `@axe-core/playwright`
  (devDependency only — nothing ships in the single-file artifact) + `tests/e2e/a11y.spec.ts`
  scanning WCAG 2 A+AA across ten routes and the mobile resting/menu-open states. Fixes it
  drove: the home page gained the sr-only `<h1>` the reference itself ships
  (`visuallyhidden` "Apple" — the clone says "Apple (Singapore)"), and the TV+ gallery track
  dropped its redundant `ul/li` shell for `div` + `role="tabpanel"` (a `li[role=tabpanel]`
  breaks axe's `list` rule via the role override; no spec pinned the track markup). Two
  measured-reference exclusions are documented in the spec header — the ribbon link
  (#2997ff, no underline, on #1d1d1f — measured live this cycle) and the dimmed inactive
  gallery cards (aria-hidden + 40% opacity by design). Router grammar hardened:
  `#/search/x`, `#/entertainment/x`, `#/support/x` now 404 like their sibling heads.
- `[VERIFY]` Full gate green after the change: lint 0 errors · typecheck clean ×2 · unit
  10 files / 108 tests · build 310.71 kB / 93.74 kB gzip (CSS 33,720 bytes / 519 rules) ·
  e2e 40/40 (28 pins + 12 axe scans) · smoke 45/45, zero console errors. The sr-only h1,
  the div gallery track and the boundary's resetKey verified live on both the dev server
  and the built artifact.
- `[CHORE]` README/AGENTS/CLAUDE/PAD/SKILL/DEPLOYMENT swept in lockstep (counts 10/105 →
  10/108 unit, 28 → 40 e2e, 310.4 → 310.7 kB, CSS 33,654 → 33,720 bytes); the audit's five
  stale-doc spots fixed (§1.2's dead `clsx`/Testing-Library rows, §11/SKILL §5 line counts,
  DEPLOYMENT §1 route counts, §5.3's dead `.button-neutral`, §3's component inventory); the
  17 screenshots re-captured; worklog Task 120.

#### Revision Block — v1.6 (the session-7 robustness + lockstep-integrity cycle)

- `[SR]` The session-7 cycle (2026-11-28, `docs/REMEDIATION_PLAN.md` session-7 section)
  re-verified the pulled tree (9ffb287) — baseline gates exactly as documented (9/102 ·
  27/27 e2e · 45/45 smoke · 156 routes) — plus a read-only audit (0 CRITICAL/HIGH/MEDIUM;
  2 LOW + 5 INFO) and a fresh agent-browser parity sweep: the clone's mobile navigation
  re-measured working at 390×844 and **all eleven reference flyout models re-extracted from
  the live DOM and programmatically re-diffed against `flyoutSections()` — all match**;
  hero and promo sequences also match (the reference's TV+ gallery rail did not lazy-load
  into this session's headless render — parity rests on the session-4/5/6 extractions
  plus the clone's own e2e gallery pins).
- `[FIX]` Audit fixes: the `README.md` Quick-start e2e count drift (26 → the live count);
  the holiday play/pause button no longer carries `aria-pressed` (the flipping label is
  the single state channel — the gallery's pattern, pinned by the extended home e2e);
  `BagSummary` moved from `pages/BagPage.tsx` to `components/BagSummary.tsx` (the
  page→page import is gone — the session-5/6 sharing pattern applied to the last
  straggler).
- `[FEAT]` `ErrorBoundary` (`src/components/ErrorBoundary.tsx`) wraps `RouteView` so a
  render throw degrades to a graceful in-shell fallback (home + reload affordances)
  instead of a blank root — the deferred debt from sessions 5+6, now landed with the
  repo's first render-level component spec (`ErrorBoundary.test.tsx`, React 19 `act` in
  jsdom — the test posture gains the component tier in §7.1). Coverage pins added: the
  ghost-product `?buy` 404 focus path (e2e), the back/forward popstate focus path
  (appended to the in-app Buy CTA e2e), and the unknown-choice-id bag-line case (unit).
- `[VERIFY]` Full gate green after the change: lint 0 errors · typecheck clean ×2 · unit
  10 files / 105 tests · build 310.4 kB / 93.7 kB gzip (CSS 33,654 bytes / 518 rules) ·
  e2e 28/28 · smoke 45/45, zero console errors. Live on the dev server: the holiday
  button flips labels with no `aria-pressed`; the bag + checkout ledgers render; the
  ghost `?buy` route shows not-found with focus on `<main>`.
- `[CHORE]` README/AGENTS/CLAUDE/PAD/SKILL/DEPLOYMENT swept in lockstep (counts 9/102 →
  10/105 unit, 27 → 28 e2e, 309.3 → 310.4 kB, CSS 33,212 → 33,654 bytes); the 17
  screenshots re-captured; worklog Task 119.

#### Revision Block — v1.5 (the session-6 re-verification + grammar-hygiene cycle)

- `[SR]` The session-6 cycle (2026-11-28, `docs/REMEDIATION_PLAN.md` session-6 section)
  re-verified the pulled tree (6a3f2be) — baseline gates exactly as documented (9 files/99
  unit → after the fixes 9/102 · 27/27 e2e · 45/45 smoke · 156 routes) — plus a read-only
  audit (0 CRITICAL/HIGH/MEDIUM; 2 LOW + 4 INFO) and a fresh agent-browser parity sweep:
  the clone's mobile navigation re-measured working at 390×844 and **all eleven reference
  flyout models re-extracted from the live DOM and programmatically re-diffed against
  `flyoutSections()` — all match** (headings + link sets, NBSP-normalized); nav order,
  hero/promo sequences and the TV+ gallery titles also match. No reference drift found.
- `[FIX]` Audit fixes: the shell's navigation focus reset no longer steals focus from the
  Configurator's heading on in-app `?buy` deep links (`App.tsx` gates the scroll+focus
  reset on `!(route.name === "product" && hasBuyParam(hash))` — a defect that was real on
  the production artifact and masked on the dev server by StrictMode's double effect
  invocation; pinned by the new store-flow e2e "in-app Buy CTA keeps the configurator
  heading focused"); the bag-line summary grammar extracted into the tested
  `bagLineSummary()` seam in `src/lib/cart.ts` (option-less products render "Qty n" with
  no stray leading "·"); the duplicated `ORDER_NO` regex deduped (exported from
  `router.ts`, imported by `StaticPages.tsx`). The holiday tile's random lazy initializer
  was accepted as-is (React's documented CSR idiom; it carries the reference's 4-colourway
  variety) — decision recorded in the remediation plan.
- `[VERIFY]` Full gate green after the change: lint 0 errors · typecheck clean ×2 · unit 9
  files / 102 tests · build 309.3 kB / 93.2 kB gzip (CSS 33,212 bytes / 501 rules) · e2e
  27/27 · smoke 45/45, zero console errors. Live on the dev server: the bag popover line
  for an option-less product reads "AirTag (4 Pack) / Qty 1" (no stray separator); the
  in-app Buy CTA leaves `#configure-heading` focused; the support-page order lookup
  unchanged.
- `[CHORE]` README/AGENTS/CLAUDE/PAD/SKILL/DEPLOYMENT swept in lockstep (counts 9/99 →
  9/102 unit, 26 → 27 e2e, 309.2 → 309.3 kB, CSS 33,214 → 33,212 bytes); the 17
  screenshots re-captured; worklog Task 118.

#### Revision Block — v1.4 (the session-5 verification + hygiene cycle)

- `[SR]` The session-5 cycle (2026-11-28, `docs/REMEDIATION_PLAN.md` session-5 section)
  re-verified the pulled tree (4390746) — baseline gates exactly as documented — plus a
  read-only audit (0 CRITICAL/HIGH/MEDIUM; 2 LOW + 4 INFO, 13/14 anchors PASS) and a fresh
  agent-browser parity sweep: the clone's mobile navigation re-measured working at 390×844 and
  **all eleven reference flyout models re-extracted from the live DOM and programmatically
  diffed against `flyoutSections()` — all match** (NBSP-normalized); nav order, hero/promo
  sequences and the TV+ gallery titles also match. No reference drift found this cycle.
- `[FIX]` Audit fixes: `routeTitle()` extracted from `App.tsx` into the tested
  `src/lib/route-title.ts` seam and now uses `STORE_CATEGORY_LABELS` (the tab title and the
  store h1 agree — "Shop Apple Watch"); `hasBuyParam()` in `router.ts` owns the `?buy`
  grammar exactly (URLSearchParams, not substring — `?buyfoo`/`?q=buy` are not the deep
  link); the dead `.button-neutral`/`.section-ribbon-host` CSS rules deleted; `aria-controls`
  on the nav icon buttons, desktop nav links and mobile accordion rows now exist only while
  the referenced panel is mounted; the duplicated bag-line `<li>` extracted into
  `components/BagLineRow.tsx` (BagLineRow + BagLineList) consumed by the bag popover and the
  checkout aside. The PAD §7.1 stale table (7/62, desktop 7) corrected to the live counts.
- `[VERIFY]` Full gate green after the change: lint 0 errors · typecheck clean ×2 · unit 9
  files / 99 tests · build 309.2 kB / 93.2 kB gzip (CSS 33.2 kB / 501 rules) · e2e 26/26 ·
  smoke 45/45, zero console errors. Live on the dev server: the watch store tab title reads
  "Shop Apple Watch - Apple (Singapore)" matching its h1; the `?buy` deep link scrolls to and
  focuses the configurator heading; aria-controls is absent while panels are closed and
  present while open.
- `[CHORE]` README/AGENTS/CLAUDE/PAD/SKILL swept in lockstep (counts 8/86 → 9/99 unit,
  25 → 26 e2e, 309.6 → 309.2 kB, CSS 33,322/503 → 33,214/501); the 17 screenshots
  re-captured; worklog Task 117.

#### Revision Block — v1.3 (the session-4 store-surface parity cycle)

- `[SR]` The session-4 cycle (2026-11-27 night, `docs/REMEDIATION_PLAN.md` session-4 section) ran
  the standing verification on the pulled tree (7b8a3ec) — baseline gates exactly as documented —
  plus a read-only audit (0 CRITICAL/HIGH/MEDIUM; 2 LOW + 8 INFO, 13/13 anchors PASS) and a
  fresh agent-browser sweep of all eleven reference flyouts, the mobile bar/menu, the /sg/store
  chip row and the category-page h1. Measured deltas: the live reference had RESTRUCTURED its
  Home flyout into the full three-section category model (Explore Home / Shop Home / More from
  Home, 16 links), its Explore sections list the full product family per category (Mac: MacBook
  Neo/Air/Pro/iMac/mini/Studio/Displays; iPhone: Duo/18 Pro/Air/17/17e/16; iPad: Pro/Air/iPad/
  mini/Pencil/Keyboards; Watch: Series 12/Ultra 4/SE 3/Nike/Hermès; AirPods: 5/Pro 3/Max 2), and
  its store chip row uses full-form labels in iPhone-before-iPad order with an AirTag chip;
  category pages carry full-form h1s ("Shop Apple Watch").
- `[FIX]` `flyoutSections()` re-modeled: the Home case to the measured three-section structure;
  the five device categories' Explore rows to the reference's family labels routed via a
  `familyLink()` helper (labels matching a catalog product route to its product page — MacBook Pro,
  iPad, iPhone Duo, iPhone 18 Pro, Apple Watch Series 12, AirPods Pro 3 — all others to info
  routes; **D6 revised**: catalog-only products stay reachable via the store pages, one click
  deeper). New `STORE_CHIPS` seam (order, full-form labels, AirTag chip → `#/info/airtag`);
  `StorePage` renders the seam's chips and the full-form category h1. `routeHref.productBuy()`
  factory added; `home-content.ts`/`Tile.tsx` hrefs now all factory-built with a new
  `home-content.test.ts` (the module was the only untested `src/lib` seam). Audit LOW-1 fixed:
  checkout phone normalization strips only an explicit `+65` (a bare `65`-leading 8-digit
  number survives). INFO closes: `StaticPages` uses the seam's `slugify()`; `tests/**/*.mjs`
  (the smoke battery, now JSDoc-typed) under the `typecheck:tests` gate; the cart reducer
  returns the same reference on rejected actions; the sitemap test sorts with `localeCompare`.
- `[VERIFY]` Full gate green after the change: lint 0 errors · typecheck clean ×2 · unit 8 files /
  86 tests · build 309.6 kB / 93.2 kB gzip (CSS 33.3 kB / 503 rules) · e2e 25/25 · smoke 45/45,
  zero console errors. Live on the dev server: the Home flyout renders the reference's 3-section
  16-link model; the Mac flyout the 10-link Explore with family rows; the mobile Home accordion
  expansion carries 16 sub-links at 39px; the store chip row matches the measured order and the
  watch-category h1 reads "Shop Apple Watch". Sitemap regenerated: 156 routes / 131 info pages.
- `[CHORE]` README/AGENTS/CLAUDE/PAD/SKILL/reference-investigation swept in lockstep (counts
  7/71 → 8/86 unit, 128 → 156 routes); the stale §7 counts (7/62, 24 tests) this cycle's audit
  caught were corrected; 17 screenshots under `docs/screenshots/` (the standing 13 + the Home
  flyout, the Mac family rows, the mobile Home expansion, the store-watch page);
  `scripts/capture-screenshots.sh` extended; worklog Task 116.

#### Revision Block — v1.2 (the session-3 full-sweep content-model cycle)

- `[SR]` The session-3 cycle (2026-11-27 late, `docs/REMEDIATION_PLAN.md` session-3 section) ran
  the standing verification on the pulled tree (9841cb1) — baseline gates exactly as documented —
  plus a read-only audit (0 CRITICAL/HIGH; 1 MEDIUM, 3 LOW, 6 INFO) and an agent-browser
  full-sweep of **all eleven** reference flyouts (session 2 captured Store/Mac/iPhone/Support
  only). Measured deltas: the live reference had grown an Entertainment flyout (Explore
  Entertainment + Support), a single-Quick-Links Home flyout, a two-section Accessories flyout,
  a seasonal `Shop Gifts` store label, a 9-row (no Home) Explore Support, and per-category
  More-from label drift (Wallet, Pay; watchOS 27; visionOS 27; iPadOS 27; Apple Creator Studio;
  Education; Hearing Health; Apple Watch Straps; Book a Demo; Apple Vision Pro for Enterprise…).
- `[FIX]` `flyoutSections()` rewritten to the live-measured per-category structures (tests RED
  first — `site-content.test.ts` 9 → 18 tests pinning structures, label lists, the routeHref
  grammar and the no-dead-slugs invariant); `INFO_TITLES` now derives only from links that route
  to `#/info/` — the nine store-routed footer labels stop seeding orphan routes (audit LOW-2);
  `scripts/build-sitemap.mjs` resolves `VITE_SITE_URL` via Vite `loadEnv` so the documented
  `cp .env.example .env` flow stamps the base (audit MEDIUM-1 — the shell env still wins);
  dead `src/utils/cn.ts` deleted with the unused `clsx`/`tailwind-merge` deps (LOW-1); mobile
  accordion sub-links carry `py-2` touch padding (≈39px hit area, reference 33px — LOW-3).
- `[VERIFY]` Full gate green after the change: lint 0 errors · typecheck clean ×2 · unit 7 files /
  71 tests · build 307.1 kB / 92.3 kB gzip (CSS 32.1 kB / 489 rules) · e2e 25/25 · smoke 45/45,
  zero console errors. Live on the dev server: the Entertainment flyout renders the reference's
  two-section content (10 links), the Home flyout its 5-link Quick Links, all 11 mobile rows
  carry expand buttons, and the sub-links measure 39px. Sitemap regenerated: 128 routes
  (103 info pages). `.env`-file base verified by a custom-origin run
  (`https://envfile-test.example.org` stamped into both files).
- `[CHORE]` README/AGENTS/CLAUDE/PAD/SKILL/reference-investigation/DEPLOYMENT swept in lockstep
  (counts 7/62 → 7/71 unit, 24 → 25 e2e, 123 → 128 routes); 13 screenshots under
  `docs/screenshots/` (the standing 10 + the Entertainment flyout, the iPhone flyout and the
  mobile Entertainment expansion); `scripts/capture-screenshots.sh` added (reproducible captures);
  worklog Task 115.

#### Revision Block — v1.1 (the session-2 live-parity pass)

- `[SR]` The session-2 cycle (2026-11-27 evening, `docs/REMEDIATION_PLAN.md` session-2 section)
  re-audited the remediated tree (0 CRITICAL/HIGH findings) and ran an agent-browser live-parity pass
  against `https://www.apple.com/sg/` at 1440×900 and 390×844. Measured deltas: the reference's mobile
  bar (logo flush left; Search + Bag + hamburger flush right — measured x=0/246/294/342, 48px targets),
  its two-level accordion mobile menu, and the desktop flyouts' three-section structure
  (Explore/Shop/More-from; Store: Shop/Quick Links/Special Stores; Support: Explore Support/Get
  Help/Helpful Topics). Parity confirmed for gallery autoplay (dwell ≈4.16 s) and the holiday animation.
- `[FIX]` `src/lib/site-content.ts` gained the tested `flyoutSections()` seam — the reference's
  three-section content model with informational labels joining the `INFO_TITLES` derivation; the
  sitemap route set grew 82 → 123 (derived, never hand-listed). `GlobalNav` restructured: mobile bar
  per the live measurements, accordion mobile menu (top rows navigate; expand buttons reveal the
  flyout content; independent toggles per the footer-accordion convention), desktop flyouts render
  the three sections (24px/600 links, 12px #86868b headings — reference-measured). `renderRobots()`
  joined the sitemap seam: `npm run sitemap` now writes BOTH `sitemap.xml` and `robots.txt` from one
  `VITE_SITE_URL` (the prior generator silently left the robots `Sitemap:` line at localhost while
  `.env.example` claimed otherwise — audit MEDIUM-1, fixed). Unused `@testing-library/*` devDeps
  removed; `tsconfig.tests.json` now covers `scripts/**/*.mjs` (allowJs + checkJs, verified clean);
  the gallery/duo e2e waits converted from fixed sleeps to state-based polling.
- `[VERIFY]` Full gate green after the restructure: lint 0 errors · typecheck clean ×2 · unit 7 files /
  62 tests · build 305.5 kB / 92.4 kB gzip (CSS 32.1 kB / 489 rules) · e2e 24/24 · smoke 45/45, zero
  console errors. Mobile bar geometry re-measured on the dev server at 390×844 — byte-equal to the
  live reference's button positions (logo x=0 w=48, Search x=246, Bag x=294, Menu x=342, all 48px).
- `[CHORE]` README/AGENTS/CLAUDE/PAD/SKILL/reference-investigation swept in lockstep (counts 6/50 →
  7/62 unit, 21 → 24 e2e, 82 → 123 routes); 10 screenshots re-captured under `docs/screenshots/`;
  worklog Task 114.

#### Revision Block — v1.0 (the remediation of the `sonnet 5.5 v1` code-drop)

- `[SR]` The repo's `main` carried a wholesale code replacement (commit `eb47784`,
  "sonnet 5.5 v1") that transplanted this React 19 + Vite 7 + Tailwind v4 SPA over the
  previous Next.js/ElyBeauty tree **while leaving the old app's infrastructure files in
  place**. The audit (2026-11-27, `docs/REMEDIATION_PLAN.md`) found the build and dev
  server broken by the stale `postcss.config.mjs`, the vendored `skills/` folder inside
  Vite's dependency scan and Tailwind v4's content scan (136 kB of prose-leaked CSS,
  23 MB of dead ElyBeauty imagery shipping to `dist/`), a dead Playwright config aimed
  at the old app's spec tree, no ESLint gate, no sitemap/robots/OG SEO surface, and a
  four-document set (AGENTS/CLAUDE/PAD/DEPLOYMENT) describing the previous application.
- `[FIX]` Remediation (TDD where assertable): stale configs and dead assets removed
  (`postcss.config.mjs`, `next.config.ts`, `prisma/`, `scripts/` remnant, `public/images/`,
  `tsconfig.tests.json`); `vite.config.ts` gained `optimizeDeps.entries` + watch scoping;
  `src/index.css` gained the full `@source not` exclusion set (measured: CSS 136,456 →
  31,632 bytes, rules 1,885 → 476; build 4.7 s → 1.3 s; `dist/index.html` 404.7 →
  301.5 kB after the SEO meta); ESLint 10 flat config + gate scripts landed in `package.json`; Playwright
  was re-anchored to the production build (3 spec files, 21 tests, `vite preview` on
  `127.0.0.1:4173`); the sitemap seam (`src/lib/sitemap.ts`, 6 tests) + generator
  (`scripts/build-sitemap.mjs`, 82 routes) + `robots.txt` + OG/JSON-LD landed; `.env.example`
  was rewritten to match the codebase (zero app-env reads).
- `[VERIFY]` Full gate green after remediation: `lint` 0 errors · `typecheck` clean ·
  `typecheck:tests` clean · unit 6 files / 50 tests · `build` succeeds · e2e 21/21 ·
  smoke 45/45 with zero console errors. Mobile navigation re-measured on the running
  dev server at 390×844 (menu geometry, typography, navigation, close-on-navigate all
  correct — no Tailwind v4 display-toggling defect; the menu mounts via React state).
  PostgreSQL 17 installed rootless per `docs/setup_pg_z.sh` (accepting connections at
  `postgresql://postgres:postgres@127.0.0.1:5432/app_db`).
- `[CHORE]` This document, `AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/DEPLOYMENT.md`,
  `apple-storefront-clone_SKILL.md`, `docs/reference-investigation.md` (ledger refresh),
  `worklog.md` and `docs/screenshots/` rewritten/created for the remediated tree;
  `docker-compose.yml` adapted from the nordhem sample to this repo's PG contract.

---

## Table of Contents

1. [System Overview & Decisions](#1-system-overview--decisions)
2. [High-Level System Topology](#2-high-level-system-topology)
3. [Application Architecture](#3-application-architecture)
4. [Data Architecture](#4-data-architecture)
5. [Design System Reference](#5-design-system-reference)
6. [Security Architecture](#6-security-architecture)
7. [Testing Strategy](#7-testing-strategy)
8. [Build & Deployment](#8-build--deployment)
9. [Developer Handbook](#9-developer-handbook)
10. [Known Issues & Outstanding Tasks](#10-known-issues--outstanding-tasks)
11. [Key Files Reference](#11-key-files-reference)
12. [Glossary](#12-glossary)

---

## 1. System Overview & Decisions

### 1.1 Document Metadata & Purpose

This PAD is the single source of truth for the remediated `apple-storefront-clone`
codebase. Use it when onboarding, debugging, extending, auditing, or replicating
this application. New engineers: read §1–§3 first. Debugging: start at §3.3 and
AGENTS.md "Traps". Deploying: §8 plus `docs/DEPLOYMENT.md`.

### 1.2 Technology Stack Summary

| Layer | Technology | Version (pinned) | Key Rationale |
|---|---|---|---|
| UI runtime | React | 19.2.6 | Function components + hooks; the reference-parity interactions (flyouts, gallery, configurator) need no SSR |
| Language | TypeScript | 5.9.3, strict, `noUnusedLocals/Parameters` | The domain seam (`src/lib/*`) is pure and fully typed; strictness is the contract |
| Build tool | Vite | 7.3.7 | Fastest single-page toolchain; `vite-plugin-singlefile` 2.3.0 inlines the whole app into one `dist/index.html` |
| CSS engine | Tailwind CSS | 4.1.17 via `@tailwindcss/vite` | CSS-first v4: tokens in `@theme`, no JS config, Oxide-speed builds |
| Unit tests | Vitest | 4.1.12 (jsdom 29.1.1) | Same Vite pipeline and `@/` alias as the app; zero-config jsdom |
| E2E tests | Playwright | 1.65.1 (`@playwright/test`) | Chromium + iPhone 13 device emulation against the production build |
| DOM testing | React 19 `act` + `react-dom/client` directly | 19.2.6 | Component-level specs render via `createRoot`/`act` in jsdom (no Testing Library dependency — removed in session 2 as unused) |
| Lint | ESLint | 10.15.0 flat config + typescript-eslint 8.74.0 | Flat config ignoring the vendored prose folders |
| Package manager | npm | lockfile `package-lock.json` | One lockfile, one manager — the reproducibility rule |
| A11y scans | @axe-core/playwright | ^4.14.1 (devDep) | The e2e a11y tier scans WCAG 2 A+AA; nothing ships in the single-file artifact |
| Local DB (optional) | PostgreSQL | 17 (rootless) or docker `postgres:17-alpine` | The repo family's documented local environment; this SPA does not connect to it |

No backend, no ORM, no auth, no payment provider, no external services at runtime.

### 1.3 Architecture Decision Records (ADRs)

**ADR-001: Single-page React 19 app built by Vite into one self-contained HTML file.**
- **Context:** The clone must run from `file://`, any static host, and the repo's own
  tooling without a Node server (the previous tree was Next.js 16 with Prisma + SQLite).
- **Decision:** React 19 + Vite 7 + `vite-plugin-singlefile` 2.3.0; the build output is
  exactly `dist/index.html` (~306 kB, ~92 kB gzip).
- **Rationale:** Education/parity artifact, not a service; single-file keeps the
  deployment story trivial and the artifact auditable.
- **Consequences:** No SSR, no server-side metadata, no `next/*` infrastructure; SEO
  posture is bounded by ADR-007. All state is client-side.
- **Alternatives rejected:** Next.js (the prior app — deleted precisely because a
  storefront clone does not need a server); plain static HTML (no componentization).

**ADR-002: Hash-based routing.**
- **Context:** A single-file artifact with no server rewrites must handle ~156 routes.
- **Decision:** `src/lib/router.ts` parses `location.hash` (`#/store/mac`,
  `#/product/iphone-18-pro`, `#/search?q=…`); `routeHref.*` factories build every href.
- **Rationale:** Works from `file://` and any static host; no 404-handling server
  needed; hostile input degrades to a typed 404 route instead of a render throw.
- **Consequences:** Search engines collapse routes onto the entry URL (SEO tradeoff
  owned by ADR-007); `App.tsx` owns navigation side-effects (title, scroll reset, focus).
- **Alternatives rejected:** History/path routing (needs a server or rewrites; breaks
  the `file://` guarantee).

**ADR-003: Tailwind CSS v4, CSS-first, with strictly scoped source detection.**
- **Context:** v4 auto-scans every non-ignored text file for class candidates; this repo
  vendors ~50 MB of skills/docs prose full of class-shaped tokens.
- **Decision:** Tokens in `@theme` in `src/index.css` (SF Pro stacks, ink/canvas/link
  colors, custom `tablet`/`nav`/`wide` breakpoints); component CSS in
  `@layer components`; `@source not` excludes skills/, docs/ and root prose; Vite's
  scanner pinned to `index.html` via `optimizeDeps.entries`.
- **Rationale:** Measured — unscoped scanning leaked 105 kB of dead CSS (1,885 rules
  vs 476 real) and broke the dev dependency scan on `skills/**/reference.html`
  importing `three`; scoping shrank the build 4.7 s → 1.3 s.
- **Consequences:** New root-level prose files must join the `@source not` set.
- **Alternatives rejected:** JS `tailwind.config.js` (v3 pattern; unnecessary in v4);
  deleting the vendored folders (they are the operator's reference library).

**ADR-004: Pure domain seam + in-memory store; no persistence.**
- **Context:** The reference is a marketing page; the superset (store, bag, checkout)
  must stay demo-honest and testable.
- **Decision:** All logic in `src/lib/*` (catalog, cart reducer, router, money, checkout
  validation, content, sitemap); the single shared store is
  `src/context/BagContext.tsx` (React context + reducer, in-memory only).
- **Rationale:** The seam is unit-testable without rendering (105 tests, incl. the
  one render-level component spec); "no backend,
  nothing transmitted" is an explicit documented deviation, not an accident.
- **Consequences:** Bag/order state resets on reload (documented limitation).
- **Alternatives rejected:** localStorage persistence (silently changes the privacy
  story of a demo that claims it stores nothing).

**ADR-005: Original SVG art only.**
- **Context:** Apple's photography/video is proprietary.
- **Decision:** `src/components/ProductArt.tsx` ships original inline SVG art per
  product; gradients replace the TV+ gallery backdrops; links point to `tv.apple.com/sg`.
- **Rationale:** Legal posture for an unaffiliated educational clone; keeps the
  single-file build lean.
- **Consequences:** Visual fidelity of tiles is "same language", not pixel-identical
  media; the parity dossier pins tokens instead of media.

**ADR-006: Three-tier test suite against the production artifact.**
- **Context:** The dev server is not the build; parity claims must be executable.
- **Decision:** Vitest for the seam + the one render-level component spec (108 tests
  at the session-8 measurement); Playwright against
  `npm run build && vite preview --host 127.0.0.1` (40 tests: tokens,
  mobile-navigation state machine, store flow incl. hostile routes, axe-core
  WCAG 2 A+AA scans); the exhaustive
  45-assertion `file://` smoke battery as the parity net.
- **Rationale:** The token assertions ARE the parity evidence; the mobile spec pins
  the v4 display-utility trap class; hostile-route assertions pin XSS-as-text.
- **Consequences:** `npm run test:e2e` costs ~60 s (build included; the axe
  tier added ~25 s); acceptable for
  the gate.
- **Alternatives rejected:** Component-mount tests as the main tier (seam-first is
  faster and the DOM contracts are already covered by e2e).

**ADR-007: SEO posture — generated sitemap, honest hash-route caveat.**
- **Context:** Hash routes collapse to one URL for crawlers (ADR-002 consequence).
- **Decision:** `src/lib/sitemap.ts` enumerates the real route set (204 URLs at the
  session-9 measurement — the session-9 store-rail info labels joined the derivation) from the
  live catalog and footer map (tested, never hand-maintained);
  `scripts/build-sitemap.mjs` regenerates `public/sitemap.xml` against
  `VITE_SITE_URL`; `robots.txt`, OG/Twitter meta and JSON-LD ship in the entry HTML.
- **Rationale:** The route set stays tool-visible and future path-routing-ready
  without pretending the SPA has per-route SEO parity.
- **Consequences:** Deployments must point `robots.txt`'s Sitemap line and OG/canonical
  at their own origin (documented in DEPLOYMENT.md §3).

**ADR-008: Vendored `skills/` and `docs/` are out of every toolchain.**
- **Context:** The operator's standing contract: those folders are reference prose,
  excluded from checking, testing and compilation.
- **Decision:** Excluded from ESLint, TypeScript, Vitest, Playwright, Tailwind
  (`@source not`) and Vite's dep scan (`optimizeDeps.entries`). AGENTS.md owns the
  enforcement checklist.
- **Rationale:** Un-scoped, they broke the build (ADR-003 evidence) and would keep
  doing so via any config that reintroduces scanning.

---

## 2. High-Level System Topology

```text
Browser (Chromium/Firefox/Safari — headless Chromium is the verified one)
  │
  │  HTML + inlined JS + inlined CSS  (dist/index.html — one file, no network beyond itself)
  ▼
┌─────────────────────────────────────────────────────────────┐
│ React 19 SPA                                                 │
│  App.tsx ─ GlobalNav / pages / Footer                        │
│  hash router (src/lib/router.ts) ──> route switch            │
│  BagContext (in-memory)                                      │
│  pure seam: src/lib/* (catalog, cart, money, checkout, …)     │
└─────────────────────────────────────────────────────────────┘
  │  no outbound calls; no persistence; nothing transmitted

Static serving: file://, vite preview, or any static host (DEPLOYMENT.md)

Optional local environment (repo family standard, unused by the SPA):
  PostgreSQL 17 — rootless (docs/setup_pg_z.sh) or docker compose
  postgresql://postgres:postgres@127.0.0.1:5432/app_db
```

Runtime characteristics: zero network after load; all interactions are
client-side state; the only external links are the footer/store destinations
marked as external in the dossier.

---

## 3. Application Architecture

### 3.1 The Layer Model

```
Layer 0: Entry        index.html + main.tsx — mounts App under StrictMode. Rule: no logic here.
Layer 1: Composition  App.tsx (route switch + navigation side-effects), pages/* — one file per route.
                     Rule: pages compose components and the seam; they own no domain logic.
Layer 2: Components   components/* (GlobalNav, SearchPanel, Tile, EntertainmentGallery,
                     Footer, ProductArt, ProductCard, Ribbon, Icons, PageShell,
                     ErrorBoundary, BagLineRow, BagSummary). Rule: presentational +
                     local UI state (panels/flyouts); interaction effects (in-view, media) via hooks/.
Layer 3: Shared state context/BagContext.tsx — the ONE store. Rule: in-memory only.
Layer 4: Domain seam  src/lib/* — pure, typed, unit-tested. Rule: no React imports.
Layer 5: Design system src/index.css — @theme tokens + @layer components. Rule: utilities win
                     the cascade over component CSS; prose folders excluded via @source not.
```

**Golden Rule:** logic that needs a test lives in Layer 4; everything above it is
rendering and wiring. A behavior change that cannot be pinned in Layer 4 or an e2e
spec is not done.

### 3.2 Annotated Directory Structure

```text
apple-storefront-clone/
├── index.html                  ← entry HTML; SEO meta + JSON-LD live here
├── package.json                ← gate scripts (lint/typecheck/test/build/e2e/smoke/sitemap/gate)
├── vite.config.ts              ← react + @tailwindcss/vite + singlefile; dep-scan scoped to index.html
├── vitest.config.ts            ← jsdom environment, src/**/*.test.{ts,tsx}
├── playwright.config.ts        ← 2 projects (desktop 1440×900, mobile iPhone 13) over vite preview
├── eslint.config.mjs           ← ESLint 10 flat config; skills/docs ignored
├── tsconfig.json / tsconfig.tests.json ← strict app config / tests+configs+scripts config
├── docker-compose.yml          ← optional PG 17 (loopback-bound) for the local environment
├── src/
│   ├── main.tsx                ← createRoot mount
│   ├── App.tsx                 ← route switch, document.title, scroll/focus reset, skip link
│   ├── index.css               ← Tailwind v4 @theme tokens + @layer components CSS
│   ├── components/             ← GlobalNav (flyouts + mobile accordion menu), SearchPanel, Tile,
│   │                             EntertainmentGallery, Footer, ProductArt (SVG art),
│   │                             ProductCard, Ribbon, Icons, PageShell, ErrorBoundary
│   │                             (page-level render guard), BagLineRow, BagSummary,
│   │                             StoreRails (the editorial rails + quick-links strip)
│   ├── pages/                  ← HomePage, StorePage, ProductPage, BagPage, CheckoutPage,
│   │                             ConfirmationPage, SearchPage, StaticPages (info/support/404)
│   ├── context/BagContext.tsx  ← the ONE store (in-memory bag + last order)
│   ├── hooks/                  ← useRoute (useSyncExternalStore over hashchange), browser.ts
│   │                             (useMediaQuery, usePrefersReducedMotion, useInView)
│   ├── lib/                    ← THE SEAM: catalog, cart, router, money, checkout,
│   │                             home-content, site-content (+flyoutSections), sitemap,
│   │                             route-title, store-rails (the seven measured editorial
│   │                             rails + quick-links strip), slug (each with *.test.ts
│   │                             except the 9-line slug module)
├── tests/
│   └── e2e/                    ← home.spec.ts, mobile-navigation.spec.ts, store-flow.spec.ts,
│                                 smoke.mjs (the 45-assertion file:// battery)
├── scripts/
│   └── build-sitemap.mjs       ← regenerates public/sitemap.xml + public/robots.txt from the seam
├── public/
│   ├── sitemap.xml             ← 204 routes, generated (npm run sitemap)
│   └── robots.txt              ← generated alongside the sitemap (same VITE_SITE_URL)
├── docs/                       ← reference-investigation.md (parity dossier), DEPLOYMENT.md,
│                                 REMEDIATION_PLAN.md (this cycle's audits), screenshots/,
│                                 setup_pg_z.sh + ssh wrapper runbook (operator tooling)
├── skills/                     ← vendored reference library — OUT of every toolchain (ADR-008)
├── AGENTS.md / CLAUDE.md / README.md / apple-storefront-clone_SKILL.md
└── worklog.md                  ← session log
```

### 3.3 Critical Code Patterns

**Pattern 1 — the pure seam (testability).**

```ts
// src/lib/router.ts — the route grammar, no React, fully unit-tested.
export function parseHash(hash: string): Route {
  const withoutHash = hash.replace(/^#/, "");
  const [pathPart = "", queryPart = ""] = withoutHash.split("?");
  const segments = pathPart.split("/").filter(Boolean).map((s) => safeDecode(s));
  if (segments.some((s) => s === undefined)) return NOT_FOUND; // malformed URI escape → 404, never a throw
  const [head, arg, ...rest] = segments as string[];
  if (rest.length > 0) return NOT_FOUND;                        // /a/b/c is not a route
  switch (head) { /* typed route table … */ }
}
```

*Why:* the whole navigation contract (including hostile inputs) is 85 lines of pure
TypeScript with 8 tests; components never parse locations themselves.

**Pattern 2 — conditional mounting for overlays (the Tailwind v4 display trap).**

```tsx
// src/components/GlobalNav.tsx — the mobile menu MOUNTS; nothing toggles display utilities.
{panel === "menu" ? (
  <div id="mobile-menu" className="absolute … nav:hidden">…accordion rows…</div>
) : null}
// MobileMenuRow — each accordion section body mounts per-row the same way:
{open ? <div id={`${link.id}-menu-section`}>…flyout sections…</div> : null}
```

*Why:* v4 changed display-utility generation order; JS-toggling `hidden` against
`flex` is unreliable (tailwindlabs/tailwindcss#15884). Static pairs
(`hidden nav:flex`, `nav:hidden`) resolve by cascade at ≥834px — measured and pinned
by `tests/e2e/mobile-navigation.spec.ts`.

**Pattern 3 — cascade discipline (`@layer components`).**

```css
/* src/index.css */
@source not "../skills";        /* prose never feeds the class graph (ADR-003) */
@theme { --breakpoint-nav: 834px; --color-action: #0071e3; … }
@layer components { .globalnav { … } /* utilities like nav:hidden can override these */ }
```

*Why:* an unlayered `.globalnav` rule would beat `nav:hidden` in the cascade; the
layer is the contract that lets utilities win.

**Pattern 4 — measured tokens as executable parity.**

```ts
// tests/e2e/home.spec.ts — the reference's CSS measured and asserted, not eyeballed.
expect(css).toEqual({ h: "56px", hw: "600", sub: "28px", btnR: "980px",
  btnBg: "rgb(0, 113, 227)", tileH: "692px", promoH: "580px", navH: "44px",
  promoH3: "40px", footerBg: "rgb(245, 245, 247)" });
```

*Why:* the dossier's token table is enforced on every e2e run; drift fails the gate.

---

## 4. Data Architecture

There is no database. The domain model is typed constants + in-memory state:

- **Catalog** (`src/lib/catalog.ts`): 8 `Category`s, 12 `Product`s with option
  matrices (choices with SGD deltas, colour hex swatches), an id→product index,
  and a token-substring AND-match search.
- **Cart** (`src/lib/cart.ts`): a reducer over `CartLine[]` (add / setQuantity /
  remove / clear) with `MAX_LINE_QUANTITY = 10`; `lineKey` canonicalizes
  option selections so a product+configuration is one line.
- **Money** (`src/lib/money.ts`): `Intl.NumberFormat("en-SG")`, GST (9%) derived
  inclusively from totals — Singapore retail quoting convention.
- **Checkout** (`src/lib/checkout.ts`): Singapore field validation (6-digit postal,
  8-digit local phone with `+65` stripping, email shape) + a 32-symbol order
  number from `crypto.getRandomValues`.
- **Order** (`src/context/BagContext.tsx`): `placeOrder` snapshots the bag into
  `lastOrder` and clears it — the support page's order-status lookup reads that
  snapshot in-session.
- **Store rails** (`src/lib/store-rails.ts`): the reference's seven measured editorial
  rails + the quick-links strip as typed constants — 68 cards (eyebrow/label/desc,
  catalog matches carrying `productId`, editorial cards carrying the measured
  bg/fg theme) routed by the flyout `familyLink` rule; `RAIL_INFO_LABELS` feeds the
  `INFO_TITLES` derivation so the sitemap's 204 routes stay derived from one source.

Optional local PostgreSQL 17: installed for the repo family's standard environment
(rootless via `docs/setup_pg_z.sh`, or `docker compose up -d`); connection
`postgresql://postgres:postgres@127.0.0.1:5432/app_db`. This application never
connects to it — see `docs/DEPLOYMENT.md` §4.

---

## 5. Design System Reference

### 5.1 Typographic System

| Token | Value | Usage |
|---|---|---|
| `--font-display` | "SF Pro Display", SF Pro Icons, -apple-system, BlinkMacSystemFont, Helvetica Neue, Arial | Headlines, tiles, nav large text |
| `--font-text` | "SF Pro Text", same fallbacks | Body, buttons, footer |
| Tile headline | 56 / 48 / 32 px, weight 600, reference-measured | `.typography-tile-headline` |
| Tile subhead | 28 / 24 / 19 px, weight 400 | `.typography-tile-subhead` |
| Promo headline | 40 / 32 px | `.section-promo` override |
| Body base | 17 px / 1.47059, tracking −0.022em | `body` |
| Nav | 12 px / 1, tracking −0.01em | `.globalnav` |

### 5.2 Color Tokens

| Token | Value | Usage |
|---|---|---|
| `--color-ink` | `#1d1d1f` | Primary text |
| `--color-ink-muted` | `#6e6e73` | Secondary text |
| `--color-canvas` | `#f5f5f7` | Footer/background washes |
| `--color-link` | `#0066cc` | Links/CTAs (light surfaces) |
| `--color-link-dark` | `#2997ff` | Links on dark surfaces |
| `--color-action` | `#0071e3` | Primary button (hover `#0077ed`, active `#006edb`) |
| `--color-hairline` | `#d2d2d7` | Hairline borders |

### 5.3 Component Primitives

Buttons (`.button` 980px-radius pill, `button-secondary`, `button-block`), the `.link-cta` chevron link, `.globalnav` translucency
(`rgba(22,22,23,.8)` + `backdrop-filter: saturate(180%) blur(20px)`), tile grid
(12px gaps, `--tile-h` 692/650/580 per breakpoint; promos 580/570/500), the
gallery card (1250/668 aspect, 28px radius), the dotnav progress-fill dots.

### 5.4 Motion

Ribbon blue→charcoal (0.8 s, 1.6 s delay); flyout-in (0.24 s); duo subhead reveal
(0.9 s cubic-bezier); PROLED sweep (1.6 s); gallery dwell 4.16 s; `art-float`
(6/7.5/5 s alternating). **Reduced motion:** a global `@media
(prefers-reduced-motion: reduce)` block pins every animation/transition to ~0 ms.

---

## 6. Security Architecture

### 6.1 Security Rules

| Rule | Enforcement |
|---|---|
| All external input (hash, query) validated by the router grammar | `parseHash` whitelists routes; malformed → typed 404; unit tests + hostile-route e2e |
| XSS payloads render as text | React escaping (no `dangerouslySetInnerHTML` anywhere — verified); e2e pins `<script>` payload as visible text, not DOM |
| No secrets, no keys, no PII at rest | The app stores/transmits nothing; `.env.example` documents zero app-env reads; no credentials in repo (the old app's keys never carried over) |
| Dependency posture | `npm ls` clean tree; no network calls at runtime → minimal surface |

### 6.2 Threat Model Notes

An educational client-only demo: the realistic classes are DOM-XSS via hostile
route fragments (mitigated above and pinned by tests) and supply-chain risk in
dependencies (npm-audit clean at remediation time; no runtime outbound calls
reduce exploitability). There is no auth surface because there are no
credentials.

---

## 7. Testing Strategy

### 7.1 Test Distribution

| Category | Files | Tests | Location | Framework |
|---|---|---|---|---|
| Unit (seam) | 11 | 126 | `src/lib/*.test.ts` | Vitest 4 + jsdom |
| Unit (component) | 1 | 4 | `src/components/ErrorBoundary.test.tsx` | Vitest 4 + jsdom (React `act`) |
| E2E — desktop | 1 | 8 | `tests/e2e/home.spec.ts` | Playwright (1440×900) |
| E2E — mobile nav | 1 | 11 | `tests/e2e/mobile-navigation.spec.ts` | Playwright (iPhone 13 viewport, touch) |
| E2E — store flow | 1 | 13 | `tests/e2e/store-flow.spec.ts` | Playwright (1440×900) |
| E2E — a11y scans | 1 | 13 | `tests/e2e/a11y.spec.ts` | Playwright + @axe-core/playwright (WCAG 2 A+AA) |
| File:// smoke battery | 1 | 45 assertions | `tests/e2e/smoke.mjs` | Playwright library |

### 7.2 Test Patterns

- **Seam-first:** every `src/lib` module has adjacent tests for grammar/validation
  edge cases (malformed URI escapes, invalid quantities, hostile slugs).
- **Production-artifact e2e:** the suite boots `npm run build` + `vite preview`
  (127.0.0.1:4173) — never the dev server (the dev server is not the build).
- **Console-zero contract:** both the e2e projects and the smoke battery fail on
  any console error/warning or pageerror.
- **Count lockstep:** counts above must be swept across README/PAD/SKILL in the
  same commit they change (`rg "<old number>"`).

### 7.3 Pre-PR / Pre-Push Checklist

- [ ] `npm run lint` exit 0
- [ ] `npm run typecheck` && `npm run typecheck:tests` clean
- [ ] `npm run test` — 12 files / 130 tests
- [ ] `npm run build` — single-file `dist/index.html`
- [ ] `npm run test:e2e` — 45 passed (32 pins + 13 axe scans)
- [ ] `npm run test:smoke` — 45 assertions, zero console errors
- [ ] Docs touched in the same commit; counts in lockstep

---

## 8. Build & Deployment

### 8.1 Production Build

`npm run build` → `vite build` with `react()`, `@tailwindcss/vite`, and
`viteSingleFile()` → **one artifact: `dist/index.html`** (measured 349.26 kB /
102.71 kB gzip this cycle; CSS 37,986 bytes / 579 rules). No server bundle, no image
pipeline, no external requests.

### 8.2 Environment Variables

| Variable | Required | Read by | Default |
|---|---|---|---|
| `VITE_SITE_URL` | no | `scripts/build-sitemap.mjs` only | `http://localhost:5173/` |

The SPA itself reads no environment variables (verified).

### 8.3 Deployment

The artifact runs from `file://`, `vite preview`, or any static host. Full runbook
with the deployment checklist, the optional rootless PostgreSQL 17 / docker-compose
local environment, and origin-specific SEO steps: **`docs/DEPLOYMENT.md`**.

### 8.4 CI/CD

None hosted — the local gate (`npm run gate`) is the only gate, enforced before
every push (AGENTS.md contract).

---

## 9. Developer Handbook

### 9.1 Local Setup

```bash
git clone https://github.com/nordeim/apple-storefront-clone.git
cd apple-storefront-clone && npm install
npm run dev                    # http://localhost:5173
# optional local PostgreSQL 17 (the family standard): bash docs/setup_pg_z.sh
```

### 9.2 Common Commands

See the table in `README.md` / `AGENTS.md` (identical contract; `npm run gate`
chains the full order).

### 9.3 Code Style Rules

TypeScript strict + ESLint 10 flat config (typescript-eslint recommended +
react-hooks flat recommended). No `any`; no `console.log` in `src/`; prose
folders never enter a toolchain.

### 9.4 Git Workflow

`main` only, atomic Conventional Commits, push via the SSH wrapper runbook
(`docs/how-to-git-push-using-ssh-wrapper_SKILL.md` — the wrapper's default remote
is the previous project; pass `--remote
git@github.com:nordeim/apple-storefront-clone.git`).

---

## 10. Known Issues & Outstanding Tasks

| Priority | Issue | Impact | Status |
|---|---|---|---|
| INFO | Bag/order state is in-memory and resets on reload | Demo-honest by design (ADR-004) | Documented deviation |
| INFO | Safari/WebKit + Firefox + real-device touch + screen readers unverified | Parity evidence is Chromium-only | Open (environment) |
| INFO | Hash routing limits per-route SEO | Crawlers collapse routes onto the entry URL | Documented (ADR-007) |
| INFO | Fonts fall back to Arial/DejaVu without SF Pro | Wider rendering on such machines | Documented limitation |
| LOW | OG/canonical/robots-Sitemap origin is a placeholder | Real deploys must point SEO tags at their origin (DEPLOYMENT.md §3) | Open by design |
| LOW | `react-refresh/only-export-components` warnings (3 files) | Cosmetic dev-tooling warnings on intentional dual exports | Accepted |

The full remediation history of this cycle: `docs/REMEDIATION_PLAN.md`.

---

## 11. Key Files Reference

| File | Lines | Purpose |
|---|---|---|
| `src/lib/router.ts` | 98 | The hash-route grammar; every href factory + `hasBuyParam` |
| `src/lib/route-title.ts` | 39 | The tab-title seam (full-form store labels, matching the h1) |
| `src/lib/catalog.ts` | 356 | The typed catalog: 8 categories, 12 products, option matrices, search |
| `src/lib/cart.ts` | 103 | The bag reducer + price/line-key seam (`bagLineSummary`) |
| `src/lib/checkout.ts` | 49 | Singapore checkout validation + order numbers |
| `src/lib/sitemap.ts` | 75 | Route-set enumeration + sitemap.xml/robots.txt rendering (204 URLs) |
| `src/lib/site-content.ts` | 445 | Nav links, the per-category flyout content model, footer directory, info-page map |
| `src/index.css` | 457 | Tailwind v4 tokens + all component CSS + source scoping |
| `src/components/GlobalNav.tsx` | 253 | Desktop flyouts, mobile accordion menu, bag popover, search trigger |
| `src/components/ProductArt.tsx` | 449 | The original SVG art library |
| `src/components/EntertainmentGallery.tsx` | 153 | The TV+ gallery state machine (dwell, pause, keys) |
| `src/components/BagLineRow.tsx` | 31 | The shared bag-line summary row (popover + checkout aside) |
| `src/components/ErrorBoundary.tsx` | 67 | Page-level render guard: graceful fallback, nav/bag state survive; `resetKey` re-arm |
| `src/components/BagSummary.tsx` | 25 | The shared Subtotal/Delivery/GST/Total ledger (bag page + checkout) |
| `src/lib/store-rails.ts` | 253 | The store index's seven measured editorial rails + quick-links strip (the rail content model, `railCardHref`, `productPriceLabel`) |
| `src/lib/category-rails.ts` | 360 | The six device category pages' measured shelf models (the D12 product cards, the content shelves, `CATEGORY_RAIL_INFO_LABELS`) |
| `src/lib/slug.ts` | 9 | The one label→slug grammar (extracted session 9 to keep the module graph acyclic) |
| `src/components/StoreRails.tsx` | 217 | The rail + quick-links rendering (measured card anatomy, theme-coloured editorial cards) + the category shelf family (CategoryShelves, the D12 product card with its Buy deep link) |
| `src/pages/StorePage.tsx` | 123 | Store index (h1 → quick links → chips → rails → "All products." grid) and category pages (h1 → chips → measured shelves → "All products." grid) |
| `src/App.tsx` | 98 | Route switch, navigation side-effects, the page-level ErrorBoundary |
| `tests/e2e/mobile-navigation.spec.ts` | 148 | The mobile-menu contract (bar layout, accordion, the v4 display trap) |
| `tests/e2e/smoke.mjs` | 131 | The exhaustive file:// parity battery (45 assertions) |
| `scripts/flyout-diff.mjs` | 73 | The standing flyout drift harness (Vite ssrLoadModule vs a saved reference extraction) |
| `vite.config.ts` | 30 | Build pipeline + dep-scan scoping (ADR-003) |
| `playwright.config.ts` | 47 | The two-project e2e harness over `vite preview` |

---

## 12. Glossary

- **Seam** — the pure, unit-tested logic layer in `src/lib/*` (term of art from the
  ely-beauty family).
- **Dossier** — `docs/reference-investigation.md`: the measured evidence of the
  reference site (tokens, deviations D1–D8, verification ledger).
- **Dwell** — the TV+ gallery auto-advance interval (4.16 s, measured).
- **Single-file build** — `dist/index.html` with inlined JS/CSS via
  `vite-plugin-singlefile`.
- **Token** — a measured reference value (type size, color, radius, height)
  reproduced in the clone's CSS and pinned by tests.
- **v4 display trap** — the Tailwind v4 class of bugs where JS toggles display
  utilities against conflicting static classes; avoided by conditional mounting.
