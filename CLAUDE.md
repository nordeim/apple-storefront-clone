---
IMPORTANT: File is read fresh for every conversation. Be brief and practical.
---

# CLAUDE.md — apple-storefront-clone

Guidance for Claude Code working in this repository. Complements `AGENTS.md`
(commands + traps) and `Project_Architecture_Document.md` (deep architecture).

## Core Identity & Purpose

An educational, single-page clone of the Apple Singapore storefront
(`https://www.apple.com/sg/`) with a working store superset: catalog,
configurable products, in-memory bag, GST-inclusive Singapore checkout,
order-status lookup, live search, entertainment and support pages. Stack:
**React 19 · TypeScript (strict) · Tailwind CSS v4 (CSS-first) · Vite 7 ·
Vitest · Playwright**. The build is a single self-contained `dist/index.html`.

Unaffiliated with Apple; prices/specs are illustrative; imagery is original
SVG art. Two properties must survive every change:

1. **Visual parity with the reference** — measured tokens (type scale, 980px
   button radius, tile heights, 734/1068 breakpoints, footer canvas) live in
   `docs/reference-investigation.md` and are pinned by the e2e token test.
2. **A pure, tested domain seam** — `src/lib/*` holds all logic; React
   components stay thin and render-facing.

## Foundational Principles

### Meticulous Approach (Six-Phase Workflow)

1. **ANALYZE** — read the relevant files, configs and tests in full; reproduce
   failures before diagnosing them.
2. **PLAN** — smallest correct, sequential, verifiable plan; name the files,
   tests and evidence.
3. **VALIDATE** — check the plan against acceptance criteria and executable
   reality (configs, lockfiles, running app).
4. **IMPLEMENT** — small, typed, test-backed increments; update tests and docs
   with the change.
5. **VERIFY** — run the full gate (`lint → typecheck → typecheck:tests → test
   → build → test:e2e → test:smoke`); browser-verify UI changes.
6. **DELIVER** — atomic Conventional Commits to `main`; update docs lockstep;
   hand off with Verified/Reasoned/Assumed labels and any deferred debt.

### Project-Specific Principles

- Test-first for every logic change (red → green → refactor); bug fixes carry
  a regression test.
- The `skills/` and `docs/` folders are reference prose — excluded from
  checking, testing and compilation by standing contract (see AGENTS.md
  "The standing scope rule").
- Never weaken a gate to make it pass (no disabled lint rules, no loosened
  types, no skipped tests).

## Implementation Standards

### General Coding Practices

- **TypeScript strict**; never `any` (`unknown` instead); interfaces for
  object shapes, types for unions; early returns over nesting.
- **Pure seams** — logic goes in `src/lib/` with unit tests; components import
  from the seam and stay presentational.
- **Naming** — components PascalCase; utilities camelCase; tests as
  `*.test.ts` next to the seam they cover; e2e specs as `*.spec.ts`.
- **State** — React state/context only, and the ONE shared store is
  `src/context/BagContext.tsx` (in-memory; nothing persists or transmits).
- **Routing** — hash-based only via `src/lib/router.ts` (`routeHref.*`
  factories); navigation side-effects (title/scroll/focus) live in `App.tsx`.
- **Nav content** — `flyoutSections()` in `src/lib/site-content.ts` is the
  single content source for the desktop flyouts AND the mobile accordion
  menu; informational labels join the `INFO_TITLES` derivation so sitemap
  routes and flyout content cannot drift apart.

### Language & Framework Guidelines

- **React 19** — function components, hooks; no `forwardRef` needed on the
  current tree; conditional mounting for overlays/menus (never JS-toggle
  Tailwind display utilities — v4 cascade trap, pinned by
  `tests/e2e/mobile-navigation.spec.ts`).
- **Tailwind CSS v4 (CSS-first)** — tokens in `src/index.css`'s `@theme`
  (fonts, colors, `tablet`/`nav`/`wide` breakpoints); no
  `tailwind.config.js`, no `postcss.config.*`. Component CSS stays inside
  `@layer components` so utilities win the cascade. Keep the `@source not`
  exclusions (skills/docs prose) intact.
- **Accessibility** — semantic HTML + ARIA where the reference uses it
  (flyouts: `aria-expanded`/`aria-controls`; gallery: tablist semantics;
  skip link; `:focus-visible` rings; `prefers-reduced-motion` honored).

## Development Workflow

### Environment Setup

```bash
git clone https://github.com/nordeim/apple-storefront-clone.git
cd apple-storefront-clone
npm install        # Node ≥ 20, npm + package-lock.json
npm run dev        # http://localhost:5173
```

