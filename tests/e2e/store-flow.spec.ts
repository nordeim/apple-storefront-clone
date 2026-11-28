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

  test("store index renders the seven measured editorial rails in order", async ({ page }) => {
    // Session-9 parity surface: the reference's /sg/store body is seven
    // editorial rails; the clone's superset product grid follows below.
    await page.goto("/#/store");
    const headers = page.locator(".store-rail-header");
    await expect(headers).toHaveCount(7);
    await expect(headers.first()).toHaveText(/The latest\. Wonderful and colourful choices\./);
    await expect(headers.nth(1)).toHaveText(/Personalisation\. Leave a lasting impression\./);
    await expect(headers.nth(2)).toHaveText(/Holiday picks\. Get them all decked out\./);
    await expect(headers.nth(3)).toHaveText(/Colourful finds\. Delight up the holiday season\./);
    await expect(headers.nth(4)).toHaveText(/Home essentials\. More room to amaze\./);
    await expect(headers.nth(5)).toHaveText(/Only at Apple\. The total package\./);
    await expect(headers.nth(6)).toHaveText(/Savings and offers\. Exclusive deals, special stores and more\./);
    // "The latest." carries the reference's twelve measured product cards.
    const latestCards = page.locator(".rail-scroller").first().locator("li");
    await expect(latestCards).toHaveCount(12);
    // A catalog-matched rail card navigates to the clone's product page.
    const iPhoneCard = latestCards.filter({ hasText: "iPhone 18 Pro" }).first();
    await expect(iPhoneCard.locator("a")).toHaveAttribute("href", "#/product/iphone-18-pro");
    await iPhoneCard.locator("a").click();
    await expect(page).toHaveURL(/#\/product\/iphone-18-pro$/);
    await expect(page.getByRole("heading", { level: 1, name: "iPhone 18 Pro" })).toBeVisible();
  });

  test("store quick-links strip renders between the h1 and the chip row", async ({ page }) => {
    // The reference's measured store-page order: h1 → quick links → chips.
    await page.goto("/#/store");
    const strip = page.locator(".store-quick-links");
    await expect(strip).toBeVisible();
    await expect(strip.getByRole("link")).toHaveCount(5);
    for (const label of ["Shop Gifts", "Find a Store", "AirPods", "Apple Intelligence", "Apple Trade In"]) {
      await expect(strip.getByRole("link", { name: label })).toBeVisible();
    }
    // The AirPods quick link routes to the clone's category page.
    await expect(strip.getByRole("link", { name: "AirPods" })).toHaveAttribute("href", "#/store/airpods");
    // The superset grid section follows the rails (the working store below
    // the parity surface).
    await expect(page.getByRole("heading", { name: "All products." })).toBeVisible();
  });

  test("category page renders its measured shelf model with working buy deep links", async ({ page }) => {
    // Session-10 parity surface: the reference's /sg/shop/buy-mac body is a
    // shelf sequence; the clone's superset product grid follows below.
    await page.goto("/#/store/mac");
    const headers = page.locator(".store-rail-header");
    await expect(headers).toHaveCount(7);
    await expect(headers.first()).toHaveText(/All models\. Take your pick\./);
    await expect(headers.nth(1)).toHaveText(/Mac picks\. More power to them\./);
    await expect(headers.nth(2)).toHaveText(/Ways to save\. Find what works for you\./);
    await expect(headers.nth(3)).toHaveText(/Only at Apple\. The total package\./);
    await expect(headers.nth(6)).toHaveText(/Savings and offers\. Exclusive deals, special stores and more\./);
    // "All models." carries the clone's catalog Macs (D12) + the measured
    // COMPARE editorial card.
    const firstShelf = page.locator(".rail-scroller").first();
    await expect(firstShelf.locator("li")).toHaveCount(3);
    // The measured per-product tag renders on the MacBook Pro (M6) card.
    const proCard = firstShelf.locator("li").filter({ hasText: "NEW 14” WITH M6" }).first();
    await expect(proCard.getByText("NEW 14” WITH M6")).toBeVisible();
    await expect(proCard.getByText(/From S\$/)).toBeVisible();
    // The superset grid follows the shelves (the working store below).
    await expect(page.getByRole("heading", { name: "All products." })).toBeVisible();
    // The Buy pill deep-links the working configurator.
    await expect(proCard.getByRole("link", { name: /Buy MacBook Pro/ })).toHaveAttribute("href", "#/product/macbook-pro-m6?buy");
    await proCard.getByRole("link", { name: /Buy MacBook Pro/ }).click();
    await expect(page).toHaveURL(/#\/product\/macbook-pro-m6\?buy$/);
    await expect(page.locator("#configure-heading")).toBeFocused();
  });

  test("over-long rail labels navigate to their info page, not the 404", async ({ page }) => {
    // S10-1 regression pin: nine session-9 rail labels slugify past the
    // router's old 60-char cap and landed on the 404 page; the cap now
    // covers every measured label (longest 126) and the round-trip specs
    // guard the boundary.
    await page.goto("/#/store");
    const card = page
      .locator(".rail-scroller li")
      .filter({ hasText: "Beats 360 Over‑Ear Headphones – Pink" })
      .first();
    await card.locator("a").first().click();
    await expect(page).toHaveURL(/#\/info\/beats-360-over-ear-headphones-pink-with-pink-performance-knit-cushions$/);
    await expect(page.getByRole("heading", { level: 1, name: "Beats 360 Over‑Ear Headphones – Pink with Pink Performance Knit Cushions" })).toBeVisible();
  });

  test("airpods page renders the measured marketing model with the configurator deep link", async ({ page }) => {
    // Session-11 parity surface (D14): the nav's AirPods destination is the
    // reference's /sg/airpods/ marketing family — chapternav → sr-only h1 →
    // three heroes → compare → consider → music, with the superset below.
    await page.goto("/#/store/airpods");
    await expect(page).toHaveTitle("AirPods - Apple (Singapore)");
    await expect(page.getByRole("heading", { level: 1, name: "AirPods", exact: true })).toBeAttached();
    const chapternav = page.locator(".airpods-chapternav");
    await expect(chapternav.getByRole("link")).toHaveCount(6);
    await expect(chapternav.getByRole("link", { name: "Compare" })).toHaveAttribute("href", "#/info/compare-airpods");
    const headlines = page.locator(".airpods-hero-headline");
    await expect(headlines).toHaveCount(3);
    await expect(headlines.first()).toHaveText("AirPods 5");
    await expect(headlines.nth(1)).toHaveText("AirPods Pro 3");
    await expect(headlines.nth(2)).toHaveText("AirPods Max 2");
    await expect(page.getByRole("heading", { name: "Compare AirPods models" })).toBeVisible();
    await expect(page.locator(".airpods-compare-column")).toHaveCount(4);
    await expect(page.getByRole("heading", { name: "Get to know AirPods." })).toBeVisible();
    await expect(page.locator(".airpods-feature-card")).toHaveCount(5);
    // D12: the catalog-matched hero's Buy deep-links the working configurator.
    const proHero = page.locator(".airpods-hero").nth(1);
    await expect(proHero.getByRole("link", { name: "Buy AirPods Pro 3" })).toHaveAttribute("href", "#/product/airpods-pro-3?buy");
    await proHero.getByRole("link", { name: "Buy AirPods Pro 3" }).click();
    await expect(page).toHaveURL(/#\/product\/airpods-pro-3\?buy$/);
    await expect(page.locator("#configure-heading")).toBeFocused();
  });

  test("accessories page renders the measured grid model with catalog-matched cards", async ({ page }) => {
    // Session-11 parity surface (D15): the reference's
    // /sg/shop/accessories/all — chapternav → gallery → curated tabs → value
    // props → index nav, with the superset below.
    await page.goto("/#/store/accessories");
    await expect(page).toHaveTitle("Accessories - Apple (Singapore)");
    await expect(page.getByRole("heading", { level: 1, name: "Accessories", exact: true })).toBeVisible();
    await expect(page.locator(".accessories-chapternav a")).toHaveCount(9);
    await expect(page.getByRole("heading", { name: "Say hello to what’s new." })).toBeVisible();
    await expect(page.locator(".accessories-gallery-card")).toHaveCount(8);
    await expect(page.getByRole("heading", { name: "Our top picks. Their next favourites." })).toBeVisible();
    // The gallery's Apple TV 4K Buy CTA routes to the clone's product page.
    const tvCard = page.locator(".accessories-gallery-card").filter({ hasText: "Apple TV 4K" });
    await expect(tvCard.getByRole("link", { name: "Buy Apple TV 4K" })).toHaveAttribute("href", "#/product/apple-tv-4k?buy");
    // The value props + the index nav.
    await expect(page.getByRole("heading", { name: "Why Apple is the best place to buy accessories." })).toBeVisible();
    await expect(page.locator(".accessories-value-props li")).toHaveCount(4);
    await expect(page.getByRole("heading", { name: "Shop by Product" })).toBeVisible();
    await expect(page.locator(".accessories-index-nav a")).toHaveCount(24);
    // The superset grid follows (the working store below).
    await expect(page.getByRole("heading", { name: "All products." })).toBeVisible();
  });

  test("accessories curated tabs switch panels and catalog-matched cards route to products", async ({ page }) => {
    // The WAI-ARIA tabs pattern (session-11): five tabs over the measured
    // card sets; the three catalog-matched cards derive their prices (D10)
    // and route to the clone's product pages.
    await page.goto("/#/store/accessories");
    const tabs = page.locator(".accessories-tab");
    await expect(tabs).toHaveCount(5);
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
    // The Holiday Picks panel carries its measured 11 items.
    await expect(page.locator("#accessories-panel-0 .accessories-curated-card")).toHaveCount(11);
    // Switch to Travel Ready: the AirTag 4 pack card routes to the product
    // page and quotes the catalog's price (S$135, not the reference's S$149
    // — the money seam's whole-price grammar drops the cents).
    await tabs.nth(2).click();
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
    const airTagCard = page.locator("#accessories-panel-2 .accessories-curated-card").filter({ hasText: "AirTag 4 pack" });
    await expect(airTagCard.getByText("S$135")).toBeVisible();
    await expect(airTagCard.locator("a")).toHaveAttribute("href", "#/product/airtag-4-pack");
    // Keyboard operation: ArrowLeft from Travel Ready lands on Colourful Finds.
    await tabs.nth(2).focus();
    await page.keyboard.press("ArrowLeft");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#accessories-panel-1 .accessories-curated-card")).toHaveCount(11);
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
    // The popstate path (back, then forward) re-enters the same ?buy route
    // through the hash router without a shell focus steal.
    await page.goBack();
    // Back lands on the bare entry URL (the browser collapses the hash);
    // the app renders home.
    await expect(page.getByRole("heading", { name: /Gifts they/ })).toBeVisible();
    await page.goForward();
    await expect(page).toHaveURL(/#\/product\/iphone-duo\?buy$/);
    await expect(page.locator("#configure-heading")).toBeVisible();
    expect(await page.evaluate(() => document.activeElement?.id)).toBe("configure-heading");
  });

  test("?buy on a ghost product still resets focus to main (404 path)", async ({ page }) => {
    // The App.tsx focus gate's false branch: an in-app navigation to an
    // unknown product id degrades to not-found, and the shell's standard
    // focus reset runs (the Configurator that would own focus never mounts).
    // Fresh loads never move focus (the effect's isNavigation guard), so the
    // pin drives an in-app hash navigation.
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Gifts they/ })).toBeVisible();
    await page.evaluate(() => {
      window.location.hash = "#/product/ghost?buy";
    });
    await expect(page.getByText("We couldn’t find that page.")).toBeVisible();
    expect(await page.evaluate(() => document.activeElement?.id)).toBe("main");
  });
});
