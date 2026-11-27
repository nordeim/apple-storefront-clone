I'll internalize the operating instructions and work through this systematically. This is a large multi-phase task, so let me first set up a tracking plan and then check the workspace state.
The workspace has been reset (empty git repo, no remote). I'll clone the repository fresh.
仓库已克隆。现在我来阅读关键文档：`docs/reference-investigation.md`、`skills/skills-catalog.md` 和 `package.json`。
The catalog is large. Let me grep for the specific skills I need.
Now let me read the core skill files. Starting with the documentation skills.
Now the architecture doc skill and tailwind/tdd skills.
现在让我探索一下实际的源代码结构。
This reveals a critical finding already: the repo was recently rewritten as a Vite+React SPA ("sonnet 5.5 v1"), but stale config files from a previous Next.js app (ely-beauty) remain. Let me examine the remaining infrastructure files.
The `.env.example` is from the old ElyBeauty app — a major mismatch. Let me examine the recent commits to understand what changed.
The history is now clear: commit `eb47784` ("sonnet 5.5 v1") replaced the old Next.js ElyBeauty app with the Vite+React Apple clone SPA, leaving stale infra files behind. Let me check the remaining infra docs.
This is a review/remediation cycle. Now let me audit the core source files, starting with the mobile navigation focus area and the Tailwind v4 CSS setup.
Now the GlobalNav component — the mobile navigation focus area.
The nav uses custom `nav:` breakpoint variants. Let me check the Tailwind-V4-Validation-Report in docs — it likely documents the exact bug the user references.
The trap log documents classic v4 engine traps. Let me scan the current source for those patterns and read the remaining core files.
All three docs are confirmed stale (ElyBeauty). Let me review the remaining lib seam and pages quickly.
I spotted a possible syntax anomaly in router.ts (`const ead, arg, ...rest]`). Let me verify with the Read tool.
The file is actually fine (terminal rendering artifact). Now let me set up the environment: install deps and clone the homenest reference repo in parallel.
The homenest trap log reveals the key Tailwind v4 mobile-nav bug pattern (JS-toggling display utilities). Now let me run the baseline gates on this codebase.
Build failed — let me see the actual error.
Root cause confirmed: `postcss.config.mjs` references uninstalled `@tailwindcss/postcss` — a vestigial ElyBeauty config that breaks the build. Let me verify this is the only blocker by temporarily moving it aside.
Build works when the stale config is removed (I restored it pending the remediation plan). Let me check the Tailwind CSS output for bloat from the un-excluded `skills/` folder.
Confirmed: `.bg-red`, `.container`, `.w-96` etc. come from the un-excluded skills scan — CSS bloat. Let me check if public/images is even referenced by the current code.
23MB of dead ElyBeauty images ship to `dist/` on every build, referenced nowhere. Let me finish reading the remaining components.
Smoke test is solid but uses raw playwright, not `@playwright/test`. Now let me set up PostgreSQL using the repo script (per user instruction) and start the dev server.
PostgreSQL 17 is running rootless. Now let me learn the agent-browser skill for the visual checks.
agent-browser is available. Let me start the dev server and run the visual/functional checks.
Another confirmed bug: Vite's dep scanner tries to resolve `three` imported by `skills/design/.../reference.html` — skills/ pollutes the build. Now let me check the app visually with agent-browser.
Page loads but shows no interactive elements — possible React render failure. Let me check console errors.
The app renders NOTHING on the dev server — root is empty. Let me investigate this critical failure.
`/src/index.css` returns **500** in dev — that's the render-killer. Let me see the error.
Root cause chain fully confirmed: the stale `postcss.config.mjs` breaks dev AND build — the dev server ships a blank page. Let me verify the app renders correctly once it's removed, then run the mobile-menu check.
Vite needs a restart to pick up the config removal. Let me restart the dev server.
App now renders. Now the critical mobile navigation menu check at 390×844.
Mobile nav shows correctly (hamburger, logo, bag). Now let me open the menu and verify its behavior.
Menu opens with all 11 links + Search. Let me capture a screenshot to visually verify it, then test menu navigation.
Navigation works and the menu closes. Let me visually inspect the screenshot.
I can't view images in this session, so I'll verify the menu geometry via computed styles instead (visual verification will come through the screenshots deliverable).
Mobile menu geometry is verified correct. Now let me check desktop nav and run the full smoke test baseline with playwright.
Desktop nav verified. Now let me run the full e2e smoke baseline against the built app.
Smoke test passes 45/45 once the stale config is gone. Let me complete the source audit with the remaining lib and page files.
Source audit is complete. Now let me read the remaining required skills: the SSH push wrapper instructions, TDD, and the two distill skills.
No ssh binary or paramiko yet. Let me install paramiko and check the pip situation.
paramiko installed. Now let me extract the key audit principles from the web-application skill.
The audit is complete. Now let me write the comprehensive remediation plan document with the detailed ToDo list.
Plan validated against the codebase. Now executing Phase 1 — starting with the critical build fixes.
T1/T4/T5 done. Now T2 — the vite.config.ts fix.
Now T3 — the Tailwind `@source` exclusions in index.css.
Massive verified improvement: CSS 136KB→31.6KB, build 4.7s→1.3s, dist 404KB→300KB, zero unused classes. Now T6 — install the lint/test toolchain properly.
Now let me wire the gate scripts into package.json.
Now T7 — the new ESLint flat config. Let me check what's available in the installed packages first.
The react-hooks recommended config is eslintrc-style. Let me check its flat-config export shape.
Lint gate is green (0 errors). Now T8 — the proper Playwright suite. Writing the config first.
Now the three spec files, ported from the verified smoke battery.
Now the corrected tsconfig.tests.json and the full test gate run.
The webServer timed out. Let me test the preview server manually to diagnose.
Found it — preview binds to IPv6 `localhost` only in this sandbox. Fix: bind explicitly to `127.0.0.1`.
19/21 pass. The 2 failures are my spec shortcut — "Check Out" lives on the bag page, not the product page. Let me fix the flow.
All 21 e2e tests pass — Phase 1 complete. Moving to Phase 2 with TDD: the sitemap seam test FIRST (RED).
RED confirmed. Now the implementation (GREEN).
The test drives the design: home should be the clean base URL. Fixing routeUrl.
Sitemap seam is green. Now T10 — the sitemap generator script.
No tsx/vite-node binaries — I'll write the generator using Vite's own module loader (the repo's toolchain).
Sitemap: 82 routes, valid XML. Now T11 — robots.txt and the SEO meta in index.html.
Now T12 — verify the app reads no env vars, then write the matching .env.example.
Confirmed — the SPA reads zero env vars. Writing the honest .env.example:
Phase 2 complete. Updating .gitignore for the new test artifacts, then starting Phase 3 docs.
Now Phase 3 — the documentation set. First, let me gather the exact facts (versions, test counts) for the docs.
Now writing the enhanced README.md.
Now AGENTS.md — compact, high-signal.
Now CLAUDE.md per the claude-md skill's required template.
Now the big one — Project_Architecture_Document.md per the PAD skill structure.
Now docs/DEPLOYMENT.md — let me check the old one's section structure to mirror the field-tested format.
Now adapt docker-compose.yml to this repo's contract.
Now updating the reference-investigation.md verification ledger.
Now let me study the two distill skills before creating the project SKILL.
Let me gather the last facts (z-index map, TS interfaces) for the SKILL document.
Now let me append the session entry to worklog.md, matching its format.
The worklog format is clear. Appending this session's entry as Task 113.
Worklog appended. Now T21 — capturing the screenshot set for the remediated dev server.
All 10 screenshots validated. Let me clean up two redundant `@source` lines in index.css.
Now the final full gate (T22).
Full gate is green. The artifact grew slightly with SEO meta (299.8→301.5 kB) — sweeping the measured numbers in docs for lockstep.
All gates green and docs swept. Now T23 — the atomic commits. Let me review the working tree state.
The deletions are already staged via git rm. Committing directly.
All 5 commits on main. Now T24 — the SSH wrapper push. Setting up the key and paramiko shim.
Key verified. Now the wrapper dry-run with the shim on PATH.
Dry-run green — authentication works, fast-forward confirmed. Now the real push.
Push verified — remote main @ 059f675 == local HEAD. Shredding the operator key per the runbook.
All done — tree clean, pushed, key shredded. Final verification sweep before the summary.
All verified — the only "TODO" matches are the rules' own prose. The task is complete. Here is the final report:

---

## Audit → Remediation → Delivery (all evidence-backed)

**What was wrong (Mode C audit of the `sonnet 5.5 v1` code-drop):** the code replacement left the old Next.js app's infrastructure in place. 2 CRITICAL + 4 HIGH findings:

- **CRITICAL — build broken, dev served a blank page**: stale `postcss.config.mjs` referenced an uninstalled `@tailwindcss/postcss` plugin (Vite's CSS pipeline died → `#root` empty). One 5-line leftover file was the entire outage.
- **HIGH — Tailwind v4 defects**: the vendored `skills/` folder sat inside Vite's dep-scan (died on `three` from a skills HTML template) and Tailwind's auto-content-detection (136,456-byte CSS / 1,885 rules — 77% was prose leakage); 23 MB dead imagery shipped to `dist/`; dead Playwright config aimed at the old app's specs; no ESLint gate.
- **MEDIUM**: stale `.env.example` (old app's Stripe/AUTH_SECRET), no sitemap/robots/OG, stale `next.config.ts`/`prisma/`/`scripts/`, and a 400 KB docs set describing the previous application.

**Mobile navigation (your focus — verified working):** agent-browser at 390×844 confirmed the menu opens (48px bar, full-bleed panel, 28px/600 links, all 11 links + Search), navigates, and closes correctly. The mobile menu mounts via React state — the Tailwind v4 display-toggling trap class is **not** present; the real v4 bugs in this repo were the PostCSS leftover and unscoped source scanning.

**Remediation (TDD, per [docs/REMEDIATION_PLAN.md](/home/z/my-project/apple-storefront-clone/docs/REMEDIATION_PLAN.md)):**
- CSS **136,456 → 31,632 bytes** (1,885 → 476 rules), build 4.7 → 1.3 s, artifact 404.7 → 301.5 kB
- New: ESLint 10 gate, rewritten Playwright suite anchored to the production build (**21/21**), sitemap seam TDD'd (6 tests) generating **82 routes**, robots.txt, OG/JSON-LD, honest `.env.example`
- PostgreSQL 17 installed rootless per `docs/setup_pg_z.sh` (verified accepting connections; SPA uses no DB — documented honestly)
- Full documentation set rewritten: [README.md](/home/z/my-project/apple-storefront-clone/README.md), [AGENTS.md](/home/z/my-project/apple-storefront-clone/AGENTS.md), [CLAUDE.md](/home/z/my-project/apple-storefront-clone/CLAUDE.md), [Project_Architecture_Document.md](/home/z/my-project/apple-storefront-clone/Project_Architecture_Document.md), [docs/DEPLOYMENT.md](/home/z/my-project/apple-storefront-clone/docs/DEPLOYMENT.md), [apple-storefront-clone_SKILL.md](/home/z/my-project/apple-storefront-clone/apple-storefront-clone_SKILL.md), 10 screenshots in `docs/screenshots/`, worklog Task 113

**Final gate (all green):** lint 0 errors · typecheck clean ×2 · **50/50 unit** · single-file build · **21/21 e2e** · **45/45 smoke, zero console errors**.

**Pushed:** 5 atomic Conventional Commits to `main` (`f49ec42…059f675`) via `ssh_git_wrapper_v3.py` — remote verified `059f675 == HEAD`; deploy key shredded after use. `docs/sample_DEPLOYMENT.md` doesn't exist in this repo, so DEPLOYMENT.md follows the field-tested structure the existing guide was derived from, rewritten for this codebase.

**Deferred/unknowns:** Safari/Firefox/real-touch/screen-reader verification (no environment), OG/canonical origin tags need pointing at the real deploy origin, and hash-routing limits per-route SEO (documented in ADR-007). Suggested next step: a fresh-clone `npm install && npm run gate` run on your side to confirm the clean-clone experience.
