I'll start by internalizing the operating instructions, then work through this comprehensive task systematically. Let me set up a TODO plan first.
Repo cloned. Now reading core documentation files:
Core docs read. Now reading PAD, REMEDIATION_PLAN, worklog, and session_4:
Now reading REMEDIATION_PLAN.md, worklog.md, and session_4.md:
文档已完全理解。现在正在对照实际代码库验证理解——检查源结构、配置，以及是否存在引用的技能：
Now validating the codebase structure — configs, package.json, and key source files:
Configs validated — vitest + playwright already wired. Installing dependencies and running baseline gates:
Baseline lint/typecheck/unit green exactly as documented (8 files / 86 tests). Now build, e2e, smoke:
Smoke battery failed — investigating:
Playwright browsers need installing in this fresh environment:
All baseline gates green exactly as documented (86 unit · 25 e2e · 45 smoke · 309.56 kB). Now setting up PostgreSQL:
PostgreSQL 17 running and accepting connections. Now reading audit skills and launching the code audit:
Audit methodology internalized. Now launching parallel work: (a) read-only code-audit subagent on the recent changes, (b) cloning the homenest-store-s reference repo:
审计已完成：**0 个严重/高/中等问题 · 2 个低级别 · 4 个信息**（PAD §7.1 陈旧计数；路由标题与 H1 标签不一致；?buy 子字符串匹配；无效 CSS；悬空的 aria-controls；重复的袋行渲染）。现在正在审查 homenest-store-s 参考模式：
homenest patterns noted (static responsive pairs rule, v4 trap-log discipline — both already applied in the apple repo). Now the live parity pass. Loading the agent-browser skill:
Dev server up. Beginning the mobile navigation verification (the standing focus) at 390×844:
Bar geometry byte-equal to the reference pins (logo x=0, Search x=246, Bag x=294, Menu x=342, all 48px). Opening the mobile menu:
Mobile nav verified: opens, expands, navigates, closes. Now comparing against the live reference site:
Region modal present — closing it and re-measuring:
Reference bar pins confirmed (logo w=49, Search x=246, Bag x=294) — its menu is already open. Comparing accordion structure:
Footer accordion buttons matched — my query wasn't scoped. Re-scoping to the menu dialog:
Reference menu stuck in base state (known environment artifact; session-4's fresh capture remains the evidence). Switching to desktop flyout spot-checks on the reference for new drift:
Nav order parity confirmed. Checking the reference's Home flyout (hover) for content drift since session 4:
Reference hover is flaky in this environment — but the full flyout DOM is present (200 links). Extracting per-category models directly from the reference DOM:
Reference's current Home flyout = exactly the clone's session-4 model (16 links, 3 sections) — no drift. Checking Mac + iPhone flyouts and the store chip row:
Now reading the clone's seam model for comparison:
Clone's Mac/iPhone/Home flyout models match the current reference DOM exactly. Running the full 11-flyout sweep:
Extracting headings too, then diffing programmatically against the clone's seam:
Full reference model captured with headings. Now writing a diff script to compare against the clone's seam:
All 14 "diffs" are NBSP (U+00A0) artifacts from the reference's `&nbsp;`. Normalizing and re-running:
The normalization only fixed the clone side. Fixing both sides:
**ALL 11 FLYOUTS MATCH** — the clone's seam is current with the live reference. Now checking the reference's store chip row:
Hidden-flyout DOM contaminates page-content measurement (known artifact). Spot-checking the reference's home ribbon + hero vs the clone:
Hero sequence matches ("Gifts they'll love." → iPhone Duo → iPhone 18 Pro). Checking promo tile order:
Apple Watch Series 12 found at y=2858 — the reference's 6-promo sequence (HomeView, iPad, Watch, MacBook Pro, MacBook Pro, AirPods Pro 3) matches the clone's exactly. Checking the TV+ gallery titles:
9/9 gallery titles match. Verifying the truncated item 5 full title:
Exact match on gallery item 5. The live-parity pass is complete — no content drift found. Reviewing App.tsx to verify the UI-1 finding before planning remediation:
UI-1 confirmed. Checking the SEO surface in index.html:
SEO surface verified (156 routes, robots stamped, OG/JSON-LD present, .env.example matches the codebase). Now reading the fix-target files before writing the remediation plan:
正在检查 e2e 规格卡点以进行修复的兼容性：
All findings verified. Writing the session-5 remediation plan into docs/REMEDIATION_PLAN.md:
Plan committed to the doc. Now executing TDD-first — S5-1: RED test for the route-title seam:
RED 已确认。正在实现 GREEN 接缝：
GREEN 10/10. Wiring App.tsx to the seam:
Restoring the still-needed imports for RouteView:
S5-1 complete — 96/96 unit tests. Now S5-2: RED tests for `hasBuyParam`:
RED confirmed. Implementing `hasBuyParam` in router.ts:
Now updating both consumers to use the exact grammar:
S5-2 GREEN (99/99). Now S5-3: removing dead CSS rules:
Now S5-4: gating aria-controls to mounted state in GlobalNav:
Now updating the three pinned spec locators that address the hamburger via aria-controls:
S5-4 done. Now S5-5: extracting the shared BagLineRow component:
The popover's scroll constraint got dropped — restoring it via a className prop:
Now updating CheckoutPage to consume the shared component:
All gates green. Now S5-6: pinning the store tab title in the store-flow spec:
Running the full gate on the remediated tree:
Full gate GREEN (99 unit · 26 e2e · 45 smoke · 309.24 kB). Measuring new CSS stats and live-verifying the touched surfaces on the dev server:
标题和 h1 现在保持一致。正在实时验证 `?buy` 深度链接和 aria-controls 门控：
aria-controls gating live-verified (absent closed / present open). All e2e already covers the bag-line rendering. Now capturing the 17-shot screenshot family:
所有 17 张截图已捕获并验证。现在开始文档同步清理——查找每个过时的计数：
Sweeping all doc files with the new counts (9 files/99 unit · 26 e2e · 309.2 kB · CSS 33.2 kB/501):
Now the PAD — viewing §7.1 (the audit's DOC-1) and updating with a v1.4 revision block:
Found more stale lines in PAD §3.2/§11 (deleted utils/cn.ts still listed, 123 URLs). Fixing with measured values:
PAD v1.4 done. Now updating apple-storefront-clone_SKILL.md to v1.4.0:
Now the reference-investigation ledger + DEPLOYMENT counts:
The earlier MultiEdit was atomic-failed — re-applying the reference-investigation.md ledger updates:
All doc ledgers updated. Writing worklog Task 117:
Worklog updated. Final gate re-run before committing:
Full gate green (9 files/99 · 26 e2e · 45 smoke · 309.24 kB). Making atomic commits:
正在修改 commit 3 中一个我发现的拼写错误（尚未推送）：
Tree clean, 3 atomic commits. Now setting up the SSH-wrapper push — reading the runbook:
Runbook internalized. Deploying the key (outside the repo) and checking for ssh/paramiko:
No ssh binary and no paramiko — installing paramiko and deploying the shim:
Now materializing the operator key to a 0600 file outside the repo and running the dry-run:
Dry-run passed (auth OK, fast-forward 4390746..9007507). Executing the real push:
Push verified — remote main @ 9007507 == local HEAD. Shredding the operator key and confirming clean state:
All verified. Let me do a final compliance check against the distill-skill conventions for the SKILL.md:
Adding the session-5 lessons to the SKILL.md per the distillation conventions:
Commit landed; the key was shredded after the first push — re-materializing for this final push:
All work complete and pushed. Final state verified:
Session 5 complete — pushed to `main` @ `179084f`, remote verified, key shredded.

**Baseline (verified on the fresh clone):** all documented gates green exactly as claimed (8 files/86 unit · 25 e2e · 45 smoke · 309.56 kB · sitemap 156 routes); PG 17 rootless installed via `docs/setup_pg_z.sh`.

**Audit (read-only, skills/ excluded):** 0 Critical/High/Medium · 2 LOW (PAD §7.1 stale counts; tab title vs h1 label divergence) · 4 INFO (?buy substring match, dead CSS, dangling aria-controls, duplicated bag-line block). 13/14 doc anchors PASS.

**Live parity vs apple.com/sg:** mobile navigation confirmed working at 390×844 (bar byte-equal, 11 accordion rows, expand/navigate/close, zero console errors — no Tailwind v4 bug). All eleven reference flyout models re-extracted from the live DOM and programmatically diffed against the seam: **all match, no drift**; hero/promo/gallery/nav sequences match.

**TDD remediation (RED→GREEN observed):** new `route-title` seam (tab title now matches "Shop Apple Watch" h1, e2e-pinned); exact `hasBuyParam` grammar; mount-gated `aria-controls`; shared `BagLineRow` component; dead CSS deleted; spec locators kept strong.

**Final gate:** lint 0 · typecheck ×2 · **9 files/99 tests** · build 309.2 kB (CSS 33,214 B/501 rules) · **26/26 e2e** · 45/45 smoke, zero console errors. 17 screenshots re-captured; PAD v1.4, SKILL v1.4.0, worklog Task 117, REMEDIATION_PLAN session-5 section — all in lockstep.

**Verified / Reasoned / Assumed:** gates, parity diff, live dev-server checks = **Verified**; homenest pattern reuse (static-pair rule) = **Reasoned**; deferred debt (a11y focus-trap/axe, error boundary) documented as before. Suggested next: fresh clone + `npm run gate`; next cycle could sweep the reference's editorial store/product-page depth.
