/**
 * Session-10 flyout drift harness (rebuilt from the session-6/9 pattern):
 * diffs a saved reference flyout-model extraction against the clone's
 * `flyoutSections()` seam via Vite ssrLoadModule.
 *
 * Usage:
 *   1. Extract the reference's models from the live nav (the eleven
 *      .globalnav-item containers; the Home flyout lives in the legacy
 *      `globalnav-item-tv` container) and save them as JSON mapping the
 *      item key (store/mac/.../tv/support) to [{heading, links[]}].
 *   2. node scripts/flyout-diff.mjs <reference-flyouts.json>
 */
import { createServer } from "vite";
import { readFileSync } from "node:fs";

/**
 * @typedef {{ heading: string, links: string[] }} RefSection
 * @typedef { RefSection[] } RefModel
 */

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  optimizeDeps: { entries: ["index.html"] },
});
try {
  const { flyoutSections, NAV_LINKS } = await vite.ssrLoadModule("/src/lib/site-content.ts");

  const refJson = process.argv[2];
  if (!refJson) {
    console.error("pass the reference extraction JSON path as argv[2]");
    process.exit(1);
  }
  const ref = /** @type { Record<string, RefModel> } */ (JSON.parse(readFileSync(refJson, "utf8")));

  const norm = (/** @type { string } */ s) => s.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  // The reference's Home flyout lives in the legacy `globalnav-item-tv`
  // container (documented in the session-4/8 logs: the tv-home naming).
  /** @type { Record<string, string> } */
  const REF_KEY = { home: "tv" };
  let mismatches = 0;
  for (const link of NAV_LINKS) {
    const seamSections = flyoutSections(link);
    const refModel = ref[REF_KEY[link.id] ?? link.id] ?? ref[link.label];
    if (!refModel) {
      console.log(`[diff] ${link.id}: NO REFERENCE EXTRACTION (check the extractor)`);
      mismatches++;
      continue;
    }
    /** @type {{ heading: string, links: { label: string }[] }[]} */
    const sections = seamSections;
    const seam = sections.map((s) => ({
      heading: norm(s.heading),
      links: s.links.map((l) => norm(l.label)),
    }));
    const refSections = refModel.map((s) => ({
      heading: norm(s.heading),
      links: s.links.map(norm),
    }));
    const a = JSON.stringify(seam);
    const b = JSON.stringify(refSections);
    if (a === b) {
      console.log(`[ok]   ${link.id}: ${seamSections.length} sections match`);
    } else {
      mismatches++;
      console.log(`[DIFF] ${link.id}:\n  seam: ${a.slice(0, 400)}\n  ref:  ${b.slice(0, 400)}`);
    }
  }
  console.log(mismatches === 0 ? "ALL FLYOUT MODELS MATCH" : `${mismatches} MISMATCH(ES)`);
  process.exit(mismatches === 0 ? 0 : 1);
} finally {
  await vite.close();
}
