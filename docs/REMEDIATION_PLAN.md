# Remediation Plan — audit of the `sonnet 5.5 v1` code-drop (2026-11-27)

**Mode C audit → remediation.** The repo's `main` (HEAD `7cca678`) carries the
"sonnet 5.5 v1" wholesale code replacement (commit `eb47784`): the old
Next.js/ElyBeauty tree was overwritten with the React 19 + Vite 7 + Tailwind v4
single-file SPA, while **the old app's infrastructure files were left behind in
place**. The `skills/` folder is out of audit scope (excluded from checking,
testing and compilation by operator contract).

## Audit summary (counts by severity)

| Severity | Count | Key items |
|---|---|---|
| CRITICAL | 2 | dev+build broken (postcss.config.mjs); verification ledger false as-committed |
| HIGH | 4 | skills/ scanned by Vite + Tailwind; dead Playwright config; no ESLint gate; 23 MB dead imagery |
| MEDIUM | 5 | stale .env.example; SEO/sitemap absent; stale next/prisma/scripts artifacts; missing gate scripts; stale docs set |
| LOW/INFO | 5 | nordhem docker-compose; .gitignore gaps; README needs enhancement; dist payload notes |

### Verified evidence

- `npx tsc --noEmit` → clean; `npx vitest run` → 5 files / 44 tests pass.
- `npm run build` → **FAILS**: `Invalid PostCSS Plugin found at: plugins[0] (@postcss.config.mjs)` — `postcss.config.mjs` references `@tailwindcss/postcss`, which is not a dependency (the app uses `@tailwindcss/vite`).
- `npm run dev` → serves a **blank page**: `/src/index.css` → HTTP 500 (same root cause), `#root` has 0 children. Removing the file → dev renders (4 root children, header `.globalnav`), CSS 200, and the 45-assertion smoke suite passes 45/45 with zero console errors.
- Vite dev log: `Failed to run dependency scan … three (imported by skills/design/design-templates/saas-landing/reference.html)` — the vendored `skills/` folder is inside the scan scope.
- Built CSS (136,456 bytes / 1,885 rules) contains utilities used nowhere in `src/` — `.bg-red-*` (7 rules), `.container` (9), `.w-96`, `.h-screen`, `.m-4`, `.grid-cols-4` — Tailwind v4 auto-content-detection picks class candidates out of `skills/` and root markdown (`@source not "../docs"` exists; `skills/` and the root `*.md` are NOT excluded).
- `public/images/` = 23 MB of ElyBeauty product PNGs referenced nowhere in `src/` or `index.html`; copied into `dist/` on every build.
- Mobile navigation (operator focus) **verified working** via agent-browser at 390×844: hamburger (48px bar) → menu opens (`#mobile-menu`, `top:48px`, `100dvh−48px`, `rgba(22,22,23,.98)`), links 28px/600 SF Pro Display on `#424245` hairlines, all 11 links + Search; click-through navigates and closes; desktop (≥834px) hides hamburger via the custom `nav:` breakpoint (offsetParent null) and shows the link row as `flex`. **No Tailwind v4 display-toggling bug**: the menu mounts/unmounts via React state (the homenest trap-log rule), and `src/` contains no `space-y/space-x` usage (v4 selector-rewrite trap not applicable). The one real v4-related defect class in this repo is C1+H1 (stale PostCSS config + unscoped source scanning).
- SEO: no `public/sitemap.xml`, no `public/robots.txt`, no OG/Twitter/canonical meta, no JSON-LD in `index.html` (title + description + theme-color only). Hash routing is not separately indexable (documented deviation D7).

## Remediation ToDo list

Order is the execution order; TDD applies wherever a behavior is assertable.

### Phase 1 — restore the gate (CRITICAL/HIGH)

