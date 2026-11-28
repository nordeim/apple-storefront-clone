# Apple (Singapore) storefront clone

React 19 · TypeScript (strict) · Tailwind CSS v4 (CSS-first) · Vite 7 · Vitest · Playwright

A React 19 + TypeScript (strict) + Tailwind CSS v4 + Vite 7 single-page storefront that reproduces the
structure and visual language of `https://www.apple.com/sg/` and extends it with a working store.
It was built using the conventions of the `ely-beauty` reference repo (CSS-first Tailwind tokens, pure
domain seams in `src/lib/`, unit-tested logic, a browser smoke test, a written evidence dossier).

Educational clone — unaffiliated with Apple. Prices, specs and imagery are illustrative original SVG art;
Apple's proprietary assets were deliberately not copied or hot-linked.

## Commands

| Task | Command |
|---|---|
| Install | `npm install` |
| Dev server | `npm run dev` |
| Lint | `npm run lint` (ESLint 10 flat config — must exit 0) |
| Typecheck (app) | `npm run typecheck` |
| Typecheck (tests + configs) | `npm run typecheck:tests` |
| Unit tests | `npm run test` (Vitest, jsdom — 12 files / 130 tests) |
| Production build (single file → `dist/index.html`) | `npm run build` |
| E2E suite (builds + serves `dist/` via `vite preview`) | `npm run test:e2e` (Playwright — 45 tests incl. 13 axe-core a11y scans) |
| File-protocol smoke battery | `npm run test:smoke` (45 assertions over `dist/index.html`) |
| Regenerate `public/sitemap.xml` (337 routes) | `npm run sitemap` |
| Clean gate order | `npm run lint && npm run typecheck && npm run typecheck:tests && npm run test && npm run build && npm run test:e2e && npm run test:smoke` |

The Playwright E2E suite boots the production build (`npm run build` then `vite preview --host 127.0.0.1 --port 4173`),
so it exercises the same artifact that ships. `vite preview` binds to `127.0.0.1` explicitly — the
default `localhost` bind resolves to `::1` on some hosts and never answers the `127.0.0.1` readiness probe.

## Quick start

```bash
git clone https://github.com/nordeim/apple-storefront-clone.git
cd apple-storefront-clone
npm install
npm run dev          # → http://localhost:5173
```

**Verify setup** (all must pass):

```bash
npm run typecheck    # clean, no output
npm run test         # 12 files / 130 tests passed
npm run build        # dist/index.html (~349 kB single file)
npm run test:e2e     # 45 passed (32 pins + 13 axe a11y scans)
```

Node.js ≥ 20 (verified on Node 24); npm is the package manager and `package-lock.json` is the lockfile.

## What is in it

**Parity with the reference home page:** blue→charcoal ribbon, translucent global nav with hover flyouts (the
reference's measured per-category content model — Mac/iPad/iPhone/Watch/AirPods/Vision carry the
Explore/Shop/More-from structure with the reference's full product-family rows in Explore; Home carries
the reference's restructured Explore/Shop/More-from model; Entertainment and Accessories carry
two-section flyouts; Store and Support carry their captured three-section models), 3 hero tiles +
6 promo tiles (2-column grid ≥735px), the "Hello, hello." subhead reveal, the PROLED subhead light sweep,
the colour-cycling holiday tile with play/pause, the 9-title Apple TV+ gallery (auto-advance 4.16 s,
dot navigation, pause, swipe, arrow keys), the legal footnotes and the full footer directory (accordion
on ≤734px). Type scale, button geometry (980px pill), tile heights and breakpoints (734 / 1068) are taken
from the reference's CSS — `docs/reference-investigation.md` holds the measured token table and the
deviations ledger. The mobile navigation matches the reference's measured bar layout (logo flush left;
Search, Bag and the hamburger flush right) and its two-level accordion menu (every one of the 11 rows
carries an expand button; expansions reveal the same flyout content the desktop shows). The store page
carries the reference's measured quick-links strip (Shop Gifts · Find a Store · AirPods · Apple
Intelligence · Apple Trade In), the measured chip row (full-form labels, iPhone before iPad, AirTag
chip) and the reference's seven measured editorial rails — "The latest." / "Personalisation." /
"Holiday picks." / "Colourful finds." / "Home essentials." / "Only at Apple." / "Savings and
offers." — as a horizontal-scroller card family (measured headers, subheads, eyebrows, labels,
prices and card themes; catalog-matched cards route to the clone's product pages, everything else to
generated info pages) with the clone's superset product grid below ("All products."). The category
pages carry the reference's full-form h1 ("Shop Apple Watch") and their measured shelf models
(session-10: mac 7 shelves · ipad 7 · iphone 6 · watch 8 · vision 7 · home 5 — the "All models."
shelf renders the clone's catalog products in the reference's card anatomy with working Buy deep
links into the configurator, and the content shelves carry the reference's measured editorial,
accessory and service cards; the superset product grid follows below).

