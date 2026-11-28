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

---

# Session 4 (2026-11-27, night — the store-surface parity cycle)

Inputs: the operator's standing review prompt on the pulled tree (7b8a3ec =
e16a436 + two operator docs commits: the session_3.md log paste and a worklog
trim). Baseline re-observed exactly as documented (lint 0 errors · 2× typecheck
clean · 7 files/71 unit · build 307.09 kB · e2e 25/25 · smoke 45, zero console
errors · sitemap 128 routes · PG 17 rootless accepting connections). A
read-only subagent audit (web-application methodology, `skills/` excluded) ran
on the tree; the live-parity pass this cycle re-captured **all eleven reference
flyouts fresh** (with section headings), the mobile bar/menu, the /sg/store
page chip row and the category-page h1.

## Session-4 findings (counts by severity)

| Severity | Count | Key items |
|---|---|---|
| CRITICAL | 0 | — |
| HIGH | 0 | — |
| MEDIUM | 2 | Home flyout restructured on the live reference; Explore product-family rows missing in 5 categories |
| LOW | 5 | audit LOW-1 (phone `65` strip); audit LOW-2 (`?buy` grammar unowned + hand-built hrefs); PAD §7 stale counts; store chip row label/order/count; category-page h1 short forms |
| INFO | 8 | audit INFO set (slugify duplication, router leniency, cart no-op refs, smoke.mjs gate gap, locale sort, a11y posture, error boundary, react-refresh warnings — posture items documented as deferred) |

### Verified evidence (this cycle, both sites)

- **Mobile navigation (operator's standing focus): CONFIRMED WORKING.** Clone
  bar at 390×844: logo x=0/w=48, Search x=246, Bag x=294, Menu x=342, all 48px
  targets — byte-equal to the reference's pinned measurements (logo w=49 is the
  documented 1px deviation). Menu opens at top=48, height 796, rgba(22,22,23,.98);
  all 11 rows carry expand buttons; Mac expansion shows 21 links across 3
  sections; sub-links 39px; "Compare Mac" click → `#/info/compare-mac`, menu
  closed, h1 "Compare Mac", zero console errors. **No Tailwind v4 bug** (the
  mount/unmount-via-state contract holds; e2e pins it).
- **Home flyout (M-1):** the live reference RESTRUCTURED its Home flyout from
  the session-3 "single Quick Links" model to a full three-section model
  (measured both at 390×844 and 1440×900 — desktop = mobile):
  Explore Home (Explore Home, Apple HomeView, Apple TV 4K, HomePod, HomePod
  mini 2) / Shop Home (Shop Home, Shop Home Accessories, Personal Setup) /
  More from Home (Home Support, AppleCare for Apple TV, AppleCare for HomePod,
  Apple TV app, Apple TV, Home app, Apple Music, AirPlay) — 16 links. The clone
  still renders the single Quick Links row (5 links).
- **Explore product-family rows (M-2):** the reference's Explore sections list
  the full product family per category — Mac: MacBook Neo, MacBook Air, MacBook
  Pro, iMac, Mac mini, Mac Studio, Displays (7 rows); iPad: iPad Pro, iPad Air,
  iPad, iPad mini, Apple Pencil, Keyboards (6); iPhone: iPhone Duo, iPhone 18
  Pro, iPhone Air, iPhone 17, iPhone 17e, iPhone 16 (6); Watch: Apple Watch
  Series 12, Ultra 4, SE 3, Nike, Hermès (5); AirPods: AirPods 5, Pro 3, Max 2
  (3). The clone renders only its catalog products (2/1/2/1/1) — the session-3
  D6 disposition. Shop/More-from sections match byte-for-byte in every category;
  Store/Support/Entertainment/Accessories/Vision flyouts match exactly.
- **Store chip row (measured at 1440×900, y=126):** reference = Mac, iPhone,
  iPad, Apple Watch, Apple Vision Pro, Home, AirPods, AirTag, Accessories (9
  chips, full-form labels, iPhone before iPad). Clone = All, Mac, iPad, iPhone,
  Watch, Vision, AirPods, Home, Accessories (short forms, no AirTag).
- **Category-page h1:** reference `/sg/shop/buy-watch` → "Shop Apple Watch"
  (full form). Clone `#/store/watch` → "Shop Watch" (short form).
- **/sg/store page:** h1 "Store" parity confirmed; the reference's body is an
  editorial layout (The latest. / Personalisation. / Holiday picks. …) while
  the clone renders the functional catalog — the documented superset posture
  (README "What is in it"); full editorial mirroring is deferred as the
  next-cycle target (product-page sweep).
- **Audit (subagent, read-only):** 0 CRITICAL/HIGH/MEDIUM · 2 LOW + 8 INFO, all
  evidence-backed; 13/13 doc anchors PASS. LOW-1: `checkout.ts` strips a bare
  `65` prefix (a valid 8-digit SG number starting 65 is rejected with a
  contradictory error). LOW-2: home tiles hand-build `#/product/x?buy` hrefs —
  the `?buy` deep-link grammar is owned by no factory and pinned by no test;
  `home-content.ts` is the only untested `src/lib` module. FYI: PAD §7 still
  carries pre-session-3 counts (7/62, 24) — a missed lockstep sweep.

## Remediation ToDo list (session 4 — S4-*)

### Phase 1 — content seam (TDD-first)

- **S4-1.** `flyoutSections()` Home case → the measured three-section model
  (16 links): Apple HomeView and Apple TV 4K route to their catalog product
  pages; Explore Home/Shop Home → `#/store/home`; Shop Home Accessories →
  `#/store/accessories`; the remaining labels → info routes. The single
  Quick-Links model is replaced (its "Apple Intelligence" info route retires
  with it — the reference moved it; no other consumer links it).
- **S4-2.** `flyoutSections()` Explore rows for mac/ipad/iphone/watch/airpods
  → the reference's full product-family label lists. Labels that match a
  catalog product route to its product page (MacBook Pro, iPad, iPhone Duo,
  iPhone 18 Pro, Apple Watch Series 12, AirPods Pro 3); all other family
  labels route to info pages. **D6 revised:** the reference's family labels are
  the flyout model; catalog-only products (MacBook Pro with PROLED XDR
  Display, AirTag 4-Pack, MagSafe Charger) stay reachable via the store pages —
  the superset contract, one click deeper.
- Tests RED first in `site-content.test.ts` (Home test inverted to 3 sections;
  family-row label lists pinned per category; product-route assertions for the
  6 matching labels; the routeHref grammar + no-dead-slugs invariants unchanged).

