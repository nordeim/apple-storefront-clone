import { expect, test } from "@playwright/test";

// Desktop contract (1440×900): reference-token parity, tile structure, flyouts,
// the TV+ gallery state machine, the holiday play/pause, and the duo reveal.
// Console errors/warnings fail the run — the app must boot clean.

test.describe("home (desktop)", () => {
  test("title, tiles and nav anatomy", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Apple (Singapore)");
    await expect(page.locator("button[aria-controls='mobile-menu']")).toBeHidden();
    await expect(page.locator(".section-hero .tile")).toHaveCount(3);
    await expect(page.locator(".section-promo .tile")).toHaveCount(6);
    await expect(page.locator("nav.globalnav-bar li")).toHaveCount(11);
  });

  test("flyout opens on hover and closes on leave", async ({ page }) => {
    await page.goto("/");
    await page.locator("a.globalnav-link", { hasText: "iPhone" }).hover();
    await expect(page.locator("#flyout-iphone")).toBeVisible();
    await expect(page.locator("#flyout-iphone a", { hasText: "iPhone 18 Pro" })).toBeVisible();
    await page.mouse.move(700, 500);
    await expect(page.locator("#flyout-iphone")).toHaveCount(0);
  });

  test("computed tokens match the reference measurements", async ({ page }) => {
    await page.goto("/");
    const css = await page.evaluate(() => {
      const g = (s: string, pr: string) => {
        const el = document.querySelector(s) as Element;
        return getComputedStyle(el)[pr as keyof CSSStyleDeclaration];
      };
      return {
        h: g(".section-hero h2", "fontSize"),
        hw: g(".section-hero h2", "fontWeight"),
        sub: g(".section-hero .tile-subhead", "fontSize"),
        btnR: g(".tile .button", "borderTopLeftRadius"),
        btnBg: g(".tile .button", "backgroundColor"),
        tileH: g(".section-hero .tile", "minHeight"),
        promoH: g(".section-promo .tile", "minHeight"),
        navH: g(".globalnav", "height"),
        promoH3: g(".section-promo h3", "fontSize"),
        footerBg: g(".footer", "backgroundColor"),
      };
    });
    expect(css).toEqual({
      h: "56px", hw: "600", sub: "28px", btnR: "980px", btnBg: "rgb(0, 113, 227)",
      tileH: "692px", promoH: "580px", navH: "44px", promoH3: "40px", footerBg: "rgb(245, 245, 247)",
    });
  });

  test("TV+ gallery autoplays, pauses and takes arrow keys", async ({ page }) => {
    await page.goto("/");
    await page.locator(".gallery").scrollIntoViewIfNeeded();
    await page.waitForTimeout(5200);
    const sel = await page.locator(".dotnav-dot[aria-selected=true]").getAttribute("id");
    expect(sel).not.toBe("tv-gallery-item-1-trigger");
    await page.getByRole("button", { name: "Pause Apple TV+ gallery" }).click();
    const s1 = await page.locator(".dotnav-dot[aria-selected=true]").getAttribute("id");
    await page.waitForTimeout(4600);
    expect(await page.locator(".dotnav-dot[aria-selected=true]").getAttribute("id")).toBe(s1);
    await page.locator(".dotnav-dot[aria-selected=true]").focus();
    await page.keyboard.press("ArrowRight");
    expect(await page.locator(".dotnav-dot[aria-selected=true]").getAttribute("id")).not.toBe(s1);
  });

  test("holiday tile play/pause toggles animation state", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByRole("button", { name: "Pause Holiday 2026 animation" }).click();
    await expect(page.locator("[data-tile-id=holiday-2026]")).toHaveAttribute("data-playing", "false");
  });

  test("duo subhead reveals in view", async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-tile-id=iphone-duo]").scrollIntoViewIfNeeded();
    await page.waitForTimeout(2200);
    await expect(page.locator(".duo-subhead.is-revealed")).toHaveCount(1);
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
