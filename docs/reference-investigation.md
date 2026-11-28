# Reference investigation: https://www.apple.com/sg/

Target origin: `https://www.apple.com/sg/` (public, no authentication). Observed once via HTTP fetch of the
page HTML plus its five stylesheets (`tiles`, `main`, `homepage`, `home-gallery`, `globalheader`). All fetched
content was treated as inert data. No write probes; no credentials involved.

Evidence labels: **Verified** (read directly from fetched source / measured in the clone), **Reasoned**,
**Assumed**, **Unknown** (blocker named).

## Page structure

| Region | Finding | Label |
|---|---|---|
| Ribbon | "Shop online and get Specialist help…"; blue→charcoal animation (0.8 s, 1.6 s delay); 14px text, 16px padding | Verified |
| Global nav | 11 links: Store, Mac, iPad, iPhone, Watch, Vision, AirPods, Home, Entertainment, Accessories, Support; search + bag | Verified (names); flyout content Unknown (injected by JS, not in HTML) |
| Hero (3 tiles) | Holiday 2026 (dark, content-bottom variant, 4 colourways, play/pause), iPhone Duo (light, "Hello, hello." animation), iPhone 18 Pro (dark) | Verified |
| Promo (6 tiles, 2-col) | HomeView, iPad, Apple Watch Series 12, MacBook Pro PROLED (shine sweep), MacBook Pro M6, AirPods Pro 3 | Verified |
| Gallery | 9 Apple TV+ items, tablist dot-nav with timed fill + pause, "Stream now", 4.16 s dwell | Verified |
| Footer | Legal notes, directory (Shop and Learn … About Apple), "More ways to shop", phone 1800-692-7753, legal links, locale | Verified |

## Measured tokens (from reference CSS) → clone

| Token | Reference | Clone (computed in browser) |
|---|---|---|
| Tile headline | 56 / 48 / 32px, 600 | 56px / 600 (desktop), 32px (390px) |
| Tile subhead | 28 / 24 / 19px, 400 | 28px |
| Promo headline | 40 / 32px | 40px |
| Button | 980px radius, `#0071e3`, hover `#0076DF` | 980px, `rgb(0,113,227)` |
| Tile gap / section | 12px grid gap | 12px |
| Tile height | `--hero-content-height` ∈ {692, 650, 580, 570, 500} | hero 692, promo 580 (desktop) |
| Breakpoints | 734 / 1068 | 734 / 1068 |
| Footer | `#f5f5f7`, 12px | `rgb(245,245,247)` |

Verified for Chromium at 1440×900 and 390×844 by `tests/e2e/smoke.mjs` ("tokens" assertion).

## Deviations ledger

| # | Deviation | Reason |
|---|---|---|
| D1 | Product imagery and hero videos replaced by original SVG art | Apple's assets are proprietary; keeps single-file build small |
| D2 | Which promo/hero tile height maps to which breakpoint is Assumed (the reference exposes the set of values, not the mapping) | CSS values read, media-query pairing partly inferred |
| D3 | Global nav is `position: sticky` (reference scrolls away) | Superset: bag/search reachable anywhere |
| D4 | Flyout content follows the reference's measured per-category structures (session-4 sweep: device categories Explore/Shop/More-from with the reference's full product-family rows in Explore; Home the restructured Explore/Shop/More-from model; Entertainment Explore+Support; Accessories Shop+Explore; Store and Support their captured three-section models; informational labels from the live flyouts; family labels that match a catalog product route to its product page); destinations outside the clone resolve to generated info pages | All eleven flyouts captured live twice (session 3 + session 4, 2026-11-27); the reference's family lists are its live Season-2026 state, re-capturable; the seasonal "Shop Gifts" label rotates on the reference and is modeled as content |
| D5 | Gallery backdrops are generated gradients; links go to `tv.apple.com/sg` | No hot-linking of `mzstatic.com` artwork |
| D6 | Catalog prices/specs are illustrative; the flyout's Explore rows model the reference's family labels (catalog-only products — MacBook Pro with PROLED XDR Display, AirTag 4-Pack, MagSafe Charger — stay reachable via the store pages, one click deeper) | Reference home page has no price data; the superset catalog is the clone's own (revised session 4) |
| D7 | Hash routing instead of path routing | Works from `file://` and any static host |
| D8 | Side gutters of 12px on ≥735px, none on mobile | Assumed from CSS padding rules; not pixel-compared |
| D9 | Mobile navigation restructured to the reference's measured layout (session 2): bar = logo flush left + Search/Bag/hamburger flush right; menu = two-level accordion (top rows navigate, expand buttons reveal the flyout sections); independent section toggles | Bar geometry measured live (x=0/246/294/342, 48px targets) and replicated byte-equal; the accordion's exclusivity semantics could not be conclusively measured live, so the clone follows its own footer-accordion convention (Reasoned) |

