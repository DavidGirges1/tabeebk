import { test, expect } from "@playwright/test";

test.describe("Bylaws & Interactive Guidelines Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/bylaws");
    await page.waitForLoadState("domcontentloaded");
  });

  test("should load bylaws page with hero title and sections", async ({ page }) => {
    // Check page has the main heading (h1)
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toContainText("لائحة الاشتراكات", { timeout: 10000 });

    // Check subscriptions section exists
    await expect(page.getByRole("heading", { name: /لائحة الاشتراكات ونسب المساهمة/i })).toBeVisible();
  });

  test("should filter surgical caps table with search input", async ({ page }) => {
    // BylawsInteractiveSection renders the surgical caps search
    const capsSearchInput = page.getByPlaceholder(/ابحث عن عملية جراحية/i);
    await expect(capsSearchInput).toBeVisible({ timeout: 10000 });

    await capsSearchInput.fill("قلب");

    // Table should show filtered results — rows containing cardiac terms
    await expect(
      page.getByText(/القلب|قلبي/i).first()
    ).toBeVisible({ timeout: 8000 });
  });

  test("should switch to chronic diseases tab and search conditions", async ({ page }) => {
    // Find the chronic diseases tab
    const chronicTab = page.getByRole("tab", { name: /أدوية الأمراض المزمنة/i });
    await expect(chronicTab).toBeVisible({ timeout: 10000 });
    await chronicTab.click();

    const chronicSearchInput = page.getByPlaceholder(/ابحث عن مرض مزمن/i);
    await expect(chronicSearchInput).toBeVisible({ timeout: 8000 });

    await chronicSearchInput.fill("الكبد");
    // Look for hepatic condition in the results (التليف الكبدي exists in the data)
    await expect(
      page.getByText(/التليف الكبدي/i).first()
    ).toBeVisible({ timeout: 8000 });
  });
});
