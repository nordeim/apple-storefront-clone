# AGENTS.md — apple-storefront-clone

React 19 + TypeScript (strict) + Tailwind CSS v4 (CSS-first) + Vite 7 single-page storefront —
an educational clone of `https://www.apple.com/sg/` with a working store (catalog, configurator,
in-memory bag, Singapore checkout). The evidence dossier (measured tokens, deviations ledger) is
`docs/reference-investigation.md`; the full architecture reference is `Project_Architecture_Document.md`.

## Commands

| Task | Command |
|---|---|
| Dev server | `npm run dev` (port 5173) |
| Lint | `npm run lint` (ESLint 10 flat config — must exit 0) |
| Typecheck (app) | `npm run typecheck` |
| Typecheck (tests + configs) | `npm run typecheck:tests` |
| Unit tests | `npm run test` (Vitest/jsdom — **10 files / 105 tests**; update this count in README + PAD when it changes) |
| Production build | `npm run build` (single file → `dist/index.html`, ~310 kB) |
| E2E | `npm run test:e2e` (Playwright — **28 tests**; builds and serves `dist/` itself) |
| File:// smoke battery | `npm run test:smoke` (45 assertions over `dist/index.html`) |
| Regenerate sitemap | `npm run sitemap` (writes `public/sitemap.xml` + `public/robots.txt` from the tested `src/lib/sitemap.ts` seam — **156 routes**) |
| Clean gate order | lint → typecheck → typecheck:tests → test → build → test:e2e → test:smoke |

Use `npm`; the lockfile is `package-lock.json`. Commit to `main` only (no feature branches);
push with `docs/ssh_git_wrapper_v3.py` per `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`.

## The standing scope rule

The vendored `skills/` and `docs/` folders are reference prose, **excluded from checking, testing and
compilation**. They are already excluded from: ESLint (`eslint.config.mjs` ignores), TypeScript
(`tsconfig*.json` exclude), Vitest (include pattern is `src/**/*.test.{ts,tsx}` only), Playwright
(`testDir: tests/e2e`), Tailwind (`@source not "../skills"` in `src/index.css`) and Vite's dep scanner
(`optimizeDeps.entries: ["index.html"]`). Never add a `tailwind.config.js`, a `postcss.config.*`, or any
config that reintroduces scanning of those folders — the last one that shipped (`postcss.config.mjs`
referencing an uninstalled PostCSS plugin) broke both `build` and `dev` (blank page) at HEAD before
remediation.

## Traps (each one broke a real gate once)

1. **No PostCSS config.** Tailwind runs through `@tailwindcss/vite` in `vite.config.ts`. Any
   `postcss.config.*` file is a stale leftover from the replaced Next.js app and kills the CSS
   pipeline (dev serves a blank page; `build` fails with "Invalid PostCSS Plugin").
2. **`vite preview` must bind `127.0.0.1`** (`--host 127.0.0.1`), not the default `localhost` — on
   hosts where `localhost` resolves to `::1`, Playwright's webServer readiness probe times out.
3. **Tailwind v4 auto-content-detection scans the whole repo.** Without the `@source not` exclusions,
   class-shaped tokens in skills/docs prose leak into the shipped CSS (measured: 136 kB → 31.6 kB CSS
   after scoping) and `skills/**.html` module scripts break Vite's dependency scan.
4. **Tailwind v4 display utilities are never JS-toggled.** The mobile menu (and its accordion sections)
   mount/unmount via React state (`panel === "menu"`, per-row `open`), which is the contract that pins
   `tests/e2e/mobile-navigation.spec.ts`; `hidden`/`nav:flex` pairs are static classes resolved by the
   cascade at ≥834px.
5. **Component CSS lives in `@layer components`** so Tailwind utilities (e.g. `nav:hidden`) can
   override it — an unlayered rule would silently win the cascade.
6. **Hash routing owns navigation semantics** (`src/lib/router.ts` parses `#/store/mac`-style routes;
   `routeTitle`/scroll/focus reset live in `App.tsx`'s effect). Never add a path-based router or a
   `history.pushState` without updating `parseHash` tests and the smoke battery first.
7. **Count lockstep:** when test/route/screenshot counts change, sweep README.md, PAD §8.1 and the
   SKILL project_state in the same commit (`rg "<old number>"`).

## Environment

The app reads **no** environment variables (verified: zero `import.meta.env`/`process.env` in `src/`).
`VITE_SITE_URL` exists for `scripts/build-sitemap.mjs` only — one value stamps the sitemap base AND
the robots.txt `Sitemap:` directive; it resolves from the shell **or** a `.env` file (Vite `loadEnv`,
shell wins — the `.env.example` `cp` flow works as documented). See `.env.example`.

## Testing posture

- Unit tests cover the pure seam only (`src/lib/*`) — the SPA's logic is deliberately pure and testable
  without React rendering.
- E2E pins three contracts: reference tokens (computed styles), the mobile navigation state machine
  (390×844 touch viewport — bar layout, accordion menu, sub-link navigation), and the store flow
  (search → configurator → bag → checkout → confirmation → order lookup, incl. hostile routes rendered
  as text).
- `tests/e2e/smoke.mjs` is the exhaustive file:// battery (45 assertions) kept as the parity net;
  it needs `npm run build` first and uses the same Playwright Chromium as the spec suite.
