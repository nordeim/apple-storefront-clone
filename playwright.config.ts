import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E — runs against the production single-file build
 * (`npm run build` then `vite preview`), so the suite exercises the same
 * artifact that ships. Two projects:
 *  - desktop-chromium (1440×900) — the reference-measurement viewport
 *  - mobile-navigation (iPhone 13 viewport/UA on Chromium) — the mobile
 *    nav/menu contract (WebKit is not installable in the target sandbox;
 *    the touch viewport is what this suite pins).
 * Run: npm run test:e2e
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  outputDir: "test-results",
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      testIgnore: /mobile-navigation\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile-navigation",
      testMatch: /mobile-navigation\.spec\.ts/,
      use: { ...devices["iPhone 13"], browserName: "chromium" },
    },
  ],
  webServer: {
    // --host 127.0.0.1: `vite preview` binds to `localhost` by default, which
    // resolves to ::1 on some hosts and never answers the 127.0.0.1 probe.
    command: "npm run build && npm run preview -- --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