### Phase 2 — audit fixes (TDD)

- **S4-3.** `src/lib/checkout.ts` phone normalization: strip only an explicit
  `+65` country code (`.replace(/^\+65/, "")`); regression tests for
  "65123456" (valid, must pass) and "+65 6512 3456" (valid, must pass).
- **S4-4.** `src/lib/router.ts`: add `routeHref.productBuy(id)`; use it in
  `home-content.ts` (both CTA hrefs + the `#/store` fallback via
  `routeHref.store()` in `Tile.tsx`); NEW `src/lib/home-content.test.ts` —
  every tile CTA href satisfies the route grammar and every product id resolves
  in the catalog (closes the untested-module gap).
- **S4-5.** Store chip row → the measured model: `All` (superset affordance,
  documented deviation — the reference has none), then Mac, iPhone, iPad,
  Apple Watch, Apple Vision Pro, Home, AirPods, AirTag, Accessories. AirTag chip
  → `#/info/airtag` (resolves in INFO_TITLES via the Accessories flyout). Chip
  label map exported from the content seam; category h1 → full form
  ("Shop Apple Watch") via the same map.
- **S4-6.** Opportunistic INFO one-liners: `StaticPages.tsx` uses `slugify()`
  from the seam (drops the duplicated transform); `tsconfig.tests.json` includes
  `tests/**/*.mjs` (smoke battery under checkJs); `cart.ts` returns the same
  reference on rejected actions (React bail-out); `sitemap.test.ts` expected
  sort uses `localeCompare` (locale-safe assertion).
- **S4-7.** PAD §7.1/§7.3 stale counts (7/62, 24 → the current numbers) — the
  missed session-3 lockstep sweep, folded into this cycle's doc sweep.

### Phase 3 — e2e + regeneration

- **S4-8.** `home.spec.ts`: Home flyout test rewritten to the three-section
  model; iPhone flyout test extended with a family-row pin (iPhone Air).
  `mobile-navigation.spec.ts` and `smoke.mjs` pins audited (MacBook Pro /
  iPhone 18 Pro survive the model change — no edits).
- **S4-9.** `npm run sitemap` — regenerate; measure the new route count
  (~128 + ~29 new info labels − 1 retired); count-lockstep sweep across the
  doc set in the same commit.

### Phase 4 — evidence & delivery

- **S4-10.** Screenshots: re-capture the affected shots (desktop Home flyout,
  desktop Mac flyout with the family rows, mobile Home expansion) + re-validate
  the family via the capture script.
- **S4-11.** Docs sweep: README (Home-flyout prose), AGENTS.md (counts),
  CLAUDE.md (counts), PAD v1.3 revision block (§7 counts), SKILL v1.3.0
  (project_state + D6 revision), reference-investigation (D6 rewritten +
  deviations refresh), worklog Task 116.
- **S4-12.** Full gate → atomic Conventional Commits on `main` → SSH-wrapper
  push.

## Plan validation notes (session 4, against the codebase)

- `flyoutSections()` remains the single seam feeding the desktop flyouts, the
  mobile accordion bodies and (via `INFO_TITLES`) the sitemap's info routes —
  the Home and family-row changes propagate with no component edits (the
  `Flyout` and `MobileMenuRow` renderers are content-agnostic, read in full).
- Blast radius verified by reading every consumer: `home.spec.ts` Home-flyout
  test (rewritten), `site-content.test.ts` Home + Mac-Explore tests (rewritten),
  `mobile-navigation.spec.ts` (pins Mac/iPhone section structure + MacBook Pro +
  iPhone 18 Pro — both labels survive the new model), `smoke.mjs` (pins
  flyout "iPhone 18 Pro" + search "MacBook Pro" — both survive), store-flow
  specs (no flyout/chip pins). Unit and sitemap counts move; both swept
  lockstep in the same commit.
- The AirTag chip's `#/info/airtag` destination resolves in INFO_TITLES today
  (the Accessories flyout's Explore "AirTag" label) — no new derivation needed.
- Risk control: the reference's product-family lists are its live state at
  capture time (Season 2026 lineup); they are modeled as content in the seam,
  re-capturable next cycle. The clone's catalog is untouched — the superset
  (12 products, configurator, bag, checkout) is fully preserved; only the
  flyout's label surface moves to the reference's model.

---

# Session 5 (2026-11-28 — the verification + hygiene cycle)

Inputs: the operator's standing review prompt on a fresh clone (HEAD `4390746` = run-116's docs commit + the session_4.md log paste). Baseline re-observed exactly as documented (lint 0 errors · 2× typecheck clean · 8 files/86 unit · build 309.56 kB / 93.18 kB gzip · e2e 25/25 · smoke 45/45, zero console errors · sitemap 156 routes · PG 17 rootless accepting connections). A read-only subagent audit (web-application methodology, `skills/` excluded) ran over the whole tree with the session-4 diffs (`7b8a3ec..4390746`) first; the live-parity pass re-measured the clone's mobile navigation and re-extracted **all eleven reference flyout models + the home tile/gallery surfaces** from the live DOM.

## Session-5 findings (counts by severity)

| Severity | Count | Key items |
|---|---|---|
| CRITICAL | 0 | — |
| HIGH | 0 | — |
| MEDIUM | 0 | — |
| LOW | 2 | PAD §7.1 table still carries pre-session-4 counts (7 files/62 tests, e2e-desktop 7); `routeTitle` uses the short category label while the store h1 uses the full form ("Shop Watch" tab vs "Shop Apple Watch" h1) |
| INFO | 4 | `?buy` deep link matched by substring (`hash.includes("?buy")`) in App/ProductPage; dead CSS (`.button-neutral` + `.section-ribbon-host`, zero references); dangling `aria-controls` while panels are unmounted; bag-line `<li>` block duplicated (BagPopover + CheckoutPage) |

### Verified evidence (this cycle)

