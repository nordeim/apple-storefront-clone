我将首先内附的操作说明，然后系统地完成这项复杂的任务。让我制定一个待办计划并开始。
仓库已克隆。现在让我阅读核心文档。我会先阅读较小的文件，然后分块阅读较大的架构文档。
Now the README and docs structure:
Session 9 context understood. Now let me read the worklog (recent entries) and the remediation plan structure:
Clear picture forming — this is session 10 of an established cycle. Let me read the architecture document and key remaining docs:
Now the SKILL file's project state, the reference dossier, and the skills catalog:
Minor drift noted (SKILL Appendix B header says "session 8" but carries session-9 figures — a docs-sweep item). Now the repo skills catalog:
Now the repo's setup script and the web-application + tdd skills:
Skills understood. Now let me validate against the codebase — configs and key source files:
Structure matches PAD §11 exactly. Now let me install dependencies and set up PostgreSQL in parallel:
PG data dir is gone (sandbox recycled) — running the repo's setup script:
PostgreSQL 17 installed and accepting connections. Let me verify the version and check npm install progress:
Dependencies installed. Now let me install the Playwright browser and run the baseline gates:
Build matches documented 322.34 kB exactly. Now e2e and smoke:
All baseline gates green exactly as documented. Let me verify git status is clean and start the dev server:
Dev server up, tree clean. Now let me review the homenest-store-s reference repo for tech stack patterns:
Patterns understood. Let me now read the key source files of the apple clone to complete the codebase validation:
Mobile nav contract confirmed (mount/unmount via React state). Now the CSS and store surfaces:
Now the session-9 feature files (the recent changes to audit):
Codebase understanding is complete. Now let me set up the audit — first launch the read-only audit subagent, then do the live-parity pass with agent-browser:
Now let me launch the read-only audit subagent (per the repo's established methodology) while I run the live-parity pass:
Audit found a real HIGH defect (9 rail cards 404 due to the router's 60-char slug cap). Now the live-parity pass — let me verify agent-browser and check the clone's mobile nav first:
Bar geometry byte-equal to pins. Now the menu state machine test:
Mac expansion byte-equal (3 sections / 26 links / 39px sub-links). Now test sub-link navigation + menu close:
Clone mobile nav fully working, zero errors. Now the reference site — let me check the reference's category pages (the session-9 log's named next surface):
The reference category page structure is revealed — 7 card shelves. Let me measure "All models." in full detail:
Let me extract the full card content of each shelf:
Now let me check the Watch category page (session-9's named surface) to understand per-category variation:
The pattern is clear. Let me check the clone's category inventory and current rendering to size the gap:
The shelves vary per category — full per-page measurement is required. Let me extract the reference's category URLs from its store page, then measure each systematically:
Now let me write a systematic measurement script and run it across all category pages:
All 6 device category pages measured (~228 cards total). AirPods/Accessories are different page families (marketing/grid). Let me examine the captured card content in detail:
Let me measure the editorial card visual anatomy (themes) on the category pages:
Let me capture the theme classes for editorial cards across all category pages:
All measurements captured. Now the standing flyout drift check — rebuild the diff harness:
All 11 flyout models extracted. Let me save and diff against the seam:
The Home flyout lives in the reference's legacy `tv` container (documented naming). Fixing the harness mapping:
Zero flyout drift confirmed. Now let me check the clone's ProductCard and catalog to finalize the design:
Let me examine the first-shelf editorial cards for vision and home, plus the remaining shelf content across all pages:
The content is fully captured but needs clean eyebrow/headline/desc decomposition. Let me capture the structured card fields directly:
Clean extraction confirmed. Let me capture all 6 pages:
All captured. Let me verify the first-shelf trailing editorial cards and check the vision hero card:
Let me measure the "All models." product card's internal layout (info/price/Buy positions):
Complete anatomy captured. Now let me write the session-10 remediation plan. First, check the plan file's tail format:
Now let me compute the exact measured counts for the plan:
All numbers computed. Now let me write the session-10 remediation plan:
Plan appended. Now validating the plan against the codebase — reading the exact derivation and spec touchpoints:
Plan validated — no count pins block the sitemap growth. Now TDD execution. **S10-1 RED first** — the router boundary pins:
Now the round-trip guard in store-rails.test.ts (M-1), then run RED:
RED confirmed for the round-trip guard. Let me check the router boundary test:
Both RED. Now the GREEN fix — the router cap:
S10-1 GREEN — 9 broken cards healed. Now S10-2 (chevron theme inheritance):
S10-2 done. Before writing the seam, let me verify slug lengths across all captured labels (the cap question):
4 labels exceed 80 (max 126). Raising the cap to 130 — the smallest bounded change covering all measured content. Updating the boundary pins:
Now the seam converter. First, the exact slug grammar:
Now let me check the catalog taglines and write the seam converter:
The converter works. Let me review the remaining generated data:
The watch HOLIDAY card's bg wasn't captured. Let me measure it directly:
Data validated. The ZEISS card drops per D12 (non-buyable product card). Now the RED spec first (TDD):
RED confirmed. Now the seam implementation:
Hyphenated helper names parse as subtraction. Fixing to camelCase:
My spec had a typo (U+2011 vs ASCII hyphen). Fixing both spec issues:
Seam GREEN (9/9). Now S10-4 — extend the StoreRails component with the category card family:
Now add the category shelf components at the end of StoreRails.tsx:
Now S10-5 — the StorePage restructure:
Now the CSS. Let me quickly measure the reference's short-card typography first:
Short card headline is 24px/600. Now the CSS block:
Now fix the product card's info overlay (no gradient — the reference has the name on plain white):
The new classes need the base card positioning rules. Updating:
Now the INFO_TITLES join in site-content.ts and run the full unit suite:
Tests green (130) but my spec's typing is wrong. Fixing:
Lint clean, build green. Regenerate the sitemap and check the new route count:
Sitemap 204 → 337 routes. Now live verification on the dev server:
All 7 shelves render. Let me verify at desktop width and check the full anatomy:
Anatomy byte-close to the reference. Test the Buy navigation and other pages:
The Buy pill needs its own anchor (nested anchors are invalid). Restructuring with the Tile link pattern:
Now the CSS for the restructured product card:
The Buy pill deep-links the working configurator with focus management. Let me sweep all six category pages:
All pages render. Spot-check the themed cards and console:
Live verification caught a real defect: the reference ships "CONTINUITY" twice on the iPhone page (measured faithfully) and my label-key collides. Fixing the key strategy:
Let me verify the CONTINUITY duplicate is real on the reference (not a capture artifact):
The duplicate is real on the reference — measured content is faithful. Now verify the console is clean:
Console clean. Now the e2e pins — reading the current spec format:
Let me add an accessible name to the Buy pill, then write the two e2e pins:
Now add the a11y route and run the e2e suite:
The filter matched the PROLED card. Fixing with the unique eyebrow filter:
Now fix the flyout-diff.mjs typing for tsconfig.tests.json:
E2E 45/45 green. Fixing the .mjs typing (JSDoc, not TS annotations):
All typechecks pass. Now the full gate (S10-7):
Full gate green. Let me measure the docs figures (CSS size, smoke count, route counts):
All figures measured. Now S10-8 — screenshots. Let me check the capture script:
Let me add the session-10 shot and re-capture the family:
20 screenshots validated. Let me visually verify the new captures:
All screenshots verified non-blank. Now the docs sweep (S10-9). First, measure the new line counts:
Now the PAD → v1.9:
Now the SKILL.md → v1.9.0:
Now the worklog Task 122 entry:
Now the execution addendum + final gate on the complete tree:
Screenshots verified (unchanged pages produced byte-identical files). Final full gate on the complete tree:
Final gate fully green. Let me sweep for any stale counts before committing:
All clean (remaining hits are historical revision blocks). Now the atomic commits:
Three atomic commits, clean tree. Now the SSH-wrapper push — reading the runbook:
No ssh binary — I need the paramiko shim (Appendix A). Let me read it:
Let me deploy the shim by extracting it from the runbook, and prepare the key:
Dry-run clean — fast-forward e5bbdc2..473ca6f. Executing the real push:
Push verified — remote @ 473ca6f, key shredded, branch up to date. Final deliverable verification:
All verified. Let me complete the todo list and finalize:
Session 10 is complete and pushed. Final summary (paste-able as `docs/session_10.md`):

**Baseline validation** — fresh clone (the sandbox had recycled; HEAD `e5bbdc2`), every documented gate re-ran green exactly as claimed: lint 0 · typechecks ×2 · 11/119 unit · build 322.34 kB / 97.42 kB gzip (byte-equal) · 42/42 e2e · 45/45 smoke · 204 routes. Rootless PostgreSQL 17.12 installed fresh per `docs/setup_pg_z.sh`, verified accepting connections at `postgresql://postgres:postgres@127.0.0.1:5432/app_db`.

**Audit** (read-only subagent, web-application methodology, `skills/` excluded): **1 HIGH + 1 MEDIUM + 3 LOW + 8 INFO**. The HIGH was real: **nine session-9 rail cards linked to info slugs (61–70 chars) the router's 60-char cap silently 404'd** — dead links every gate was green against, because the specs assert href *shape*, not routeability. All 8 standing traps PASS; count lockstep exact except the LOWs (two stale PAD line counts, the SKILL Appendix B session title, the dark-theme chevron colour).

**Live parity** (agent-browser, both sites): mobile navigation CONFIRMED WORKING at 390×844 (bar byte-equal, 11 accordion rows, Mac expansion 3 sections / 26 links, navigate + close, zero console errors) — **no Tailwind v4 display-toggling defect**. All eleven reference flyout models re-extracted and re-diffed via the rebuilt harness (`scripts/flyout-diff.mjs`, now committed) — **all match**. The six device category pages measured in full for this cycle's feature (233 cards); AirPods/Accessories measured as different page families (D13).

**TDD remediation**: S10-1 — router boundary pins RED first → cap 60 → 130 (longest measured slug: 126) → GREEN; the `parseHash` round-trip guard added to every content seam (the drift-class fix). The 9 cards healed with zero content changes. S10-3/4/5 — the **six device category pages' measured shelf models** landed: `category-rails.ts` (360 lines, 233 measured cards), `CategoryShelves` rendering with the measured "All models." product-card anatomy — **the Buy pill deep-links the working configurator** (D12: a product-looking card must BE a sellable product; the superset play), the chevron theme fix, and the sitemap derivation grew 204 → 337 routes. The live pass caught a real React key collision on the reference's duplicated CONTINUITY card (kept verbatim, keyed by index).

**Final gate**: lint 0 · typechecks ×2 · **12 files / 130 unit** · build **349.26 kB / 102.71 kB gzip** (CSS 37,986 B / 579 rules) · **45/45 e2e** (32 pins + 13 axe scans, incl. the new `#/store/mac` WCAG scan) · 45/45 smoke, zero console errors. 20 screenshots (incl. 19/20 the category shelves); docs swept in lockstep (PAD v1.9, SKILL v1.9.0 with lesson 17, AGENTS trap 8, D12/D13 in the dossier, worklog Task 122); `.env.example` re-verified unchanged. **Pushed: main @ `473ca6f`** via the SSH wrapper — remote ref verified, key shredded.

Next cycle: the reference's AirPods marketing page and the Accessories filtered-grid page are the named next surfaces (D13), if you want the store family completed.
