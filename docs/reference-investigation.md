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
| D4 | Flyout menus are generated from the catalog | Reference flyout content is not in the HTML |
| D5 | Gallery backdrops are generated gradients; links go to `tv.apple.com/sg` | No hot-linking of `mzstatic.com` artwork |
| D6 | Catalog prices/specs are illustrative | Reference home page has no price data |
| D7 | Hash routing instead of path routing | Works from `file://` and any static host |
| D8 | Side gutters of 12px on ≥735px, none on mobile | Assumed from CSS padding rules; not pixel-compared |

## Verification ledger (this build)

> Refreshed 2026-11-27 by the remediation cycle (`docs/REMEDIATION_PLAN.md`).
> The as-committed `sonnet 5.5 v1` tree could NOT satisfy these rows — the
> stale `postcss.config.mjs` broke both the build and the dev server until it
> was removed (see the deviations note below).

| Check | Result |
|---|---|
| `npx tsc --noEmit` | clean (Verified) |
| `npx tsc --noEmit -p tsconfig.tests.json` | clean (Verified) |
| `npx vitest run` | 6 files, 50 tests pass (Verified) |
| `npm run lint` | 0 errors (Verified) |
| `npm run build` | succeeds, `dist/index.html` single file, 301.5 kB / 91.4 kB gzip, CSS 31.6 kB / 476 rules (Verified) |
| `npm run test:e2e` (Playwright over `vite preview`) | 21/21 PASS (Verified) |
| `tests/e2e/smoke.mjs` (headless Chromium, `file://`) | 45/45 PASS, 0 console errors/warnings (Verified) |
| Mobile navigation re-measured on the dev server (agent-browser, 390×844) | menu opens/navigates/closes; geometry + typography correct; no Tailwind v4 display-toggling defect (Verified) |
| Visual review of screenshots (desktop home, mobile, product) | done by eye; no pixel diff (Verified for what was viewed) |
| Safari / Firefox / real devices / screen readers | not run (Unknown: not available in this sandbox) |

Deviation D8's side-gutter behavior and all other rows above remain as
originally measured; the remediation did not change any visual token (the
e2e token assertions are byte-identical to the original smoke assertions).
