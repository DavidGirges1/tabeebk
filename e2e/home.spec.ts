import { test, expect } from "@playwright/test";

test.describe("Home Page & Medical Directory", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load the home page with proper title and navbar", async ({ page }) => {
    // Check title / brand text
    await expect(page).toHaveTitle(/دليل الرعاية الطبية|Med Aggregator/i);
    await expect(page.getByText("دليل الرعاية الطبية").first()).toBeVisible();
  });

  test("should display navigation links", async ({ page }) => {
    const header = page.locator("header");
    await expect(header.getByRole("link", { name: /الدليل والشبكة الطبية/i })).toBeVisible();
    await expect(header.getByRole("link", { name: /تقدمة/i })).toBeVisible();
    await expect(header.getByRole("link", { name: /لائحة الاشتراكات والخدمات/i })).toBeVisible();
  });

  test("should navigate to introduction page", async ({ page }) => {
    const header = page.locator("header");
    await Promise.all([
      page.waitForURL(/.*introduction/, { timeout: 15000 }),
      header.getByRole("link", { name: /تقدمة/i }).click(),
    ]);
    await expect(page).toHaveURL(/.*introduction/);
  });

  test("should navigate to bylaws page", async ({ page }) => {
    const header = page.locator("header");
    await Promise.all([
      page.waitForURL(/.*bylaws/, { timeout: 15000 }),
      header.getByRole("link", { name: /لائحة الاشتراكات والخدمات/i }).click(),
    ]);
    await expect(page).toHaveURL(/.*bylaws/);
  });
});
