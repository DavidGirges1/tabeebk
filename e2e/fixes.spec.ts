import { test, expect } from "@playwright/test";

test.describe("Regression Tests for Confirmed Bugs (FIX 1 to FIX 6)", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test("FIX 1: Specialty filter should be hidden on Facilities tab and visible on Doctors tab", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // 1. Switch to Facilities (Providers) tab
    const providersTab = page.getByRole("tab", { name: /المنشآت/i });
    await providersTab.click();
    await expect(providersTab).toHaveAttribute("data-state", "active");

    // 2. Assert specialty filter section is NOT visible on Facilities tab
    const specialtySection = page.getByTestId("specialty-filter-section");
    await expect(specialtySection).toBeHidden();

    // 3. Switch to Doctors tab
    const doctorsTab = page.getByRole("tab", { name: /الأطباء/i });
    await doctorsTab.click();
    await expect(doctorsTab).toHaveAttribute("data-state", "active");

    // 4. Assert specialty filter IS visible on Doctors tab
    await expect(specialtySection).toBeVisible();
  });

  test("FIX 2: Selecting specialty then switching tabs must not silently filter Facilities", async ({
    page,
  }) => {
    // 1. Get baseline facilities count on providers tab
    await page.goto("/?tab=providers");
    await page.waitForLoadState("networkidle");
    const resultBadge = page.locator("span.font-mono, div.font-mono").filter({ hasText: /نتيجة/i }).first();
    await expect(resultBadge).toBeVisible();
    const baselineText = await resultBadge.innerText();

    // 2. Go to Doctors tab and select a specialty
    await page.goto("/?tab=doctors&specialty=أنف وأذن وحنجرة");
    await page.waitForLoadState("networkidle");

    // 3. Switch to Facilities tab via UI
    const providersTab = page.getByRole("tab", { name: /المنشآت/i });
    await providersTab.click();
    await page.waitForURL((url) => url.searchParams.get("tab") === "providers");
    await page.waitForLoadState("networkidle");

    // 4. Assert the result count on Facilities tab matches the full unfiltered baseline
    await expect(resultBadge).toHaveText(baselineText, { timeout: 10000 });
  });

  test("FIX 3: Filtering by 'جراحة عامة' includes compound specialties like 'جراحة عامة ومناظير'", async ({
    page,
  }) => {
    await page.goto("/?tab=doctors&specialty=جراحة عامة");
    await page.waitForLoadState("networkidle");

    // Check that results exist and include surgery / laparoscopy compound doctors
    const cards = page.locator("div.group.relative.cursor-pointer.rounded-2xl");
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // Verify specialty text on cards contains surgery
    const specialtyTexts = await page.getByTestId("doctor-specialty-text").allInnerTexts();
    const hasSurgery = specialtyTexts.some((text) => text.includes("جراحة"));
    expect(hasSurgery).toBe(true);
  });

  test("FIX 4: Doctor title is stripped into a separate field and doctor matches clean specialty", async ({
    page,
  }) => {
    // Filter by clean specialty "أنف وأذن"
    await page.goto("/?tab=doctors&specialty=أنف وأذن&q=رأفت صادق");
    await page.waitForLoadState("networkidle");

    // Assert Dr. Raafat appears
    await expect(page.getByText(/رأفت صادق المهندس/i)).toBeVisible({ timeout: 10000 });

    // Assert title badge is rendered distinctly
    const titleBadge = page.getByTestId("doctor-title-badge").first();
    await expect(titleBadge).toBeVisible();
    await expect(titleBadge).toContainText(/أستاذ/i);

    // Assert specialty is clean
    const specialtyText = page.getByTestId("doctor-specialty-text").first();
    await expect(specialtyText).toContainText(/أنف وأذن/i);
  });

  test("FIX 5: Doctor with parenthetical compound specialty in name is discovered under that filter", async ({
    page,
  }) => {
    // Filter by "روماتيزم"
    await page.goto("/?tab=doctors&specialty=روماتيزم");
    await page.waitForLoadState("networkidle");

    // Assert Dr. Mohamed Hosny Hamza appears (previously had raw specialty 'علاج طبيعي')
    await expect(page.getByText(/محمد حسني حمزة/i)).toBeVisible({ timeout: 10000 });
  });

  test("FIX 6: Doctor with invalid/missing phone displays 'الهاتف غير متاح' fallback", async ({
    page,
  }) => {
    // Dr. Mohamed Hosny Hamza has no phone in dataset
    await page.goto("/?tab=doctors&q=محمد حسني حمزة");
    await page.waitForLoadState("networkidle");

    // 1. Check Card footer shows fallback message
    await expect(page.getByText("الهاتف غير متاح").first()).toBeVisible({ timeout: 10000 });

    // 2. Open Modal and verify detail fallback message
    const card = page.locator("div.group.relative.cursor-pointer.rounded-2xl").first();
    await card.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByTestId("doctor-no-phone")).toHaveText("الهاتف غير متاح");
  });
});
