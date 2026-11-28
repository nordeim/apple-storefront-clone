---
name: apple-storefront-clone
description: >
  Complete engineering skill for the apple-storefront-clone codebase — a React 19 +
  TypeScript (strict) + Tailwind CSS v4 (CSS-first) + Vite 7 single-page clone of
  https://www.apple.com/sg/ with a working store superset. Use when extending,
  debugging, auditing, or replicating this codebase, or when onboarding a new agent
  to it. Covers the architecture, design tokens, the Tailwind v4 trap log, the
  three-tier test suite, the build/SEO posture, and the hard lessons of the 2026-11
  remediation cycle.
version: 1.6.0
last_updated: 2026-11-28
tags: [react, vite, tailwindcss-v4, typescript, spa, e-commerce-clone, e2e-testing]
---

# apple-storefront-clone — Engineering Skill (v1.6.0)

> **What this is:** the distilled, codebase-verified engineering reference for
> the remediated `apple-storefront-clone`. Every number below was measured in
> the 2026-11-28 sessions. Companion documents: `README.md` (user-facing),
> `AGENTS.md` (agent traps, compact), `CLAUDE.md` (conventions),
> `Project_Architecture_Document.md` (deep architecture + ADRs),
> `docs/reference-investigation.md` (parity dossier),
> `docs/REMEDIATION_PLAN.md` (both cycles' audits).

## §1 Project Identity & Design Philosophy

An **educational, unaffiliated clone** of the Apple Singapore storefront with a
functional superset: catalog, configurable products, in-memory bag,
GST-inclusive Singapore checkout, order-status lookup, live search,
entertainment/support pages. Philosophy:

1. **Parity through measurement, not imitation** — the reference's tokens were
   read from its shipped CSS and are asserted in e2e (56px/600 headlines,
   980px button radius, 692px hero tiles, 734/1068 breakpoints, #0071e3 action).
2. **A pure, tested domain seam** — all logic lives in `src/lib/*`; React is a
   rendering layer over it.
3. **One artifact** — `vite-plugin-singlefile` inlines the whole app into one
   `dist/index.html` that runs from `file://` and any static host.
4. **Honest demo posture** — no backend, no persistence, no tracking; Apple's
   proprietary assets deliberately never copied (original SVG art instead).

## §2 Tech Stack & Environment (pinned)

| Layer | Version | Notes |
|---|---|---|
| React | 19.2.6 | Function components + hooks; StrictMode mount |
| TypeScript | 5.9.3 | `strict`, `noUnusedLocals/Parameters`, bundler resolution, `@/*` → `src/*` |
| Vite | 7.3.7 | `react()` + `@tailwindcss/vite` + `viteSingleFile()`; dep scan pinned to `index.html` |
| Tailwind CSS | 4.1.17 | CSS-first: `@theme` tokens in `src/index.css`; NO JS config; NO PostCSS config |
| Vitest | 4.1.12 (jsdom 29.1.1) | 10 files / 105 tests (9 seam + 1 render-level component spec) |
| Playwright | 1.65.1 | 28 e2e over the production build; Chromium only (WebKit unavailable in the sandbox) |
| ESLint | 10.15.0 (typescript-eslint 8.74.0) | Flat config; `skills/**` and `docs/**` ignored |
| (removed) | — | `clsx`/`tailwind-merge` and the dead `cn()` helper were dropped in session 3 (zero importers) |

Environment: **zero variables read by the app**; `VITE_SITE_URL` exists for the
sitemap generator only. Node ≥ 20 (verified 24); npm + `package-lock.json`.

## §3 Bootstrapping & Configuration

```bash
git clone https://github.com/nordeim/apple-storefront-clone.git
cd apple-storefront-clone
npm install
npm run dev                                   # http://localhost:5173
npm run gate                                  # lint → typecheck → typecheck:tests → test → build → test:e2e → test:smoke
```

Configuration files that EXIST: `vite.config.ts`, `vitest.config.ts`,
`playwright.config.ts`, `eslint.config.mjs`, `tsconfig.json`,
`tsconfig.tests.json`, `.env.example`, `docker-compose.yml` (optional PG 17).
Configuration files that must NEVER exist: `tailwind.config.*`,
`postcss.config.*` (the §9 trap #1), any config that scans `skills/` or `docs/`.

Optional local PostgreSQL 17 (repo-family standard, unused by the SPA):
`bash docs/setup_pg_z.sh` → `postgresql://postgres:postgres@127.0.0.1:5432/app_db`,
or `docker compose up -d` (same contract, loopback-bound).

## §4 The Design System (CSS-First)

All tokens in `src/index.css`'s `@theme`; component CSS in `@layer components`
so utilities win the cascade:

| Token | Value |
|---|---|
| `--font-display` / `--font-text` | SF Pro Display / SF Pro Text (+ SF Pro Icons, -apple-system, Helvetica Neue, Arial fallbacks) |
| `--color-ink` / `--color-ink-muted` | `#1d1d1f` / `#6e6e73` |
| `--color-canvas` / `--color-hairline` | `#f5f5f7` / `#d2d2d7` |
| `--color-link` / `--color-link-dark` | `#0066cc` / `#2997ff` |
| `--color-action` (+hover/active) | `#0071e3` / `#0077ed` / `#006edb` |
| `--breakpoint-tablet` / `--breakpoint-nav` / `--breakpoint-wide` | 735px / 834px / 1069px |

Type scale (reference-measured): tile headline 56/48/32px @600; subhead
28/24/19px @400; promo headline 40/32px; body 17px/1.47059/−0.022em;
nav 12px. Tile heights: hero 692/650/580, promo 580/570/500. Button:
980px radius pill. Gallery card 1250/668 aspect, 28px radius, dwell 4.16s.

**The `@source` contract** (§9 trap #3): Tailwind v4 auto-detects sources across
the whole repo; this repo vendors ~50 MB of prose in `skills/` + `docs/`, so
`src/index.css` must carry the full `@source not` exclusion set (skills, docs,
root markdown). Measured before/after scoping: CSS 136,456 → 31,632 bytes;
1,885 → 476 rules.

## §5 Component Architecture & Patterns

Layer model (PAD §3.1): Entry → Composition (`App.tsx`, `pages/*`) →
Components → ONE store (`context/BagContext.tsx`) → pure seam (`lib/*`) →
design system (`index.css`).

Key components: `GlobalNav` (270 lines — desktop flyouts in the reference's
per-category flyout content model (device categories Explore/Shop/More-from; Home a Quick-Links row; Entertainment and Accessories two-section), the **mobile bar measured off the live site**
(logo left; Search/Bag/hamburger right), the **mobile accordion menu** with
per-row conditional mounting, bag popover, search trigger), `SearchPanel`
(live overlay), `Tile`, `EntertainmentGallery` (153 lines — the TV+ state
machine: timed dwell, pause, dot nav, arrow keys, swipe), `ProductArt`
(449 lines — the original SVG art library), `Footer` (directory +
accordion ≤734px), `PageShell`/`ProductCard`/`Ribbon`/`Icons`.

**The overlay rule:** panels (`menu`/`search`/`bag`) MOUNT via React state —
`{panel === "menu" ? <div id="mobile-menu" …/> : null}` — and the mobile
menu's accordion section bodies mount per-row the same way — never via
JS-toggled Tailwind display utilities (§9 trap #2).

## §6 Custom Hooks Deep Dive

- `useRoute` (hooks/useRoute.ts): `useSyncExternalStore` over `hashchange` +
  `useMemo(parseHash)` — SSR-safe server snapshot `""`.
- `useMediaQuery` / `usePrefersReducedMotion` (hooks/browser.ts): MQL via
  `useSyncExternalStore` with proper subscribe; reduced-motion drives pauses.
- `useInView(threshold=0.35)`: IntersectionObserver one-shot reveal; returns
  `true` when IO is unavailable so content never stays hidden.

## §7 Catalog & Content Model

Typed constants, not a CMS: `src/lib/catalog.ts` (8 categories, 12 products,
option matrices with SGD deltas + colour hex swatches, id→product index,
token-substring AND-match search), `src/lib/site-content.ts` (nav links, the
`flyoutSections()` content model — the reference's measured per-category structures
per entry, shared by the desktop flyouts and the mobile accordion menu; the
full footer directory + info-page map via `slugify`), `src/lib/home-content.ts`
(hero/promo tile copy + footnotes), `src/lib/route-title.ts` (the tab-title
seam — full-form store labels matching the h1), `src/lib/cart.ts`'s
`bagLineSummary` (the bag-line summary grammar shared by the popover and the
checkout aside). The sitemap seam (`src/lib/sitemap.ts`)
enumerates 156 routes from exactly these sources — the route set can never
drift from the catalog.

## §8 Accessibility Implementation

Skip link (focus-visible, fixed top-left); `aria-expanded`/`aria-controls` on
flyouts, hamburger, search, bag; gallery tablist semantics (`aria-selected`
dots, arrow keys); live-region result counts in SearchPanel; focus moved to
`<main>` after navigation (with `preventScroll`); `:focus-visible` global ring;
`prefers-reduced-motion` honored globally (CSS pin + JS pauses). Not verified:
real screen readers (documented Unknown).

## §9 Anti-Patterns & Common Bugs (the trap log)

1. **PostCSS config existence = outage.** The replaced Next.js app's
   `postcss.config.mjs` (referencing an uninstalled plugin) shipped inside the
   SPA tree and broke BOTH `npm run build` AND dev (dev served a blank page:
   `/src/index.css` → 500 → React never mounted). Fix: the file must not
   exist; Tailwind runs through `@tailwindcss/vite`.
2. **JS-toggling Tailwind v4 display utilities.** v4 changed
   display-utility generation order; toggling `hidden` against `flex`/`block`
   is unreliable (tailwindlabs/tailwindcss#15884). Mount/unmount overlays via
   React state; static pairs like `hidden nav:flex` resolve by cascade ≥834px.
   Pinned by `tests/e2e/mobile-navigation.spec.ts`.
3. **Unscoped Tailwind source detection.** Without `@source not` for
   skills/docs prose, class-shaped tokens in the prose leak into the shipped
   CSS (`.bg-red-*`, `.container`, `.w-96` — measured 105 kB of dead CSS).
4. **Vite dep scan over vendored HTML.** `skills/**/reference.html` imports
   `three`, which is not a dependency — the scan fails noisily and
   pre-bundling is skipped. Fix: `optimizeDeps.entries: ["index.html"]`.
5. **`vite preview` on `localhost`.** Resolves to `::1` on some hosts;
   Playwright's `127.0.0.1` readiness probe then times out. Always
   `--host 127.0.0.1` (already in `playwright.config.ts`).
6. **Unlayered component CSS.** A rule outside `@layer components` (e.g. the
   `.globalnav` block) would beat `nav:hidden` in the cascade. Keep the layer.
7. **Count drift.** Test/route/screenshot counts appear in README, PAD §8.1
   and this file's project_state — sweep every copy in the same commit.
8. **Hand-maintained sitemaps/CDNs.** The sitemap derives from the live
   catalog seam; editing `public/sitemap.xml` by hand is reverted on the next
   `npm run sitemap`.
9. **Persistence creep.** Adding localStorage/DB to bag/order state changes
   the privacy story of a demo that claims it stores nothing (ADR-004).
10. **Path routing creep.** Any `history.pushState`/path router breaks the
    `file://` guarantee; `parseHash` and its 8 tests + hostile-route specs must
    change together with any routing work.

## §10 Debugging Guide

| Symptom | Root cause | Fix |
|---|---|---|
| Blank dev page; `/src/index.css` 500 | Stale PostCSS config | Delete `postcss.config.*`; restart dev server (Vite caches the PostCSS lookup) |
| `npm run build` "Invalid PostCSS Plugin" | Same | Same |
| Dev log "Failed to run dependency scan … three" | Dep scan reached `skills/**.html` | Keep `optimizeDeps.entries` scoped |
| Playwright webServer 120s timeout | Preview bound to `::1` | `--host 127.0.0.1` |
| Unknown classes in built CSS / CSS huge | Prose in the class graph | Restore the `@source not` set; rebuild and diff rule count (expect 476) |
| Menu won't open on mobile | Panel state or the display trap | Check `panel === "menu"` mounting; never toggle `hidden` via JS |
| Hydration-style flicker in tests | Measuring pre-hydration | The e2e suite runs against the BUILT artifact, not dev |
| A route renders 404 unexpectedly | Router grammar (order, slug regex) | Read `src/lib/router.ts` + run `router.test.ts` |

## §11 Pre-Ship Checklist

```bash
npm run lint && npm run typecheck && npm run typecheck:tests   # 0 / clean / clean
npm run test                       # 10 files / 105 tests
npm run build                      # dist/index.html ~310 kB (CSS 33.7 kB)
npm run test:e2e                   # 28/28
npm run test:smoke                 # 45 assertions, 0 console errors
npm run sitemap                    # if routes changed: regenerate + re-check 156→N
```

Plus: counts swept in README/PAD/SKILL; no `TODO`/placeholder text; docs and
code in the same commit; `git status` clean before the SSH-wrapper push.

## §12 Lessons Learnt (the 2026-11 remediation cycle)

1. **A wholesale code-drop is not a codebase.** Overwriting a tree while
   leaving the old app's configs in place produced a repo whose build was
   broken at HEAD while its docs claimed a green gate. Audit what EXISTS,
   not what the docs say shipped.
2. **One stale 5-line config file was the whole outage** — `postcss.config.mjs`
   broke build AND dev. Reproduce first (blank `#root`, CSS 500), then
   delete-with-evidence, then pin the class with tests/docs.
3. **Tailwind v4's auto-detection is a feature you must defend against.**
   Measured: 77% of the shipped CSS was prose leakage from vendored docs.
4. **Vendored libraries need an explicit scope contract in every toolchain**
   — ESLint, TS, Vitest, Playwright, Tailwind, Vite — or one of them will
   eventually read the prose.
5. **Port the evidence, not just the code.** The original 45-assertion smoke
   battery was ported into `@playwright/test` specs so the parity evidence
   lives in the gate, not in an optional script.
6. **Generate what you can derive.** The sitemap seam derives the full route
   set (156 URLs at the 2026-11-28 session-5 measurement) from the catalog + content
   seam; hand-maintained artifacts drift by construction. The flyout content
   model and the robots.txt renderer are derived by the same rule.
7. **Extract a tab-title seam the moment two surfaces disagree about a label**
   (session 5): the store h1 and the browser tab rendered different category
   labels for one shared concept — one label map in the seam (`route-title.ts`)
   now feeds both, and an e2e test pins the agreement.
8. **Query-string grammar is exact-match territory** (session 5): a substring
   `includes("?buy")` accepts a superset nobody specified (`?buyfoo`,
   `?q=buy`); the grammar belongs to one exact parser (`hasBuyParam`,
   URLSearchParams) next to the href factory that builds it.
9. **ARIA attributes that reference conditionally-mounted DOM should exist
   only while that DOM exists** (session 5): dangling `aria-controls` on
   closed panels is the price of the mount/unmount rule — gate the attribute
   on the same state that mounts the panel, and keep spec locators on
   stable attributes (aria-label/role), never on the gated one.
10. **Verify focus/a11y behavior on the production artifact, not the dev
   server** (session 6): StrictMode's double effect invocation re-runs child
   effects after a parent's focus grab, masking real focus-steal defects in
   dev (the `?buy` heading focus looked correct in dev and was stolen by the
   shell's `<main>` focus in the shipped build). Reproduce on `vite preview`
   — the artifact is the truth; pin with an e2e assertion on
   `document.activeElement` after a real in-app click.
11. **Separator grammar belongs in one tested seam** (session 6): a
   presentation string built as `join(" · ") + " · more"` leaks a stray
   leading separator when the joined list is empty — build the whole line as
   one join (`[...parts, "Qty n"].join(" · ")`) in a pure seam
   (`bagLineSummary`), test the empty-part case first, and let both surfaces
   (popover, checkout aside) consume it.
12. **One state channel per button** (session 7): the holiday play/pause
   button carried BOTH a flipping label and `aria-pressed` — the APG
   anti-pattern (screen readers can announce a contradictory pair). Pick one
   channel: a flipping label (the gallery's pattern) XOR a stable label +
   `aria-pressed`. Pin the choice with an e2e attribute assertion.
13. **Degrade, never blank** (session 7): a render throw in a route view
   unmounts the whole SPA unless a page-level `ErrorBoundary` owns it — the
   nav, bag state and footer must survive the crash so the user can still
   navigate away. The boundary is the one place a `console.error` is
   sanctioned in `src/` (observability beats silence), and its spec is the
   repo's first render-level component test (React 19 `act` in jsdom — no
   new dependencies needed).

## §13 Pitfalls to Avoid

- Renaming `tests/e2e/smoke.mjs` away from `file://` (its whole point).
- "Upgrading" the pinned `@theme` tokens to Tailwind defaults (oklch drift —
  the v3-era values are deliberate).
- Adding a `tailwind.config.js` to "help" — v4 is CSS-first by design.
- Loosening `tsconfig`/ESLint to make a gate pass; fix the code instead.
- Committing `.env`, keys, or `playwright-report/` (gitignored — keep it so).

## §14 Best Practices

- TDD for seam logic: write `src/lib/<module>.test.ts` red, implement green.
- Measure computed styles for styling truth; read the seam for logic truth.
- Keep components presentational; move logic to `lib` the moment it needs a test.
- Use `routeHref.*` factories everywhere — never hand-build `#/…` strings.
- Ship evidence labels (Verified/Reasoned/Assumed) in docs and worklog.
- Update AGENTS/CLAUDE/PAD/SKILL in the same commit as behavior changes.

## §15 Coding Patterns

```ts
// Pattern A — route factory (never hand-build hashes)
routeHref.store(c.id)                 // "#/store/mac"
routeHref.search(q)                    // "#/search?q=…" (encoded)

// Pattern B — conditional overlay mounting (the v4-safe way)
{panel === "search" ? <SearchPanel onClose={…} /> : null}

// Pattern C — the pure reducer seam
dispatch({ type: "setQuantity", key: lineKey(productId, selections), quantity })

// Pattern D — measured-token assertion in e2e
expect(css).toEqual({ h: "56px", hw: "600", …btnBg: "rgb(0, 113, 227)" })
```

## §16 Coding Anti-Patterns

```ts
// ❌ hand-built hash + unencoded query
href={`#/search?q=${query}`}
// ✅ routeHref.search(query)

// ❌ display toggling via JS
el.classList.toggle("hidden")
// ✅ mount/unmount via React state

// ❌ string-concatenated SQL-ish logic anywhere near user input
// ✅ this app has no queries; keep it that way (validation in lib/checkout.ts)
```

## §17 Responsive Breakpoint Reference

| Variant | Min width | Used for |
|---|---|---|
| `tablet:` | 735px | 2-col promo grid; side gutters; mobile menu < nav |
| `nav:` | 834px | hamburger ↔ desktop link row switch |
| `wide:` | 1069px | max-width containers |
| Raw media queries | ≤734 / ≤1068 | the reference's own tile-height typography ladder |

Mobile-first base = no prefix; the CSS also mirrors the reference's max-width
ladder (`@media (max-width: 734px/1068px)`) for the tile/typography steps.

## §18 Z-Index Layer Map

| Layer | z-index | Where |
|---|---|---|
| Skip link (on focus) | 100 (`focus:z-[100]`) | `App.tsx` |
| Global nav (sticky) | 50 | `.globalnav` |
| Tile overlays | 1 (link) / 2 (content) / 3 (CTAs) / 4 (play) | `.tile-*` |
| Gallery card link | 2 | `.gallery-card a` |

Overlays (flyout/menu/search/bag) are absolutely positioned inside the sticky
header — no portals, no z-index escalation needed.

## §19 Color Reference (Complete)

`@theme`: ink `#1d1d1f`, ink-muted `#6e6e73`, canvas `#f5f5f7`, link
`#0066cc`, link-dark `#2997ff`, action `#0071e3` (hover `#0077ed`, active
`#006edb`), hairline `#d2d2d7`. Component-layer values: globalnav
`rgba(22,22,23,.8)` + blur(20px); flyout `rgba(22,22,23,.96)`; mobile menu
`rgba(22,22,23,.98)`; nav hairline `#424245`; button focus ring = action color;
gallery dotnav `rgba(210,210,215,.64)`. Dark-tile text `#f5f5f7`; footer
links `#424245`.

## §20 The Complete TypeScript Interface Reference

```ts
// src/lib/router.ts
type Route = { name: "home" } | { name: "store"; category?: CategoryId }
  | { name: "product"; id: string } | { name: "bag" } | { name: "checkout" }
  | { name: "confirmation"; orderNo: string } | { name: "search"; query: string }
  | { name: "entertainment" } | { name: "support" } | { name: "info"; slug: string }
  | { name: "not-found" };

// src/lib/catalog.ts
interface Category { id: CategoryId; label: string; blurb: string }
interface OptionChoice { id: string; label: string; deltaSgd: number; hex?: string }
interface ProductOption { id: string; label: string; choices: OptionChoice[] }
interface Product { id: string; name: string; category: CategoryId; tagline: string;
  summary: string; art: ArtId; basePrice: number; options: ProductOption[]; highlights: string[] }

// src/lib/cart.ts
interface CartLine { productId: string; selections: Record<string, string>; quantity: number }
type CartAction = { type: "add"; line: CartLine } | { type: "setQuantity"; key: string; quantity: number }
  | { type: "remove"; key: string } | { type: "clear" };

// src/lib/checkout.ts
interface CheckoutForm { fullName: string; email: string; phone: string; address: string; postalCode: string }
type CheckoutErrors = Partial<Record<CheckoutField, string>>;

// src/context/BagContext.tsx
interface PlacedOrder { orderNo: string; lines: readonly CartLine[]; total: number; email: string }

// src/lib/sitemap.ts
interface SiteRoute { path: string; priority: number; changefreq: "daily" | "weekly" | "monthly" }
```

## Appendix A — The Meticulous Approach (six-phase workflow)

ANALYZE (read everything relevant in full; reproduce failures) → PLAN
(smallest correct sequential verifiable plan) → VALIDATE (against configs,
lockfiles, running app) → IMPLEMENT (small typed test-backed increments) →
VERIFY (the full gate, browser-verified UI) → DELIVER (atomic conventional
commits to `main`, docs lockstep, evidence labels, deferred-debt honesty).

## Appendix B — project_state (measured 2026-11-28, session 7)

- Unit: **10 files / 105 tests** (9 seam files — cart (+ `bagLineSummary`),
  catalog, checkout, the per-category flyout content model, home tiles,
  money, router (+ `hasBuyParam`), route-title, sitemap + robots — plus the
  render-level component spec `ErrorBoundary.test.tsx`)
- E2e: **28 tests** (home 8, mobile-navigation 11, store-flow 9 — incl. the
  in-app `?buy` focus pin, its back/forward popstate tail, and the
  ghost-product `?buy` 404 focus pin) over `vite preview --host 127.0.0.1:4173`
- Smoke: **45 assertions**, `file://dist/index.html`, 0 console errors — the
  battery is now JSDoc-typed and covered by `typecheck:tests`
- Sitemap: **156 routes / 131 info pages** generated from the seam; robots.txt
  rendered by the same seam + generator (one `VITE_SITE_URL` stamps both; the
  value resolves from the shell or a `.env` file via Vite `loadEnv`)
- Build: `dist/index.html` **310.4 kB / 93.7 kB gzip**; CSS **33,654 bytes /
  518 rules**; build time ~1.0 s
- Gate: `npm run gate` — lint 0 errors · typecheck clean · tests green · build · e2e · smoke
- Flyout model (session-4, re-verified sessions 5+6+7): Home is the reference's
  restructured three-section model (Explore/Shop/More from Home, 16 links);
  Mac/iPad/iPhone/Watch/AirPods Explore rows carry the reference's full
  product-family labels (family labels that match a catalog product route to
  its product page — MacBook Pro, iPad, iPhone Duo, iPhone 18 Pro, Apple Watch
  Series 12, AirPods Pro 3 — the rest to info routes; catalog-only products
  stay reachable via the store — deviation D6 as revised in session 4);
  sessions 5+6+7 re-extracted all eleven live models and diffed them against the
  seam — all match
- Store surfaces (session-4): the chip row matches the reference's measured
  order and full-form labels (+ AirTag chip; the leading All chip is the
  superset affordance); category h1s are full-form ("Shop Apple Watch"), and
  the tab title matches via the `route-title` seam (session-5)
- Local PG 17 (optional): `postgresql://postgres:postgres@127.0.0.1:5432/app_db` — installed rootless, unused by the SPA
- Mobile nav parity (sessions 5–7 re-measure at 390×844): bar geometry byte-equal
  (logo x=0 w=48, Search x=246, Bag x=294, Menu x=342); all 11 accordion rows
  carry expand buttons; open/expand/navigate/close all verified live with zero
  console errors — no Tailwind v4 display-toggling defect
- Hygiene (sessions 5–7): `aria-controls` exists only while its panel is mounted;
  the `?buy` deep link is an exact query-key grammar (`hasBuyParam`), and on in-app
  navigation into it the Configurator heading owns focus (shell focus reset gated,
  e2e-pinned on the artifact); the dead `.button-neutral`/`.section-ribbon-host` CSS
  rules are gone; the bag-line summary row is one component
  (`components/BagLineRow.tsx`) fed by the tested `bagLineSummary` seam (no stray
  separator for option-less products); the order-number regex lives once in
  `router.ts` (`ORDER_NO` export)
