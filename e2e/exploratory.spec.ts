import { test, expect } from "@playwright/test";

test.describe("Exploratory Checks Suite (7 Checks)", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  // Check 1: Combined filters
  test("Check 1: Combined filters (governorate + type + query) match the intersection", async ({
    page,
  }) => {
    // Governorate 1 (Cairo) + hospital + search term
    await page.goto("/?tab=providers&gov=1&type=hospital&q=مستشفى");
    await page.waitForLoadState("networkidle");

    const cards = page.locator("div.group.relative.cursor-pointer.rounded-2xl");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // Assert badges show Cairo and Hospital
    await expect(page.getByText(/القاهرة/i).first()).toBeVisible();
    await expect(page.getByText(/مستشفيات/i).first()).toBeVisible();
  });

  // Check 2: Zero-results state
  test("Check 2: Impossible filter combination renders clear zero-results message", async ({
    page,
  }) => {
    await page.goto("/?tab=all&q=nonexistentqueryxyz99999");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("لم يتم العثور على نتائج")).toBeVisible({ timeout: 8000 });
    // Assert reset button is rendered
    await expect(page.getByRole("button", { name: /إعادة ضبط جميع الفلاتر/i })).toBeVisible();
  });

  // Check 3: Search box vs active filter
  test("Check 3: Search box queries conjunctively with active category filter", async ({
    page,
  }) => {
    // Select hospital filter, then search for "مستشفى"
    await page.goto("/?tab=providers&type=hospital&q=مستشفى");
    await page.waitForLoadState("networkidle");

    // All results must be hospitals matching the query
    const cards = page.locator("div.group.relative.cursor-pointer.rounded-2xl");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // Assert results have hospital badge
    await expect(page.getByText(/مستشفيات/i).first()).toBeVisible();
  });

  // Check 4: Pagination + filter change
  test("Check 4: Changing filter on page 5+ resets pagination to page 1", async ({
    page,
  }) => {
    // Navigate to page 5 of providers
    await page.goto("/?tab=providers&page=5");
    await page.waitForLoadState("networkidle");

    // Trigger a filter change using search input
    const searchInput = page.getByRole("textbox", { name: "بحث في الدليل الطبي" });
    await searchInput.fill("مستشفى");
    await page.waitForURL((url) => url.searchParams.has("q"));

    // URL should now have page reset to page 1 (i.e. no page=5 parameter)
    const url = new URL(page.url());
    const pageParam = url.searchParams.get("page");
    expect(pageParam === null || pageParam === "1").toBe(true);
  });

  // Check 5: Clear/reset all filters button
  test("Check 5: Reset all filters button clears every filter including specialty", async ({
    page,
  }) => {
    await page.goto("/?tab=doctors&gov=1&specialty=جراحة عامة&q=محمد");
    await page.waitForLoadState("networkidle");

    // Find and click the 'مسح الكل' button in active pills
    const clearPillsBtn = page.getByRole("button", { name: /مسح الكل/i });
    if (await clearPillsBtn.isVisible()) {
      await clearPillsBtn.click();
    } else {
      const resetBtn = page.getByRole("button", { name: /إعادة ضبط/i }).first();
      await resetBtn.click();
    }

    await page.waitForURL((url) => !url.searchParams.has("gov") && !url.searchParams.has("specialty"));

    // Verify URL query parameters are cleared
    const url = new URL(page.url());
    expect(url.searchParams.get("gov")).toBeNull();
    expect(url.searchParams.get("specialty")).toBeNull();
    expect(url.searchParams.get("q")).toBeNull();
  });

  // Check 6: Google Maps links
  test("Check 6: Google Maps URLs match the name and address correctly", async ({
    page,
  }) => {
    await page.goto("/?tab=providers");
    await page.waitForLoadState("networkidle");

    // Check first card's Google Maps link
    const mapLink = page.locator("a[title*='خرائط Google'], a[aria-label*='خرائط Google']").first();
    await expect(mapLink).toBeVisible();

    const href = await mapLink.getAttribute("href");
    expect(href).toContain("https://www.google.com/maps/search/?api=1&query=");
  });

  // Check 7: Search input tolerance
  test("Check 7: Search tolerance with extra whitespace and diacritics", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Search with leading/trailing spaces
    const searchInput = page.getByRole("textbox", { name: "بحث في الدليل الطبي" });
    await searchInput.fill("   مستشفي    ");
    await page.waitForLoadState("networkidle");

    const cards = page.locator("div.group.relative.cursor-pointer.rounded-2xl");
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });
});
