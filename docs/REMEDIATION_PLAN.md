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

---

# Session 9 (2026-11-28 — the store editorial-rails parity cycle)

Inputs: the operator's standing review prompt on a fresh pull (HEAD `af88a0d` = the session-8 tree + the `docs/session_8.md` log paste; `git pull` brought in the log only). Baseline re-observed exactly as documented (lint 0 errors + 3 accepted warnings · typecheck ×2 clean · **10 files / 108 unit** · build **310.71 kB / 93.74 kB gzip** · e2e **40/40** · smoke **45/45**, zero console errors · sitemap **156 routes** · PostgreSQL 17.12 accepting connections at `postgresql://postgres:postgres@127.0.0.1:5432/app_db` — the data dir + server survived the sandbox recycle again). A read-only subagent audit (web-application methodology, `skills/` excluded) ran over the session-8 diffs + a full-tree hygiene sweep; the live-parity pass re-measured the clone's mobile navigation, re-extracted **all eleven reference flyout models from the live DOM and re-diffed them programmatically against `flyoutSections()`** (a rebuilt Vite ssrLoadModule harness), and swept the reference's home/store surfaces — with the reference's store page measured in full for this cycle's feature work.

## Session-9 findings (counts by severity)

| Severity | Count | Key items |
|---|---|---|
| CRITICAL | 0 | — |
| HIGH | 0 | — |
| MEDIUM | 0 | — |
| LOW | 1 | PAD §11 line-count drift on `ErrorBoundary.tsx` (says 51; the file is 67 lines since S8-1 grew it — the session-8 docs sweep refreshed the other stale rows but missed the row the session itself invalidated) |
| INFO | 5 | `resetKey={path}` is path-only (a same-path query-only change does not re-arm — mirrors the shell's own `isNavigation` semantics, consistent design); a11y spec header documents the exclusion selector in descendant form while the code excludes the element itself (cosmetic comment/code notation); secondary size figures carry measurement-method noise (CSS 33,722 vs 33,720 B; gzip tool-dependent); trailing-slash aliasing survives the strictness fix (`#/search/` parses valid — benign, no truncation); `ely-beauty_SKILL.md` (333 KB tracked at root) is a known vendored doc, properly `@source`-excluded |
| PARITY GAP | 1 | **The store index page's editorial rails** — the documented next-cycle surface from session 8: the reference's `/sg/store` body is seven measured editorial rails ("The latest." / "Personalisation." / "Holiday picks." / "Colourful finds." / "Home essentials." / "Only at Apple." / "Savings and offers."), while the clone's store index shows only the superset product grid; the reference also carries a "Quick Links" strip (Shop Gifts · Find a Store · AirPods · Apple Intelligence · Apple Trade In) under the h1 that the clone lacks |

## Verified evidence (this cycle)

- **Baseline:** every documented gate re-run and green at HEAD — the docs' claims hold exactly (counts above, byte-measured 310,714 B artifact).
- **Audit:** 0 CRITICAL/HIGH/MEDIUM · 1 LOW + 5 INFO; 8 standing traps all PASS; count lockstep exact across the six docs (test/route/build/CSS/rule counts) — the residual is the single stale PAD row. The session-8 seams re-audited clean: `resetKey` re-arm/re-latch semantics verified (both directions), router strictness uniform across all 11 heads, sr-only h1 exactly one per route (no double-h1 elsewhere), gallery `div[role=tabpanel]` conversion regression-free, axe-tier exclusions legitimate and documented inline. XSS surface clean; no dead code; no stray files.
- **Live parity (agent-browser, both sites):** clone mobile navigation CONFIRMED WORKING at 390×844 (bar byte-equal to the pins: logo x=0 w=48, Search x=246, Bag x=294, Menu x=342, all 48px; menu opens top=48/h=796, rgba(22,22,23,.98); 11 rows; Mac expansion mounts 26 links, sub-links 39px; "Compare Mac" navigates + closes; zero console errors) — **no Tailwind v4 display-toggling defect**. All eleven reference flyout models re-extracted fresh from the live DOM (Home at `globalnav-submenu-link-tv-home`) and re-diffed programmatically against `flyoutSections()` — **ALL ELEVEN MATCH**. Reference home h1 (sr-only "Apple"), hero ("Gifts they'll love." / iPhone Duo / iPhone 18 Pro) and promo sequence (iPad / HomeView / MacBook Pro ×2 / AirPods Pro 3 visible) re-measured matching; the TV+ gallery rail did not lazy-load into this session's headless render (parity rests on the session-4/5/6/8 extractions + the clone's e2e gallery pins — environment-limited, same class as session 7). Reference `/sg/store` measured in full for the feature: h1 "Store" (y=134) → "Quick Links" strip (y=148, 980×160: Shop Gifts · Find a Store · AirPods · Apple Intelligence · Apple Trade In) → the chip row (y=292, byte-equal to the clone's pins) → **seven editorial rails at a 677px rhythm**: rail header = h2 28px/600 `rgb(129, 8, 49)` + secondary header 28px/600 `rgb(110, 110, 115)`; cards 400×500 (`.rf-ccard`, white bg, text overlaid at top: eyebrow 12px/600 #424245, name 28px/600 link, desc 17px, chevron 36×36 at bottom-right), 20px gaps, horizontal scroller with paddles; accessory recommendation cards 313×500 (`.rf-recommcard`, name 17px/600, price desc); card sets: The latest. 12 product cards (NEW eyebrows), Personalisation. 3 editorial + 7 recomm, Holiday picks. 2 editorial + 10 recomm, Colourful finds. 1 editorial + 9 recomm, Home essentials. 4 editorial + 8 recomm, Only at Apple. 9 editorial, Savings and offers. 3 editorial. Reference category page (`/sg/shop/buy-watch`) h1 "Shop Apple Watch" re-verified. **Zero drift on every previously-pinned surface.**
- **Test/SEO surface:** `vitest.config.ts` + `playwright.config.ts` present and passing (the standing config-file instruction); sitemap 156 routes regenerated from the seam; robots.txt/OG/JSON-LD/`.env.example` re-verified unchanged.

## Remediation ToDo list (session 9 — S9-*)

### Phase 1 — the store editorial rails (the parity feature, TDD)

- **S9-1 (the seam, RED first).** New pure content seam `src/lib/store-rails.ts`: `STORE_RAILS` (7 rails × the measured headers/subheads/cards) + `railCardHref` (catalog-name match → `routeHref.product(id)`, else `routeHref.info(slugify(label))` — the established `familyLink` pattern) + `productPriceLabel(product)` (`From S$X` when the product carries options, `S$X` when not — the reference's own grammar, values from THIS clone's catalog, deviation D10-documented). Unit spec `store-rails.test.ts` RED first: 7 rails with exact headers/subheads; "The latest." carries 12 cards, 7 catalog-matched (iPhone 18 Pro, Apple Watch Series 12, MacBook Pro, Apple HomeView, iPhone Duo, MacBook Pro PROLED XDR Display, Apple TV 4K — labels byte-equal to the live capture) routing to product pages with clone prices; non-catalog cards carry the reference's measured price/desc text routing to info pages; "Only at Apple." carries 9 cards, "Savings and offers." 3; every card href matches `#/product/<id>` or `#/info/<slug>` shape.
- **S9-2 (the Quick Links strip, same seam).** `STORE_QUICK_LINKS` (5 measured labels: Shop Gifts, Find a Store, AirPods, Apple Intelligence, Apple Trade In → info routes; AirPods label byte-equal to the flyout's `infoLink` slug so the seam and the INFO_TITLES derivation stay one source). Rendered between the h1 and the chip row (the reference's measured order).
- **S9-3 (the component).** New `src/components/StoreRails.tsx`: per rail `<section>` with the measured h2 (burgundy `#810831` 28px/600) + secondary header (muted `#6e6e73` 28px/600) + a horizontally-scrollable `<ul>` (role="list", `overflow-x-auto` + snap, 20px gaps, 119px rail rhythm). Card anatomy per measurement: white 400×500 cards, text overlay at top (eyebrow 12px/600, name 28px/600 product cards / 17px/600 accessory cards, desc 17px, chevron bottom-right); product cards render `ProductArt` (catalog match) or a generated gradient panel (editorial/accessory cards — the D5 pattern); the whole card is one `routeHref` link. `prefers-reduced-motion` untouched (no new animation). Renders ONLY on the store index (`category === undefined`) — category pages keep their pinned structure; the superset product grid + sort control move BELOW the rails ("All products" section), preserving the reference's top-of-page order (h1 → Quick Links → chips → rails) with the working store below.
- **S9-4 (e2e pins, RED first).** `tests/e2e/store-flow.spec.ts` gains two pins: (a) "the store index renders the seven measured editorial rails in order" (h2 texts byte-equal, subheads present, "The latest." carries 12 links, the iPhone 18 Pro rail card navigates to `#/product/iphone-18-pro`); (b) "the Quick Links strip renders between the h1 and the chip row" (5 labels, byte-equal). The smoke battery's store assertions stay green (the grid is still on the page, now below the rails).

### Phase 2 — hygiene fixes

- **S9-5 (LOW-1).** PAD §11: `ErrorBoundary.tsx` line count 51 → the measured current value (plus the two new files' rows: `store-rails.ts`, `StoreRails.tsx` — line counts measured at docs-sweep time).
- **S9-6 (INFO-2, one-line).** `tests/e2e/a11y.spec.ts` header comment: the exclusion selector notation aligned with the code's actual `.exclude('[data-active="false"]')` form.

### Phase 3 — verification, evidence, docs, delivery

- **S9-7.** Full gate on the remediated tree; live dev-server + built-artifact verification of the store index (rails render + navigate; the axe tier re-scans the store route — new rail markup must stay violation-free); mobile verification of the rails at 390×844 (horizontal scroller, no horizontal page overflow — the existing no-overflow pin covers it).
- **S9-8.** Re-capture the 17-shot screenshot family via `scripts/capture-screenshots.sh` on the remediated dev server (the store-index shots now show the rails).
- **S9-9.** Docs lockstep sweep: `docs/reference-investigation.md` (the store-rails measurement row + deviation D10/D11 notes); README's "What is in it" (the store page's rails + Quick Links strip) + counts across README/AGENTS/CLAUDE/PAD/SKILL in the same commit; PAD → v1.8 revision block + §11 rows + the new seam in §3.2/§4; SKILL → v1.8.0 (project_state + a rail lesson); worklog Task 121; `.env.example` re-verified unchanged.
- **S9-10.** Atomic Conventional Commits on `main` → SSH-wrapper push (`docs/ssh_git_wrapper_v3.py --remote git@github.com:nordeim/apple-storefront-clone.git`).

## Plan validation notes (session 9, against the codebase)

- The reference's rail card content was extracted live this cycle (all 7 rails, all 66 cards: eyebrow/label/desc/href per card); the first-party `.rf-ccard` set (12+3+2+1+4+9+3 = 34 cards) is modeled in the seam with the established routing pattern (`familyLink`'s exact catalog-name-match rule — 7 of "The latest."'s 12 cards match the clone catalog byte-equal); the 32 third-party accessory `.rf-recommcard` items are modeled as accessory cards with measured labels/prices routing to info pages — no invented content, no dead destinations.
- StorePage.tsx read in full (81 lines): the rails section slots in after the chip row block; the grid + sort control become a following "All products" section (the `<h2>` the rails introduce sits ABOVE the product grid's implicit section — heading order stays valid: h1 → rail h2s → "All products" h2). The e2e store-flow pins (search → configurator → bag → checkout) navigate via URL/direct interactions, not positional assumptions about the grid — verified by reading the spec; the smoke battery's store assertions match on content, not position (verified by reading `smoke.mjs`).
- `ProductArt` read in full: 13 `ArtId`s cover all 7 catalog-matched rail cards (iphone-duo, iphone-18-pro, watch, macbook-m6/macbook-proled, homeview, tv) — no new art needed; editorial/accessory cards use generated gradient panels (the TV+ gallery's `backgroundImage` pattern — no images shipped, D1 intact).
- New component + seam stay in the existing layers: `src/lib/store-rails.ts` (pure, no React imports) + `src/components/StoreRails.tsx` (presentational) — the vitest include pattern (`src/**/*.test.{ts,tsx}`) and both tsconfigs cover them with zero config changes; `tsconfig.json`'s `include: ["src", ...]` picks up the new files.
- The a11y tier scans the store route (`tests/e2e/a11y.spec.ts`): the new rail markup (list + links + overlay text) must pass WCAG 2 A+AA — the card links get descriptive aria-labels (name + price) since the visual text is one overlay; contrast: white cards, ink text — passes by construction; the burgundy h2 `#810831` on white = 10.4:1 (passes).
- Counts will move: unit +N (store-rails spec), e2e +2 (the two new pins) — the lockstep sweep (S9-9) covers README/AGENTS/CLAUDE/PAD/SKILL in the same commits. The build size will grow (the rail content + component + CSS); docs carry the measured values post-build.
- Blast radius: StorePage.tsx (restructured), index.css (a `@layer components` rail block — utilities must keep winning the cascade), zero router changes (the rails route via existing `routeHref` factories), zero catalog changes, zero context changes. The PAD §3.2 inventory gains the two files.

### Execution addendum (session 9, as-run corrections and notes)

- S9-1 as executed: the seam spec was written first and failed RED against the missing module, then the seam landed GREEN (11/11). The `slug.ts` extraction happened during implementation when the site-content cycle became apparent (slugify is a function declaration so the cycle would have survived ONE import order, but the reverse order would hit the STORE_RAILS TDZ — extracted rather than gamble on import order).
- S9-2 as executed: the first draft info-routed the "AirPods" quick link — the site-content orphan-route spec (`INFO_TITLES` must not gain keys that store-routed labels own) caught it before any commit: the clone HAS the AirPods destination (the reference's own quick link goes to /sg/airpods/), so it routes to `#/store/airpods` instead. The spec did its job as a standing guard.
- S9-3 as executed: the rail cards render `ProductArt` for catalog matches and a light neutral gradient for the rest (deviation D1 posture — no reference imagery); the editorial cards carry the reference's measured bg/fg pairs (byte-converted to hex); the eyebrow's #424245 (measured on the reference's white product cards) is applied only to non-editorial cards — the axe tier flagged the dark-editorial contrast fail (serious) on the first artifact build, and the fix (editorial eyebrows inherit the theme fg) landed before the docs sweep.
- S9-4 as executed: both pins green on the first post-feature run (they pin shipped behavior — the seam spec was the RED-first layer for the data). Store-flow 9 → 11.
- Counts as landed: unit 108 → **119** (+11 store-rails specs; 11 files), e2e 40 → **42** (+2 store-index pins), sitemap 156 → **204** (+48 rail info routes; 179 info pages), build 310.71 kB / 93.74 kB gzip → **322.34 kB / 97.42 kB gzip**, CSS 33,720 B / 519 rules → **35,782 B / 553 rules**; screenshots 17 → 18; the a11y tier drove one real fix (the editorial-eyebrow contrast inheritance).
# Session 10 (2026-11-28 — the category-page parity cycle)

Inputs: the operator's standing review prompt on a fresh clone (HEAD `e5bbdc2` = the session-9 tree + the `docs/session_9.md` log paste). Baseline re-observed exactly as documented (lint 0 errors + 3 accepted warnings · typecheck ×2 clean · **11 files / 119 unit** · build **322.34 kB / 97.42 kB gzip** (byte-equal 322,344 B) · e2e **42/42** · smoke **45/45**, zero console errors · sitemap **204 routes** · PostgreSQL **17.12** installed fresh per `docs/setup_pg_z.sh` — the sandbox had recycled the data dir — accepting connections at `postgresql://postgres:postgres@127.0.0.1:5432/app_db`). A read-only subagent audit (web-application methodology, `skills/` excluded) ran over the session-9 diffs + a full-tree hygiene sweep; the live-parity pass re-measured the clone's mobile navigation, re-extracted **all eleven reference flyout models from the live DOM and re-diffed them programmatically against `flyoutSections()`** (a rebuilt Vite ssrLoadModule harness at `scripts/flyout-diff.mjs`), and measured **the reference's six device category pages in full** (`/sg/shop/buy-{mac,ipad,iphone,watch,vision,home}`) for this cycle's feature work — the surface the session-9 log named.

## Session-10 findings (counts by severity)

| Severity | Count | Key items |
|---|---|---|
| CRITICAL | 0 | — |
| HIGH | 1 | **H-1: nine session-9 rail cards link to info slugs the router 404s** — `slugify(label)` runs 61–70 chars on 9 of the 68 rail cards, and `parseHash`'s `SLUG = /^[a-z0-9-]{1,60}$/` cap rejects them (longest: `beats-360-over-ear-headphones-pink-with-pink-performance-knit-cushions` at 70). Clicking any of the 9 lands on the 404 page. The full green gate (119 unit · 42 e2e · axe · smoke) cannot see it: the specs assert href SHAPE (regex without a length bound), not routeability |
| MEDIUM | 1 | **M-1: no `parseHash` round-trip guard** — the seam↔sitemap derivation is circular-tested (same derivation both sides); nothing round-trips a generated href through the router, which is the hole that let H-1 ship |
| LOW | 3 | L-1: PAD §11 stale line counts (`site-content.ts` says 441, is 438; `index.css` says 387, is 421); L-2: SKILL Appendix B title says "session 8" while carrying session-9 figures; L-3: the rail chevron keeps `color: var(--color-ink)` on dark editorial themes (`#1d1d1f` on `#1d1d1f` — invisible; the eyebrow got `color: inherit` in session 9, the chevron did not) |
| INFO | 8 | The `rail-card` class on both `<li>` and `<a>` is redundant-but-benign; a11y.spec has NO rail exclusions (and needs none); zero duplicate keys in the rail data; `PRODUCT_ALIASES` all valid; eyebrow-inherits-theme fix + all theme pairs AA-clean (measured ratios 5.07:1–21:1); count lockstep exact everywhere except L-1/L-2; the sitemap's deliberate omissions (checkout/confirmation/search) consistent with ADR-007; `smoke.mjs`'s "npm i --no-save playwright" comment is stale (playwright is a lockfile-pinned transitive) |
| PARITY GAP | 1 | **The six device category pages' shelf models** — the documented next-cycle surface: the reference's `/sg/shop/buy-*` pages are shelf sequences (h1 "Shop Mac" 80px/600 burgundy → "All models." product shelf → "{X} picks." → service rails), while the clone's category pages show only h1 + chips + the flat superset grid. Measured in full this cycle: **6 pages × 5–8 shelves, 233 cards** (30 reference product cards, 203 editorial/accessory cards). The reference's AirPods (`/sg/shop/goto/airpods/accessories`) and Accessories (`/sg/shop/accessories/all`) pages are DIFFERENT page families (a marketing page and a filtered grid) — out of this cycle's scope, documented as the next surface |

## Verified evidence (this cycle)

- **Baseline:** every documented gate re-run green at HEAD on a fresh clone + fresh PG 17.12 — the docs' claims hold exactly.
- **Audit (read-only subagent, `skills/` excluded):** 1 HIGH + 1 MEDIUM + 3 LOW + 8 INFO; 8 standing traps all PASS (no postcss config; 127.0.0.1 preview bind; `@source not` exclusions; React-state menu mounting; `@layer components`; hash-only routing; `optimizeDeps.entries`; no tailwind.config); count lockstep exact except L-1/L-2; session-9 seams re-audited (alias map valid, keys unique, themes AA-clean, module graph acyclic, single-file build intact).
- **Live parity (agent-browser, both sites):** clone mobile navigation CONFIRMED WORKING at 390×844 (bar byte-equal: logo x=0 w=48, Search x=246, Bag x=294, Menu x=342, nav 48px; menu opens top=48/h=796 rgba(22,22,23,.98); 11 rows / 11 expand buttons; Mac expansion 3 sections / 26 links, sub-links 39px; "Compare Mac" navigates + closes + title updates; zero console errors) — **no Tailwind v4 display-toggling defect**. All eleven reference flyout models re-extracted fresh and re-diffed via the rebuilt harness: **ALL ELEVEN MATCH** (the Home item's flyout in its legacy `globalnav-item-tv` container — the documented tv-home naming). **The category surface measured in full**: mac 7 shelves/49 cards · ipad 7/48 · iphone 6/47 · watch 8/52 · vision 7/21 · home 5/16; shelf header = h2 28px/600 `rgb(129,8,49)` + secondary header; "All models." product cards 400×500 (name h3 28px/600 at top-left pad 28px, art mid, price 14px bottom-left, Buy pill 56×36 `#0071e3` radius 980px bottom-right, GST note; the "Take a closer look" 169×43 dark video pill is the reference's video feature — not reproduced, D1); editorial cards 400×500 / 480×500 / 313×240 / 480×240 (eyebrow h3 12px/600, headline 28px/600 link); accessory recomm cards 313×500 (badge 12px/600, label 17px/600, price 14px); themed cards carry measured bg/fg pairs (`rf-card-bgblack` = #1d1d1f/#f5f5f7, the store-rails colour family).
- **Test/SEO surface:** `vitest.config.ts` + `playwright.config.ts` present and passing (the standing config-file instruction); sitemap 204 routes regenerated from the seam (idempotent — the tree stays clean); robots.txt/OG/JSON-LD/`.env.example` re-verified.

## Remediation ToDo list (session 10 — S10-*)

### Phase 1 — TDD fixes (the audit's production defect)

- **S10-1 (H-1 + M-1, RED first).** `src/lib/router.test.ts` gains the boundary pin: a 61–80-char info slug parses to `info` (RED against the current 60 cap), a >80-char slug still 404s, and a known 70-char slug round-trips. Then `src/lib/router.ts`'s `SLUG` cap rises 60 → 80 (the longest measured label slugifies to 70; headroom to 80, no existing test pins 60 — verified). The round-trip guard: `store-rails.test.ts` and the new category-rails spec both assert `parseHash(href).name !== "not-found"` for EVERY generated href — the drift-class hole M-1 names. The 9 broken cards heal with zero content changes; `public/sitemap.xml` regenerates identical (the 9 slugs were already emitted).
- **S10-2 (L-3).** `src/index.css`: `.rail-card-editorial .rail-card-chevron { color: inherit; }` — the chevron joins the eyebrow in inheriting the card theme (the dark-theme invisibility fix).

### Phase 2 — the category-page shelf model (the parity feature, TDD)

- **S10-3 (the seam, RED first).** New pure content seam `src/lib/category-rails.ts`: `CATEGORY_RAILS: Record<CategoryId, readonly CategoryRail[]>` — the six device pages' measured shelf models (mac 7 shelves · ipad 7 · iphone 6 · watch 8 · vision 7 · home 5; headers/subheads byte-equal to the capture). The FIRST shelf per page ("All models." / "Apple Vision Pro." / "Apple Home.") derives its product cards from THIS clone's catalog at module scope (`productsByCategory(category)` → measured anatomy, clone-honest prices via `productPriceLabel`, **deviation D12**: the reference's 30 model cards compress to the clone's 9 real products — a card that looks like a product must BE a product the clone sells, the session-9 D10 lesson applied to the shelf) + the measured trailing editorial cards ("COMPARE ALL MODELS / Which Mac is right for you?" etc.). Every content card routes via the established `railCardHref` rule (catalog-name match → product page; else info page). `CATEGORY_RAIL_INFO_LABELS` joins the `INFO_TITLES` derivation (sitemap lockstep, no drift). The airpods + accessories categories carry an EMPTY rail list this cycle (their reference pages are different families — documented D13; their clone pages keep the pinned h1 + chips + grid structure).
- **S10-4 (the component).** `src/components/StoreRails.tsx` extends to the category card family: the product card (400×500: name + eyebrow tag at top, `ProductArt` mid, `productPriceLabel` bottom-left, a Buy pill bottom-right → `#/product/<id>?buy` — the configurator deep link, the superset play: the reference's Buy is a marketing link, the clone's opens the working configurator), `product-wide` (646×500, the Vision Pro hero), `editorial-wide` (480×500), `editorial-short` (313×240) and `editorial-short-wide` (480×240) — the measured variants. Editorial/accessory cards reuse the store-rails anatomy unchanged. The shelf section: measured h2 + subhead + the horizontal scroller (20px gaps, snap, the rail rhythm).
- **S10-5 (the page restructure).** `src/pages/StorePage.tsx`: a category page renders h1 → chips → the category's measured shelves → the superset "All products." grid + sort control below (the session-9 store-index pattern generalized: measured parity surface on top, the working store below). The store index keeps its session-9 structure unchanged.

### Phase 3 — verification

- **S10-6 (e2e pins, RED first).** `tests/e2e/store-flow.spec.ts` gains two pins: (a) the Mac category page renders its seven measured shelves in order, the "All models." shelf's MacBook Pro card carries a Buy pill linking `#/product/macbook-pro-m6?buy` and the superset grid follows below; (b) a long-label rail card (the class H-1 fixes) navigates to its info page — not the 404. The axe tier re-scans `#/store/mac` (added to the route list): the new card family must stay WCAG 2 A+AA clean.
- **S10-7.** Full gate on the remediated tree (lint → typecheck ×2 → unit → build → e2e → smoke); live dev-server + built-artifact verification of all six category pages (shelves render + navigate; the Buy pill opens the configurator focused); mobile verification at 390×844 (the no-horizontal-overflow pin covers the new scrollers).

### Phase 4 — evidence, docs, delivery

- **S10-8.** Screenshots: re-capture the family via `scripts/capture-screenshots.sh` + a `19-desktop-category-mac.png` close-up (the new surface).
- **S10-9.** Docs lockstep sweep: `docs/reference-investigation.md` (the category-shelf measurement row + deviations D12/D13); README "What is in it" (the category shelves) + counts; PAD → v1.9 (revision block, §3.2 inventory, §4 seam row, §7.1 distribution, §8.1 figures, §11 line counts incl. the L-1 fixes); SKILL → v1.9.0 (project_state + the L-2 title fix + a lesson); AGENTS/CLAUDE count rows; DEPLOYMENT route counts; worklog Task 122; `.env.example` re-verified unchanged (the app still reads zero env vars).
- **S10-10.** Atomic Conventional Commits on `main` → SSH-wrapper push (`docs/ssh_git_wrapper_v3.py --remote git@github.com:nordeim/apple-storefront-clone.git`).

## Plan validation notes (session 10, against the codebase)

- All 233 measured cards were extracted live this cycle with a structured extractor (eyebrow/headline/desc/price/badge/theme per card — `struct-*.json` captures); the reference product cards (30) are NOT copied — the first shelf derives from the clone's catalog (mac 2 · ipad 1 · iphone 2 · watch 1 · vision 1 · home 2 products) with clone-honest prices; the 203 editorial/accessory cards carry measured text routed by the established rule. No invented content; no dead destinations (S10-1 guarantees routeability).
- `StorePage.tsx` read in full (111 lines): the shelves slot in after the chip row; the existing e2e store-flow pins navigate by URL/label, not grid position (spec read — safe); the smoke battery's category assertions match content, not position (`smoke.mjs` read).
- The routing blast radius is ONE regex char-count change (60→80) — `router.test.ts` has no 60-boundary pin (verified by read); `ORDER_NO`, categories and all other heads untouched. The sitemap regenerates from the seam: the 204 existing routes stay, the new info labels join via `INFO_TITLES` (deduped by construction — the derivation is keyed by slug).
- `ProductArt` covers the 9 catalog products' art (ArtIds verified); the Vision Pro hero card reuses its art at the wider measured size; editorial/accessory cards keep generated gradient/neutral panels (D1 — no reference imagery, no shipped images).
- New files stay in the existing layers (`src/lib/category-rails.ts` pure, no React; the component extends `StoreRails.tsx`); vitest/tsconfig/playwright config changes: NONE (the include patterns already cover them). The CSS additions land inside `@layer components` (the cascade contract).
- Counts will move: unit +~15 (the category-rails spec + router boundary pins), e2e +2 pins +1 axe route, sitemap grows by the new info labels (the seam derivation computes it; docs carry the measured post-regen count), build size grows (measured at gate time). The lockstep sweep (S10-9) covers all six docs in the same commits.
- Blast radius: `router.ts` (1 line), `router.test.ts` (+pins), `store-rails.test.ts` (+round-trip), `index.css` (+chevron fix, +category card family), `StoreRails.tsx` (extension), `StorePage.tsx` (restructure), `site-content.ts` (the INFO_TITLES join), `sitemap.ts` (no change — the derivation flows through), new `category-rails.ts` + `category-rails.test.ts`, `store-flow.spec.ts` (+2 pins), `a11y.spec.ts` (+1 route). Zero catalog/context/hooks changes.

### Decisions on the open questions (operator-delegated)

- **D12 (the "All models." honesty rule).** The shelf carries the clone's REAL catalog products only (9 cards across the 6 pages), not the reference's 30 model cards — a card with a price and a Buy pill must be a product the clone can actually configure and sell (session-9's encoded lesson, generalized to the shelf). The reference's non-catalog models stay reachable through the flyout family links (D6 as revised).
- **D13 (AirPods + Accessories).** Their reference pages are different families (a marketing page and a filtered accessories grid — measured as such); this cycle models the six device shelf pages and leaves those two at the current pinned structure, documented as the next surface. The alternative (modeling all 8 in one cycle) would have doubled the feature's content surface past a single cycle's verification budget.
- **The "Take a closer look" video pill** on the reference's product cards is not reproduced (D1: no reference video) — the card keeps name/art/price/Buy only.


### Execution addendum (session 10, as-run corrections and notes)

- S10-1 as executed: the boundary pin was first written at 80 chars, then re-measured — the category labels' longest slug is 126 (the APPLECARE+ card), so the pin and the cap moved to 130 before landing (the boundary specs are this session's own; no shipped pins were touched). The 9 broken session-9 cards healed with zero content changes; `public/sitemap.xml` regenerated identical for them (the slugs were already emitted).
- S10-3 as executed: the seam data was generated from the live-captured JSON (a converter under the session scratch area) and hand-verified shelf-by-shelf against the raw captures; the ZEISS Optical Inserts product card on the vision hero shelf drops per D12 (a Buy pill on a product the clone cannot sell). The vision hero renders at the measured 646×500 (`product-wide`).
- S10-4 as executed: the Buy pill is a second anchor above the card's main link (the Tile pattern — nested anchors are invalid HTML); its accessible name is "Buy <product>". The live pass caught a React key collision on the reference's duplicated CONTINUITY card (the iPhone experience shelf ships it twice on the live reference — re-verified with a fresh single-pass extraction); the shelf keys now carry the index (safe for a frozen content list).
- The e2e pin's first run failed on its own locator (the "MacBook Pro" text filter matched the PROLED card first) — fixed by filtering on the unique "NEW 14" WITH M6" eyebrow before any commit.
- Counts as landed: unit 119 → **130** (+9 category-rails, +1 router boundary, +1 store-rails round-trip; 12 files), e2e 42 → **45** (+2 pins, +1 axe route), sitemap 204 → **337 routes / 312 info pages** (+133 category info labels), build 322.34 kB / 97.42 kB gzip → **349.26 kB / 102.71 kB gzip**, CSS 35,782 B / 553 rules → **37,986 B / 579 rules**; screenshots 18 → 20; the axe tier scans the new `#/store/mac` route green (the new card family is WCAG 2 A+AA clean on its own merits).

# Session 11 (2026-11-28 — the AirPods marketing page + Accessories grid cycle)

Inputs: the operator's standing review prompt on a fresh clone (HEAD `ca944e3` = the session-10 tree + the session-10 log paste). Baseline re-observed exactly as documented (lint 0 errors + 3 accepted warnings · typecheck ×2 clean · **12 files / 130 unit** · build **349.26 kB / 102.71 kB gzip** (byte-equal 349,262 B) · e2e **45/45** · smoke **45/45**, zero console errors · sitemap **337 routes** idempotent · PostgreSQL **17.12** re-initialized fresh — the sandbox had recycled the data dir into a partial state (`pg_notify` missing), wiped and re-run per `docs/setup_pg_z.sh`, accepting connections at `postgresql://postgres:postgres@127.0.0.1:5432/app_db`). A read-only subagent audit (web-application methodology, `skills/` excluded) ran over the session-10 surface + a full-tree hygiene sweep; the live-parity pass re-measured the clone's mobile navigation working at 390×844 (bar byte-equal: logo x=0 w=48, Search x=246, Bag x=294, Menu x=342, nav 48px; menu opens top=48/h=796 rgba(22,22,23,.98); 11 rows / 11 expand buttons; Mac expansion 3 sections / 26 links, sub-links 39px; "Compare Mac" navigates + closes + title updates; zero console errors — **no Tailwind v4 display-toggling defect**), then measured **the reference's two remaining store-family pages in full** — `/sg/airpods/` (the marketing page) and `/sg/shop/accessories/all` (the filtered grid) — the surfaces the session-10 log named (D13).

## Session-11 findings (counts by severity)

| Severity | Count | Key items |
|---|---|---|
| CRITICAL | 0 | — |
| HIGH | 0 | — |
| MEDIUM | 2 | **M-1: dead key in `PRODUCT_EYEBROWS`** — `category-rails.ts` maps `watch: "NEW"` but every other key is a catalog product id; the Apple Watch "All models." card never receives its measured "NEW" eyebrow (the lookup key is the product's ArtId, not its catalog id — caught by neither the unit spec nor e2e). **M-2: `apple-storefront-clone_SKILL.md` carries session-9 counts in §2/§7/§11** (11/119 unit, 42 e2e, 204 routes, ~322 kB at six spots) while its own Appendix B states the session-10 figures — the doc contradicts itself; an agent running §11's checklist would flag a healthy gate as regressed |
| LOW | 1 | **L-1: the Home category page quotes two prices for one product** — the "Shopping guides." editorial card carries the reference's measured "S$399.00" for "Apple HomeView" while the same page's D12 product card derives "From S$449.00"; the card exact-matches a catalog name so it routes to the product page whose configurator contradicts the card (strains D10's internal-consistency rule) |
| INFO | 4 | The round-trip guards live on both rail seams but the site-content seam is guarded by the `INFO_TITLES`-resolution test instead (negligible — longest footer/flyout label ~35 chars vs the 130 cap); the CONTINUITY duplicate is correctly index-keyed (verified: exactly one duplicate per rail/shelf, the intended one); `docker-compose.yml` ships the documented loopback-only dev credential (not a leak); the hygiene sweep is clean (no console.log/TODO/any/@ts-ignore/dangerouslySetInnerHTML in `src/`; zero app env reads; npm audit 0 vulnerabilities) |
| PARITY GAP | 2 | **The AirPods marketing page** (`/sg/airpods/` — the nav's AirPods destination): chapternav (6 links, 132px) → a11y-only pagetitle h1 "AirPods" (34px/600, the 1px pattern) → 3 hero sections (AirPods 5 80px h2 dark theme "Discover the magic of Active Noise Cancellation."/"Starting at S$199"; AirPods Pro 3 80px light "The world's best in-ear Active Noise Cancellation."/"S$349"; AirPods Max 2 25.5px light chapter-hero "Listening. Remastered."/"S$749"; each Learn more + Buy) → compare module (h2 64px "Compare AirPods models", 4 columns 210px: New AirPods 5 S$199 / AirPods 5 Wireless Charging Case S$219 / AirPods Pro 3 S$349 / AirPods Max 2 S$749, name 24px, Buy/Learn more/View-in-AR) → consider rail (h2 64px "Get to know AirPods.", 5 feature cards 372×680: Active Noise Cancellation / Live Translation / Heart Rate Sensing / Hearing Health / Personalised Spatial Audio, h3 + body) → Apple Music promo. **The Accessories filtered-grid page** (`/sg/shop/accessories/all`): h1 "Accessories" 80px/600 → chapter nav (9 chips "X - Accessories": iPhone/iPad/Mac/Apple Watch/Apple Vision Pro/AirPods/Home/AirTag/Beats, routing to per-category accessory grids) → media gallery (h2 56px "Say hello to what's new.", 8 media cards 1260×680 r28 in a dotnav scroller, dark/light/narrow themes, headline+body+CTA each) → curated tabbed grid (h2 56px "Our top picks. Their next favourites.", 5 pill tabs — Holiday Picks/Colourful Finds/Travel Ready/Home Essentials/Power Picks — 53 cards 300×460 r28: badge [New/Only at Apple/Online only/Free engraving] + name + price + colour-swatches; the swatches are product photography, not reproduced per D1) → value props (h2 56px "Why Apple is the best place to buy accessories.", 4 items) → index nav (3 groups: Shop by Product 9 links / Shop by Category 11 / Explore More Accessories 4) |

## Verified evidence (this cycle)

- **Baseline:** every documented gate re-run green at HEAD on a fresh clone + fresh PG 17.12 — the docs' claims hold exactly (including the byte-equal 349,262 B build and the idempotent 337-route sitemap).
- **Audit (read-only subagent, `skills/` excluded):** 0 CRITICAL + 0 HIGH + 2 MEDIUM + 1 LOW + 4 INFO; **all 8 standing traps PASS** (no postcss config; 127.0.0.1 preview bind; `@source not` exclusions; React-state menu mounting; `@layer components`; hash-only routing; `optimizeDeps.entries`; no tailwind.config); count lockstep exact everywhere except the SKILL §2/§7/§11 staleness (M-2); **280/280 rail-card hrefs + buyHrefs round-trip `parseHash` with 0 failures** (runtime-verified); the sitemap derivation cannot drift (312 info pages / 337 total, exactly as documented); `npm audit --omit=dev` 0 vulnerabilities.
- **Live parity (agent-browser, both sites):** clone mobile navigation CONFIRMED WORKING at 390×844 — the standing mobile-menu + Tailwind v4 check the operator's prompt names; both remaining store-family reference pages measured in full (the parity-gap row above; structured captures under the session scratch area: 6+3+4+5+1 = 19 AirPods content items, 9+8+53+4+24 = 98 Accessories content items).
- **Test/SEO surface:** `vitest.config.ts` + `playwright.config.ts` present and passing (the standing config-file instruction); sitemap 337 routes regenerated idempotent; robots.txt/OG/JSON-LD/`.env.example` re-verified (zero app env reads — the app contract holds).

## Remediation ToDo list (session 11 — S11-*)

### Phase 1 — TDD fixes (the audit's findings)

- **S11-1 (M-1, RED first).** `category-rails.test.ts` gains the dead-key guard: every `PRODUCT_EYEBROWS` key must be a catalog product id (RED against the current `watch` key). Fix: the key becomes `apple-watch-series-12` — the Watch "All models." card gains its measured "NEW" eyebrow. GREEN.
- **S11-2 (L-1, RED first).** `category-rails.test.ts` gains the D10 internal-consistency pin: no category-rail card whose label exact-matches (or aliases) a catalog product name may carry a measured `desc` price — catalog-matched cards derive. RED against the HomeView "S$399.00" editorial card. Fix: the card becomes a productId card (the established `railCardHref` derivation; its price renders "From S$449.00" from the catalog). GREEN.

### Phase 2 — the AirPods marketing page (the parity feature, TDD)

- **S11-3 (the seam, RED first).** New pure content seam `src/lib/airpods-page.ts`: `AIRPODS_CHAPTERNAV` (6 measured links), `AIRPODS_HEROES` (3 heroes — h2/tagline/price/CTAs/theme), `AIRPODS_COMPARE` (h2 + 4 columns), `AIRPODS_CONSIDER` (h2 + 5 feature cards), `AIRPODS_MUSIC` (the promo block). Routing: the AirPods Pro 3 hero and its compare column carry `productId` (Buy → `#/product/airpods-pro-3?buy`, the D12 superset play); AirPods 5 / AirPods 5 Wireless Charging Case / AirPods Max 2 route Learn more + Buy to generated info pages (D6/D11); Compare → `#/info/compare-airpods` (already in INFO_TITLES via the flyout); Accessories → `#/store/accessories`; Apple Music → `#/info/apple-music` (the flyout's routing). The "View in AR" links drop (D1: the reference's AR feature is not reproduced). `AIRPODS_INFO_LABELS` joins the `INFO_TITLES` derivation (sitemap lockstep, no drift). Spec: content pins + every generated href round-trips `parseHash`.
- **S11-4 (the component).** New `src/components/AirPodsSections.tsx`: the chapternav strip (the measured 6-link bar), the hero family (80px/25.5px h2s, tagline 21px, price 17px, the `button` CTA pair — Learn more + Buy), the compare module (4 columns, name 24px, price, Buy/Learn more), the consider rail (5 cards, the established horizontal scroller), the music promo. CSS inside `@layer components`.
- **S11-5 (the page restructure).** `src/pages/StorePage.tsx`: the airpods category renders the marketing model — `<h1 className="sr-only">AirPods</h1>` (the reference's 1px pagetitle pattern; the clone's home page already uses the sr-only h1 family) → chapternav → heroes → compare → consider → music → then the superset block (chips + "All products." grid + sort, the working-store contract). `routeTitle`: store+airpods → "AirPods - Apple (Singapore)" (the reference's document title; h1-agreement holds).

### Phase 3 — the Accessories grid page (the parity feature, TDD)

- **S11-6 (the seam, RED first).** New pure content seam `src/lib/accessories-page.ts`: `ACCESSORIES_CHAPTERNAV` (9 chips), `ACCESSORIES_GALLERY` (h2 + 8 media cards with themes + CTAs), `ACCESSORIES_CURATED` (h2 + 5 tabs × the 53 measured cards — badge/label/price), `ACCESSORIES_VALUE_PROPS` (h2 + 4 items), `ACCESSORIES_INDEX_NAV` (3 groups / 24 links). Routing: the established `railCardHref` rule — catalog-named cards (AirTag 4 pack, MagSafe Charger (1m), AirPods Pro 3, Apple TV 4K, HomePod mini 2→NOT in catalog…) derive prices and route to product pages (D10/D12); every other card carries its measured label + price routed to a generated info page (D11, the recomm-card rule); the gallery's HomePod mini 2 / Apple TV 4K "Buy" CTAs route to the clone's product pages (both ARE catalog products); the chapternav's device chips route to the clone's category pages (`#/store/iphone` … — the pages that carry their measured accessory shelves; the clone has no per-category accessory routes), AirTag + Beats chips route to info pages; the index-nav links route to info pages (the flyout pattern). The colour-swatch strips drop (D1: product photography). `ACCESSORIES_INFO_LABELS` joins `INFO_TITLES`. Spec: content pins + full href round-trip + tab/card-count pins (11/11/11/11/9).
- **S11-7 (the component).** New `src/components/AccessoriesSections.tsx`: the chapter-nav chip row, the media gallery (the established scroller + dotnav family, 28px-radius themed cards), the curated tabbed grid (pill tabs with proper `role=tab`/`aria-selected` semantics, panels of 300×460 cards), the value-props row (4 items), the index-nav directory (3 groups). CSS inside `@layer components`.
- **S11-8 (the page restructure).** `StorePage.tsx`: the accessories category renders h1 "Accessories" (80px — the reference's exact h1; the "Shop Accessories" derivation retires) → chapternav → gallery → curated tabs → value props → index nav → the superset block below. `routeTitle`: store+accessories → "Accessories - Apple (Singapore)". The six device pages + the store index keep their pinned structure unchanged.

### Phase 4 — verification

- **S11-9 (e2e pins, RED first).** `store-flow.spec.ts` gains three pins: (a) the AirPods page renders its chapternav + three heroes + the compare module, and the AirPods Pro 3 hero's Buy links `#/product/airpods-pro-3?buy`; (b) the Accessories page renders its five curated tabs and the first panel's cards, and a catalog-matched card (AirTag 4 pack) routes to the product page; (c) the accessories curated tabs switch panels on click (the tab semantics). The axe tier re-scans `#/store/airpods` + `#/store/accessories` (added to the route list): both new page families must stay WCAG 2 A+AA clean.
- **S11-10.** Full gate on the remediated tree (lint → typecheck ×2 → unit → build → e2e → smoke); live dev-server + built-artifact verification of both pages (sections render + navigate; the Buy pills open the configurator focused; the tabs switch); mobile verification at 390×844 (the no-horizontal-overflow pin covers the new scrollers + tab row).

### Phase 5 — evidence, docs, delivery

- **S11-11.** Screenshots: re-capture the family via `scripts/capture-screenshots.sh` + close-ups of the two new surfaces (21/22: the AirPods marketing page, the Accessories grid).
- **S11-12.** Docs lockstep sweep: `docs/reference-investigation.md` (the two page-family measurement rows + deviations D14/D15 + the L-1 D10 note); README "What is in it" (both pages) + counts; PAD → v2.0 (revision block, §3.2 inventory, §4 seam rows, §7.1 distribution, §8.1 figures, §11 line counts); SKILL → v2.0.0 (project_state + the M-2 §2/§7/§11 fixes + a lesson); AGENTS/CLAUDE count rows; DEPLOYMENT route counts; worklog Task 123; `.env.example` re-verified unchanged (the app still reads zero env vars).
- **S11-13.** Atomic Conventional Commits on `main` → SSH-wrapper push (`docs/ssh_git_wrapper_v3.py --remote git@github.com:nordeim/apple-storefront-clone.git`).

## Plan validation notes (session 11, against the codebase)

- All 117 measured content items (19 + 98) were extracted live this cycle with structured extractors (captures under the session scratch area, hand-verified against the raw DOM); the reference's product photography (hero backdrops, colour swatches, the "View in AR" feature) is NOT copied — D1; the curated grid's catalog-named cards (AirTag 4 pack, MagSafe Charger (1m), AirPods Pro 3) derive prices from THIS clone's catalog (D10/D12), all others carry measured labels + prices routed to generated info pages (D11).
- `StorePage.tsx` read in full (123 lines): the two new page families slot in as category branches (airpods/accessories); the six device pages' shelf branch and the store index branch stay untouched; the existing e2e pins navigate by URL/label, not grid position (spec read — safe); the a11y route list gains two routes; the smoke battery's category assertions match content, not position.
- The routing blast radius is ZERO router changes — both pages live on existing `#/store/{category}` routes; the only seam change is `route-title.ts` (two label derivations) + the `INFO_TITLES` joins (the sitemap derivation flows through, deduped by construction). The `route-title.test.ts` pins for airpods/accessories update with the new labels (this session's own boundary pins — no shipped pins weakened).
- New files stay in the existing layers (`src/lib/airpods-page.ts` + `src/lib/accessories-page.ts` pure, no React; two new component files; CSS in `@layer components`); vitest/tsconfig/playwright config changes: NONE (the include patterns already cover them). `category-rails.ts`'s airpods/accessories empty lists retire (their test pin replaced by the new seams' specs — the D13 close-out).
- Counts will move: unit +~20 (two new specs + the S11-1/S11-2 guards), e2e +3 pins +2 axe routes, sitemap grows by the new info labels (the seam derivation computes it; docs carry the measured post-regen count), build size grows (measured at gate time). The lockstep sweep (S11-12) covers all six docs in the same commits.
- Blast radius: `category-rails.ts` (the S11-1 key + the S11-2 card), `route-title.ts` (2 labels), `site-content.ts` (2 INFO_TITLES joins), `StorePage.tsx` (2 category branches), 2 new seam files + 2 specs, 2 new component files, `index.css` (+the two page families' CSS), `store-flow.spec.ts` (+3 pins), `a11y.spec.ts` (+2 routes). Zero catalog/context/hooks/router changes.

### Decisions on the open questions (operator-delegated)

- **D14 (the AirPods page family).** `#/store/airpods` — the nav's AirPods destination — renders the reference's marketing-page model (chapternav → sr-only h1 → heroes → compare → consider → music) with the clone's superset store block below (the session-9/10 established pattern: measured parity surface on top, the working store below). The route stays `#/store/airpods` (no router change); the document title becomes "AirPods - Apple (Singapore)" (the reference's title; h1-agreement holds). The reference's AR links and photography drop (D1).
- **D15 (the Accessories page family).** `#/store/accessories` renders the reference's filtered-grid model (h1 "Accessories" → chapternav → gallery → curated tabs → value props → index nav) + the superset block below. The chapternav's device chips route to the clone's category pages (the closest clone-honest destinations — those pages carry the measured accessory shelves; per-category accessory routes are a future surface); AirTag/Beats chips + all index-nav links route to generated info pages (the flyout pattern). The h1/title retire the "Shop Accessories" derivation (the reference's page is not a "Shop X" page).
- **The curated grid's colour swatches drop** (D1: each swatch is product photography). The cards carry badge + name + price — the measured text content, the same anatomy the store-rails recomm cards already ship.

### Execution addendum (session 11, as-run corrections and notes)

- S11-1 as executed: the guard needed the map exported (`PRODUCT_EYEBROWS` was private with unpinned keys — the M-1 root cause; it is now exported with the dead-key contract documented on it). RED was verified before the key fix (the import failure and the dead-key assertion both fired).
- S11-2 as executed: the "product cards are the only ones with buy deep links" geometry guard was re-expressed precisely rather than weakened — the old `productId ⇒ buyHref` assertion became `buyHref ⇒ productId` + "every first-shelf product card carries one", because the fix legitimately introduces a content card that carries productId WITHOUT a Buy pill (a product-linked editorial card deriving its price). The D12 guarantee (a Buy pill only ever appears on a sellable product) is preserved verbatim.
- S11-6 as executed: the curated-grid data was generated from the live-captured JSON by a converter under the session scratch area and hand-verified against the raw DOM extraction; the captured labels carry the reference's own non-breaking spaces (U+00A0 inside "iPhone\u00a018 Pro\u00a0Max" — Apple's line-break guard, kept verbatim; `slugify` collapses them like any other non-alphanumeric run). The Smart Folio card (the reference's one priceless card) is a card, not a promo; the reference repeats the Belkin BoostCharge power bank across two tabs and the HomePod mini 2 name across the gallery + grid (kept verbatim — the info-labels export carries the repeats; INFO_TITLES dedupes by slug, and the spec's uniqueness pin is set-equality with the page's info-routed destinations, the category-rails pattern).
- The accessories spec's D10 guard needed the `PRODUCT_ALIASES` addition ("MagSafe Charger (1m)" → the catalog id) — without the alias the guard itself failed (the label names a catalog product but the href rule couldn't see it), which is the guard working as designed.
- The axe tier's two catches on the new markup (both from the new `#/store/airpods` scan): the dark hero's CTAs failed color-contrast (light-theme #0066cc on #0b0b0d — hero-scoped link-dark pair added) and the consider rail failed `scrollable-region-focusable` (a text-only scroller has no keyboard path — `tabIndex={0}` added; the store rails pass only because their cards carry links). The e2e AirTag price pin first ran as "S$135.00" — the money seam's whole-price grammar drops the cents ("S$135", the reference's own grammar) — fixed before any commit.
- Counts as landed: unit 12/130 → **14/147** (+6 airpods-page, +8 accessories-page, +2 category-rails guards, +1 route-title family test; 14 files), e2e 45 → **50** (+3 pins, +2 axe routes: `#/store/airpods` + `#/store/accessories` — both scan WCAG 2 A+AA clean), sitemap 337 → **389 routes / 364 info pages** (+52: the airpods page's 7 + the accessories grid's 45 info labels), build 349.26 kB / 102.71 kB gzip → **382.22 kB / 109.12 kB gzip**, CSS 37,986 B / 579 rules → **45,806 B / 675 rules**; screenshots 20 → 24 (21/22 the AirPods marketing page + compare close-up; 23/24 the Accessories grid + curated close-up).

# Session 12 (2026-11-28 — the per-category accessories grid cycle)

Inputs: the operator's standing review prompt on a fresh clone (HEAD `9bdebe8` = the session-11 tree + the session-11 log paste). Baseline re-observed exactly as documented (lint 0 errors + 3 accepted warnings · typecheck ×2 clean · **14 files / 147 unit** · build **382.22 kB / 109.12 kB gzip** (byte-equal 382,220 B) · e2e **50/50** · smoke **45/45**, zero console errors · sitemap **389 routes** idempotent · rootless PostgreSQL **17.12** re-initialized fresh — the sandbox had recycled the data dir into the same partial state as session 11 (`pg_notify` missing); wiped and re-run per `docs/setup_pg_z.sh`, accepting connections at `postgresql://postgres:postgres@127.0.0.1:5432/app_db`). A read-only subagent audit (web-application methodology, `skills/` excluded) ran over the session-11 surface + a full-tree hygiene sweep; the live-parity pass re-verified the clone's mobile navigation working at 390×844, re-extracted the reference's full eleven-flyout link map (hrefs included), and measured **the reference's seven per-category accessories grid pages in full** (`/sg/shop/{mac,ipad,iphone,watch,vision,airpods,home}/accessories`) — the D15-named future surface ("per-category accessory routes") and the concrete instance of the session-11 log's "the reference's `/sg/shop/goto/*` marketing destinations behind the flyout links" candidate (the flyouts' "X Accessories" links and the all-accessories chapternav's device chips all route there; the other goto destinations — the buy pages — were already modeled in session 10).

## Session-12 findings (counts by severity)

| Severity | Count | Key items |
|---|---|---|
| CRITICAL | 0 | — |
| HIGH | 0 | — |
| MEDIUM | 1 | **M-1: the airpods seam lacks the INFO_LABELS lockstep guard** — `airpods-page.test.ts`'s "sitemap lockstep" spec only checks the exported `AIRPODS_INFO_LABELS` array's internal consistency, never set-equality with the info hrefs the page actually renders (the accessories seam has the strong spec; the airpods seam does not). No live dead route today (all 7 labels verified covered), but the S10-1 dead-route bug class is unguarded on this seam |
| LOW | 3 | **L-1: D10 asymmetry on the AirPods Pro 3 hero** — the hero renders its measured `"S$349"` string verbatim while its own compare column derives via `productPriceLabel` (they agree today; nothing pins the hero string to the catalog, so a catalog price change would silently contradict the configurator on the same page). **L-2: `StorePage.tsx:122` says "The four device category pages' measured shelf model" — there are six** (the sibling comment at :87 says six; session-11's commit introduced the mismatch). **L-3: a no-op ternary in `accessories-page.test.ts:168`** (`c.kind === "promo" ? [c.href] : [c.href]` — dead branching from a draft) |
| INFO | 3 | The curated tabs implement ArrowLeft/Right + roving tabindex but not Home/End (APG-optional; axe clean). `console.log` in `tests/e2e/smoke.mjs` + `scripts/*.mjs` is the CLI runner surface, not app code (the hygiene contract is `src/`, which is clean). The accessories chapternav comment's "the category pages that carry their measured accessory shelves" rationale does not hold for the AirPods chip (it routes to the marketing family, which carries no shelves — honest content, imprecise comment) |
| PARITY GAP | 1 | **The seven per-category accessories grid pages** — the D15 deferral. The reference's `/sg/shop/{cat}/accessories` pages are the same family as the modeled all-accessories grid (h1 80px → per-category chapternav chips → media gallery → curated tabbed grid → value props → index nav), each with per-category content: mac (h1 "Mac Accessories", 9 chips, gallery "Just in for Mac." 2 cards, 4 tabs "Gear Up/Power Picks/Mac Must-Haves/The Perfect Match" 12+12+12+3 cards, 3 value props, index nav Shop by Product 9 / Shop by Mac Category 10 / Explore More 2) · ipad ("iPad Accessories", 7 chips, "Just in for iPad." 3 cards, 4 tabs 12+12+14+8, 4 vp, 9/7/2) · iphone ("iPhone Accessories", 7 chips, "In the spotlight." 4 cards, 5 tabs "Mix & Match/Power Picks/Travel Ready/Personal Audio/For Creators" 11+12+14+11+8, 4 vp, 9/8/3) · watch ("Apple Watch Accessories", 4 chips, 1 card, 3 tabs "Sport Mode/Classic Style/Power Picks" 13+8+9, 3 vp, 9/4/2) · vision ("Apple Vision Pro Accessories", 5 chips, 2 cards, 2 tabs "Essential Picks/Work & Play" 7+9, 3 vp, 9/5/1) · airpods ("AirPods & Accessories", 3 chips, 1 card, 2 tabs "AirPods & Essentials/Stay Charged" 11+12, 4 vp, 9/3/1) · home ("Home Accessories", 6 chips, 3 cards, 3 tabs "Home Essentials/Security/Lighting" 12+2+2, 4 vp, 10/7/2). **429 measured content items total** (226 curated cards incl. 26 promos · 16 gallery cards · 41 chips · 25 value props · 63 index-nav links · 7 h1/title pairs). The clone currently routes the flyouts' "X Accessories" links, the accessories flyout's device links and the all-page chapternav's device chips to compromise destinations (`#/store/{cat}` or `#/store/accessories`) |

## Verified evidence (this cycle)

- **Baseline:** every documented gate re-run green at HEAD on a fresh clone + fresh PG 17.12 — the docs' claims hold exactly (including the byte-equal 382,220 B build and the idempotent 389-route sitemap); `npm audit --omit=dev` 0 vulnerabilities.
- **Audit (read-only subagent, `skills/` excluded):** 0 CRITICAL + 0 HIGH + 1 MEDIUM + 3 LOW + 3 INFO; **all 8 standing traps PASS**; count lockstep exact everywhere (14/147 unit · 50 e2e = 35 pins + 15 axe · 45 smoke · 389 routes · 382.22 kB — all verified against the artifacts); the session-11 surface re-audited clean (all 7+45 info labels covered; the D10 guard holds — no catalog-named card carries a measured price; ARIA tabs pattern correct; slug round-trips safe, longest slug 107 < 130).
- **Live parity (agent-browser, both sites):** clone mobile navigation CONFIRMED WORKING at 390×844 (bar byte-equal: logo x=0 w=48, Search x=246, Bag x=294, Menu x=342, nav 48px; menu opens top=48/h=796 rgba(22,22,23,.98); 11 rows / 11 expand buttons; Mac expansion 26 links, sub-links 39px; "Compare Mac" navigates + closes + title updates; zero console errors) — **no Tailwind v4 display-toggling defect**. The reference's full flyout link map re-extracted with hrefs: nav main links → the marketing pages (`/sg/mac/` …), flyout "Shop X" → `goto/buy_*` (modeled, session 10), flyout "X Accessories" + the all-page chapternav chips → `goto/{x}/accessories` = **`/sg/shop/{cat}/accessories`** (this cycle's surface), the store flyout's AirPods chip → the airpods accessories page. All seven per-category pages captured with a structured extractor (chips with aria-labels, gallery cards with themes/CTAs, every curated tab clicked and extracted with badges/labels/prices, value props, index nav groups) — captures under `.scratch/s12/capture-*.json`, hand-verified against independent live re-extractions (tab labels, card counts, badge/label/price spot checks, the promo structure). Nine captured items name clone catalog products (AirPods Pro 3 ×5 cards, MagSafe Charger (1m) ×2, Apple TV 4K card + gallery card) — the D10 rule applies (the reference quotes S$399 for the Apple TV 4K card while the clone's catalog says From S$229); the longest measured label is 115 chars (slugifies well under the 130 cap); 36 labels repeat across tabs/pages (the reference's own repeats — kept verbatim, deduped by slug in the sitemap derivation).
- **Test/SEO surface:** `vitest.config.ts` + `playwright.config.ts` present and passing; sitemap 389 routes regenerated idempotent; robots.txt/OG/JSON-LD/`.env.example` re-verified (zero app env reads — the app contract holds).

## Remediation ToDo list (session 12 — S12-*)

### Phase 1 — TDD fixes (the audit's findings)

- **S12-1 (M-1, RED first).** `airpods-page.ts`: `AIRPODS_INFO_LABELS` becomes structurally derived from the content models (the `AIRPODS_CHAPTERNAV`/`HEROES`/`COMPARE`/`MUSIC` info hrefs — labels primary, hrefs derived, the accessories pattern), making drift impossible; `airpods-page.test.ts` gains the set-equality pin (the exported set == every `#/info/` href the page renders) plus the existing internal-consistency checks. RED against the hand-listed array (a deliberately dropped label) → GREEN with the structural derivation.
- **S12-2 (L-1, RED first).** `airpods-page.test.ts` gains the hero-price pin: for every hero with `productId`, the rendered price must equal `productPriceLabel(getProduct(productId))`. RED (the hero quotes the measured string with no derivation). Fix: `AirPodsSections.tsx`'s Hero derives via `productPriceLabel` when `productId` is set (mirroring the compare column). GREEN.
- **S12-3 (L-2 + L-3 + INFO-3).** `StorePage.tsx:122` "four" → "six"; `accessories-page.test.ts:168` collapses to `.map((c) => c.href)`; the accessories chapternav comment's rationale gains the AirPods-chip precision (it routes to the marketing family — D14 — which carries no shelves).

### Phase 2 — the route + the titles (TDD)

- **S12-4 (RED first).** `router.ts`: the store route gains the accessories view — `{ name: "store"; category?: CategoryId; view?: "accessories" }`; `parseHash` accepts `#/store/{cat}/accessories` for the seven device categories and 404s everything else (`#/store/accessories/accessories` — the accessories category has no accessories page; `#/store/mac/ipad`; `#/store/mac/accessories/x`); `routeHref.storeAccessories(category)`. `router.test.ts` gains the boundary pins (7 valid parses, the 404 shapes, the `?buy`-style query tolerance on the new route). The mobile-navigation and site-content specs' `ROUTE_RE` extends to the new shape.
- **S12-5 (RED first).** `route-title.ts`: the accessories view carries the reference's measured per-page titles — mac "Shop Mac Accessories", ipad "Shop iPad accessories" (the reference's own lowercase 'a'), iphone "Shop iPhone Accessories", watch "Apple Watch Accessories", vision "Apple Vision Pro Accessories", airpods "Shop AirPods & Accessories", home "Home Accessories" (each + " - Apple (Singapore)", the clone's established suffix for the reference's "(SG)"). `route-title.test.ts` pins all seven.

### Phase 3 — the per-category seam (the parity feature, TDD)

- **S12-6 (the seam, RED first).** New pure content seam `src/lib/accessories-category-pages.ts`: `ACCESSORIES_CATEGORY_PAGES: Record<DeviceCategoryId, AccessoriesCategoryPage>` where a page = { h1, title, chapternav chips (label + " - {h1}" ariaLabel), gallery (headline + themed cards), curated (headline + tabs × the measured cards), value props, index nav } — generated from `.scratch/s12/capture-*.json` by a converter (the session-10/11 approach; no hand transcription), reusing the session-11 types where they fit (`AccessoriesGalleryCard`, `AccessoriesCuratedItem`, `AccessoriesValueProp`, `AccessoriesIndexGroup`). Routing rules: the 9 catalog-matched cards (AirPods Pro 3 ×5, MagSafe Charger (1m) ×2, Apple TV 4K ×2 incl. its gallery CTA) become `productId` items deriving prices at render (D10 — the reference's S$399/S$59 strings are NOT quoted where they contradict the catalog); every other curated card/promo routes via `railCardHref` (D11); the chapternav chips, the gallery's non-catalog CTAs, the value props and the index-nav links route to info pages via `info(label)` — EXCEPT the index-nav "Shop by Product" group's seven device links (→ `storeAccessories(cat)`) and its "All Accessories" link (→ `#/store/accessories`); `ACCESSORIES_CATEGORY_INFO_LABELS` derives structurally from the models and joins `INFO_TITLES`. The spec pins: per-page h1/title/chips/gallery/tab-labels/card-counts (12+12+12+3 · 12+12+14+8 · 11+12+14+11+8 · 13+8+9 · 7+9 · 11+12 · 12+2+2), badge totals (New 47 / Only at Apple 25 / Free engraving 14 / Online only 6), the D10 guard (no catalog-named card carries a measured price), the INFO_LABELS set-equality, and every generated href round-trips `parseHash`.

### Phase 4 — components + wiring

- **S12-7 (the components).** `AccessoriesSections.tsx` parameterizes its five section components by an optional model prop (the all-page constants as defaults — zero behavior change for the pinned `#/store/accessories` page): `AccessoriesChapterNav({ chips })`, `AccessoriesGallery({ gallery })`, `AccessoriesCurated({ curated })`, `AccessoriesValueProps({ valueProps })`, `AccessoriesIndexNav({ indexNav })`; plus `AccessoriesCategoryPageSections({ page })` composing the per-category model. The curated tabs keep the WAI-ARIA pattern and the `accessories-*` class names (the e2e selectors are route-scoped, no conflicts).
- **S12-8 (the wiring).** `StorePage.tsx`: the accessories view renders `PageTitle` with the measured h1 + `AccessoriesCategoryPageSections` + the superset block below (the store chip row + sort + the accessories-category product grid — the clone's real accessory products, the same superset play as `#/store/accessories`); `App.tsx` passes the view. `site-content.ts`: the six device flyouts' "X Accessories" links, the airpods flyout's "AirPods Accessories", the Home flyout's "Shop Home Accessories" and the accessories flyout's seven device links route to `storeAccessories(cat)`. `accessories-page.ts`: the all-page chapternav's seven device chips route to `storeAccessories(cat)` (AirTag/Beats stay info). `sitemap.ts`: `siteRoutes()` gains the seven `/store/{cat}/accessories` paths (priority 0.7, weekly). The specs update in lockstep: `site-content.test.ts` (the href pins for the re-routed links + ROUTE_RE), `accessories-page.test.ts` (the chapternav pins), `sitemap.test.ts` (the new routes + count).

### Phase 5 — verification

- **S12-9 (e2e, RED first).** `store-flow.spec.ts` gains two pins: (a) the Mac accessories page renders its measured model (h1 "Mac Accessories", 9 chips, 4 tabs, the "Gear Up" panel's 11 curated cards + 1 promo, the value props, the index nav) and its "Shop by Product" Mac chip navigates to itself + the iPhone chip to `#/store/iphone/accessories`; (b) the Home accessories page's Apple TV 4K curated card derives "From S$229" from the catalog (the D10 pin) and routes to the product page. `a11y.spec.ts` scans `#/store/mac/accessories` (the family's classes already pass on the all-page; the per-category render must stay WCAG 2 A+AA clean). `mobile-navigation.spec.ts`'s no-overflow route list gains `#/store/mac/accessories` + `#/store/iphone/accessories`.
- **S12-10.** Full gate on the remediated tree (lint → typecheck ×2 → unit → build → e2e → smoke); sitemap regeneration + idempotency check; live dev-server + built-artifact verification (all seven pages render their measured sections; the chips and index-nav links navigate; the catalog-matched cards derive; the tabs switch by click and ArrowLeft); mobile verification at 390×844 (no horizontal overflow; the chapternavs scroll).

### Phase 6 — evidence, docs, delivery

- **S12-11.** Screenshots: re-capture the family via `scripts/capture-screenshots.sh` + `25-desktop-mac-accessories.png` and `26-desktop-iphone-accessories.png` (the new surface's shots).
- **S12-12.** Docs lockstep sweep: `docs/reference-investigation.md` (D16 + the measurement row); README "What is in it" (the per-category grids) + counts; PAD → v2.1 (revision block, §3.2 inventory, §4 seam row, §7.1 distribution, §8.1 figures, §11 line counts); SKILL → v2.1.0 (project_state + a lesson); AGENTS/CLAUDE count rows; DEPLOYMENT route counts; worklog Task 124; `docs/session_12.md`; `.env.example` re-verified unchanged (the app still reads zero env vars).
- **S12-13.** Atomic Conventional Commits on `main` → SSH-wrapper push (`docs/ssh_git_wrapper_v3.py --remote git@github.com:nordeim/apple-storefront-clone.git`).

## Plan validation notes (session 12, against the codebase)

- All 429 measured items were extracted live this cycle with a structured extractor (captures under `.scratch/s12/`), hand-verified against independent live re-extractions (the iphone page's first tab re-extracted card-by-card and matched; the promo structures dumped raw and modeled on the evidence — eyebrow = first visible span when ≥2, headline = last, "Learn more" CTA, the video-fallback `<p>` drops per D1, footnote markers drop per D11); the reference's product photography (gallery backdrops, colour swatches, the one video promo) is NOT copied — D1; the nine catalog-matched items derive prices from THIS clone's catalog (D10/D12), everything else carries measured text routed by the established rules (D11).
- The routing blast radius is ONE new route shape — `parseHash` gains a second-segment branch for the store head (`accessories` after a device category id); `rest.length > 0 → NOT_FOUND` becomes a scoped check. No existing route changes shape; `routeHref.storeAccessories` is additive. The seven new sitemap paths derive from `CATEGORIES` minus `accessories` — the enumeration stays derived, never hand-listed.
- `AccessoriesSections.tsx` read in full (219 lines): the five sections read module constants directly; parameterizing by an optional prop with the constants as defaults keeps the pinned all-page rendering byte-identical (the props are the same data the constants provide). The `accessories-*` CSS classes are shared by the per-category render — ZERO new CSS expected (the h1 uses the established `PageTitle` token, as on the all page).
- `StorePage.tsx` read in full (149 lines): the accessories view slots in as a branch beside the airpods/accessories family branches; the superset block (chips + sort + grid) is the existing markup keyed to the accessories-category products. `App.tsx`'s store case passes the new view prop. The e2e pins navigate by URL/label (spec read — safe); the smoke battery has no accessories-chapternav pins (read — safe).
- The flyout re-routes change nine labels' hrefs across `site-content.ts` (six "X Accessories" + "AirPods Accessories" + "Shop Home Accessories" + the accessories flyout's seven device links) and seven chapternav chips in `accessories-page.ts` — all currently route to `#/store/{cat}` or `#/store/accessories`; the mobile accordion renders the same model so it flows through automatically. The `site-content.test.ts` ROUTE_RE and the affected href pins update in lockstep (this session's own boundary; no shipped pins weakened — the href-shape grammar extends, never narrows).
- New files stay in the existing layers (`src/lib/accessories-category-pages.ts` pure, no React; the components extend `AccessoriesSections.tsx`); vitest/tsconfig/playwright config changes: NONE (the include patterns already cover them). The seam joins `INFO_TITLES` (the sitemap derivation flows through, deduped by construction — the 36 repeated labels collapse by slug).
- Counts will move: unit +~25 (the new spec + the S12-1/S12-2 guards + the router/route-title pins), e2e +2 pins +1 axe route, sitemap grows by 7 store routes + the new info labels (the seam derivation computes it; docs carry the measured post-regen count — estimate +~200 given ~150 unique new info labels), build size grows (measured at gate time). The lockstep sweep (S12-12) covers all seven docs in the same commits.
- Blast radius: `router.ts` (+view), `router.test.ts` (+pins), `route-title.ts` (+7 titles), `route-title.test.ts` (+pins), `site-content.ts` (9 link re-routes + the INFO_TITLES join), `site-content.test.ts` (ROUTE_RE + href pins), `sitemap.ts` (+7 routes), `sitemap.test.ts` (+pin), `accessories-page.ts` (7 chip re-routes + shared-type exports), `accessories-page.test.ts` (chip pins + S12-3), `airpods-page.ts` (S12-1 structural derivation), `airpods-page.test.ts` (S12-1/S12-2 pins), `AirPodsSections.tsx` (S12-2 hero derivation), `AccessoriesSections.tsx` (parameterization + the per-category composition), `StorePage.tsx` (the view branch + S12-3), `App.tsx` (the view prop), new `accessories-category-pages.ts` + spec, `store-flow.spec.ts` (+2), `a11y.spec.ts` (+1), `mobile-navigation.spec.ts` (+2 routes). Zero catalog/context/hooks changes.

### Decisions on the open questions (operator-delegated)

- **D16 (the per-category accessories family).** The seven pages land as `#/store/{cat}/accessories` (mirroring the reference's `/sg/shop/{cat}/accessories` shape) rendering the measured grid family (h1 → chapternav → gallery → curated tabs → value props → index nav) with the clone's superset block below (the store chip row + sort + the accessories-category product grid — the same superset play as the all-accessories page; the clone's accessory catalog is the honest product set for an accessories page). The flyouts' "X Accessories" links, the accessories flyout's device links and the all-page chapternav's device chips re-route to the new pages (closing the D15 compromise); the reference's per-category filter chips (Cases & Protection etc.), the AirTag/Beats index links and the overlay destinations (Apple Music overlays, pencil comparisons) route to generated info pages (the established D11 pattern — the clone has no per-category filter routes); the "Apple Watch Straps" flyout link stays info-routed (the bands page is a distinct future surface). The per-page document titles carry the reference's exact strings (including iPad's lowercase "accessories"); the clone's established "Apple (Singapore)" suffix maps the reference's "(SG)".
- **The video promo** (the iphone page's AirPods Max 2 card) is modeled as a text promo (eyebrow + caption headline + Learn more) — the reference's video feature drops per D1, the same posture as the session-11 Beats 360 gallery card. The footnote promos (Apple Music / Apple Fitness+ / "More sound. More possibilities.") carry their measured headlines with the markers trimmed (D11).

### Execution addendum (session 12, as-run corrections and notes)

- S12-1 as executed: the set-equality guard was proven the honest way — a label was deliberately dropped from `AIRPODS_INFO_LABELS` and the pin failed (RED), then restored (GREEN); the list itself gained the per-section source-of-truth comments (the accessories pattern) rather than a structural rewrite (the airpods models build hrefs inline from labels, so the labels are not recoverable from the models without a larger refactor the set-equality pin renders unnecessary).
- S12-6 as executed: the converter needed three real corrections after its first run, each caught by a check rather than by eye: (a) the gallery CTAs and index-nav chip matches leaked RAW reference hrefs (`/sg/shop/...`) into the seam — the chipByHref map returned the raw capture chip instead of the converted one; (b) the index-nav chip branch emitted `info(chip.label)` (the short name) instead of `info(chip.ariaLabel)`, producing same-slug collisions across the reference's own spacing variants ("Cases &Protection" vs "Cases & Protection"); (c) the converter's inline slugify NFKD-normalized, producing `dualsensetm` where slug.ts produces `dualsense` for the ™-carrying label — the spec's set-equality pin failed until the converter mirrored slug.ts exactly. The vision page's two priceless cards ("ZEISS Optical Inserts", "Apple Vision Pro Light Seal") are the reference's own priceless cards — the D11 branch allows them (the all-page Smart Folio pattern); the value-prop `linkName` is the visible "Learn more" (the accessible "Learn more - {headline}" suffix trims); footnote tails ("Footnote ◊/∆/1/2") trim from bodies per D11.
- S12-8 as executed: the live verification caught one real defect no gate saw — on `#/store/airpods/accessories` the airpods MARKETING branch rendered alongside the grid (the sr-only "AirPods" h1, the heroes) because the branch keyed on category alone; the fix gates it on `view !== "accessories"`. Lesson: a same-route view flag must gate every family branch keyed on the category.
- The per-category pages' superset block shows the ACCESSORIES-category product grid (the clone's 2 real accessory products) — the same superset play as `#/store/accessories`, documented in D16.
- Counts as landed: unit 14/147 → **15/163** (+11 accessories-category-pages, +2 router view pins +1 boundary 404s fold-in, +1 route-title D16 test, +1 sitemap D16 test; the S12-1/S12-2 guards landed inside existing airpods tests), e2e 50 → **53** (+2 pins, +1 axe route `#/store/mac/accessories` — the family's classes scan WCAG 2 A+AA clean on the per-category render), sitemap 389 → **559 routes / 527 info pages** (+7 store routes +163 net new info labels — the 223-label export dedupes 60 against existing INFO_TITLES entries by slug), build 382.22 kB / 109.12 kB gzip → **447.68 kB / 120.48 kB gzip** (CSS 45,806 B/675 rules → 45,842 B/676 — the per-category render reuses the family's classes), screenshots 24 → 26 (+25 the Mac grid, +26 the iPhone curated close-up).

---

# Remediation Plan — session 13: the nav-main marketing pages cycle (2026-11-28)

**Mode C audit → remediation.** The prior cycle (session 12, HEAD `5ea2703`) closed the
per-category accessories family. This cycle re-ran the standing ritual on a fresh clone
(baseline green exactly as documented: lint 0 · typechecks ×2 · 15/163 unit · build
447.68 kB / 120.48 kB gzip byte-equal · 53/53 e2e · 45/45 smoke · 559-route sitemap
idempotent · npm audit 0 · rootless PG 17.12 re-initialized clean on first run), then a
read-only audit + a live-parity pass. `skills/` stays out of scope.

## Session-13 findings (counts by severity)

| Severity | Count | Key items |
|---|---|---|
| CRITICAL | 0 | — |
| HIGH | 0 | — |
| MEDIUM | 1 | **M-1: count lockstep broken** — 11 stale current-claim counts across 4 of the 6 named docs (AGENTS:17 build "~382 kB"; AGENTS:77 + CLAUDE:134 a11y "ten routes" vs the live fourteen routes + 2 mobile states; README:47 build size; SKILL:219 build size + SKILL:515 "a11y 15: thirteen routes" vs its own line 52; DEPLOYMENT:9/135-137 the whole verification-gate block still session-5-era, DEPLOYMENT:16-18 route enumeration missing the 7 accessories views and listing 3 phantom routes) |
| LOW | 4 | **L-1:** PAD:30 + SKILL:580 claim "63 index-nav links" — the seam carries 121 links (58 distinct hrefs). **L-2:** `site-content.test.ts` never round-trips hrefs through `parseHash` (the one seam without the T8 guard; `INFO_TITLES` has no slug-length guard either — a future >130-char label would 404 AND pollute the sitemap). **L-3:** `routeHref.storeAccessories()` accepts the illegal `accessories` category (`#/store/accessories/accessories` 404s by design; the type permits building it). **L-4:** the new seam re-defines `AccessoriesChapterChip` (identical interface in accessories-page.ts) and its spec mirrors `findProduct` instead of importing a shared matcher |
| INFO | 6 | D12 boundary cases on airpods/accessories marketing CTAs (documented deviation); StoreRails asymmetry on the accessories views (intentional superset); info-page titles carry the reference's spacing quirks (pinned); the per-category PageTitle sub reuses the device blurb (un-measured); tabs lack Home/End keys (APG-optional, axe clean); `\u` escape style in two seams |
| PARITY GAP | 1 | **The six nav-main marketing pages** — the session-12 log's named next surface. The reference's nav main links (Mac/iPad/iPhone/Watch/Vision/Home) route to marketing pages (`/sg/mac/`, `/sg/ipad/`, `/sg/iphone/`, `/sg/watch/`, `/sg/apple-vision-pro/`, `/sg/home/`); the clone routes them to the store category pages. Measured this cycle: each page = chapternav chips + visible 80px h1 + "Explore the line-up." (product tiles; mac carries a 4-tab filter gallery) + "Why Apple is the best place to shop X." value props + 2-3 content sections (banner cards / accordion continuity features / essentials) + a closing links directory. The vision page is hero-led (statement sections, no line-up). **358 measured content items** captured with a structured extractor (both page generations: React MarcomSection + legacy chapternav), hand-verified against live re-extraction |

## Verified evidence (this cycle)

- **Baseline:** every documented gate re-ran green at HEAD on a fresh clone + fresh PG 17.12 (the data dir was clean this cycle — no re-init needed); Playwright Chromium re-synced to the lockfile (headless-shell 1255); `npm audit` 0 vulnerabilities.
- **Audit (read-only subagent, web-application methodology, `skills/` excluded):** 0 CRITICAL + 0 HIGH + 1 MEDIUM + 4 LOW + 6 INFO; 7/8 standing traps PASS (T7 count lockstep FAIL — the M-1); the session-12 surface re-audited clean (D10 mechanically enforced and holding; S12-1/S12-2 fixes correctly landed; sitemap idempotent at exactly 559; `.env.example` accurate — zero app env reads).
- **Live parity (agent-browser, both sites):** clone mobile navigation CONFIRMED WORKING at 390×844 (bar byte-equal to the reference: logo x=0 w=48, Search x=246, Bag x=294, Menu x=342, 48px bar; menu opens top=48 h=796 rgba(22,22,23,.98); 11 rows / 11 expand buttons; Mac expansion 26 links, sub-links 39px; "Compare Mac" navigates + closes + title updates; zero console errors) — **no Tailwind v4 display-toggling defect** (the audit's T4 pass agrees: zero `classList`/`style.display` in `src/`; the homenest trap-log rule holds). The reference's nav-main link map extracted with hrefs: Store → goto/store, **Mac → `/sg/mac/` · iPad → `/sg/ipad/` · iPhone → `/sg/iphone/` · Watch → `/sg/watch/` · Vision → `/sg/apple-vision-pro/` · Home → `/sg/home/`** (AirPods → `/sg/airpods/` — already modeled, session 11; Entertainment → `/sg/services/` — the clone keeps its own entertainment family; Accessories → modeled, session 11; Support → external, the clone's own superset page). All six marketing pages measured in full (358 items; the h1s are VISIBLE 80px titles below the chapternav — the PageTitle token family, unlike the airpods page's sr-only h1); captures under `.scratch/s13/capture-*.json`, hand-verified (mac line-up 9 tiles incl. the two MacBook Pro variants distinguished by ″ U+2033 vs ” U+201D; the home line-up's 4 products; the iPhone Duo hero's 2 product tiles; watch chapternav 11 chips).
- **D10 cross-check:** line-up cards naming clone catalog products — mac "MacBook Pro 14″…" (M6) + "MacBook Pro 14”…" (PROLED) via aliases; ipad "iPad"; iphone "iPhone Duo" + "iPhone 18 Pro"; watch "Apple Watch Series 12"; home "Apple HomeView" + "Apple TV 4K" (the reference quotes S$399 for both; this catalog says S$449 / From S$229 — real D10 cases). All other tiles/cards keep measured text (D11 routing).

## Remediation ToDo list (session 13 — S13-*)

### Phase 1 — the audit fixes (TDD where assertable)

- **S13-1 (M-1, doc sweep).** The count lockstep sweep: AGENTS:17 + README:47 + SKILL:219 → the live build size (447.68 kB / 120.48 kB gzip); AGENTS:77 + CLAUDE:134 → "fourteen routes + mobile resting/menu-open" (16 axe scans); SKILL:515 → the a11y row corrected (a11y 16: fourteen routes); DEPLOYMENT:9/135-137 → the live gate figures (15/163 · 53 = 37+16 · 447.68 kB / 120.48 gzip · CSS 45,842 B / 676 rules); DEPLOYMENT:16-18 → the route enumeration gains the 7 `/store/{cat}/accessories` views and drops the 3 phantom routes; PAD:30 + SKILL:580 → "121 index-nav links (58 distinct destinations)".
- **S13-2 (L-2, RED first).** `site-content.test.ts` gains the global INFO_TITLES round-trip guard: every `INFO_TITLES` slug (and every `NAV_LINKS`/flyout href) round-trips `parseHash` to a non-not-found route. RED proven by injecting a >130-char label into the derivation (or a temporary bad slug) → GREEN with the guard.
- **S13-3 (L-3).** `router.ts`: `storeAccessories(category: DeviceCategoryId)` where `export type DeviceCategoryId = Exclude<CategoryId, "accessories">` (exported from catalog.ts, reused by the new seam); all call sites typecheck unchanged.
- **S13-4 (L-4).** `accessories-category-pages.ts` imports `AccessoriesChapterChip` from `accessories-page.ts` (the duplicate interface drops); `store-rails.ts` exports `findProductId(label)` and `accessories-category-pages.test.ts` imports it (the mirrored matcher drops).

### Phase 2 — the marketing routes (TDD)

- **S13-5 (RED first).** `router.ts`: six new top-level single-segment routes — `#/mac`, `#/ipad`, `#/iphone`, `#/watch`, `#/vision`, `#/home` → `{ name: "marketing"; category: DeviceCategoryId }` (mirroring the reference's `/sg/{x}/` shape); `routeHref.marketing(category)`; boundary pins: the six valid parses, `#/mac/x` 404s, `#/store`-family unchanged, the `?buy`-style query tolerance, and the collision checks (`#/store/mac` still the store; `#/product/*` unchanged). `MARKETING_ROUTE_CATEGORIES` constant drives both parse and href (never hand-listed twice).
- **S13-6 (RED first).** `route-title.ts`: the six measured titles — "Mac", "iPad", "iPhone", "Apple Watch", "Apple Vision Pro", "Home" (each + " - Apple (Singapore)", the established suffix for the reference's "(SG)"). `route-title.test.ts` pins all six + h1 agreement.

### Phase 3 — the marketing seam (the parity feature, TDD)

- **S13-7 (the seam, RED first).** New pure content seam `src/lib/marketing-pages.ts`: `MARKETING_PAGES: Record<MarketingCategoryId, MarketingPage>` where a page = { title, h1, chapternav (chips: label + optional "New" badge), sections[] } and a section is one of: `lineup` (headline + tabs × product tiles {name, badge, tagline, measured price?, productId?, learnHref, buyHref}), `valueprops` (headline + rows + headCtas), `cards` (headline + tiles {eyebrow?, headline, copy, price?, ctas}), `accordion` (headline + items), `directory` (heading + links), `statement` (heading + paragraphs + ctas — the vision hero family). Generated from `.scratch/s13/capture-*.json` by a converter (the session-10/11/12 approach; no hand transcription). Routing rules: line-up tiles whose (alias-matched) name resolves to a catalog product carry `productId` and DROP their measured price (rendered via `productPriceLabel` — D10) with Buy → `productBuy(id)` (D12); every other CTA routes via the established rules — chapternav "Accessories" → `storeAccessories(cat)`, "Shop X" → `routeHref.store(cat)`, family labels via `familyLink`, everything else `info(label)` (D11); the first chapternav-duplicating section and non-text CTA artifacts (image links) drop; `MARKETING_INFO_LABELS` derives structurally and joins `INFO_TITLES`. The spec pins: per-page title/h1/chip counts/section-kind sequence, the line-up tile counts (mac 4 tabs 9+4+3+2, ipad 4, iphone 6, watch 3, home 4), the D10 guard (no productId tile carries a measured price), the D12 guard (every buyHref is a `#/product/{id}?buy` of a real catalog product), the INFO_LABELS set-equality, and every generated href round-trips `parseHash`.

### Phase 4 — components + wiring

- **S13-8 (the components).** New `src/components/MarketingSections.tsx`: `MarketingChapterNav` (the chip strip — the established chapternav pattern), `LineupGallery` (tabs via the WAI-ARIA tabs pattern when >1 tab, else the plain grid; product tiles with derived-or-measured price), `ValueProps` (the icon-row family), `MarketingCards`, `MarketingAccordion` (the footer-accordion conventions), `MarketingDirectory` (the index-nav pattern), `StatementSection` (the vision hero family: 56-80px headline + copy + CTAs). New CSS lives in `@layer components` in `src/index.css` (the `marketing-*` class family); zero JS-toggled display utilities (the v4 trap contract).
- **S13-9 (the wiring).** New `src/pages/MarketingPage.tsx` (PageTitle h1 + sections + the superset block: a "Shop {X}" CTA band routing to the store category page — the store family stays one click away); `App.tsx` gains the `marketing` route case (per-view key); `site-content.ts`: `NAV_LINKS`' six device categories re-route to `routeHref.marketing(cat)` (the reference's behavior; the store pages stay reachable via the flyouts' "Shop X" links, the marketing chapternav chips and the store chip row); `sitemap.ts` gains the six `/mac`-style paths (priority 0.9, weekly). The specs update in lockstep: `site-content.test.ts` (the nav href pins + ROUTE_RE), `sitemap.test.ts` (+6 routes).

### Phase 5 — verification

- **S13-10 (e2e, RED first).** `store-flow.spec.ts` (or a new `marketing.spec.ts`) gains three pins: (a) the Mac marketing page renders its measured model (chapternav 11 chips, the line-up 4 tabs / 9 "All products" tiles, the value props, the closing directory) and its "Shop Mac" chapternav chip navigates to `#/store/mac`; (b) the Home page's Apple TV 4K line-up tile derives "From S$229" from the catalog (the D10 pin) and its Buy deep-links the configurator; (c) the Vision page renders its hero statement + a statement section. `a11y.spec.ts` scans `#/mac` + `#/vision` (the new classes must stay WCAG 2 A+AA clean). `mobile-navigation.spec.ts`'s no-overflow route list gains `#/mac` + `#/iphone`.
- **S13-11.** Full gate on the remediated tree (lint → typecheck ×2 → unit → build → e2e → smoke); sitemap regeneration + idempotency; live dev-server + built-artifact verification (all six pages render their measured sections; the chapternav chips navigate; the line-up tabs switch; the catalog-matched tiles derive; mobile 390×844 no horizontal overflow).

### Phase 6 — evidence, docs, delivery

- **S13-12.** Screenshots: the six marketing pages (desktop 1440×900) + one mobile shot → `docs/screenshots/27-32` via the capture script.
- **S13-13.** Docs lockstep sweep: `docs/reference-investigation.md` (D17 + the measurement row); README "What is in it" (the marketing family) + counts; PAD → v2.2 (revision block, §3.2 inventory, §4 seam row, §7.1 distribution, §8.1 figures, §11 line counts); SKILL → v2.2.0 (project_state + lesson 20); AGENTS/CLAUDE count rows; DEPLOYMENT route counts; worklog Task 125; `docs/session_13.md`; `.env.example` re-verified unchanged.
- **S13-14.** Atomic Conventional Commits on `main` → SSH-wrapper push (`docs/ssh_git_wrapper_v3.py --remote git@github.com:nordeim/apple-storefront-clone.git`).

## Plan validation notes (session 13, against the codebase)

- All 358 measured items were extracted live this cycle (captures under `.scratch/s13/`), hand-verified against the live DOM (mac's 9-tile line-up re-checked tile-by-tile; the home line-up's 4 products; the iPhone Duo hero's 2 tiles; the watch chapternav). The reference's two MacBook Pro line-up cards are distinguished by their prime characters (″ U+2033 on the M6 card vs ” U+201D on the PROLED card) — the alias keys carry the captured strings byte-exactly (word joiners U+2060 included, the D11 verbatim rule).
- The routing blast radius is ONE new route shape — six single-segment heads on the switch (`mac|ipad|iphone|watch|vision|home`), all existing heads untouched (verified against the switch in `router.ts:79-103` — no collisions: the current heads are store/product/bag/checkout/confirmation/search/entertainment/support/info). `routeHref.marketing` is additive. The six sitemap paths derive from the same constant.
- The nav re-route changes exactly six hrefs in `NAV_LINKS` (site-content.ts:20-31 — the map derives from CATEGORIES, so the change is one `href:` expression); the mobile accordion renders the same model so it flows through automatically; `site-content.test.ts`'s nav href pins update in lockstep.
- The store family is untouched: `#/store/{cat}` keeps the shelf models (session-10), the accessories views keep their grids (session-12) — the marketing pages are a NEW family beside them, and every "Shop X" surface (flyouts, chapternav chips, store chip row, marketing CTA band) still routes there.
- New files stay in the existing layers (`src/lib/marketing-pages.ts` pure; `src/components/MarketingSections.tsx`; `src/pages/MarketingPage.tsx`); vitest/tsconfig/playwright config changes: NONE (the include patterns already cover them). The seam joins `INFO_TITLES` (the sitemap derivation flows through, deduped by construction).
- Counts will move: unit +~12-16 (the marketing-pages spec + the router/route-title/site-content/sitemap pins), e2e +3 pins +2 axe routes, sitemap +6 store routes + the new info labels (measured at gate time), build size grows (measured at gate time). The lockstep sweep (S13-13) covers all seven docs in the same commits.
- Blast radius: `router.ts` (+6 routes + DeviceCategoryId export), `router.test.ts` (+pins), `route-title.ts` (+6 titles), `route-title.test.ts` (+pins), `site-content.ts` (NAV_LINKS re-route + the INFO_TITLES join + storeAccessories type), `site-content.test.ts` (href pins + the S13-2 guard), `catalog.ts` (DeviceCategoryId export), `sitemap.ts` (+6 routes), `sitemap.test.ts` (+pin), `store-rails.ts` (findProductId export), `accessories-page.ts` (AccessoriesChapterChip re-export), `accessories-category-pages.ts` (S13-4 dedup), `accessories-category-pages.test.ts` (S13-4 import), new `marketing-pages.ts` + spec, new `MarketingSections.tsx` + `MarketingPage.tsx`, `App.tsx` (route case), `index.css` (the marketing-* class family), `store-flow.spec.ts`/new spec (+3), `a11y.spec.ts` (+2), `mobile-navigation.spec.ts` (+2 routes). Zero context/hooks changes.

### Decisions on the open questions (operator-delegated)

- **D17 (the nav-main marketing family).** The six pages land as top-level hash routes `#/{mac,ipad,iphone,watch,vision,home}` (mirroring the reference's `/sg/{x}/` shape) rendering the measured marketing family (chapternav → visible 80px h1 → line-up → value props → content sections → closing directory), each closing with a superset "Shop {X}" CTA band routing to the store category page. The nav main links re-route to them (the reference's behavior). The line-up tiles naming clone catalog products derive prices from THIS clone's catalog (D10) and Buy deep-links the working configurator (D12); non-catalog tiles keep their measured text with CTAs info-routed (D11, the airpods-heroes precedent — a non-catalog "Buy" is acceptable ONLY outside the store-card family, where it is a documented deviation). The vision page's image-led sections model as statement sections (heading + copy + CTAs) — the reference's imagery is not reproduced (D1). The Entertainment nav link keeps the clone's own entertainment page (a different, smaller family — named as the remaining known gap); Support stays the clone's superset page.
- **The chapternav chips** reuse the established chip anatomy: product-family labels route via `familyLink` (catalog matches → product pages), "Accessories" → the per-category accessories grid (session-12), "Shop X" → the store page, OS/service labels → info pages.
- **The iPhone Duo hero section** (the reference's two-tile product hero below the chapternav) renders as a `cards` section with the two product tiles (both catalog-matched — iPhone Duo + iPhone 18 Pro — deriving prices per D10).

