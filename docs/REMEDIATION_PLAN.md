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

---

# Remediation Plan — session 2: the live-parity pass (2026-11-27, evening)

**Mode C audit → remediation.** The prior cycle left a green, verified gate at `059f675`
(pushed). This cycle re-ran the full ritual on the pulled tree (`e9ee951` = 059f675 +
`docs/session_1.md`, docs-only): baseline gates (all green, exact counts re-observed),
a read-only subagent audit of the remediation commits using the `web-application`
skill methodology, and an **agent-browser live-parity pass against
`https://www.apple.com/sg/`** (desktop 1440×900 + mobile 390×844). `skills/` remains
out of audit scope.

## Audit + live-parity findings (counts by severity)

| Severity | Count | Key items |
|---|---|---|
| CRITICAL | 0 | — |
| HIGH | 0 | — |
| MEDIUM | 4 | robots.txt generator gap; mobile bar layout; mobile menu structure; flyout depth |
| LOW | 3 | unused devDeps; scripts/ not typechecked; timing-based e2e waits |
| INFO | 4 | OG image/og:url absent (documented); docker creds (documented); cart no-op copies; hash-route SEO (ADR-007) |

### Verified evidence (live reference, agent-browser)

- **Mobile bar (390×844, measured):** reference = Apple logo **left** (x=0, w=49) +
  Search (x=246) + Bag (x=294) + hamburger "Menu" (x=342) right cluster; the hamburger
  is on the **far right** (`globalnav-menutrigger-bread`), and a back-chevron replaces
  it while the menu is open. Clone = hamburger left + logo center + bag right, no
  search icon in the bar (search was a row inside the menu). **P-1.**
- **Mobile menu (real click interaction):** reference = two-level accordion — 11
  category rows ("Store menu"/"Mac menu" buttons, `aria-expanded`), each expanding to
  headed sub-link groups (Store: "Shop" / "Quick Links" / "Shop Special Stores" with
  Find a Store, Order Status, Apple Trade In, Financing, Personal Setup, Certified
  Refurbished, Education, Business). Clone = flat 11 links + in-menu Search row. **P-2.**
- **Desktop flyouts (hover, captured):** reference = three headed sections —
  "Explore X" (Explore All X, models, Compare X, Switch from…), "Shop X" (Shop X,
  X Accessories, Apple Trade In, Financing, Personal Setup), "More from X" (X Support,
  AppleCare, macOS 27 / iOS 27, Apple Intelligence and Siri, Apps by Apple, iCloud+, …);
  Support = "Explore Support"/"Get Help"/"Helpful Topics". Clone = one flat
  catalog-derived section. **P-3.**
- **Parity confirmed (no action):** TV+ gallery **auto-advances on a clean load** at
  the reference dwell ≈4.16 s (measured item 1→3→4 over 17 s; an earlier paused
  observation was the region-modal artifact); holiday colour animation autoplays;
  ribbon/hero/promo tiles, nav link sets, footer directory + legal rows and the
  footer accordion all match.
- **Audit (subagent):** `build-sitemap.mjs` writes only `sitemap.xml`, but
  `.env.example` claims `VITE_SITE_URL` also stamps `public/robots.txt` — the
  `Sitemap:` line is hardcoded localhost, silently breaking the documented deploy
  path. **M-1.** Unused devDeps `@testing-library/react`+`/dom`; `scripts/` outside
  `tsconfig.tests.json`; fixed `waitForTimeout` races in the gallery/duo specs.

## Remediation ToDo list (session 2 — S2-*)

Execution order = the table order; TDD wherever a behavior is assertable
(seam tests red first; e2e specs updated before/with the implementation).

### Phase 1 — content seam (TDD)

| # | Item | TDD / regression evidence |
|---|---|---|
| S2-1 | `src/lib/sitemap.ts`: new `renderRobots(base)` (full robots.txt document, `Sitemap:` stamped from the base); tests first in `sitemap.test.ts` | RED → GREEN; `scripts/build-sitemap.mjs` writes BOTH `public/sitemap.xml` and `public/robots.txt`; regenerate at default base; custom-base run verified then restored |
| S2-2 | `src/lib/site-content.ts`: new `flyoutSections(link)` seam — the reference's three-section model per nav entry (Explore/Shop/More from; Store = Shop/Quick Links/Special Stores; Support = Explore Support/Get Help/Helpful Topics), labels from the captured live sets, hrefs only from `routeHref.*` factories; new informational labels join the `INFO_TITLES` derivation (sitemap + info routes stay derived, never hand-listed) | new `src/lib/site-content.test.ts` RED → GREEN: section shape, every href matches `#/…` route grammar, every info slug resolves in `INFO_TITLES` |

