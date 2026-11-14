// S118-2 — the console-error-count drift net (audit 118-a INFO-1)
//
// Audit 118-a found the standing "13 deliberate console.error boundary
// sites" narrative was stale: the measured reality on run-117's own green
// tree was already 14 call sites across 6 files (the count moved at
// run-115's review-catch remediation and the audit vocabulary copied the
// old number forward — the run-114 lesson repeating: an unpinned count is
// a debt that compounds quietly because narratives copy, they do not
// measure).
//
// These pins read the src/ tree directly (the S99-1 filesystem-derivation
// convention, like docs-counts, schema-defaults, and api-seam-counts):
// the deliberate-`console.error` geometry (exactly 14 call sites across
// exactly 6 enumerated files) and the boundary-logger discipline that
// makes the net non-vacuous — `console.error` is the ONLY sanctioned
// console method in src/ (every site is a deliberate catch/error boundary;
// a stray `console.log`/`debug`/`info`/`warn` call fails HERE, by file
// name, as does any growth of the error-site count that a doc narrative
// then miscounts.
//
// Call-site matching is paren-aware (`console.error(`), so prose mentions
// of "the console" or "browser console" inside comments stay legal.
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const SRC_ROOT = join(process.cwd(), "src");

/** Every .ts/.tsx file under src/ (recursively), relative-posix named. */
function listSourceFiles(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) out.push(full);
    }
  };
  walk(SRC_ROOT);
  return out.map((f) => relative(process.cwd(), f).split("\\").join("/"));
}

const sourceFiles = listSourceFiles();
const sources = new Map(
  sourceFiles.map((f) => [f, readFileSync(join(process.cwd(), f), "utf8")]),
);

const countMatches = (src: string, re: RegExp) => [...src.matchAll(re)].length;
// Stateless detectors (matchAll needs the g flag; a stateful global regex's
// lastIndex would leak between .test() calls and miss files — the S114 RED).
const errorCalls = (src: string) => countMatches(src, /console\.error\s*\(/g);
const strayCalls = (src: string) =>
  countMatches(src, /console\.(?:log|debug|info|warn|trace|dir|table)\s*\(/g);

const errorFiles = sourceFiles.filter((f) => errorCalls(sources.get(f) ?? "") > 0);
const errorSiteTotal = sourceFiles.reduce(
  (sum, f) => sum + errorCalls(sources.get(f) ?? ""),
  0,
);
const strayOffenders = sourceFiles.filter((f) => strayCalls(sources.get(f) ?? "") > 0);

describe("S118 — the console-error-count net (audit 118-a INFO-1)", () => {
  it("S118-2a: exactly 14 deliberate console.error call sites across exactly 6 files", () => {
    // The measured geometry (audit 118-a, independently re-measured this
    // cycle): 14 sites across 6 files —
    //   src/app/api/stripe/webhook/route.ts          ×8
    //   src/app/api/stripe/payment-intent/route.ts   ×2
    //   src/app/api/checkout/route.ts                ×1
    //   src/app/(storefront)/error.tsx               ×1
    //   src/lib/actions/admin.ts                     ×1
    //   src/lib/actions/reviews.ts                   ×1
    // A change here MUST update the live-tense narratives in the same
    // commit (the count-lockstep discipline this pin now enforces at the
    // source — the run-117 "13" drift can no longer recur silently).
    expect(errorFiles.length, "files carrying console.error calls").toBe(6);
    expect(errorSiteTotal, "total console.error call sites").toBe(14);
    expect(
      errorFiles
        .map((f) => `${f} ×${errorCalls(sources.get(f) ?? "")}`)
        .sort()
        .join("\n"),
      "the per-file console.error breakdown",
    ).toBe(
      [
        "src/app/(storefront)/error.tsx ×1",
        "src/app/api/checkout/route.ts ×1",
        "src/app/api/stripe/payment-intent/route.ts ×2",
        "src/app/api/stripe/webhook/route.ts ×8",
        "src/lib/actions/admin.ts ×1",
        "src/lib/actions/reviews.ts ×1",
      ]
        .sort()
        .join("\n"),
    );
  });

  it("S118-2b: no other console method is ever called in src/", () => {
    // The anchor that makes this net non-vacuous: console.error is the ONLY
    // sanctioned console method in src/ — every deliberate boundary logs
    // through it, and log|debug|info|warn|trace|dir|table calls are the
    // debug-noise class the boundary-logger discipline forbids. Prose
    // mentions of "the console" inside comments stay legal (call-site
    // matching only); a real stray call fails here by file name.
    expect(
      strayOffenders.map((f) => `${f} ×${strayCalls(sources.get(f) ?? "")}`),
      "stray console.* calls in src/ (console.error is the only sanctioned method)",
    ).toEqual([]);
  });
});