- **Baseline:** every documented gate re-run and green (counts above) — the docs' claims hold at HEAD.
- **Live parity (agent-browser, both sites):** clone mobile navigation fully working at 390×844 (bar geometry byte-equal to the pins: logo x=0 w=48, Search x=246, Bag x=294, Menu x=342, all 48px; menu opens at top=48/h=796, rgba(22,22,23,.98), 11 rows; Mac expansion renders the 3-section content; sub-links 39px; "Compare Mac" → `#/info/compare-mac` + menu closes + h1 correct) — **no Tailwind v4 display-toggling defect** (conditional mounting holds; e2e pins it). The live reference's DOM was extracted fresh and diffed programmatically against `flyoutSections()`: **all eleven flyout content models match exactly** (headings + link lists; NBSP-normalized). Nav order, hero sequence ("Gifts they'll love." / iPhone Duo / iPhone 18 Pro), promo sequence (Apple HomeView / iPad / Apple Watch Series 12 / MacBook Pro ×2 / AirPods Pro 3) and the TV+ gallery titles (9/9) all match. **No reference drift found this cycle** — the session-4 parity state holds. (The reference's own menu dialog and chip-row page measurements remain flaky in this environment — hidden-flyout DOM contaminates page-level probes — so the session-4 captures stand as the evidence base.)
- **Audit:** session-4 diffs verified correct (phone normalization edge cases, `routeHref.productBuy` grammar, cart bail-out, chip/h1 modeling all confirmed); 13/14 doc anchors PASS (the miss = LOW DOC-1, PAD §7.1).
- **Test suites:** `vitest.config.ts` + `playwright.config.ts` present and passing (8 files/86 unit; 25 e2e over the production build; 45-assertion file:// smoke battery) — the standing instruction "add vitest and playwright suites via config files" is satisfied by the existing configs; this cycle extends the suites with regression tests for the fixes below.
- **SEO:** `public/sitemap.xml` (156 `<url>` routes) + `public/robots.txt` (stamped, honest hash-route caveat) + OG/Twitter/JSON-LD in `index.html` verified; `.env.example` matches the codebase exactly (zero app-env reads; `VITE_SITE_URL` generator-only, shell > `.env` precedence verified by the audit).

## Remediation ToDo list (session 5 — S5-*)

### Phase 1 — TDD seam fixes

- **S5-1 (LOW UI-1).** Extract `routeTitle()` from `App.tsx` into a pure seam `src/lib/route-title.ts` that uses `STORE_CATEGORY_LABELS` (full-form, matching the store h1) — tests RED first in `src/lib/route-title.test.ts` (per-route title grammar incl. `#/store/watch` → "Shop Apple Watch - Apple (Singapore)"); `App.tsx` imports it from the seam.
- **S5-2 (INFO ROUTE-1).** Own the `?buy` grammar exactly: new `hasBuyParam(hash)` in `src/lib/router.ts` (URLSearchParams-based, not substring) — `router.test.ts` RED first (`"?buy"` true; `"?buyfoo"`/`"?q=buy"`/`"#/store?buyfoo"` false); `App.tsx` + `ProductPage.tsx` consume it.
- **S5-3 (INFO CSS-1).** Delete the dead `.button-neutral` (+ `:hover`) and `.section-ribbon-host` rules from `src/index.css` (zero references verified); the built CSS shrinks accordingly.
- **S5-4 (INFO A11Y-1).** Gate `aria-controls` on the nav icon buttons, the desktop nav links and the mobile accordion rows to the mounted state (attribute present only while the panel/flyout/section exists); the two spec locators + one smoke locator that address the hamburger via `aria-controls` move to `aria-label`/role (pin strength preserved — the hamburger itself is still asserted hidden on desktop).
- **S5-5 (INFO MAINT-1).** Extract the shared bag-line `<li>` block into `src/components/BagLineRow.tsx`; `BagPopover` and `CheckoutPage` consume it (BagPage keeps its rich layout — it shares only the seam calls).

### Phase 2 — e2e + verification

- **S5-6.** e2e: pin the store tab title's full form inside an existing store-flow assertion (no count change); the mobile-navigation/home/smoke locator updates above keep the hamburger contract.
- **S5-7.** Full gate; live dev-server re-verification of the touched surfaces (store tab title, `?buy` deep-link scroll, bag popover rendering, aria attributes).

### Phase 3 — evidence, docs, delivery

- **S5-8.** Re-capture the 17-shot screenshot family via `scripts/capture-screenshots.sh` on the remediated dev server.
- **S5-9.** Docs lockstep sweep: PAD §7.1 + revision block v1.4; SKILL → v1.4.0 (project_state, counts, §20 seam list); README/AGENTS/CLAUDE counts; `docs/reference-investigation.md` ledger note (session-5 flyout re-verification); worklog Task 117; `.env.example` re-verified unchanged.
- **S5-10.** Atomic Conventional Commits on `main` → SSH-wrapper push (`docs/ssh_git_wrapper_v3.py --remote git@github.com:nordeim/apple-storefront-clone.git`).

## Plan validation notes (session 5, against the codebase)

- `route-title.ts` imports `{getProduct}` (catalog) + `{INFO_TITLES, STORE_CATEGORY_LABELS}` (site-content) + `Route` (router) — no import cycle (site-content already imports router); the layer rule holds (logic that needs a test lives in Layer 4).
- `hasBuyParam` lives in `router.ts` next to `parseSearchQuery` (same query-parsing family); `URLSearchParams` handles the `"?buy"` bare-key form; both consumers currently substring-match (`App.tsx:89`, `ProductPage.tsx:20` — read in full).
- The aria-controls gating touches exactly three pinned locators: `mobile-navigation.spec.ts:34` (→ role locator), `home.spec.ts:11` (→ `aria-label='Menu'`), `smoke.mjs:33` (→ same) — each keeps asserting the same behavior through a stable attribute; the accordion/nav-link aria-controls have no spec consumers (verified by grep).
- `BagLineRow` is purely presentational over the existing seam (`describeSelections`/`unitPrice`/`lineKey`); both consumer blocks were read in full and are byte-identical apart from surrounding layout.
- Counts will move (unit files 8 → 9, tests 86 → ~100; CSS bytes/rules drop; build size ~unchanged) — the lockstep sweep (S5-9) covers README/AGENTS/CLAUDE/PAD/SKILL in the same commit.

---

# Session 6 (2026-11-28 — the re-verification + grammar-hygiene cycle)

Inputs: the operator's standing review prompt on a fresh pull (HEAD `6a3f2be` = run-117's docs commits + the session_5.md log paste; `git pull` brought in the log only). Baseline re-observed exactly as documented (lint 0 errors · typecheck ×2 clean · 9 files/99 unit · build 309.24 kB / 93.24 kB gzip · e2e 26/26 · smoke 45/45, zero console errors · sitemap 156 routes · rootless PostgreSQL 17 re-established via `docs/setup_pg_z.sh`, accepting connections at `postgresql://postgres:postgres@127.0.0.1:5432/app_db`). A read-only subagent audit (web-application methodology, `skills/` excluded) ran over the session-5 diffs (`4390746..6a3f2be`) first; the live-parity pass re-measured the clone's mobile navigation, re-extracted **all eleven reference flyout models from the live DOM and re-diffed them programmatically against `flyoutSections()`** (scripts/parity-diff-6.mjs — Vite ssrLoadModule harness), and spot-checked the reference's hero/promo/gallery surfaces.

