import { expect, test } from "@playwright/test";

// Mobile navigation contract (iPhone 13 viewport, touch): the bar layout
// matches the live reference (logo flush left; Search, Bag and the hamburger
// flush right), the hamburger opens the full-bleed accordion menu, every
// reference link is present, sections expand/collapse, navigation closes the
// menu, and no route overflows horizontally. This is the suite that pins the
// mobile menu against regressions (including the Tailwind v4 display-toggling
// class of bug — the menu and its sections mount/unmount via React state,
// never via JS-toggled utilities).

const LINKS = ["Store", "Mac", "iPad", "iPhone", "Watch", "Vision", "AirPods", "Home", "Entertainment", "Accessories", "Support"];

test.describe("mobile navigation (390×844, touch)", () => {
  test("bar layout: logo flush left, search + bag + hamburger flush right", async ({ page }) => {
    await page.goto("/");
    const logo = page.getByRole("link", { name: "Apple Singapore home" });
    await expect(logo).toBeVisible();
    expect((await logo.boundingBox())?.x).toBeLessThan(10);
    const menu = page.getByRole("button", { name: "Menu" });
    const menuBox = await menu.boundingBox();
    expect(menuBox?.x).toBeGreaterThan(320); // far right, 48px target
    expect(menuBox?.width).toBe(48);
    const search = page.getByRole("button", { name: "Search apple.com" });
    await expect(search).toBeVisible(); // in the mobile bar, as on the reference
    const bag = page.getByRole("button", { name: "Shopping Bag" });
    const [searchX, bagX] = await Promise.all([(await search.boundingBox())?.x, (await bag.boundingBox())?.x]);
    expect(searchX).toBeLessThan(bagX ?? Infinity);
    expect(bagX).toBeLessThan(menuBox?.x ?? Infinity);
  });

  test("hamburger opens the menu with all reference links", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("button[aria-controls='mobile-menu']")).toBeVisible();
    await expect(page.locator("a.globalnav-link", { hasText: "Entertainment" })).toBeHidden();
    await page.getByRole("button", { name: "Menu" }).click();
    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    for (const label of LINKS) {
      await expect(menu.locator("a", { hasText: label })).toBeVisible();
    }
    // the two-level structure: every flyout-bearing row carries an expand button
    for (const label of ["Store", "Mac", "iPhone", "Support"]) {
      await expect(menu.getByRole("button", { name: `${label} menu` })).toBeVisible();
    }
    // Entertainment has no flyout on the reference — no expand button for it
    await expect(menu.getByRole("button", { name: "Entertainment menu" })).toHaveCount(0);
  });

  test("menu link navigates and closes the menu", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.locator("#mobile-menu a", { hasText: "Mac" }).first().click();
    await expect(page).toHaveURL(/#\/store\/mac$/);
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
  });

  test("bar SEARCH button opens the search overlay on mobile", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Search apple.com" }).click();
    await expect(page.locator("#search-panel")).toBeVisible();
    await page.locator("#site-search").fill("macbook");
    await expect(page.locator("#search-panel a", { hasText: "MacBook Pro" }).first()).toBeVisible();
  });

  test("accordion section expands and collapses", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    const mac = page.getByRole("button", { name: "Mac menu" });
    await expect(mac).toHaveAttribute("aria-expanded", "false");
    await mac.click();
    await expect(mac).toHaveAttribute("aria-expanded", "true");
    // the section body carries the reference's three-section flyout content
    await expect(page.locator("#mac-menu-section p", { hasText: "Explore Mac" })).toBeVisible();
    await expect(page.locator("#mac-menu-section p", { hasText: "Shop Mac" })).toBeVisible();
    await expect(page.locator("#mac-menu-section p", { hasText: "More from Mac" })).toBeVisible();
    await expect(page.locator("#mac-menu-section a", { hasText: "Explore All Mac" })).toBeVisible();
    await expect(page.locator("#mac-menu-section a", { hasText: "MacBook Pro" }).first()).toBeVisible();
    await mac.click();
    await expect(mac).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#mac-menu-section")).toHaveCount(0);
  });

  test("accordion sub-link navigates and closes the menu", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("button", { name: "iPhone menu" }).click();
    await page.locator("#iphone-menu-section a", { hasText: "iPhone 18 Pro" }).click();
    await expect(page).toHaveURL(/#\/product\/iphone-18-pro$/);
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
  });

  test("menu geometry: flush below the 48px bar, full-bleed", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    const box = await page.locator("#mobile-menu").boundingBox();
    const link = await page.locator("#mobile-menu a").first().evaluate((el) => {
      const cs = getComputedStyle(el);
      return { fontSize: cs.fontSize, weight: cs.fontWeight, color: cs.color };
    });
    expect(box).toMatchObject({ x: 0, y: 48, width: 390 });
    expect(link).toEqual({ fontSize: "28px", weight: "600", color: "rgb(245, 245, 247)" });
  });

  test("mobile type scale and single-column promo grid", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".section-hero h2").first()).toHaveCSS("font-size", "32px");
    expect(
      (await page.locator(".section-promo").evaluate((el) => getComputedStyle(el).gridTemplateColumns)).split(" ").length,
    ).toBe(1);
  });

  test("footer directory collapses to the accordion", async ({ page }) => {
    await page.goto("/");
    await page.locator(".footer").scrollIntoViewIfNeeded();
    const acc = page.locator(".footer button[aria-expanded]").first();
    await acc.click();
    await expect(acc).toHaveAttribute("aria-expanded", "true");
  });

  test("no horizontal overflow on any route", async ({ page }) => {
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    for (const r of ["#/store", "#/bag", "#/checkout", "#/entertainment", "#/support", "#/product/macbook-pro-m6", "#/info/compare-mac"]) {
      await page.goto(r);
      await page.waitForTimeout(200);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        r,
      ).toBe(true);
    }
  });

  test("zero console errors or warnings on load", async ({ page }) => {
    const bad: string[] = [];
    page.on("console", (m) => { if (["error", "warning"].includes(m.type())) bad.push(m.text()); });
    page.on("pageerror", (e) => bad.push(`pageerror ${e.message}`));
    await page.goto("/");
    await page.waitForTimeout(800);
    expect(bad, bad.join(" | ")).toEqual([]);
  });
});