### Phase 2 — GlobalNav restructure (e2e-first)

| # | Item | TDD / regression evidence |
|---|---|---|
| S2-3 | Mobile bar: logo left; Search + Bag + hamburger right cluster (48px targets); mobile search button `nav:hidden` (desktop keeps its own); drop the in-menu Search row (the bar icon is the reference's entry point) | `mobile-navigation.spec.ts` rewritten against the live-measured geometry (RED on the old code → GREEN) |
| S2-4 | Mobile menu → accordion: top row = category link (navigates) + "`X menu`" expand button (`aria-expanded`/`aria-controls`, chevron); expanded body renders `flyoutSections` (smaller type, headed groups); independent toggles (the clone's footer-accordion convention); panel scrolls; **conditional mounting preserved** (the v4 display-trap contract) | same spec: accordion expand/collapse, sub-link navigate + menu closes, no-overflow, console-zero |
| S2-5 | Desktop flyout: render the three-section `flyoutSections` content (headings + link grid), replacing the flat catalog list | `home.spec.ts` flyout test asserts the 3 headings + representative links (incl. "iPhone 18 Pro") |

### Phase 3 — hygiene + gates

| # | Item |
|---|---|
| S2-6 | Remove unused devDeps `@testing-library/react` + `@testing-library/dom` (npm uninstall; lockfile via npm only) |
| S2-7 | `home.spec.ts`/`smoke.mjs`: replace fixed sleeps with state-based polling (`expect.poll`) where a DOM state is observable (gallery dot change, duo reveal) — assertion strength preserved |
| S2-8 | `tsconfig.tests.json`: evaluate `checkJs` coverage for `scripts/`; if it adds noise without value, document as accepted LOW (single .mjs, exercised by `npm run sitemap`) |

### Phase 4 — regeneration, evidence, docs, delivery

| # | Item |
|---|---|
| S2-9 | `npm run sitemap` — regenerate sitemap.xml + robots.txt; count the new route total; **lockstep sweep** of the route/test counts across README/AGENTS/CLAUDE/PAD/SKILL/reference-investigation |
| S2-10 | Recapture affected screenshots (mobile home with the new bar, mobile menu accordion open, desktop home/flyout) + re-validate the full set |
| S2-11 | Docs sweep: README (mobile-menu description), PAD (§3 patterns, §7 counts, §8.1, §10, §11), SKILL (§5/§7/§9/project_state), reference-investigation (deviations D4 → measured flyouts; ledger refresh), worklog Task 114 |
| S2-12 | Full gate `npm run gate` → atomic Conventional Commits on `main` → SSH-wrapper push |

## Plan validation notes (session 2, against the codebase)

- `src/lib/sitemap.ts` (55 lines) exports `buildSitemapXml(base)`; `renderRobots(base)` is
  additive and follows the same base-handling contract (`routeUrl` normalizes the
  trailing slash). `scripts/build-sitemap.mjs` already loads the seam via
  `vite.ssrLoadModule` — adding the second `writeFile` is a two-line change.
- `src/lib/site-content.ts` already owns `flyoutLinks(category)` + `INFO_TITLES`
  (derived from footer/legal labels); `flyoutSections` extends the same file and the
  same derivation, so `sitemap.ts`'s `INFO_TITLES.keys()` loop picks the new routes up
  automatically — no hand-maintained route list is introduced anywhere.
- `GlobalNav.tsx` (230 lines): the `Panel` state machine, `hashchange` close,
  outside-pointerdown close, Escape handling and the conditional-mount rule
  (`{panel === "menu" ? … : null}`) stay untouched; only the bar layout, the mobile
  menu body and the `Flyout` renderer change. `tests/e2e/mobile-navigation.spec.ts`
  (8 tests) and the smoke battery's mobile section were read in full — the top-level
  category links remain links, so "mobile nav navigates + closes" pins survive the
  restructure by design.
- The e2e count will move (8 → ~10 mobile tests, flyout assertions extended); the
  sitemap route count will grow from 82 (5 core + 8 categories + 12 products + 57 info)
  by the new informational labels — the exact total is measured after S2-2 and swept
  through the doc set in the same commit (the AGENTS.md count-lockstep rule).
- Risk control: the live-parity evidence is Chromium-only; the reference-side captures
  are stored in this document, and the accordion-expansion semantics (independent vs
  exclusive toggles) could not be conclusively measured on the live site in this
  environment — the clone follows its own footer-accordion convention (Reasoned, not
  Verified).

---

# Session 3 (2026-11-27, evening — the full-sweep parity cycle)

Inputs: the operator's `docs/session_2.md` paste (the completed session-2 log) +
the standing review prompt, on the pulled tree (9841cb1 = 0bd9d7d + the paste).
Baseline re-observed exactly as documented (lint 0 errors · 2× typecheck clean ·
7 files/62 unit · build 305.52 kB · e2e 24/24 · smoke 45, zero console errors ·
sitemap 123 routes · robots stamped). A read-only subagent audit (web-application
methodology, `skills/` excluded) ran on the session-2 commits; the live-parity
pass this cycle swept **all eleven nav flyouts** on the live reference (the
session-2 capture covered Store/Mac/iPhone/Support only) plus the mobile bar,
accordion, search and store routes.

## Session-3 findings (counts by severity)

| Severity | Count | Key items |
|---|---|---|
| CRITICAL | 0 | — |
| HIGH | 0 | — |
| MEDIUM | 1 | `.env.example` documents a `.env` copy path that never reaches the generator (`build-sitemap.mjs` reads `process.env.VITE_SITE_URL` before Vite exists — a silent localhost-stamped production deploy) |
| LOW | 3 | dead `src/utils/cn.ts` + unused runtime deps `clsx`/`tailwind-merge`; 9 orphan info routes (INFO_TITLES over-derivation); mobile accordion sub-links ≈19px hit area (reference: 33px) |
| INFO | 6 | axe-core absent / focus-trap / Escape-focus-return; duplicated slug logic in StaticPages; locale-sensitive sort assertion; `home-content.ts` hand-built href; `smoke.mjs` outside both typecheck gates; no React error boundary |

### Verified live-parity evidence (agent-browser, reference logged-out)

**Confirmed green (no code change):** mobile bar geometry byte-equal on both sites
(logo x=0 [ref w=49 / clone w=48], Search x=246, Bag x=294, menu x=342 — all 48px);
mobile menu open/expand/navigate/close functional with zero console errors; search
typeahead matches; `/store` h1 parity; baseline gates exactly as documented.

**Content-model deltas (the reference's flyout content has evolved past the
session-2 capture):**

1. **Entertainment has a flyout on the live reference** (measured, 490px panel):
   `Explore Entertainment` (Explore Entertainment, Apple TV, Apple Music, Apple
   Arcade, Apple Fitness+, Apple Podcasts, Apple Books, App Store) + `Support`
   (Apple TV Support, Apple Music Support). The clone renders no Entertainment
   flyout at all (the seam returns `[]`).
2. **Home flyout is a single `Quick Links` section** (measured, 44px single-row
   panel): Shop Gifts, Find a Store, AirPods, Apple Intelligence, Apple Trade In.
   The clone renders the generic three-section category model.
3. **Accessories flyout is two sections**: `Shop Accessories` (Shop All
   Accessories, Mac, iPad, iPhone, Apple Watch, Apple Vision Pro, AirPods, Home)
   + `Explore Accessories` (Made by Apple, Beats, AirTag). The clone renders the
   generic three-section model.
4. **Store flyout's first Shop label is `Shop Gifts`** (the reference's seasonal
   swap; the clone ships `Shop All`).
5. **Support `Explore Support` carries 9 rows on the reference** (iPhone, Mac,
   iPad, Watch, Apple Vision Pro, AirPods, Music, TV, Explore Support) — the clone
   adds a 10th (`Home`) the reference does not render.
6. **Per-category label drift** (live capture vs the seam's current model):
   Mac More-from +`Education`; iPhone More-from +`Wallet, Pay`; iPad More-from
   +`iPadOS 27`, `Apple Creator Studio`, `Education`, `Apple at Work`; Watch —
   reference order is Apple Watch Support, AppleCare, `watchOS 27`, `Apple Watch
   For Your Kids`, Apps by Apple, `Apple Fitness+`, `Education` (no AI-and-Siri /
   iCloud+ rows), +`Apple Watch Straps` in Shop; Vision — reference order is
   Apple Vision Pro Support, AppleCare, `visionOS 27`, `Apple Vision Pro for
   Enterprise`, Shop swaps Trade In for `Book a Demo`, Explore is
   `Explore Apple Vision Pro` + `Tech Specs`; AirPods — More-from is AirPods
   Support, AppleCare, `Hearing Health`, `Apple Music`, `Apple Fitness+`, Shop is
   the three model shops + Accessories.
7. **Mobile accordion rows**: every one of the reference's 11 rows carries an
   expand button (measured on the reference's dialog); the clone's Entertainment
   row lacks one (follows from delta 1).

## Remediation ToDo list (session 3 — S3-*)

### Phase 1 — content seam (TDD-first)

- **S3-1.** Rewrite `flyoutSections()` in `src/lib/site-content.ts` to the
  live-measured per-category structures: explicit section models for `store`
  (Shop Gifts swap), `support` (drop `Home`), `home` (single Quick Links),
  `entertainment` (Explore Entertainment + Support), `accessories` (Shop
  Accessories + Explore Accessories); per-category label lists for
  mac/ipad/iphone/watch/vision/airpods per the capture above. Catalog products
  stay in the Explore rows (the documented D6 deviation). Tests RED first
  (`site-content.test.ts` rewritten to pin the captured model: structures,
  labels, the routeHref-factory grammar, the no-dead-slugs invariant).
- **S3-2.** Fix the `INFO_TITLES` over-derivation (audit LOW-2) in the same seam
  change: derive titles only from links that actually route to `#/info/`
  (footer + legal + the flyout model's own info links) — the 9 store-routed
  footer labels stop seeding orphan `/info/*` routes.

### Phase 2 — env contract + hygiene

- **S3-3.** `scripts/build-sitemap.mjs`: resolve `VITE_SITE_URL` via Vite's
  `loadEnv` so the `.env.example` documented `cp .env.example .env` path actually
  stamps the base (shell env still wins). Verified by a custom-base `.env` run.
- **S3-4.** Delete dead `src/utils/cn.ts`; `npm rm clsx tailwind-merge`
  (audit LOW-1 — zero importers verified).
- **S3-5.** Mobile accordion sub-links: `py-2` touch padding (≈35px hit area,
  reference measures 33px) — audit LOW-3.

### Phase 3 — e2e + regeneration

- **S3-6.** Update `tests/e2e/mobile-navigation.spec.ts` (all 11 rows carry
  expand buttons; sub-link height ≥ 32px) and `tests/e2e/home.spec.ts` (flyout
  content assertions to the new model).
- **S3-7.** Regenerate `public/sitemap.xml` + `public/robots.txt`; measure the
  new route count; count-lockstep sweep across the doc set.

### Phase 4 — evidence & delivery

- **S3-8.** Screenshots (the 10-shot family, re-captured on the remediated dev
  server), docs sweep (README/AGENTS/CLAUDE/PAD/SKILL/reference-investigation/
  DEPLOYMENT + worklog Task 115), atomic commits, SSH-wrapper push to `main`.

## Plan validation notes (session 3, against the codebase)

- `flyoutSections()` is the single seam feeding the desktop flyouts, the mobile
  accordion bodies and (via `INFO_TITLES`) the sitemap's info routes — one change
  propagates everywhere by design; `NAV_LINKS` and the `MobileMenuRow`
  expand-button logic (`sections.length > 0`) pick the Entertainment/Home/
  Accessories flyouts up with no component change.
- Blast radius on tests: `site-content.test.ts` (9 tests, rewritten), 
  `sitemap.test.ts` (route-count derivations hold — they iterate `INFO_TITLES`),
  `mobile-navigation.spec.ts` (2 assertions flip), `home.spec.ts` (flyout labels),
  `smoke.mjs` (label-dependent assertions checked before run). Count lockstep:
  unit count may move; sitemap route count moves; both swept in the same commit.
- `scripts/build-sitemap.mjs` already imports from `vite` (`ssrLoadModule`);
  `loadEnv` is an additive import from the same package — no new dependency.
- Risk control: the reference's seasonal `Shop Gifts` label is the live state at
  capture time and will rotate again; it is modeled as content, not hardcoded
  structure, and can be re-captured next cycle. The accordion-expansion semantics
  (independent toggles) keep the clone's footer convention (unchanged from
  session 2's Reasoned disposition).