**Superset:** store with category filters and sorting, product pages with a configurator (options change
price), an in-memory bag with a nav popover, GST-inclusive totals (9%), validated Singapore checkout
(6-digit postal code, 8-digit +65 numbers), order confirmation, order-status lookup, live search
(overlay + results page), entertainment and support pages, 404 handling, skip link, focus management on
navigation, `prefers-reduced-motion` support, a page-level error boundary that keeps the shell usable after
a render crash (and recovers on the next navigation), and an axe-core WCAG 2 A+AA e2e scan tier.

## Architecture

```
src/lib/        pure, tested logic: catalog, cart reducer, router (hash), money, checkout validation,
                content + the flyout content model (per-category structures measured off the live
                reference; feeds nav flyouts, the mobile accordion menu and the sitemap route
                enumeration), store-rails (the store index's seven measured editorial rails + the
                quick-links strip; feeds the rail markup and the sitemap info routes),
                category-rails (the six device category pages' measured shelf models — the
                "All models." product cards derive from this catalog with working Buy deep
                links, the content shelves carry the reference's measured text; feeds the
                category shelf markup and the sitemap info routes),
                sitemap route enumeration (feeds public/sitemap.xml)
src/hooks/      useRoute (hashchange), media-query / in-view hooks
src/context/    BagContext (in-memory only)
src/components/ GlobalNav (desktop flyouts + mobile accordion menu), SearchPanel, Tile, EntertainmentGallery,
                Footer, ProductArt (original SVG art), ErrorBoundary (page-level render guard),
                BagLineRow + BagSummary (shared bag-line/summary rows),
                StoreRails + StoreQuickLinks (the store index's measured editorial rails),
                CategoryShelves (the category pages' measured shelf family, in StoreRails.tsx)
src/pages/      one file per route
tests/e2e/      Playwright suite (home, mobile-navigation, store-flow) + the file:// smoke battery
scripts/        build-sitemap.mjs (generates public/sitemap.xml from the tested seam)
docs/           reference-investigation.md (evidence + deviations ledger), DEPLOYMENT.md, screenshots/
```

Routing is hash-based (`#/store/mac`, `#/product/iphone-18-pro`) so the single-file build works from
`file://` and any static host. Component CSS lives in `@layer components` so Tailwind utilities can
override it (an unlayered rule would silently beat `nav:hidden`).

Tailwind v4 is CSS-first: the design tokens (SF Pro stacks, ink/canvas/link colors, the custom
`tablet`/`nav`/`wide` breakpoints) live in the `@theme` block of `src/index.css` — there is no
`tailwind.config.js` and none should be added. The vendored `skills/` and `docs/` prose is kept out of
Tailwind's auto-content-detection with `@source not` exclusions (and out of Vite's dependency scan via
`optimizeDeps.entries`) — without them, class-shaped tokens in the prose leak into the shipped CSS.

## Environment variables

The app reads **no** environment variables. One optional variable drives the sitemap generator only
(see `.env.example`):

| Variable | Read by | Default |
|---|---|---|
| `VITE_SITE_URL` | `scripts/build-sitemap.mjs` (base URL written into `public/sitemap.xml` / `robots.txt`) | `http://localhost:5173/` |

## SEO

`public/sitemap.xml` (337 routes) is generated from the tested `src/lib/sitemap.ts` seam — never a
hand-maintained list. `public/robots.txt` and `index.html` (OG/Twitter meta, JSON-LD WebSite+Organization)
are part of the same deliverable — one `VITE_SITE_URL` value stamps both the sitemap's base and the
robots.txt `Sitemap:` directive. Honest limitation: hash routing means search engines collapse every
route onto the entry URL; the sitemap enumerates the full route set for tooling and a future move to
path routing.

## Local database (optional)

The repo family's documented local PostgreSQL 17 (rootless install or Docker) is set up by
`docs/setup_pg_z.sh`; this SPA does not connect to it. See `docs/DEPLOYMENT.md` §4 for both install
paths and the connection contract (`postgresql://postgres:postgres@127.0.0.1:5432/app_db`).

## Known limitations

- **Demo data.** Prices, specs and product copy for the catalog are illustrative, not Apple's.
- **Imagery is original SVG art**, not Apple's photography or video; Apple's assets are proprietary and
  were deliberately not copied or hot-linked. The reference's hero videos are not reproduced.
- **No backend.** The bag and last order live in memory and reset on reload; checkout takes no payment and
  sends nothing anywhere. Footer destinations other than the store/support/entertainment pages resolve to
  a placeholder page that says so.
- **Fonts.** The stack is SF Pro → system fonts, as on the reference; machines without SF Pro / Helvetica
  fall back to Arial/DejaVu and will look wider.
- **Not verified:** Safari/WebKit and Firefox (only headless Chromium was run); real-device touch; real
  screen-reader output such as VoiceOver/NVDA (semantics and ARIA are present, and the axe-core WCAG 2
  A+AA e2e tier passes with two documented parity-bound exclusions — the reference's own ribbon link
  contrast and its dimmed inactive gallery cards); pixel-diff against the live site (computed-style token
  checks were used instead).
- The Apple name, logo and product names are trademarks of Apple Inc. This is an unaffiliated educational clone.

## Deployment

`npm run build` emits a self-contained `dist/index.html` that runs from `file://`, any static host, or
`vite preview`. Full guide (including the optional local PostgreSQL 17 rootless/Docker setup and the
deployment checklist): [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
