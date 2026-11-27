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
version: 1.1.0
last_updated: 2026-11-27
tags: [react, vite, tailwindcss-v4, typescript, spa, e-commerce-clone, e2e-testing]
---

# apple-storefront-clone — Engineering Skill (v1.1.0)

> **What this is:** the distilled, codebase-verified engineering reference for
> the remediated `apple-storefront-clone`. Every number below was measured in
> the 2026-11-27 sessions. Companion documents: `README.md` (user-facing),
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
| Vitest | 4.1.12 (jsdom 29.1.1) | 7 files / 62 tests over the seam |
| Playwright | 1.65.1 | 24 e2e over the production build; Chromium only (WebKit unavailable in the sandbox) |
| ESLint | 10.15.0 (typescript-eslint 8.74.0) | Flat config; `skills/**` and `docs/**` ignored |
| clsx / tailwind-merge | 2.1.1 / 3.4.0 | `cn()` helper |

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
three-section content model, the **mobile bar measured off the live site**
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
`flyoutSections()` content model — the reference's three-section structure
per entry, shared by the desktop flyouts and the mobile accordion menu; the
full footer directory + info-page map via `slugify`), `src/lib/home-content.ts`
(hero/promo tile copy + footnotes). The sitemap seam (`src/lib/sitemap.ts`)
enumerates 123 routes from exactly these sources — the route set can never
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
npm run test                       # 7 files / 62 tests
npm run build                      # dist/index.html ~306 kB (CSS 32.1 kB)
npm run test:e2e                   # 24/24
npm run test:smoke                 # 45 assertions, 0 console errors
npm run sitemap                    # if routes changed: regenerate + re-check 123→N
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
   set (123 URLs at the 2026-11-27 measurement) from the catalog + content
   seam; hand-maintained artifacts drift by construction. The flyout content
   model and the robots.txt renderer are derived by the same rule.

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

## Appendix B — project_state (measured 2026-11-27, session 2)

- Unit: **7 files / 62 tests** (seam: cart, catalog, checkout, flyout content
  model, money, router, sitemap + robots)
- E2e: **24 tests** (home 7, mobile-navigation 11, store-flow 6) over
  `vite preview --host 127.0.0.1:4173`
- Smoke: **45 assertions**, `file://dist/index.html`, 0 console errors
- Sitemap: **123 routes** generated from the seam; robots.txt rendered by the
  same seam + generator (one `VITE_SITE_URL` stamps both)
- Build: `dist/index.html` **305.5 kB / 92.4 kB gzip**; CSS **32,125 bytes /
  489 rules**; build time ~1.0 s
- Gate: `npm run gate` — lint 0 errors · typecheck clean · tests green · build · e2e · smoke
- Local PG 17 (optional): `postgresql://postgres:postgres@127.0.0.1:5432/app_db` — installed rootless, unused by the SPA
- Mobile nav parity (session-2, measured against the live site at 390×844): bar
  geometry byte-equal (logo x=0 w=48, Search x=246, Bag x=294, Menu x=342);
  two-level accordion menu structure matches (top rows navigate, per-row
  expand buttons, Entertainment without a flyout)
