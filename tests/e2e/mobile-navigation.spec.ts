import { expect, test } from "@playwright/test";

// Mobile navigation contract (iPhone 13 viewport, touch): the hamburger opens
// the full-bleed menu, every reference link is present, navigation closes the
// menu, the menu's SEARCH row opens the overlay, and no route overflows
// horizontally. This is the suite that pins the mobile menu against
// regressions (including the Tailwind v4 display-toggling class of bug — the
// menu must mount/unmount via React state, never via JS-toggled utilities).

test.describe("mobile navigation (390×844, touch)", () => {
  test("hamburger opens the menu with all reference links", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("button[aria-controls='mobile-menu']")).toBeVisible();
    await expect(page.locator("a.globalnav-link", { hasText: "Entertainment" })).toBeHidden();
    await page.getByRole("button", { name: "Menu" }).click();
    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    for (const label of ["Store", "Mac", "iPad", "iPhone", "Watch", "Vision", "AirPods", "Home", "Entertainment", "Accessories", "Support"]) {
      await expect(menu.locator("a", { hasText: label })).toBeVisible();
    }
    await expect(menu.getByRole("button", { name: "Search" })).toBeVisible();
  });

  test("menu link navigates and closes the menu", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.locator("#mobile-menu a", { hasText: "Mac" }).click();
    await expect(page).toHaveURL(/#\/store\/mac$/);
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
  });

  test("menu SEARCH row opens the search overlay", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.locator("#mobile-menu").getByRole("button", { name: "Search" }).click();
    await expect(page.locator("#search-panel")).toBeVisible();
    await page.locator("#site-search").fill("macbook");
    await expect(page.locator("#search-panel a", { hasText: "MacBook Pro" }).first()).toBeVisible();
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
    for (const r of ["#/store", "#/bag", "#/checkout", "#/entertainment", "#/support", "#/product/macbook-pro-m6"]) {
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