## Verification ledger (this build)

> Refreshed 2026-11-27 by the remediation cycle (`docs/REMEDIATION_PLAN.md`) and
> the session-2 live-parity pass. The as-committed `sonnet 5.5 v1` tree could
> NOT satisfy these rows — the stale `postcss.config.mjs` broke both the build
> and the dev server until it was removed (see the deviations note below).

| Check | Result |
|---|---|
| `npx tsc --noEmit` | clean (Verified) |
| `npx tsc --noEmit -p tsconfig.tests.json` (incl. scripts checkJs) | clean (Verified) |
| `npx vitest run` | 9 files, 99 tests pass (Verified, session-5) |
| `npm run lint` | 0 errors (Verified) |
| `npm run build` | succeeds, `dist/index.html` single file, 309.2 kB / 93.2 kB gzip, CSS 33.2 kB / 501 rules (Verified, session-5 re-measure) |
| `npm run test:e2e` (Playwright over `vite preview`) | 26/26 PASS (Verified, session-5) |
| `tests/e2e/smoke.mjs` (headless Chromium, `file://`) | 45/45 PASS, 0 console errors/warnings (Verified) |
| Mobile navigation re-measured on the dev server (agent-browser, 390×844) | bar geometry byte-equal to the live reference (logo x=0 w=48, Search x=246, Bag x=294, Menu x=342); accordion opens/expands/navigates/closes; no Tailwind v4 display-toggling defect (Verified) |
| Live parity pass against apple.com/sg (session 2) | gallery autoplay (dwell ≈4.16 s) and holiday animation confirmed matching; flyout three-section structure and mobile accordion modeled on live captures (Verified) |
| Live parity full-sweep against apple.com/sg (session 3) | all eleven flyouts re-captured; Entertainment/Home/Accessories structures and per-category label drift closed to the seam; every mobile row carries an expand button; sub-links 39px vs reference 33px; search typeahead and /store h1 parity confirmed; zero console errors (Verified) |
| Sitemap regeneration (session 4) | 156 routes / 131 info pages; `.env`-file VITE_SITE_URL verified by a custom-origin run stamped into both sitemap.xml and robots.txt (Verified) |
| Live parity re-verification (session 5) | all eleven reference flyout models re-extracted from the live DOM and programmatically diffed against `flyoutSections()` — all match (NBSP-normalized); nav order, hero/promo sequences and TV+ gallery titles match; clone mobile navigation re-measured working; zero reference drift (Verified) |
| Gate re-run + fixes (session 6) | 9 files / 102 unit (+3 `bagLineSummary`), 27/27 e2e (+1 in-app `?buy` focus pin), build 309.3 kB / CSS 33,212 B / 501 rules, smoke 45/45, zero console errors (Verified, session-6) |
| Live parity re-verification (session 6) | all eleven reference flyout models re-extracted fresh from the live DOM (Home flyout at `globalnav-submenu-link-tv-home`) and re-diffed programmatically against `flyoutSections()` — ALL ELEVEN MATCH; reference bar pins re-measured (logo w=49, Search x=246, Bag x=294, Menu x=342); hero ("Gifts they'll love." / iPhone Duo / iPhone 18 Pro), 6-promo sequence (Apple HomeView / iPad / Apple Watch Series 12 / MacBook Pro PROLED / MacBook Pro M6 / AirPods Pro 3) and TV+ gallery (9/9 titles) all match; clone mobile navigation re-measured working (open/expand/navigate/close, zero console errors) — zero reference drift this cycle (Verified) |
| Gate re-run + fixes (session 7) | 10 files / 105 unit (+1 unknown-choice `bagLineSummary` pin, +2 `ErrorBoundary` component spec), 28/28 e2e (+1 ghost-product `?buy` 404 focus pin, +back/forward popstate tail), build 310.4 kB / CSS 33,654 B / 518 rules, smoke 45/45, zero console errors (Verified, session-7) |
| Live parity re-verification (session 7) | all eleven reference flyout models re-extracted fresh from the live DOM (desktop nav; Home flyout at the `tv-home` category item) and re-diffed programmatically against `flyoutSections()` — ALL ELEVEN MATCH; reference bar pins re-measured (Search x=246, Bag x=294, Menu x=342); hero ("Gifts they'll love." / iPhone Duo / iPhone 18 Pro) and 6-promo sequence (Apple HomeView / iPad / Apple Watch Series 12 / MacBook Pro ×2 / AirPods Pro 3) match; clone mobile navigation re-measured working (bar byte-equal, open/expand/navigate/close, Mac expansion 3 sections / 26 links, zero console errors) — zero reference drift; environment-limited: the reference's TV+ gallery rail did not lazy-load into this session's headless render (parity rests on the session-4/5/6 extractions + the clone's e2e gallery pins — 9 cards / 9 dots verified in the DOM) (Verified / environment-limited) |
| Visual review of screenshots (desktop home, mobile, product) | done by eye; no pixel diff (Verified for what was viewed) |
| Safari / Firefox / real devices / screen readers | not run (Unknown: not available in this sandbox) |

Deviation D8's side-gutter behavior and all other rows above remain as
originally measured; the session-2 restructure changed no pinned visual token
(the e2e token assertions are byte-identical; the flyout/mobile-menu structure
follows the reference's own measured layout).
| Gate re-run + fixes (session 8) | 10 files / 108 unit (+2 `ErrorBoundary` re-arm/re-latch specs, +1 router trailing-segment pin), 40/40 e2e (+12 axe-core WCAG 2 A+AA scans over ten routes + mobile resting/menu-open states), build 310.7 kB / CSS 33,720 B / 519 rules, smoke 45/45, zero console errors (Verified, session-8) |
| Live parity re-verification (session 8) | all eleven reference flyout models re-extracted fresh from the live DOM (the Home item's flyout lives in the reference's legacy `globalnav-item-tv` container) and re-diffed programmatically against `flyoutSections()` — ALL ELEVEN MATCH; reference resting-bar pins re-measured byte-equal (logo x=0 w=49, Search x=246, Bag x=294, Menu x=342; back-chevron `visibility:hidden` at rest); hero ("Gifts they'll love." / iPhone Duo / iPhone 18 Pro), 6-promo sequence (Apple HomeView / iPad / Apple Watch Series 12 / MacBook Pro ×2 / AirPods Pro 3), **TV+ gallery rail (9/9 titles — it lazy-loaded into this session's headless render, closing the session-7 environment-limited gap)**, the /sg/store chip row (Mac · iPhone · iPad · Apple Watch · Apple Vision Pro · Home · AirPods · AirTag · Accessories) and the category-page h1 ("Shop Apple Watch") all match — zero reference drift (Verified) |
| Reference a11y measurement (session 8) | the reference's own home page ships a sr-only `<h1 class="visuallyhidden">Apple</h1>`; its promo ribbon link is #2997ff (rgb(41,151,255)), no underline, on the #1d1d1f `ribbon-content-wrapper` — the same design as this clone's pinned ribbon tokens (i.e. WCAG AA contrast/link-distinguishability fails originate at the reference); its TV+ rail dims inactive cards like this clone (measured with agent-browser, Verified) |
