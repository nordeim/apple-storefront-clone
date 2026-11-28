I'll start by setting up a comprehensive task plan for this complex remediation project, then work through it systematically.
No existing repo clone. Let me clone the repository.
Repo cloned successfully. Now let me review the core documentation files.
Now let me read the session docs and remediation plan.
The repo is at session-12 state with 26 screenshots. I notice there's a `docs/session_13.md` — let me check it along with key config files.
`docs/session_13.md` is the session-12 working log (already committed). This is now **session 13**. Let me mark doc review complete and read the remaining key references.
Configs verified. Now let me install dependencies and set up PostgreSQL in parallel.
Now let me set up PostgreSQL and check npm install progress.
Dependencies installed. Now let me run the PostgreSQL setup and start the baseline gates in parallel.
Unit tests match docs exactly (15/163). Checking PG setup and running the build.
PostgreSQL 17 ready on first attempt. Now the build gate.
Build byte-matches docs (447.68 kB / 120.48 kB gzip). Now the E2E suite — first checking Chromium availability.
**Baseline fully green, exactly as documented**: lint 0 · typechecks ×2 · 15/163 unit · build 447.68 kB · 53/53 e2e · 45/45 smoke · 559 routes · PG 17 ready. Let me run npm audit and review the skills catalog for the audit phase.
Now for the audit phase. Let me read the audit-relevant portion of the web-application skill and check agent-browser availability.
I have the audit methodology. Now let me launch the read-only audit subagent over the session-12 surface while I review the homenest reference repo and run the live-parity pass in parallel.
Audit complete: **0 CRITICAL / 0 HIGH / 1 MEDIUM / 4 LOW / 6 INFO** — the code surface is functionally clean; the real finding is 11 stale doc counts (trap T7) plus hardening opportunities. Now the homenest reference review and the live-parity pass. Let me start the dev server and fetch the homenest repo docs.
The homenest repo confirms the Tailwind v4 trap pattern (never JS-toggle display utilities — mount/unmount via React state). Let me check its skills catalog for the relevant Tailwind v4 skills.
The Tailwind v4 mobile-nav pattern is confirmed from both repos (mount/unmount via React state, never JS-toggle display utilities) — and the audit verified trap T4 passes. Now the live-parity pass with agent-browser, focusing on the mobile navigation.
Page loads at mobile viewport. The bar height reads 44 — let me measure the full mobile bar geometry against the pins (expected 48px bar).
The viewport didn't apply (desktop links visible). Let me set the viewport explicitly.
Viewport applied (390×844, 3x DPR). Now the full mobile bar geometry measurement:
Mobile bar geometry is **byte-equal to the reference pins** (logo x=0 w=48, Search x=246, Bag x=294, Menu x=342, 48px bar). Now the menu state machine:
Mac expansion verified: 26 sub-links at 39px (matches pins). Now testing sub-link navigation and menu close:
Mobile nav state machine fully working: navigate + close + title update + route resolution. Now console check and the live reference comparison:
Zero console errors on the clone. Now let me verify the live reference's mobile navigation for comparison:
The reference has a region-selector overlay. Let me dismiss it and measure the actual bar:
Reference mobile bar matches the clone byte-for-byte (logo x=0, Search x=246, Bag x=294, Menu x=342, 48px). Let me open the reference's mobile menu to compare the accordion:
Reference menu structure confirmed: 11 rows with "{X} menu" expand buttons — matching the clone's model exactly. Let me verify the Mac expansion on the reference:
The reference's mobile menu model is confirmed matching (11 rows at 53px). The mobile navigation parity holds. Now let me examine this session's feature surface — the reference's nav-main marketing pages (`/sg/mac/`), the largest remaining un-modeled family:
The reference Mac marketing page structure revealed. Let me map the reference's nav-main link destinations and survey all the marketing pages' shared structure:
The reference nav-main map is complete. Six marketing pages remain un-modeled: Mac, iPad, iPhone, Watch, Vision, Home (AirPods was done in session 11). Let me survey the family structure across all six:
The six marketing pages share a family (chapternav → line-up → "Why Apple..." → category sections), with Vision Pro a hero-led variant. Let me extract the full Mac page content model to scope the seam:
Line-up cards confirmed. Let me check the Entertainment destination (`/sg/services/`) to complete the parity map:
The parity map is complete. Now let me validate the clone's routing touchpoints before writing the session-13 plan:
All routing touchpoints validated. Now let me capture the six marketing pages with a structured extractor. First, checking the scratch convention:
Section skeleton captured but tile extraction needs fixing. Let me inspect the actual line-up DOM structure:
Names extracted but prices/CTAs are outside the tile scope. Let me dump one unit's raw HTML:
Full card model decoded. Let me survey the other sections' tile structures:
Sections are lazy-loaded on scroll. Let me scroll through the page first, then extract:
All sections loaded. Now let me write the definitive extractor for all six pages:
Nearly complete. The "Unlock the world" tiles need a different selector. Let me inspect:
The last section is a links directory (26 links). Let me patch the extractor for accordion and directory kinds, then capture all six pages:
Captures written but the printer crashed on new kinds, and several pages need structure-specific handling (the region overlay also re-appears). Let me fix and inspect:
Mixed results — mac is complete; the others' line-up sections use different DOM. Let me inspect the iPad line-up structure:
iPad uses a plain `ProductTileGallery`. Let me survey the remaining pages' line-up variants and chapternavs:
The reference has two page generations: React MarcomSection (mac/ipad/watch) and legacy chapternav (iphone/home). Let me update the extractor to handle both and re-capture:
Now let me fix the summary printer and re-run all six pages:
The edit broke out of the template literal. Let me inspect and fix:
The backticks in the comment terminate the template literal. Fixing:
Progress — mac/iphone/home line-ups captured. Remaining: the React plain gallery (ipad/watch), iphone's empty sections, home/vision details. Let me inspect these:
The pages use heterogeneous card classes. Let me check the iPhone and Vision section structures, then finalize the extractor:
Now I understand all variants. Let me write the final extractor v3 with the complete selector set:
mac/ipad/watch are complete. Let me fix the remaining: iphone's banner-cards, home's feature-cards, and vision's hero sections:
Found the bug — `banner-card-headline` classes contain "card" and shadow the real containers. Let me write extractor v4 with the fixes plus richer text-section capture for the vision hero sections:
v4 over-filtered the React tiles. Let me check the actual classes to calibrate the filter:
The units are `BannerCard_copyLockup` (React) and `div.card.tile` (legacy) — both anchorable via their CTAs. Let me write v5 with CTA-anchored unit extraction:
All six pages captured. Let me verify the content quality and count items:
358 items captured. Let me hand-verify samples against the captures:
Captures verified — high quality with badges, prices, CTAs. Let me check the catalog for D10/D12 cross-matching before writing the plan:
Let me verify the reference h1 pattern (sr-only vs visible) before writing the plan:
The h1 is visible at 80px (the PageTitle token pattern). All reconnaissance complete. Now let me write the session-13 remediation plan:
Plan written. Now validating against the codebase before executing:
App.tsx validated — the plan aligns with the codebase. Now executing **Phase 1 (audit fixes)**. Starting with S13-2 (the INFO_TITLES round-trip guard, RED first):
Now writing the S13-2 guard (RED first):
GREEN immediately (no live defect — as the audit found). Proving the guard catches drift by injection (the honest RED):
The injection needs the proper link shape. Fixing:
My proof label was exactly at the cap. Extending it past 130:
**RED 已验证** —— 该守卫（guard）恰好捕获到了预期的 S10-1 漂移类别。正在还原注入：
S13-2 complete. Now S13-3 (type hardening) and S13-4 (dedup):
Now applying S13-3 + S13-4:
Now the spec's mirrored matcher and the storeAccessories type:
Now S13-3 — the DeviceCategoryId type:
The cast masks a correlation TS can't prove. A defensive guard is cleaner:
**Phase 1 complete** (165 tests green). Now S13-1 — the doc count sweep:
All remaining hits are legitimate historical revision blocks. S13-1 done. Now **Phase 2** — the marketing routes. Writing the RED pins first:
Now writing the S13-5 RED pins:
RED confirmed. Implementing the router change (GREEN):
I broke the parseHash structure. Let me view and repair properly:
Router GREEN. The route-title switch now needs the marketing case (S13-6). Writing RED pins first:
RED confirmed. Implementing GREEN:
Phase 2 complete (34 tests green). Now **Phase 3** — the marketing seam. First, examining the captured section 0 artifacts to finalize the converter rules:
Complete picture. First, adding the two MacBook Pro line-up aliases to the shared alias map (byte-exact from captures):
Aliases verified byte-exact. Now writing the converter that generates the seam:
Seam generated — all six pages with the right section mixes. Verifying typecheck and quality:
Found three converter bugs: double commas in accordion, footnote CTAs leaking, and null rendered as "". Fixing:
Partial application happened. Let me check state and apply remaining fixes individually:
Two more bugs: footnote markers `*`/`**` leak as CTAs, and the accordion double-comma. Fixing all:
The accordion is already fixed by the partial edit. Just the import left:
Vision's Entertainment cards are copy-only (null headline). Making the interface nullable:
Seam typechecks and lints clean. Spot-verifying the generated routing:
The home line-up names carry extraction artifacts ("New Apple HomeView Apple HomeView" — badge + doubled name). Let me check all line-up names and fix the converter's name normalization:
D10/D12 derivations verified. Now writing the seam spec (the pin suite):
Both failures are my spec's expectations (the data is correct — the Laptops tab repeats the MacBook Pros, and vision has one cards section). Fixing the spec:
**16 files / 179 tests green.** Now wiring the INFO_TITLES join, sitemap routes, and nav re-routes:
MARKETING_INFO_LABELS must be `{label, href}` objects like the sibling seams. Fixing the converter + spec:
TDZ error — NAV_LINKS now reads STORE_CATEGORY_LABELS at init. Reordering:
TDZ fixed. Now fixing the spec's type predicate:
NAV_LINKS dropped airpods (not in MARKETING_ROUTE_CATEGORIES). Fixing to include it routed to its marketing family:
All green. Adding the nav-routing pins and the sitemap routes:
Sitemap at **606 routes**. Now the components (S13-8). Let me study the established patterns first:
Now writing the MarketingSections component:
Now the MarketingPage and the App wiring:
Now the CSS for the marketing family (in `@layer components`):
The scratch converter needs ESLint ignoring (it's a session-scratch area, gitignored):
Lint clean. Let me verify the footnote filter is actually applied in the converter:
The footnote filters never landed. Fixing the converter's three CTA sites:
Build 505.25 kB, sitemap 598 routes. Now the e2e pins (S13-10):
Now the marketing e2e pins — a new spec file:
Before running e2e, let me verify the pinned derived prices against the catalog:
Two locator fixes needed — `toHaveCount` instead of `toHaveLength`, and the tile ancestor lookup:
All 5 marketing pins pass. Now the a11y violation on #/mac:
The axe tier caught a real defect — the "New" badge gray fails contrast on the chip background. Fixing (the session-9 precedent: a11y wins):
The mobile menu is missing the Vision row. Let me inspect the rendered menu:
The menu is correct — but uses full labels. Let me check what CATEGORIES defines vs what my change did:
The flyout headings use `link.label` — my switch to full labels broke the mobile pins. Reverting to the CATEGORIES short labels (the reference's nav uses short forms):
This pin is the intentional D17 change — the mobile menu's Mac link now goes to the marketing page. Updating the pin to the new contract:
**60/60 e2e green.** Now the full clean gate (S13-11):
Full gate green. Now the live verification on the dev server (S13-11):
All pages live and clean — but #/vision shows 0 Buy deep-links (the hero's Buy CTA should deep-link the configurator, D12 — Vision Pro IS a catalog product). Let me check:
Found two routing defects: generic "Learn more" CTAs route to a useless `#/info/learn-more`, and the vision hero's Buy should deep-link the configurator (D12). Fixing the converter's CTA routing:
All green. Let me collect the final figures for the docs sweep:
Now S13-12 — the screenshots. Checking the capture script:
The `aref*=` selectors never matched — the old flyout shots were captured without the flyout open (a pre-existing script defect). Fixing all selectors with the session-13 hrefs:
The file is now fixed (0 `aref`, 4 `a[href`). Let me verify the selectors match and recapture:
Something is inconsistent between tools. Let me force-fix via python directly and verify:
Mystery solved — the file IS fixed; the `[href` in tool output is being swallowed by display rendering (bracket-pattern interpretation). Definitive verification:
The file was fixed all along — the display was swallowing `[href` as markup. The codepoints confirm `nav a[href*=`. Now recapturing all screenshots:
Still stopping after shot 11. Let me trace what follows:
Found it — the attribute syntax was fixed but the href VALUES are stale (`store/iphone`). Fixing the values properly:
My debug wrappers broke `$0` resolution. The real script's death is elsewhere — checking the raw log:
The replacement dropped the `="` — the selector is `a[href#/iphone]` (invalid). Fixing properly:
All selectors valid. Running the full capture:
All 33 screenshots captured. Let me visually verify the key new shots:
Screenshots verified. Now **S13-13 — the docs lockstep sweep**. Updating all counts and adding D17:
The authoritative split is **42 pins + 18 axe scans** (16 routes + 2 mobile states). Correcting my earlier numbers:
Now updating README's "What is in it" + architecture with the marketing family, and the DEPLOYMENT route enumeration:
Counts swept. Now the reference dossier D17 entry:
Now the PAD v2.2 revision block and the SKILL v2.2.0 update:

工作区完整，所有 session-13 的更改都未提交。让我详细评估一下已经完成了哪些工作以及还剩下什么。
All code work is in place. The previous session was cut off during the docs lockstep sweep (S13-13). Let me check the docs state precisely.
The worklog ends at Task 124 (session-12). The session-13 entry, PAD v2.2 block, and SKILL v2.2.0 update were in progress when the session was cut. Let me check each doc's current state.
PAD v2.2 block exists; SKILL is still at v2.1.0 — that's the exact cut-off point. Let me check the other docs' states.
PAD v2.2 and D17 are complete. Now let me examine the SKILL file (the cut-off point), the REMEDIATION_PLAN session-13 section, and verify the doc counts.
The SKILL body sections (§2 counts) were already updated but the version header is still 2.1.0 — that's the exact cut-off point. Let me check the remaining SKILL sections (project_state, lessons) and the other docs' counts.
Now I have the full picture. The plan: complete the SKILL v2.2.0 update + worklog Task 125, then re-run the full gate to verify every number claimed in the docs, then commit and push. Let me set up the todo list and start.
node_modules looks thin (23 binaries). Let me check what's missing.
Key binaries are all present. Let me check the package.json scripts and start the full gate sequence.
Lint clean (0 errors, 3 accepted warnings — matches docs). Now typecheck ×2 and unit tests.
Unit: 16 files / 181 tests — matches PAD v2.2. Now build + sitemap regeneration.
Build 505.05 kB / 132.22 kB gzip and sitemap 596 routes idempotent — all match PAD. Let me verify the sitemap base URL matches the committed convention.
Sitemap base matches the committed convention (localhost:5173 default, +37 route blocks). Now the e2e suite — the long gate.
CSS byte count is close (49,567 vs documented 49,565) but rule counting differs by method. Let me calibrate the rule-count method against the documented one.
2-byte CSS delta vs. docs. Let me find the established measurement convention — check for a figure-collection script from the previous sessions.
让我查看完整的构建输出——Vite 的资源表可能会报告预内联的 CSS 大小（这是既定的衡量标准）。
The build report doesn't expose the standalone CSS size — the previous session's 49,565 isn't reproducible; my reproducible measure is 49,567 B / 721 rules. I'll correct that in the docs. Now let me verify the e2e split (42 pins + 18 axe) and the info-pages count (558).
e2e split confirmed: 42 pins + 18 axe = 60. Now the info-pages count.
All figures verified: 596 routes = 558 info + 16 store + 12 product + 6 marketing + 3 singles + root. Now the full doc-count sweep across all six docs.
Found the stale spots. Let me verify the unit-test file split (seam vs component) for the SKILL §2 claim, and read the SKILL's Appendix B fully.
15 seam + 1 component = 16 confirmed. Now let me read the SKILL Appendix B and §7 in full to plan the edits.
Appendix B is mostly updated but has stale bits (session 12 header, "14 seam files", CSS 45,842). Let me verify the e2e spec-file breakdown and check §7/§11 for staleness.
E2e breakdown verified (8+11+18+5+18=60). §7 lacks the marketing-pages seam. Let me check §5 (components) and §11 for the same gap.
§5, §7, §11 all have small gaps. Now let me verify the marketing info-labels delta (527→558 = 31) for the Appendix B sitemap note.
95 labels, 31 net-new after slug dedup. Let me get the line counts for the SKILL entries, then start the edits.
The seam is 1,308 lines but PAD claims 1,326 — doc drift from post-measurement edits. Let me find all line-count claims about the new files across the docs.
Let me verify the PAD's internal sections (§3.2, §4, §7.1, §8.1, §11) were actually updated as the v2.2 block claims.
PAD 的 key-files 表格中缺少营销行（v2.2 区块声明了它们）。我来读取该表格。
The key-files table needs the marketing rows and has stale line counts. Let me get all current line counts for the table's files.
Now let me get the exact store-route segmentation for the sitemap row.
Route segmentation confirmed: 4 bare + 16 store + 6 marketing + 12 product + 558 info = 596. Let me check the PAD's other internal sections (§3.2 tree, §4 seams, §7.1, §8.1) that the v2.2 block claims were updated.
The PAD's internal sections (§3.2 tree, §4, §7.1, §8.1, §11) were NOT actually updated — the v2.2 block over-claims. I must complete them. Let me read each section.
PAD §7.1/§7.3/§8.1 are stale too. Let me check the PAD §4 seam table structure.
PAD §4 needs the marketing bullet. Let me check the remaining AGENTS/CLAUDE/DEPLOYMENT spots that S13-1 targeted (axe scan counts, index-nav figures, route enumeration).
Stale spots fully mapped. Let me read the PAD tree's tests/ and public/ sections to complete the picture.
Tree's tests/ section needs the new specs too. Let me check the router pattern claim (line 738) and router test count.
Router: 147 lines, 21 tests — §3.3's "85 lines / 8 tests" is stale. I now have the complete work map. Let me execute the PAD edits.
Now the §3.2 tree edits.
树形编辑已应用。现在进行 §3.3 模式修复、§4 营销要点以及 §7/§8 的更新。
All PAD sections updated. Now the §11 key-files table — stale line counts plus the four new rows.
MultiEdit is atomic — none applied. The route-title row has a special apostrophe. Let me check the exact bytes.
The file contains a literal `\u2019` escape sequence. Let me redo the edits with exact strings.
Let me inspect the exact unicode of these table rows with Python.
The route-title row's `\u2019` is a literal ASCII sequence (fine in my edit). The router.ts row failed first. Let me find its exact text.
第一次批处理在中止前应用了 router 编辑（现为 147）。让我重新提交剩余的修改。
PAD key-files table complete. Let me run a final PAD stale-figure check, then move to the SKILL.
The Python loop was too slow. Let me use simple grep with line ranges instead.
PAD is clean. Now the SKILL updates — starting with version, title, §2, §5, §7, §11.
Now §7, §11, and Lesson 20.
Now the Appendix B updates.
Now the D17 entry in Appendix B's page-family list.
SKILL D17 entry added. Let me update the mobile-nav parity line to include this session's re-verification.
SKILL complete. Final stale-figure check on the SKILL, then the worklog entry.
Now the worklog Task 125 entry. Let me check the worklog's exact end and structure.
Worklog done. Now let me check how previous sessions split their commits, to follow the same atomic style.
Session-12's commits split cleanly by file. Let me check whether site-content.test.ts's audit-guard hunks are separable from the marketing pins.
Both new describes are one contiguous hunk — not cleanly separable. Let me check what the "update session log" commit contains to mirror the cycle's commit pattern.
The cycle pattern is exactly 4 commits: fix → feat → docs sweep (incl. worklog + screenshots) → update session log (the next session's input paste). Let me verify the worklog went into the docs commit.
现在我将遵循该仓库确切的 4 次提交循环模式（fix → feat → docs → session-log，其中第 4 次提交由操作员在下一次会话中粘贴）。首先，让我检查剩余的差异（diffs），以便正确放置文件。
accessories-page.ts 不需要更改（接口原本就在那里）。现在我将创建 commit 1（审计修复），其中包含 site-content.test.ts 的拆分版本 —— 先仅保留 guard，marketing pins 留待 feat commit。我先保存完整版本。
Now stage and commit the audit fixes, then verify that commit's tree is green in an isolated worktree.
Symlinks blocked. Alternative: archive commit 1 into a subdirectory inside the repo (node_modules resolves up-tree) and run vitest there.
Commit 1 verified green (15 files / 165 tests = 163 + 2 guard tests). Now restore the full test file and build commit 2 (the feature).
所有 21 个功能文件已暂存（`site-content.test.ts` 中仅剩 `marketing-pins` 的 +21 行 —— `guard` 已包含在 `commit 1` 中）。正在创建 `commit 2`。
All three commits in, tree clean. Let me verify the test-file round trip was byte-exact and re-confirm the gates on HEAD.
HEAD verified green. Now the push — let me read the SSH wrapper instructions.
I have the full runbook. Let me check the wrapper's actual interface and whether an ssh binary exists.
No ssh binary, no paramiko, and the wrapper's default remote is ely-beauty — I must pass `--remote`. Let me install paramiko and deploy the shim.
Key parses (ed25519). Now the dry-run through the wrapper with the shim on PATH.
Dry-run green: auth works, remote main is at 5ea2703 (our base — fast-forward to 1ccb931). Real push now.
Pushed and verified: remote main @ 1ccb931 == local HEAD. Now shred the operator key and run final post-push verification.
Key shredded. The ls-remote re-check failed only because the key is gone (the wrapper already verified remote == HEAD pre-shred, and git status confirms sync). Final hygiene checks.
Everything is verified. Let me do one final PG state check for the record and update my todo list.
The session-13 cycle is complete and pushed. Summary of this continuation:

**Resumed from the cut-off point** (docs sweep mid-flight, SKILL at v2.1.0) and finished the cycle:

1. **Full gate re-run on the final tree** — every figure verified: lint 0 errors (3 accepted warnings) · typecheck ×2 clean · unit **16 files / 181 tests** · build **505.05 kB / 132.22 kB gzip** (CSS 49,567 B / 721 rules) · e2e **60/60** (42 pins + 18 axe) · smoke **45/45** · sitemap **596 routes / 558 info pages**, idempotent · 33 valid screenshots.
2. **Completed the docs lockstep sweep** the earlier session had over-claimed: PAD's §3.2 tree, §3.3 router pattern (147 lines/21 tests), §4 marketing seam, §7.1/§7.3, §8.1, and the §11 key-files table (4 new rows + 10 corrected line counts) were still stale — all fixed. SKILL bumped to **v2.2.0** (15-seam split, MarketingSections, Lesson 20, Appendix B session-13 state with the D17 entry). Two mid-flight figures corrected by re-measurement (CSS 49,565→49,567 B; seam 1,326→1,308 lines). Worklog Task 125 appended.
3. **Three atomic Conventional Commits on main** (the repo's cycle pattern): `e5bf112` fix (audit fixes — round-trip guard, DeviceCategoryId, dedups; intermediate tree verified green in isolation: 15 files/165), `a8c501f` feat (the six nav-main marketing pages, D17 close-out), `1ccb931` docs (the lockstep sweep + 33 screenshots).
4. **Pushed via `docs/ssh_git_wrapper_v3.py`** (paramiko shim deployed, key fingerprint-checked, dry-run first) — **remote verified: refs/heads/main @ 1ccb931 == local HEAD**, fast-forward from 5ea2703, no new branch. Operator key shredded; no key material in any commit; working tree clean.

The clone now models every top-level nav destination's reference page family — a functional superset with visual parity, mobile navigation confirmed working with zero Tailwind v4 display-toggling defects.
Key parses (ed25519). Now the dry-run through the wrapper with the shim on PATH.
Dry-run green: auth works, remote main is at 5ea2703 (our base — fast-forward to 1ccb931). Real push now.
Pushed and verified: remote main @ 1ccb931 == local HEAD. Now shred the operator key and run final post-push verification.
Key shredded. The ls-remote re-check failed only because the key is gone (the wrapper already verified remote == HEAD pre-shred, and git status confirms sync). Final hygiene checks.
Everything is verified. Let me do one final PG state check for the record and update my todo list.
The session-13 cycle is complete and pushed. Summary of this continuation:

**Resumed from the cut-off point** (docs sweep mid-flight, SKILL at v2.1.0) and finished the cycle:

1. **Full gate re-run on the final tree** — every figure verified: lint 0 errors (3 accepted warnings) · typecheck ×2 clean · unit **16 files / 181 tests** · build **505.05 kB / 132.22 kB gzip** (CSS 49,567 B / 721 rules) · e2e **60/60** (42 pins + 18 axe) · smoke **45/45** · sitemap **596 routes / 558 info pages**, idempotent · 33 valid screenshots.
2. **Completed the docs lockstep sweep** the earlier session had over-claimed: PAD's §3.2 tree, §3.3 router pattern (147 lines/21 tests), §4 marketing seam, §7.1/§7.3, §8.1, and the §11 key-files table (4 new rows + 10 corrected line counts) were still stale — all fixed. SKILL bumped to **v2.2.0** (15-seam split, MarketingSections, Lesson 20, Appendix B session-13 state with the D17 entry). Two mid-flight figures corrected by re-measurement (CSS 49,565→49,567 B; seam 1,326→1,308 lines). Worklog Task 125 appended.
3. **Three atomic Conventional Commits on main** (the repo's cycle pattern): `e5bf112` fix (audit fixes — round-trip guard, DeviceCategoryId, dedups; intermediate tree verified green in isolation: 15 files/165), `a8c501f` feat (the six nav-main marketing pages, D17 close-out), `1ccb931` docs (the lockstep sweep + 33 screenshots).
4. **Pushed via `docs/ssh_git_wrapper_v3.py`** (paramiko shim deployed, key fingerprint-checked, dry-run first) — **remote verified: refs/heads/main @ 1ccb931 == local HEAD**, fast-forward from 5ea2703, no new branch. Operator key shredded; no key material in any commit; working tree clean.

The clone now models every top-level nav destination's reference page family — a functional superset with visual parity, mobile navigation confirmed working with zero Tailwind v4 display-toggling defects.
