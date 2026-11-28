The workspace was reset again — fresh clone (HEAD `9bdebe8` = the session-11 tree + the session-11 log paste). This is **session 12**. The session-11 log named the next surface: the reference's `/sg/shop/goto/*` marketing destinations behind the flyout links (the D15 "per-category accessory routes" deferral) — resolved this cycle to the seven per-category accessories grids. Baseline first (the standing ritual):

PostgreSQL 17.12: the sandbox recycled the data dir into the same partial state as session 11 (`pg_notify` missing) — wiped and re-initialized per `docs/setup_pg_z.sh`, verified at `postgresql://postgres:postgres@127.0.0.1:5432/app_db`. The Playwright Chromium cache had drifted from the lockfile (headless-shell 1200 vs the needed 1255) — re-synced with `npx playwright install chromium` before the e2e baseline.

**Baseline fully green, exactly as documented**: lint 0 (3 accepted warnings) · typechecks ×2 · 14 files/147 unit · build 382.22 kB (byte-exact 382,220 B) · 50/50 e2e · 45/45 smoke zero-console · 389 routes idempotent · npm audit 0 vulnerabilities.

Now the audit phase — the read-only subagent over the session-11 surface (web-application methodology, `skills/` excluded), while the live-parity pass runs:

Audit complete: **0 CRITICAL / 0 HIGH / 1 MEDIUM / 3 LOW / 3 INFO** — all 8 standing traps PASS, count lockstep exact. The real findings: the airpods seam lacks the INFO_LABELS set-equality guard (M-1 — the accessories seam has it, the airpods seam doesn't; the S10-1 dead-route class unguarded there), the Pro 3 hero quotes a measured price while its own compare column derives (L-1), a "four vs six" stale comment (L-2), and a dead ternary in the accessories spec (L-3).

Live parity: the clone's mobile navigation re-verified working at 390×844 (bar byte-equal, 11 rows, Mac expansion 26 links, navigate + close, zero console errors — no Tailwind v4 display-toggling defect). The reference's full eleven-flyout link map extracted WITH hrefs — the key map: nav main links → the marketing pages (`/sg/mac/`…), flyouts' "Shop X" → `goto/buy_*` (modeled session-10), **"X Accessories" links + the all-page chapternav's device chips → `goto/{x}/accessories` = `/sg/shop/{cat}/accessories`** — the D15-named future surface. Measuring all seven pages in full:

The per-category pages are the same family as the modeled all-accessories grid (h1 80px → chapternav → gallery → curated tabs → value props → index nav), each with per-category content. A structured extractor captured everything (chips with the reference's own accessible names and spacing quirks, gallery cards, every tab clicked and extracted, the promo structures dumped raw, value props, index navs) — **429 measured content items**, hand-verified against independent live re-extractions. Nine items name clone catalog products — the D10 rule applies (the reference quotes S$399 for the Apple TV 4K card; this catalog says From S$229).

The session-12 plan written into `docs/REMEDIATION_PLAN.md` (findings + S12-1..S12-13 + the D16 decision), validated against the codebase (every touchpoint read), then executed TDD:

Phase 1 — the audit fixes: the airpods set-equality guard proven RED by injection → GREEN; the Pro 3 hero derives its price at render (D10, the compare-column rule); the comment and ternary fixed.

Phase 2 — the router + titles: the store route gains the accessories view (`#/store/{cat}/accessories` for the seven device categories; boundary pins RED → GREEN); routeTitle carries the seven measured per-page titles (including iPad's own lowercase "accessories").

Phase 3 — the seam: the converter generated `src/lib/accessories-category-pages.ts` (1,080 lines) from the captures. The converter needed three corrections, each caught by a check not by eye: a raw-href leak in the chip-matching rule, a label-vs-ariaLabel mix producing same-slug collisions, and an NFKD-vs-verbatim slugify divergence on ™-carrying labels — all caught by the spec's set-equality pin. The 11-case spec pins the h1s, chips, galleries, tab labels + measured card counts, badge totals, the D10/D11/D12 rules, the INFO_LABELS set-equality, and the full parseHash round-trip.

Phase 4 — the wiring: the five section components parameterized by an optional model prop (the all-page constants default — the pinned rendering byte-identical; zero new CSS); StorePage's accessories-view branch; the flyout/chip re-routes; the sitemap's seven new routes.

**The live pass caught one real defect no gate saw**: on `#/store/airpods/accessories` the airpods MARKETING family rendered alongside the grid (the branch keyed on category alone, not the view). Fixed; the lesson encoded.

**Full gate GREEN**: lint 0 · typechecks ×2 · **15 files / 163 unit** · build **447.68 kB / 120.48 kB gzip** (CSS 45,842 B / 676 rules) · **53/53 e2e** (37 pins + 16 axe — the new route scans WCAG 2 A+AA clean) · 45/45 smoke, zero console errors · sitemap **559 routes / 527 info pages**. Live verification: all seven pages render their measured sections on the dev server AND the built artifact; the tabs switch; the AirPods Pro 3 card derives "S$349"; the Apple TV 4K card derives "From S$229" with the `?buy` deep link; mobile 390×844 — no horizontal overflow.

26 screenshots (all valid PNGs); docs swept in lockstep (PAD v2.1, SKILL v2.1.0 with lesson 19, D16 in the dossier, worklog Task 124); `.env.example` re-verified unchanged.

**Pushed: main via the SSH wrapper** — remote ref verified, key shredded.

The accessories family is now complete end-to-end: the all-accessories grid (session 11) plus its seven per-category grids, every flyout "X Accessories" destination and chapternav chip routing to its honest measured page. Next cycle candidates if you want to keep going: the reference's nav-main marketing pages (`/sg/mac/`, `/sg/iphone/`… — the largest remaining un-modeled family), or the small goto marketing pages behind the flyout quick links (Trade In, Financing, Personal Setup, Certified Refurbished).
