import { expect, test } from "@playwright/test";

// Store flow (desktop): live search, the product configurator, the bag and
// popover, GST-inclusive totals, Singapore checkout validation, order
// confirmation, order-status lookup, and hostile-route handling.

test.describe("store flow (desktop)", () => {
  test("live search and results page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Search apple.com" }).click();
    await page.locator("#site-search").fill("macbook");
    const hits = page.locator("#search-panel a", { hasText: "MacBook Pro" });
    expect(await hits.count()).toBeGreaterThanOrEqual(2);
    await page.locator("#site-search").press("Enter");
    await expect(page).toHaveURL(/#\/search\?q=macbook/);
    await expect(page.locator("main ul > li").first()).toBeVisible();
    await page.keyboard.press("Escape");
  });

  test("configurator changes price; add to bag; popover and bag page", async ({ page }) => {
    await page.goto("/#/product/iphone-18-pro?buy");
    await page.reload();
    // The ?buy deep link scrolls to the configurator, not the page top.
    await expect(page.locator("#configure-heading")).toBeVisible();
    await page.locator("label", { hasText: "512GB" }).click();
    await expect(page.getByText("S$2,099").first()).toBeVisible();
    await page.getByRole("button", { name: "Add to Bag" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Added iPhone 18 Pro" })).toBeVisible();
    await expect(page.locator(".globalnav-badge")).toHaveText("1");
    await page.getByRole("button", { name: /Shopping Bag/ }).click();
    await expect(page.locator("#bag-popover", { hasText: "iPhone 18 Pro" })).toBeVisible();
    await page.getByRole("link", { name: "Review Bag" }).first().click();
    await expect(page).toHaveURL(/#\/bag$/);
    await page.locator("select[id^='qty-']").selectOption("2");
    await expect(page.getByText("S$4,198").first()).toBeVisible();
    await expect(page.getByText("Includes GST (9%)")).toBeVisible();
  });

  test("checkout validation: errors, focus, then a confirmed order", async ({ page }) => {
    await page.goto("/#/product/iphone-18-pro?buy");
    await page.reload();
    await page.getByRole("button", { name: "Add to Bag" }).click();
    await page.getByRole("button", { name: /Shopping Bag/ }).click();
    await page.getByRole("link", { name: "Review Bag" }).first().click();
    await page.getByRole("link", { name: "Check Out" }).click();
    await page.getByRole("button", { name: "Place Order" }).click();
    await expect(page.locator("[role=alert]")).toHaveCount(5);
    expect(await page.evaluate(() => document.activeElement?.getAttribute("name"))).toBe("fullName");
    await page.fill("[name=fullName]", "Tan Wei Ming");
    await page.fill("[name=email]", "w@example.com");
    await page.fill("[name=phone]", "91234567");
    await page.fill("[name=address]", "1 Raffles Place");
    await page.fill("[name=postalCode]", "12345");
    await page.getByRole("button", { name: "Place Order" }).click();
    await expect(page.getByText("Postal codes in Singapore have 6 digits.")).toBeVisible();
    await page.fill("[name=postalCode]", "048616");
    await page.getByRole("button", { name: "Place Order" }).click();
    await expect(page).toHaveURL(/#\/confirmation\/EL-[A-Z0-9]{8}$/);
    await expect(page.getByTestId("order-number")).toHaveText(/^EL-/);
    await expect(page.locator(".globalnav-badge")).toHaveCount(0);
  });

  test("order-status lookup from the support page", async ({ page }) => {
    await page.goto("/#/product/iphone-18-pro?buy");
    await page.reload();
    await page.getByRole("button", { name: "Add to Bag" }).click();
    await page.getByRole("button", { name: /Shopping Bag/ }).click();
    await page.getByRole("link", { name: "Review Bag" }).first().click();
    await page.getByRole("link", { name: "Check Out" }).click();
    await page.fill("[name=fullName]", "Tan Wei Ming");
    await page.fill("[name=email]", "w@example.com");
    await page.fill("[name=phone]", "91234567");
    await page.fill("[name=address]", "1 Raffles Place");
    await page.fill("[name=postalCode]", "048616");
    await page.getByRole("button", { name: "Place Order" }).click();
    const orderNo = await page.getByTestId("order-number").textContent();
    await page.goto("/#/support");
    await page.fill("#order-lookup", orderNo ?? "");
    await page.getByRole("button", { name: "Check" }).click();
    await expect(page.getByText(`Order ${orderNo} is confirmed`)).toBeVisible();
  });

  test("hostile routes 404 and XSS payloads render as text", async ({ page }) => {
    await page.goto("/#/product/<img src=x onerror=alert(1)>");
    await page.reload();
    await expect(page.getByText("We couldn’t find that page.")).toBeVisible();
    await page.goto("/#/search?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E");
    await page.reload();
    expect(await page.locator("script", { hasText: "alert(1)" }).count()).toBe(0);
    await expect(page.getByText("<script>alert(1)</script>").first()).toBeVisible();
  });

  test("info page resolves a footer destination", async ({ page }) => {
    await page.goto("/#/info/privacy");
    await expect(page).toHaveTitle(/^Privacy/);
  });

  test("store tab title matches the store h1's full-form category label", async ({ page }) => {
    // The tab title and the visible h1 must share the STORE_CATEGORY_LABELS
    // map — "Shop Apple Watch", never the short category label.
    await page.goto("/#/store/watch");
    await expect(page).toHaveTitle("Shop Apple Watch - Apple (Singapore)");
    await expect(page.getByRole("heading", { level: 1, name: "Shop Apple Watch" })).toBeVisible();
    await page.goto("/#/store");
    await expect(page).toHaveTitle("Store - Apple (Singapore)");
  });

  test("in-app Buy CTA keeps the configurator heading focused", async ({ page }) => {
    // In-app navigation into ?buy (not a fresh load): the Configurator's
    // heading must own focus — the shell's <main> focus reset must not
    // steal it back on this path.
    await page.goto("/");
    await page.getByRole("link", { name: "Buy, iPhone Duo" }).first().scrollIntoViewIfNeeded();
    await page.getByRole("link", { name: "Buy, iPhone Duo" }).first().click();
    await expect(page).toHaveURL(/#\/product\/iphone-duo\?buy$/);
    await expect(page.locator("#configure-heading")).toBeVisible();
    expect(await page.evaluate(() => document.activeElement?.id)).toBe("configure-heading");
  });
});
