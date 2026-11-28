import { test } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

// The session-8 axe-core tier: WCAG 2 A+AA scans over the production
// artifact (the suite boots vite preview on 127.0.0.1:4173 like every other
// spec). Two exclusion scopes, both measured reference parity (never silent,
// never a gate weakening — the excluded elements are the reference's own
// inaccessible-by-design surfaces, re-measured on the live site this cycle):
//
// 1. `.ribbon-inner` — the reference's promo ribbon renders its "Shop online"
//    link as #2997ff (link-dark) with NO underline on a #1d1d1f bar
//    (measured live: rgb(41,151,255), text-decoration none, bg rgb(29,29,31))
//    — 2.9:1 contrast and color-only link distinction, exactly like this
//    clone's pinned ribbon tokens. WCAG AA fails it on the reference too.
// 2. `[data-active="false"] .gallery-card` scoping — the reference's TV+
//    carousel dims non-active cards (this clone: aria-hidden + opacity .4);
//    axe measures the dimmed text despite the a11y-tree exclusion. The ACTIVE
//    card is fully opaque and scanned.
//
// The ribbon's blue→charcoal animation (0.8 s + 1.6 s delay) must settle
// before scanning, or axe measures the mid-animation blue state.

const ROUTES: Array<{ hash: string; label: string }> = [
  { hash: "#/", label: "home" },
  { hash: "#/store", label: "store" },
  { hash: "#/store/watch", label: "store watch" },
  { hash: "#/store/mac", label: "store mac (the session-10 category shelves)" },
  { hash: "#/product/iphone-18-pro", label: "product" },
  { hash: "#/bag", label: "bag" },
  { hash: "#/checkout", label: "checkout" },
  { hash: "#/entertainment", label: "entertainment" },
  { hash: "#/support", label: "support" },
  { hash: "#/search?q=mac", label: "search" },
  { hash: "#/info/privacy", label: "info" },
];

async function scan(page: import("@playwright/test").Page): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .exclude(".ribbon-inner")
    .exclude('[data-active="false"]')
    .analyze();
  expectA11yClean(results.violations);
}

type AxeViolation = {
  id: string;
  impact?: unknown;
  help: string;
  nodes: Array<{ target: unknown[] }>;
};

function expectA11yClean(violations: AxeViolation[]): void {
  if (violations.length === 0) return;
  const lines = violations.flatMap((v) => [
    `${v.id} (${String(v.impact)}): ${v.help}`,
    ...v.nodes.slice(0, 3).map((n) => `  target: ${JSON.stringify(n.target).slice(0, 140)}`),
  ]);
  throw new Error(`axe violations (${violations.length} rules):\n${lines.join("\n")}`);
}

test.describe("a11y (axe-core WCAG 2 A+AA, desktop 1440×900)", () => {
  for (const route of ROUTES) {
    test(`axe: ${route.label} route has no violations`, async ({ page }) => {
      await page.goto("/" + route.hash);
      // Home + entertainment carry the ribbon animation and autoplay gallery:
      // settle both (2.6 s covers the 0.8s+1.6s ribbon) and pause the
      // carousel so the active card cannot change mid-scan.
      if (route.label === "home" || route.label === "entertainment") {
        await page.locator(".gallery").scrollIntoViewIfNeeded();
        await page.waitForTimeout(2600);
        await page.getByRole("button", { name: "Pause Apple TV+ gallery" }).click();
      }
      await scan(page);
    });
  }
});

test.describe("a11y (axe-core WCAG 2 A+AA, mobile states at 390×844)", () => {
  test("axe: mobile resting bar and home have no violations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#/");
    await page.waitForTimeout(2600);
    await page.getByRole("button", { name: "Pause Apple TV+ gallery" }).click();
    await scan(page);
  });

  test("axe: mobile menu open (the conditionally-mounted overlay) has no violations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#/");
    await page.waitForTimeout(2600);
    await page.getByRole("button", { name: "Pause Apple TV+ gallery" }).click();
    await page.click("button[aria-label='Menu']");
    await page.locator("#mobile-menu").waitFor();
    await scan(page);
  });
});