## Session-6 findings (counts by severity)

| Severity | Count | Key items |
|---|---|---|
| CRITICAL | 0 | — |
| HIGH | 0 | — |
| MEDIUM | 0 | — |
| LOW | 2 | stray leading "·" separator in bag-line rows for option-less products (AirTag (4 Pack) · Qty 1"; AirPods Pro 3) — reproduced live on the bag popover; the audit's "?buy focus lands on `<main>`" claim **reproduced on the production artifact** (dev-server probing was misleading: StrictMode's double effect invocation re-focuses the heading after the shell steals focus, so dev looks right while prod — the artifact that ships — leaves focus on `<main>`) |
| INFO | 4 | `ORDER_NO` regex duplicated (router.ts + StaticPages.tsx); "Apple (Singapore)" site-name constant static-shell duplication (accepted); store sort resets on category-chip remount (deliberate); impure random initializer for the holiday tile palette (StrictMode double-render) |

### Verified evidence (this cycle)

- **Baseline:** every documented gate re-run and green (counts above) — the docs' claims hold at HEAD.
- **Live parity (agent-browser, both sites):** clone mobile navigation working at 390×844 (bar byte-equal to the pins: logo x=0 w=48, Search x=246, Bag x=294, Menu x=342, all 48px; menu opens at top=48/h=796, rgba(22,22,23,.98); 11 rows (Store…Support), 11 expand buttons; Mac expansion renders the 3-section content; "Compare Mac" navigates + closes; the second Menu tap closes the menu; zero console errors/warnings) — **no Tailwind v4 display-toggling defect**. The live reference's bar pins re-measured byte-equal (logo w=49 at x=0, Search x=246, Bag x=294, Menu x=342). All eleven reference flyout models re-extracted fresh (the Home flyout lives at `globalnav-submenu-link-tv-home`) and diffed programmatically against the seam: **ALL ELEVEN MATCH** (headings + link sets; NBSP-normalized). Reference hero ("Gifts they'll love." → iPhone Duo → iPhone 18 Pro), promo sequence (Apple HomeView · iPad · Apple Watch Series 12 · MacBook Pro PROLED · MacBook Pro M6 · AirPods Pro 3) and TV+ gallery titles (9/9) all match — **no reference drift this cycle**.
- **Audit:** 2 LOW + 4 INFO; 8 project traps all PASS; count lockstep exact (9/99 · 26 e2e · 45 smoke · 156 routes · 309.2 kB). LOW-1 (?buy focus steal) disproved by direct reproduction — live behavior is correct (the Configurator's heading focus survives the Shell's `<main>` focus on in-app navigation); the audit's own "Reasoned" confidence label flagged it as un-executed, and execution disproved the reasoning.
- **Test suites:** `vitest.config.ts` + `playwright.config.ts` present and passing — the standing instruction is satisfied by the existing configs; this cycle adds regression pins for the fixes below.

## Remediation ToDo list (session 6 — S6-*)

### Phase 1 — TDD seam fixes

- **S6-1 (LOW-1, real on the artifact).** The audit's finding holds on the production build (verified live against `vite preview`: in-app Buy CTA click → `document.activeElement` = `<main>`, the Configurator's heading focus stolen by the Shell's unconditional `mainRef.focus()`; the dev server masked it via StrictMode re-invocation). Fix: gate the shell's scroll+focus reset so it does not run when the route is a product page carrying the `?buy` deep link — `if (!(route.name === "product" && hasBuyParam(hash))) { window.scrollTo(0, 0); mainRef.current?.focus({ preventScroll: true }); }` — the Configurator's child effect owns focus exactly when it exists. Regression pin (RED first, the failing e2e): store-flow.spec.ts gains "in-app Buy CTA keeps the configurator heading focused" (home → real click on "Buy, iPhone Duo" → activeElement is `#configure-heading`); e2e 26 → 27.
- **S6-2 (LOW-2).** Extract the bag-line summary grammar into a tested pure seam — `bagLineSummary(product, quantity, selections)` in `src/lib/cart.ts` returning `[...describeSelections(...), `Qty ${quantity}`].join(" · ")` (so option-less products render "Qty 1" with no stray separator); `bagLineSummary.test.ts` RED first (option-less product → "Qty 1"; configured product → "256GB · Natural Titanium · Qty 1"; multi-option join); `BagLineRow.tsx` consumes it. No existing spec pins the old text (verified by grep) — behavior change is safe.
- **S6-3 (INFO-1).** Dedupe the order-number grammar: export `ORDER_NO` from `src/lib/router.ts` and import it in `StaticPages.tsx` (delete the local `ORDER_NO_PATTERN` copy). Pure refactor over the already-tested regex; no behavior change.
- **S6-4 (INFO-4) — accepted as-is after re-verification, no code change.** The random lazy initializer (`useState(() => HOLIDAY_COLORS[Math.floor(Math.random() …)] ?? "pink")`) is React's documented idiom for CSR-only random initial state; there is no SSR/hydration surface in this SPA, and StrictMode's double render commits one consistent value. A deterministic start would REMOVE the documented parity behavior (the reference's holiday hero carries 4 colourways — `docs/reference-investigation.md` row 16) and contradict the README's "colour-cycling holiday tile" claim. The e2e pins (`data-playing`, play/pause) do not touch the initial color. Decision: keep the random initializer; record the rationale here.

### Phase 2 — verification

- **S6-5.** Full gate; live dev-server re-verification of the touched surfaces (bag popover line text for an option-less product; in-app CTA focus; holiday tile renders).

### Phase 3 — evidence, docs, delivery

- **S6-6.** Re-capture the 17-shot screenshot family via `scripts/capture-screenshots.sh` on the remediated dev server.
- **S6-7.** Docs lockstep sweep: counts (unit 99 → +N, e2e 26 → 27) across README/AGENTS/CLAUDE/PAD §7.1/SKILL project_state; PAD revision block v1.5; SKILL → v1.5.0; `docs/reference-investigation.md` session-6 re-verification row; worklog Task 118; `.env.example` re-verified unchanged.
- **S6-8.** Atomic Conventional Commits on `main` → SSH-wrapper push (`docs/ssh_git_wrapper_v3.py --remote git@github.com:nordeim/apple-storefront-clone.git`).

## Plan validation notes (session 6, against the codebase)

- `bagLineSummary` lives in `cart.ts` next to `describeSelections`/`lineKey` (same domain family); it needs `Product` from catalog (cart.ts already imports it). `BagLineRow.tsx`, both consumers (`GlobalNav.tsx:104`, `CheckoutPage.tsx:106`), and `cart.ts` were read in full; the component stays purely presentational over the seam (the repo's layer rule).
- The audit's LOW-1 was first probed on the dev server (heading stayed focused — a StrictMode artifact: the double effect re-invocation re-runs the Configurator's heading focus after the Shell's `<main>` focus, masking the steal) and then **confirmed on the production artifact** (`vite preview`, `document.activeElement` = `<main>`), matching the e2e RED run. The fix gates the Shell effect's focus+scroll on `!(route.name === "product" && hasBuyParam(hash))` — read in full in `App.tsx:54-62`; the Configurator effect (`ProductPage.tsx:19-23`) remains the focus owner on exactly that path (valid product routes always render it; `#/product/ghost?buy` degrades to not-found, where the normal main focus applies).
- `ORDER_NO` at `router.ts:17` is module-private today; exporting it adds a consumer in `StaticPages.tsx:40` (deleting the duplicate) — no new tests needed (the regex is pinned in `router.test.ts`; the support-page lookup flow is pinned in store-flow e2e).
- INFO-2 (SITE name duplication with the static `index.html` boot title) is **accepted as-is**: the shell title is deliberately static pre-hydration (no generator exists to stamp it; adding an export with zero TS consumers would be dead code — the repo forbids it). INFO-3 (sort reset on chip switch) is the documented remount-key decision — no change. INFO-4 (random holiday initializer) is likewise accepted (see S6-4: React's documented CSR idiom; removing the randomness would break the 4-colourway parity behavior).
- Counts will move: unit 99 → 102 (+3 bagLineSummary tests, S6-2), e2e 26 → 27 (+1 in-app focus pin, S6-1) — the lockstep sweep (S6-7) covers README/AGENTS/CLAUDE/PAD/SKILL in the same commit.

# Session 7 (2026-11-28 — the robustness + lockstep-integrity cycle)

Inputs: the operator's standing review prompt on a fresh pull (HEAD `9ffb287` = the session-6 docs sweep + the session_6.md log paste; `git pull` brought in the log only). Baseline re-observed exactly as documented (lint 0 errors + 3 accepted warnings · typecheck ×2 clean · 9 files/102 unit · build 309.27 kB / 93.24 kB gzip · e2e 27/27 · smoke 45/45, zero console errors · sitemap 156 routes · PostgreSQL 17.12 accepting connections at `postgresql://postgres:postgres@127.0.0.1:5432/app_db` — data dir and server survived the sandbox recycle this cycle). A read-only subagent audit (web-application methodology, `skills/` excluded) ran over the session-5+6 diffs plus a full-tree hygiene sweep; the live-parity pass re-measured the clone's mobile navigation, re-extracted **all eleven reference flyout models from the live DOM and re-diffed them programmatically against `flyoutSections()`** (the session-6 Vite ssrLoadModule harness, re-run), and spot-checked the reference's hero/promo surfaces.

## Session-7 findings (counts by severity)

| Severity | Count | Key items |
|---|---|---|
| CRITICAL | 0 | — |
| HIGH | 0 | — |
| MEDIUM | 0 | — |
| LOW | 2 | `README.md:48` Quick-start block still says `26 passed` for the e2e suite (the one count-lockstep drift — session-6's sweep missed it); `Tile.tsx:91` carries `aria-pressed={!playing}` on a label-flipping play/pause button (APG anti-pattern: pressed-state + changing label are contradictory channels; the gallery's play/pause is the correct label-flip-only pattern) |
| INFO | 5 | no ErrorBoundary anywhere (a render throw blanks the whole SPA — deferred debt from sessions 5+6, landed this cycle); `BagSummary` still exported from `pages/BagPage.tsx` and imported page→page by `CheckoutPage.tsx` (the session-5/6 refactor pattern missed this straggler); BagPopover non-modal focus announcement (accepted as-is); `flyoutSections()` recomputed per render (accepted — microseconds); audit-scope notes (documentation only) |

### Verified evidence (this cycle)

- **Baseline:** every documented gate re-run and green at HEAD (counts above) — the docs' claims hold, except the single README:48 drift.
- **Audit:** 0 C/H/M · 2 LOW + 5 INFO; 8 project traps all PASS; count lockstep verified everywhere except README:48. The session-6 seams re-audited clean: the `?buy` focus gate's edge routes probed at runtime (ghost product → 404 gets the standard `<main>` focus reset — correct; `?buy` on non-product routes inert; discrete query-key grammar holds), `bagLineSummary`/`ORDER_NO` single-sourcing intact, XSS surface clean (no `innerHTML`/`dangerouslySetInnerHTML`/`eval` anywhere in `src/`).
- **Live parity (agent-browser, both sites):** clone mobile navigation working at 390×844 (bar byte-equal to the pins: logo x=0 w=48, Search x=246, Bag x=294, Menu x=342; menu opens top=48/h=796, rgba(22,22,23,.98); 11 rows; Mac expansion renders the 3-section / 26-link content; "Compare Mac" navigates + closes; zero console errors) — **no Tailwind v4 display-toggling defect**. All eleven reference flyout models re-extracted fresh from the live DOM and diffed against the seam: **ALL ELEVEN MATCH**. Reference hero ("Gifts they'll love." → iPhone Duo → iPhone 18 Pro), 6-promo sequence (HomeView · iPad · Watch S12 · MacBook Pro ×2 · AirPods Pro 3) and bar pins re-measured — **no reference drift this cycle**. Environment-limited: the reference's TV+ gallery rail did not lazy-load into this session's headless render; gallery parity rests on the session-4/5/6 live extractions (9/9 titles) + the clone's own e2e gallery pins (9 cards / 9 dots verified in the DOM this cycle).
- **Test/SEO surface:** `vitest.config.ts` + `playwright.config.ts` present and passing (the standing config-file instruction); sitemap 156 routes regenerated from the seam; robots.txt/meta surface verified unchanged.

## Remediation ToDo list (session 7 — S7-*)

### Phase 1 — TDD fixes and pins

- **S7-1 (LOW-1, docs lockstep).** `README.md:48`: `26 passed` → `27 passed` (the e2e count in the Quick-start verify block). Pure docs fix.
- **S7-2 (LOW-2, RED first).** Drop `aria-pressed={!playing}` from the holiday play/pause button (`Tile.tsx:91`); the flipping `aria-label` ("Pause/Play Holiday 2026 animation") is the state channel, matching the gallery's play/pause pattern. TDD: extend `home.spec.ts`'s holiday test with a RED assertion — the button must NOT carry `aria-pressed` (it fails today: the attribute is present).
- **S7-3 (coverage pin, unit).** `cart.test.ts` bagLineSummary block gains "drops unknown choice ids without leaking separators" — `bagLineSummary(phone, { selections: { color: "bogus", storage: "256" } })` → `"256GB · Qty 1"` (already-correct behavior pinned; `describeSelections` skips unknown ids).
- **S7-4 (coverage pin, e2e +1).** `store-flow.spec.ts` gains "?buy on a ghost product still resets focus to main (404 path)": `#/product/ghost?buy` → not-found copy visible + `document.activeElement.id === "main"` — pins the App.tsx gate's false branch, previously only reasoned.
- **S7-5 (coverage pin, same test).** The existing "in-app Buy CTA keeps the configurator heading focused" test gains back/forward assertions: `goBack()` → home, `goForward()` → `#/product/iphone-duo?buy` + URL + `#configure-heading` still focused — the popstate path, previously unpinned (no count change).
- **S7-6 (INFO-2 → landed, RED first).** `src/components/ErrorBoundary.tsx` — a class boundary (`static getDerivedStateFromError`) rendering a graceful fallback ("Something went wrong." + a "Return to the homepage" link + a reload link) styled as a PageShell-compatible section; `App.tsx` wraps `<RouteView route={route} />` so the nav/footer shell survives a render throw (page-level boundary, the right granularity for a route-switched SPA). TDD: `src/components/ErrorBoundary.test.tsx` — the repo's first component-level unit test (React 19 `act` + `createRoot` in jsdom, zero new deps): renders children when no error; renders the fallback + home link when a child throws (console noise mocked inside the test). Test posture documented as a new row in PAD §7.1.
- **S7-7 (INFO-5 → landed, mechanical).** `BagSummary` moves from `src/pages/BagPage.tsx` to `src/components/BagSummary.tsx` (both components, both pages import it from `components/`) — the page→page import is gone; behavior unchanged (typecheck + full gate verify).

### Phase 2 — verification

- **S7-8.** Full gate on the remediated tree; live dev-server verification of the touched surfaces (holiday play/pause label flip with no aria-pressed; bag page + checkout still render the summary rows; the ghost-?buy 404 path live).

### Phase 3 — evidence, docs, delivery

- **S7-9.** Re-capture the 17-shot screenshot family via `scripts/capture-screenshots.sh` on the remediated dev server.
- **S7-10.** Docs lockstep sweep: counts (unit 102 → 105 (+3: unknown-choice pin + 2 boundary tests), e2e 27 → 28 (+1 ghost pin), plus the component-test posture row) across README/AGENTS/CLAUDE/PAD §7.1/SKILL project_state; PAD → v1.6 revision block; SKILL → v1.6.0; `docs/reference-investigation.md` session-7 re-verification row; worklog Task 119; `.env.example` re-verified unchanged.
- **S7-11.** Atomic Conventional Commits on `main` → SSH-wrapper push (`docs/ssh_git_wrapper_v3.py --remote git@github.com:nordeim/apple-storefront-clone.git`).

## Plan validation notes (session 7, against the codebase)

- `Tile.tsx:91` read in full: the button's `aria-label` already flips with state; no spec pins `aria-pressed` on the holiday button (grep over `tests/e2e/**` — only `data-playing` is pinned by home.spec.ts:117 + smoke.mjs:100), so removing the attribute is pin-safe; the RED assertion makes the removal itself test-driven.
- `README.md:48` verified stale by direct read + `git show 06a737b` (the sweep commit updated line 24 but missed the Quick-start block).
- `bagLineSummary` unknown-choice behavior read in `cart.ts:43-59` — `describeSelections`'s `find` skips unmatched ids, so the pin lands GREEN (labeled a coverage pin, not a bug fix).
- The `#/product/ghost?buy` route was probed at runtime this cycle (audit's probe + parseHash): `parseHash` yields `not-found`, the App.tsx:62 gate is false → the standard scroll+focus reset runs — the S7-4 e2e pins verified behavior. The ghost-path e2e needs `page.reload()` after `goto` (hash-navigation effect timing, matching the hostile-routes test's pattern at store-flow.spec.ts:84-86).
- `ErrorBoundary` placement read in `App.tsx` (full file): wrapping `RouteView` inside `<main>` keeps `GlobalNav`/`Footer`/skip-link alive and the `<main>` focus contract untouched; the boundary must never wrap the `GlobalNav` (the bag popover's state must survive a route crash). The test file lands under `src/components/` so the main `tsconfig.json` (`include: ["src", ...]`, `jsx: react-jsx`) and `vitest.config.ts` (`src/**/*.test.{ts,tsx}`) both cover it without config changes; `React.act` + `IS_REACT_ACT_ENVIRONMENT` is the React-19-documented harness; react-dom/client is an existing dependency (`react-dom` 19.2.6 — no new packages).
- `BagSummary` move: `BagPage.tsx` (full read) + `CheckoutPage.tsx`'s import line verified; both exports are components so no react-refresh warning change (the 3 accepted warnings live in ProductArt/ProductCard/BagContext — checked, unaffected).
- Count moves: unit 102 → 105 (+3), e2e 27 → 28 (+1) — the lockstep sweep (S7-10) covers README/AGENTS/CLAUDE/PAD/SKILL in the same commits.

### Execution addendum (session 7, as-run corrections)

- S7-4 as executed: the ghost-path pin first drove a fresh-load `goto` + `reload` and failed RED for the right reason — the shell's effect only runs its scroll/focus reset on **in-app navigation** (`isNavigation` guard; fresh loads never move focus by design). The landed test drives an in-app hash navigation (`window.location.hash = "#/product/ghost?buy"` from home) and pins not-found + `<main>` focus — the pin now matches the documented behavior instead of an assumed one. The plan's original "needs page.reload() after goto()" note was wrong; this addendum records the correction.
- S7-5 as executed: the first `goBack()` assertion (`#/` URL) failed RED because the browser collapses the hash to the bare entry URL on history navigation — the landed tail asserts the home content is visible (robust to URL shape), then `goForward()` back onto the `?buy` route with `#configure-heading` focused.
- Counts as landed: unit 102 → **105** (+1 unknown-choice pin, +2 `ErrorBoundary` spec), e2e 27 → **28** (+1 ghost pin); build 310.4 kB / 93.7 kB gzip; CSS 33,654 bytes / 518 rules.

---

# Session 8 (2026-11-28 — the a11y-tier + crash-recovery cycle)

Inputs: the operator's standing review prompt on a fresh pull (HEAD `1a3b13d` = the session-7 tree + the `docs/session_7.md` log paste; `git pull` brought in the log only). Baseline re-observed exactly as documented (lint 0 errors + 3 accepted warnings · typecheck ×2 clean · **10 files / 105 unit** · build 310.43 kB / 93.68 kB gzip · e2e **28/28** · smoke 45/45, zero console errors · sitemap **156 routes** · PostgreSQL 17.12 accepting connections at `postgresql://postgres:postgres@127.0.0.1:5432/app_db` — the data dir + server survived the sandbox recycle). A read-only subagent audit (web-application methodology, `skills/` excluded) ran over the session-7 diffs + a full-tree hygiene sweep; the live-parity pass re-measured the clone's mobile navigation, re-extracted **all eleven reference flyout models from the live DOM and re-diffed them programmatically against `flyoutSections()`** (the session-6 Vite ssrLoadModule harness, re-run), and swept the reference's hero/promo/gallery/store surfaces.

## Session-8 findings (counts by severity)

| Severity | Count | Key items |
|---|---|---|
| CRITICAL | 0 | — |
| HIGH | 0 | — |
| MEDIUM | 1 | `ErrorBoundary` latches `failed` forever: `App.tsx` renders it unkeyed and the class has no reset, so after one route-render crash every in-app navigation (including the fallback's own home link) keeps showing the fallback until a full reload — the recovery affordance half-broken |
| LOW | 5 | PAD §1.2 stale `clsx`/`tailwind-merge` row (deps removed session 3); PAD §1.2 stale "Testing Library present in devDeps" row (removed session 2); PAD §11 + SKILL §5 line-count drift (cart.ts 103, BagLineRow 31, GlobalNav 253); `docs/DEPLOYMENT.md` §1 route counts stale (123/103 vs live 156/131); PAD §5.3 dead `.button-neutral` mention + §3 component inventory misses BagLineRow/BagSummary/ErrorBoundary |
| INFO | 4 | a11y debt inventory (the **home page renders no `<h1>`** — the reference ships a sr-only `visuallyhidden` h1 "Apple"; axe-core tier absent — the session-7 deferred debt); `parseHash` lenience (`#/search/xyz`, `#/entertainment/x`, `#/support/x` parse as valid routes while sibling heads 404 — unreachable from app-built hrefs); ADR-era figures (ADR-001 ~306 kB, ADR-007 "128 URLs") read stale |

## Verified evidence (this cycle)

- **Baseline:** every documented gate re-run and green at HEAD — the docs' claims hold.
- **Audit:** 0 CRITICAL/HIGH · **1 MEDIUM** + 5 LOW + 4 INFO; 8 project traps all PASS; count lockstep exact across the six docs (test/route/build counts) — the residuals are the five stale-doc spots above. The session-7 seams re-audited clean (aria one-channel pin, ghost-`?buy` focus pin, popstate tail, BagSummary move all verified against the live tree).
- **Live parity (agent-browser, both sites):** clone mobile navigation CONFIRMED WORKING at 390×844 (bar byte-equal to the pins: logo x=0 w=48, Search x=246, Bag x=294, Menu x=342, all 48px; menu opens top=48/h=796, rgba(22,22,23,.98); 11 rows / 11 expand buttons; Mac expansion renders the 3-section / 26-link content, sub-links 39px; "Compare Mac" navigates + closes; zero console errors) — **no Tailwind v4 display-toggling defect**. All eleven live reference flyout models re-extracted fresh (the Home item's flyout lives in the reference's legacy `globalnav-item-tv` container — the `tv-home` naming documented since session 6) and diffed against the seam: **ALL ELEVEN MATCH**. Reference resting bar pins re-measured byte-equal (logo x=0 w=49, Search x=246, Bag x=294, Menu x=342; the back-chevron `visibility:hidden` at rest). Hero ("Gifts they'll love." / iPhone Duo / iPhone 18 Pro), 6-promo sequence (HomeView · iPad · Watch S12 · MacBook Pro ×2 · AirPods Pro 3) and the **TV+ gallery rail (9/9 titles — it lazy-loaded into this session's headless render, closing session-7's environment-limited gap)** all match; the /sg/store chip row (Mac · iPhone · iPad · Apple Watch · Apple Vision Pro · Home · AirPods · AirTag · Accessories, full forms, iPhone before iPad) and the `/sg/shop/buy-watch` h1 ("Shop Apple Watch") match. **Zero reference drift this cycle.**
- **Test/SEO surface:** `vitest.config.ts` + `playwright.config.ts` present and passing (the standing config-file instruction); sitemap 156 routes regenerated from the seam; robots.txt/OG/JSON-LD/`.env.example` re-verified unchanged.

## Remediation ToDo list (session 8 — S8-*)

### Phase 1 — TDD fixes

- **S8-1 (M-1, RED first).** `ErrorBoundary` gains a `resetKey?: string` prop; `componentDidUpdate(prevProps)` resets `failed` to false when `resetKey` changes (the react-error-boundary `resetKeys` pattern — the boundary re-arms on route change; a crash on the *new* route re-latches correctly). `App.tsx` wires `<ErrorBoundary resetKey={path}>`. TDD: `ErrorBoundary.test.tsx` RED case first — render with `resetKey="a"` + `<Boom/>` (fallback pinned), re-render with `resetKey="b"` + healthy child → the child renders again (RED today: no reset path exists).
- **S8-2 (INFO-1, the session-7 "suggested next").** The axe-core e2e tier: `@axe-core/playwright` as an explicit devDependency (nothing ships in the single-file artifact), new `tests/e2e/a11y.spec.ts` under the desktop project — WCAG2 A+AA scans of home / store / store-watch / product / bag / checkout / entertainment / support / search / an info page, plus mobile-state scans via `setViewportSize(390×844)` of the bar resting state and the menu-**open** state (the overlay is conditionally mounted — scan it while mounted). Exploratory scan first to triage findings; real fixes land (S8-3); the spec then pins zero violations (any parity-bound exclusion is documented inline, never silent).
- **S8-3 (parity + axe `page-has-heading-one`).** `HomePage` gains a sr-only `<h1>` ("Apple (Singapore)" — the clone's own site name, the same string the tab title uses) mirroring the reference's own sr-only `visuallyhidden` h1 ("Apple"). Visually zero-change: `sr-only` clipping.
- **S8-4 (INFO-3, RED first).** `parseHash` grammar strictness: `search` / `entertainment` / `support` now guard `arg === undefined` like their siblings (hostile `#/search/xyz` degrades to the typed 404 instead of a silently-truncated valid route). `router.test.ts` RED first for the three shapes.

### Phase 2 — verification

- **S8-5.** Full gate on the remediated tree; live dev-server verification of the touched surfaces (the sr-only h1 present-but-clipped on home; axe scans green on the built artifact; recovery spec green).

### Phase 3 — evidence, docs, delivery

- **S8-6.** Re-capture the 17-shot screenshot family via `scripts/capture-screenshots.sh` on the remediated dev server.
- **S8-7.** Docs lockstep sweep: counts (unit 105 → +N, e2e 28 → +N axe scans, CSS/build if moved) across README/AGENTS/CLAUDE/PAD/SKILL/DEPLOYMENT; the five stale-doc LOWs (PAD §1.2 rows, PAD §11 + SKILL §5 line counts, DEPLOYMENT §1 route counts, PAD §5.3 `.button-neutral` + §3 component inventory); PAD → v1.7 revision block; SKILL → v1.7.0 (project_state + the axe-tier lesson); `docs/reference-investigation.md` session-8 row; worklog Task 120; `.env.example` re-verified unchanged.
- **S8-8.** Atomic Conventional Commits on `main` → SSH-wrapper push (`docs/ssh_git_wrapper_v3.py --remote git@github.com:nordeim/apple-storefront-clone.git`).

## Plan validation notes (session 8, against the codebase)

- `ErrorBoundary.tsx` (51 lines) and `App.tsx` (99 lines) read in full: the boundary is the only class component, `path` is already computed at `App.tsx:53`, and the `resetKey` prop is additive (optional, default-undefined → no reset for the spec's keyless usages; `componentDidUpdate` fires only on prop/state change — the existing two spec cases render once each and stay green). The recovery semantics match React's documented boundary model: a `resetKey` change re-arms the boundary in place without unmounting (the alternative — keying the boundary from `App.tsx` — works too but is consumer discipline no test can force; owning it in the class is the seam-first repo rule).
- The recovery unit case reproduces M-1 exactly: same instance, prop change, `state.failed === true` → today the fallback persists (RED), with the reset the healthy child renders (GREEN).
- `a11y.spec.ts` runs under the desktop project only (mobile's `testMatch` restricts it to `mobile-navigation.spec.ts`); mobile-state scans happen inside the spec via `setViewportSize` — zero `playwright.config.ts` changes, zero interference with the 28 pinned tests. `@axe-core/playwright` imports `AxeBuilder` and injects axe-core into the page — devDependency tier only; the single-file artifact is untouched (verified by build-size compare in S8-5).
- `HomePage.tsx` renders the hero/promo tiles (h2/h3 tile headlines, verified this cycle); adding one `<h1 className="sr-only">` before the ribbon matches the reference's own sr-only-h1 pattern and resolves axe's `page-has-heading-one` (impact: moderate) — the one axe finding expected on home.
- `router.ts` `case "search"` (line 68) ignores `arg`; `entertainment`/`support` (70-73) likewise — the strictness fix is uniform with `bag`/`checkout`/`home` (`arg === undefined ? … : NOT_FOUND`). Blast radius: no app-built href produces `#/search/x`, `#/entertainment/x`, `#/support/x` (verified: hrefs come from `routeHref.*` factories which build exactly the argless shapes); the smoke battery and e2e specs pin argless routes — unaffected.
- Counts will move: unit 105 → ~110 (+3 router pins, +1-2 recovery cases), e2e 28 → 28 + the axe scan count (measured at execution) — the lockstep sweep (S8-7) covers README/AGENTS/CLAUDE/PAD/SKILL/DEPLOYMENT in the same commits.

### Execution addendum (session 8, as-run corrections and notes)

- S8-1 as executed: the recovery fix landed as the boundary-owned `resetKey` prop (RED observed on both new spec cases — the fallback persisted after the prop change pre-fix; GREEN 4/4 after). The plan's alternative (`<ErrorBoundary key={path}>` consumer discipline) was rejected precisely because no test can force it — owning the reset in the class pins it in the seam.
- S8-2 as executed: the exploratory axe triage (a scratch Vite-preview harness, not committed) surfaced two findings classes beyond the expected h1: (a) the ribbon's animated blue→charcoal state — axe scanning mid-animation measures the blue #0071e3 background (4.31:1/1.55:1 artifacts), so the spec settles 2.6 s before scanning; (b) inactive gallery cards at `opacity: .4` (axe measures dimmed text despite `aria-hidden`) — excluded per the measured-reference rationale. The LIVE REFERENCE was then measured directly: its ribbon link is exactly #2997ff, no underline, on #1d1d1f, and its TV+ rail dims inactive cards — the clone's flagged surfaces are byte-equal reference design, recorded as the two documented exclusions in the spec header. Fixes the tier DID drive: the sr-only h1 (S8-3) and the gallery track's `ul/li` → `div` conversion (a `li[role=tabpanel]` breaks axe's `list` rule via the role override; no e2e/smoke locator pinned the track markup — verified by grep before the change).
- S8-4 as executed: the strictness fix covers `search`/`entertainment`/`support` uniformly; the router pin asserts all three hostile shapes RED→GREEN.
- Counts as landed: unit 105 → **108** (+2 boundary re-arm/re-latch, +1 router strictness), e2e 28 → **40** (+12 axe scans); build 310.71 kB / 93.74 kB gzip; CSS 33,720 bytes / 519 rules; devDeps + `@axe-core/playwright@^4.14.1` (dev tier only — the artifact is unchanged in kind, verified by build-size delta ≈ 0.3 kB for the h1/track markup).