| # | Item | TDD / regression evidence |
|---|---|---|
| T1 | Delete `postcss.config.mjs` (stale ElyBeauty config; the app's Tailwind path is the `@tailwindcss/vite` plugin) | RED: `npm run build` fails, dev blank → GREEN: build exit 0, `#root` renders |
| T2 | `vite.config.ts`: `optimizeDeps.entries: ["index.html"]` (+ watch-ignore skills) | dev log free of the `three` dependency-scan error |
| T3 | `src/index.css`: extend `@source not` with `../skills` and root markdown (AGENTS/CLAUDE/PAD/SKILL/worklog/README) | built CSS shrinks; unused-class probes (`.bg-red`, `.container`, `.w-96`) disappear from `dist` |
| T4 | Delete `public/images/` (23 MB dead ElyBeauty imagery; the app ships original SVG art) | `dist/` contains only the single-file build + SEO files |
| T5 | Delete stale infra: `next.config.ts`, `prisma/`, `scripts/` (ElyBeauty tooling), `tsconfig.tests.json` (will be re-created correctly in T8) | `tsc --noEmit` still clean; no dangling references in repo root |
| T6 | `package.json`: rename to `apple-storefront-clone`; add gate scripts (`lint`, `typecheck`, `typecheck:tests`, `test`, `build`, `preview`, `test:e2e`, `test:smoke`); add devDeps `@playwright/test`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`, `eslint` | `npm run lint` exits 0 |
| T7 | Rewrite `eslint.config.mjs` as an ESLint 9 flat config for React+TS (ignores `skills/**`, `docs/**`, `dist/**`, `playwright-report/**`, `test-results/**`) | `npm run lint` exit 0 on the current tree |
| T8 | Rewrite `playwright.config.ts` for THIS app: `@playwright/test`, webServer = `vite preview` over the single-file build, projects `desktop-chromium` (1440×900) + `mobile-navigation` (iPhone 13 viewport); new `tsconfig.tests.json` covering `tests/**`, `playwright.config.ts`, `vitest.config.ts`, `vite.config.ts`, `eslint.config.mjs`, `scripts/**`; port the smoke assertions into real specs (`home.spec.ts`, `mobile-navigation.spec.ts`, `store-flow.spec.ts`) | `npm run test:e2e` green against the production build |

### Phase 2 — SEO / sitemap (TDD-first)

| # | Item | TDD / regression evidence |
|---|---|---|
| T9 | New pure seam `src/lib/sitemap.ts` — enumerates the real route set (home, store × categories, product × catalog, bag, entertainment, support, info pages) and renders the `sitemap.xml` document; **tests first** in `src/lib/sitemap.test.ts` (route-set derivation, XML escaping, urlset correctness, base-URL handling) | RED → GREEN via `npx vitest run` |
| T10 | `scripts/build-sitemap.mjs` writes `public/sitemap.xml` from the seam | file exists, parses, lists the enumerated routes |
| T11 | `public/robots.txt`; `index.html` gains OG/Twitter meta, canonical, and JSON-LD (Organization + WebSite; store page links) — honest for an educational clone | agent-browser/page-source checks |
| T12 | Rewrite `.env.example` to match THIS codebase (client-only SPA; `VITE_SITE_URL` for the sitemap/canonical base; no database, no auth, no Stripe) | every var documented is actually read by the repo (or explicitly marked build-time) |

### Phase 3 — documentation set (aligned to the remediated tree)

| # | Item |
|---|---|
| T13 | Enhance `README.md` (keep the accurate bones; add quick start + verify, commands, env, testing, SEO notes, screenshots, deployment link) |
| T14 | Rewrite `AGENTS.md` (compact, high-signal, agents-md skill conventions) |
| T15 | Rewrite `CLAUDE.md` (claude-md skill template: core identity, six-phase workflow, standards, env, testing) |
| T16 | Rewrite `Project_Architecture_Document.md` (PAD skill: stack table with pinned versions, ADRs, topology, layer model, directory tree, patterns, design tokens, security, testing, build/deploy, known issues) |
| T17 | Rewrite `docs/DEPLOYMENT.md` aligned to the single-file SPA (rootless PostgreSQL 17 via `docs/setup_pg_z.sh` as the documented local DB; adapted `docker-compose.yml` as the alternative); `docker-compose.yml` adapted to this repo's contract (PG 17, `app_db`, loopback bind) |
| T18 | Update `docs/reference-investigation.md` verification ledger to the remediated truth |
| T19 | Create `apple-storefront-clone_SKILL.md` via `skills/distill-codebase-skill` + `skills/to-distill-project-into-skill` |
| T20 | Append `worklog.md` session entry |

### Phase 4 — evidence & delivery

| # | Item |
|---|---|
| T21 | Capture dev-server screenshots → `docs/screenshots/` (desktop home, mobile home, mobile menu open, store, product, bag, checkout, entertainment) |
| T22 | Full gate: `npm run lint && npm run typecheck && npm run typecheck:tests && npm run test && npm run build && npm run test:e2e && npm run test:smoke` |
| T23 | Conventional, atomic commits to `main` (no new branches) |
| T24 | `git push` via `docs/ssh_git_wrapper_v3.py --remote git@github.com:nordeim/apple-storefront-clone.git` (paramiko shim; key shredded after) |

## Plan validation notes (against the codebase)

- Every deletion target above was re-verified to exist and to be referenced by nothing in `src/`/`index.html` (`next.config.ts`, `prisma/`, `scripts/`, `public/images/`, `postcss.config.mjs`, old `tsconfig.tests.json`).
- The doc rewrites' source of truth is the current `src/` tree (verified by reading every component/page/lib file) plus this session's measured evidence.
- The PostgreSQL 17 instance required by the operator contract was installed rootless via `docs/setup_pg_z.sh` (Verified: `postgresql://postgres:postgres@127.0.0.1:5432/app_db` accepting connections); the app itself reads no database — the DEPLOYMENT rewrite documents it honestly as the local standard environment for the repo family, with the docker-compose as the alternative.
