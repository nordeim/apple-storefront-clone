# apple-storefront-clone — Master Project Architecture Document (PAD) v1.0

**Classification:** Internal Engineering Reference
**Status:** DEFINITIVE, PRODUCTION-LOCKED BLUEPRINT
**Companion Document:** `README.md` (quick start), `AGENTS.md` (agent traps), `CLAUDE.md` (conventions), `docs/reference-investigation.md` (parity dossier)
**Last Updated:** 2026-11-27
**Audience:** Senior Engineers, Tech Leads, DevOps, and Onboarding Engineers
**Rule:** Every architectural decision in this document traces to a specific rationale.
Nothing is here "because it's popular."

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
| DOM testing | Testing Library | react 16.3.3 / dom 10.4.2 | Present in devDeps for component-level work; current suite is seam-first |
| Lint | ESLint | 10.15.0 flat config + typescript-eslint 8.74.0 | Flat config ignoring the vendored prose folders |
| Utilities | clsx 2.1.1 + tailwind-merge 3.4.0 | — | `cn()` class merge helper (`src/utils/cn.ts`) |
| Package manager | npm | lockfile `package-lock.json` | One lockfile, one manager — the reproducibility rule |
| Local DB (optional) | PostgreSQL | 17 (rootless) or docker `postgres:17-alpine` | The repo family's documented local environment; this SPA does not connect to it |

No backend, no ORM, no auth, no payment provider, no external services at runtime.

### 1.3 Architecture Decision Records (ADRs)

**ADR-001: Single-page React 19 app built by Vite into one self-contained HTML file.**
- **Context:** The clone must run from `file://`, any static host, and the repo's own
  tooling without a Node server (the previous tree was Next.js 16 with Prisma + SQLite).
- **Decision:** React 19 + Vite 7 + `vite-plugin-singlefile` 2.3.0; the build output is
  exactly `dist/index.html` (~300 kB, ~91 kB gzip).
- **Rationale:** Education/parity artifact, not a service; single-file keeps the
  deployment story trivial and the artifact auditable.
- **Consequences:** No SSR, no server-side metadata, no `next/*` infrastructure; SEO
  posture is bounded by ADR-007. All state is client-side.
- **Alternatives rejected:** Next.js (the prior app — deleted precisely because a
  storefront clone does not need a server); plain static HTML (no componentization).

**ADR-002: Hash-based routing.**
- **Context:** A single-file artifact with no server rewrites must handle ~82 routes.
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
- **Rationale:** The seam is unit-testable without rendering (50 tests); "no backend,
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
- **Decision:** Vitest for the seam (50 tests); Playwright against
  `npm run build && vite preview --host 127.0.0.1` (21 tests: tokens,
  mobile-navigation state machine, store flow incl. hostile routes); the exhaustive
  45-assertion `file://` smoke battery as the parity net.
- **Rationale:** The token assertions ARE the parity evidence; the mobile spec pins
  the v4 display-utility trap class; hostile-route assertions pin XSS-as-text.
- **Consequences:** `npm run test:e2e` costs ~35 s (build included); acceptable for
  the gate.
- **Alternatives rejected:** Component-mount tests as the main tier (seam-first is
  faster and the DOM contracts are already covered by e2e).