Optional local PostgreSQL 17 (the repo family's standard DB; the SPA does not
connect to it): `bash docs/setup_pg_z.sh` — see `docs/DEPLOYMENT.md` §4.

### Build Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server (port 5173) |
| `npm run build` | Single-file production build → `dist/index.html` |
| `npm run preview` | Serve `dist/` (bind `--host 127.0.0.1`) |
| `npm run lint` | ESLint 10 flat config — must exit 0 |
| `npm run typecheck` / `npm run typecheck:tests` | `tsc --noEmit` (app / tests+configs) |
| `npm run test` | Vitest run (7 files / 62 tests) |
| `npm run test:e2e` | Playwright (24 tests; builds + serves the artifact) |
| `npm run test:smoke` | 45-assertion file:// battery over `dist/` |
| `npm run sitemap` | Regenerate `public/sitemap.xml` |

## Testing Strategy

- **Unit (Vitest, jsdom)** — the pure seam `src/lib/*`: catalog, cart
  reducer, router parsing (incl. malformed inputs), money/GST, checkout
  validation, flyout content model, sitemap route enumeration.
- **E2E (Playwright, production build)** — `home.spec.ts` (tokens, the
  three-section flyouts, gallery state machine, zero console errors),
  `mobile-navigation.spec.ts` (390×844 touch: the reference's bar layout,
  accordion menu open/expand/sub-link navigation/close, geometry, no
  horizontal overflow), `store-flow.spec.ts` (search → configurator → bag →
  checkout validation → confirmation → order lookup → hostile routes).
- **Smoke** — `tests/e2e/smoke.mjs`, the exhaustive file:// parity battery.
- Red-Green-Refactor for logic; regression test for every bug fix; counts
  stay in lockstep across README / PAD / SKILL in the same commit.

## Code Quality Standards

- `npm run lint` exit 0 (`react-refresh/only-export-components` warnings on
  the three intentional dual-export files are acceptable).
- `npm run typecheck` and `npm run typecheck:tests` clean.
- No `console.log` in `src/`; no dead code; no placeholder values.

## Git & Version Control

- `main` only — no feature branches; atomic Conventional Commits
  (`feat:`, `fix:`, `docs:`, `chore:`) with the why in the body.
- Push with `docs/ssh_git_wrapper_v3.py --remote
  git@github.com:nordeim/apple-storefront-clone.git` (never commit keys;
  the wrapper shreds its temp copy).
- Docs update in the same commit as the change that made them drift.

## Error Handling & Debugging

- Malformed input degrades to a route-level 404 (`parseHash` returns
  NOT_FOUND), never a render throw; `safeDecode` catches bad URI escapes.
- Hostile routes/XSS payloads render as text (pinned by the store-flow spec).
- Debugging order: reproduce (dev + built artifact — the dev server is not
  the build), read the computed DOM for styling truth, then read
  `src/lib/*` for logic truth; the dep-scan and PostCSS traps are the
  first suspects for a blank dev page.

## Communication & Documentation

- Evidence labels (Verified / Reasoned / Assumed) on non-trivial claims;
  measured numbers over adjectives.
- `README.md` (user-facing), `AGENTS.md` (agent traps), the PAD (deep
  architecture), `docs/reference-investigation.md` (parity dossier),
  `docs/DEPLOYMENT.md` (deploy runbook), `worklog.md` (session log).

## Project-Specific Standards

### Architecture

Single-page React app; hash router; pure `src/lib` seam; one context store;
`@layer components` CSS; original SVG art via `src/components/ProductArt.tsx`.

### Data / Domain

Catalog + categories are typed constants (`src/lib/catalog.ts`); money is
`Intl.NumberFormat("en-SG")` with GST derived inclusively (9%); the bag is
in-memory (documented deviation D1/D6/D7 in the reference dossier).

### Environment Variables

| Variable | Purpose | Example |
|---|---|---|
| `VITE_SITE_URL` | Sitemap + robots.txt generator base (`scripts/build-sitemap.mjs`) only | `https://your-deploy.example` |

The app itself reads no env vars.

## Anti-Patterns to Avoid

- Adding `tailwind.config.js`, `postcss.config.*`, or re-scanning
  `skills/`/`docs/` from any toolchain.
- Path-based routing or `history.pushState` without updating the router seam
  and its tests.
- Persisting bag/order state anywhere (localStorage/DB) — the no-backend
  contract is a documented deviation, not a gap.
- Deleting or weakening tests/specs to make a gate pass.
