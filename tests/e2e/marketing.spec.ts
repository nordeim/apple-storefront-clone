import { expect, test } from "@playwright/test";

// Session-13 e2e pins — the six nav-main marketing pages (D17: the
// reference's /sg/{x}/ family rendered at #/{x}). The pins cover the Mac
// page's measured model (chapternav, tabbed line-up, value props, closing
// directory), the D10 price derivation on the Home page's line-up (the
// reference quotes S$399 for Apple TV 4K; this clone's catalog says From
// S$229) and the hero-led Vision page.

test("the Mac marketing page renders its measured model", async ({ page }) => {
  await page.goto("/#/mac");
  await expect(page).toHaveTitle("Mac - Apple (Singapore)");
  await expect(page.getByRole("heading", { level: 1, name: "Mac" })).toBeVisible();

  // chapternav: the measured 11 chips
  const chapternav = page.getByRole("navigation", { name: "Mac family" });
  await expect(chapternav.getByRole("link", { name: "MacBook Neo" })).toBeVisible();
  await expect(chapternav.getByRole("link", { name: "Shop Mac" })).toHaveAttribute("href", "#/store/mac");
  await expect(chapternav.getByRole("link", { name: "Accessories" })).toHaveAttribute("href", "#/store/mac/accessories");
  await expect(chapternav.getByRole("list").getByRole("link")).toHaveCount(11);

  // the line-up: the measured 4 filter tabs, 9 tiles in "All products"
  const tabs = page.getByRole("tablist", { name: "Product filter" }).getByRole("tab");
  await expect(tabs).toHaveText(["All products", "Laptops", "Desktops", "Displays"]);
  await expect(page.getByRole("tabpanel").getByRole("listitem")).toHaveCount(9);

  // the D10 derivation: the MacBook Pro (M6) tile quotes this clone's catalog
  const m6Tile = page.locator("li", { has: page.getByRole("heading", { name: "MacBook Pro 14″ a⁠n⁠d⁠ 1⁠6⁠″" }) });
  await expect(m6Tile).toContainText("From S$2,299");
  await expect(m6Tile.getByRole("link", { name: "Buy" })).toHaveAttribute("href", "#/product/macbook-pro-m6?buy");

  // the value props section (7 rows) and the closing directory
  await expect(page.getByRole("heading", { name: "Why Apple is the bestplace to shop Mac." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Mac" }).locator("..").getByRole("listitem").first()).toBeVisible();

  // the superset band routes to the store
  await expect(page.getByRole("link", { name: "Shop Mac" }).last()).toHaveAttribute("href", "#/store/mac");
});

test("the line-up tabs switch (the WAI-ARIA tabs pattern)", async ({ page }) => {
  await page.goto("/#/mac");
  const laptopsTab = page.getByRole("tab", { name: "Laptops" });
  await laptopsTab.click();
  await expect(page.getByRole("tabpanel").getByRole("listitem")).toHaveCount(4);
  // keyboard: ArrowRight from Laptops lands on Desktops
  await laptopsTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Desktops" })).toBeFocused();
  await expect(page.getByRole("tabpanel").getByRole("listitem")).toHaveCount(3);
});

test("the Home page's line-up derives catalog prices (D10) and deep-links the configurator (D12)", async ({ page }) => {
  await page.goto("/#/home");
  await expect(page).toHaveTitle("Home - Apple (Singapore)");

  // the reference quotes S$399 for the Apple TV 4K line-up card; this clone's
  // catalog says From S$229 — the derived price must win (D10).
  const tvTile = page.locator("li", { has: page.getByRole("heading", { name: "Apple TV 4K" }) });
  await expect(tvTile).toContainText("From S$229");
  await expect(tvTile).not.toContainText("S$399");
  await expect(tvTile.getByRole("link", { name: "Buy" })).toHaveAttribute("href", "#/product/apple-tv-4k?buy");

  // the HomeView tile derives too (the catalog's S$449, not the measured S$399)
  const hvTile = page.locator("li", { has: page.getByRole("heading", { name: "Apple HomeView" }) });
  await expect(hvTile).toContainText("From S$449");
});

test("the Vision page renders its hero-led statement family", async ({ page }) => {
  await page.goto("/#/vision");
  await expect(page).toHaveTitle("Apple Vision Pro - Apple (Singapore)");
  await expect(page.getByRole("heading", { level: 1, name: "Apple Vision Pro" })).toBeVisible();
  // the hero statement + its CTAs
  await expect(page.getByRole("heading", { name: "New powerful M5 chip and comfortable Dual Knit Band." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Buy" }).first()).toBeVisible();
});

test("the nav main links route to the marketing pages", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Global" }).getByRole("link", { name: "Mac", exact: true })).toHaveAttribute("href", "#/mac");
  await expect(page.getByRole("navigation", { name: "Global" }).getByRole("link", { name: "Home", exact: true })).toHaveAttribute("href", "#/home");
  // airpods keeps its session-11 marketing destination
  await expect(page.getByRole("navigation", { name: "Global" }).getByRole("link", { name: "AirPods" })).toHaveAttribute("href", "#/store/airpods");
  // the store stays one click away via the flyout's "Shop Mac"
  await page.getByRole("navigation", { name: "Global" }).getByRole("link", { name: "Mac", exact: true }).hover();
  await expect(page.getByRole("link", { name: "Shop Mac", exact: true }).first()).toHaveAttribute("href", "#/store/mac");
});