**ADR-007: SEO posture — generated sitemap, honest hash-route caveat.**
- **Context:** Hash routes collapse to one URL for crawlers (ADR-002 consequence).
- **Decision:** `src/lib/sitemap.ts` enumerates the real route set (82 URLs) from the
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
                     Footer, ProductArt, ProductCard, Ribbon, Icons). Rule: presentational +
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
├── tsconfig.json / tsconfig.tests.json ← strict app config / tests+configs config
├── docker-compose.yml          ← optional PG 17 (loopback-bound) for the local environment
├── src/
│   ├── main.tsx                ← createRoot mount
│   ├── App.tsx                 ← route switch, document.title, scroll/focus reset, skip link
│   ├── index.css               ← Tailwind v4 @theme tokens + @layer components CSS
│   ├── components/             ← GlobalNav (flyouts + mobile menu), SearchPanel, Tile,
│   │                             EntertainmentGallery, Footer, ProductArt (SVG art),
│   │                             ProductCard, Ribbon, Icons, PageShell
│   ├── pages/                  ← HomePage, StorePage, ProductPage, BagPage, CheckoutPage,
│   │                             ConfirmationPage, SearchPage, StaticPages (info/support/404)
│   ├── context/BagContext.tsx  ← the ONE store (in-memory bag + last order)
│   ├── hooks/                  ← useRoute (useSyncExternalStore over hashchange), browser.ts
│   │                             (useMediaQuery, usePrefersReducedMotion, useInView)
│   ├── lib/                    ← THE SEAM: catalog, cart, router, money, checkout,
│   │                             home-content, site-content, sitemap (each with *.test.ts)
│   └── utils/cn.ts             ← clsx + tailwind-merge
├── tests/
│   └── e2e/                    ← home.spec.ts, mobile-navigation.spec.ts, store-flow.spec.ts,
│                                 smoke.mjs (the 45-assertion file:// battery)
├── scripts/
│   └── build-sitemap.mjs       ← regenerates public/sitemap.xml from the seam
├── public/
│   ├── sitemap.xml             ← 82 routes, generated (npm run sitemap)
│   └── robots.txt
├── docs/                       ← reference-investigation.md (parity dossier), DEPLOYMENT.md,
│                                 REMEDIATION_PLAN.md (this cycle's audit), screenshots/,
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
  <div id="mobile-menu" className="absolute … nav:hidden">…</div>
) : null}
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

Buttons (`.button` 980px-radius pill, `button-secondary`, `button-neutral`,
`button-block`), the `.link-cta` chevron link, `.globalnav` translucency
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
| Unit (seam) | 6 | 50 | `src/lib/*.test.ts` | Vitest 4 + jsdom |
| E2E — desktop | 1 | 7 | `tests/e2e/home.spec.ts` | Playwright (1440×900) |
| E2E — mobile nav | 1 | 8 | `tests/e2e/mobile-navigation.spec.ts` | Playwright (iPhone 13 viewport, touch) |
| E2E — store flow | 1 | 6 | `tests/e2e/store-flow.spec.ts` | Playwright (1440×900) |
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
- [ ] `npm run test` — 6 files / 50 tests
- [ ] `npm run build` — single-file `dist/index.html`
- [ ] `npm run test:e2e` — 21 passed
- [ ] `npm run test:smoke` — 45 assertions, zero console errors
- [ ] Docs touched in the same commit; counts in lockstep

---

## 8. Build & Deployment

### 8.1 Production Build

`npm run build` → `vite build` with `react()`, `@tailwindcss/vite`, and
`viteSingleFile()` → **one artifact: `dist/index.html`** (measured 301.5 kB /
90.95 kB gzip this cycle; CSS 31.6 kB / 476 rules). No server bundle, no image
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
| `src/lib/router.ts` | 86 | The hash-route grammar; every href factory |
| `src/lib/catalog.ts` | 357 | The typed catalog: 8 categories, 12 products, option matrices, search |
| `src/lib/cart.ts` | 93 | The bag reducer + price/line-key seam |
| `src/lib/checkout.ts` | 43 | Singapore checkout validation + order numbers |
| `src/lib/sitemap.ts` | 55 | Route-set enumeration + sitemap.xml rendering (82 URLs) |
| `src/lib/site-content.ts` | 125 | Nav links, flyouts, footer directory, info-page map |
| `src/index.css` | 390 | Tailwind v4 tokens + all component CSS + source scoping |
| `src/components/GlobalNav.tsx` | 230 | Desktop flyouts, mobile menu, bag popover, search trigger |
| `src/components/ProductArt.tsx` | 449 | The original SVG art library |
| `src/components/EntertainmentGallery.tsx` | 153 | The TV+ gallery state machine (dwell, pause, keys) |
| `src/App.tsx` | 120 | Route switch, titles, navigation side-effects |
| `tests/e2e/mobile-navigation.spec.ts` | 118 | The mobile-menu contract (pins the v4 display trap) |
| `tests/e2e/smoke.mjs` | 117 | The exhaustive file:// parity battery (45 assertions) |
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
