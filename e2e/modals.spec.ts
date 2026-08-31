import { test, expect } from "@playwright/test";

test.describe("Card Details Modal & Action Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for actual cards to load (skeleton gone)
    await page.waitForLoadState("networkidle");
  });

  test("should open modal when clicking a facility or doctor card", async ({ page }) => {
    // Cards render as divs with class "group relative cursor-pointer ... rounded-2xl"
    const firstCard = page
      .locator("div.group.relative.cursor-pointer.rounded-2xl")
      .first();

    await expect(firstCard).toBeVisible({ timeout: 15000 });
    await firstCard.click();

    // Dialog should open
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 8000 });

    // Click the first "إغلاق" button inside the dialog
    const closeBtn = dialog.getByRole("button", { name: /إغلاق/i }).first();
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    await expect(dialog).toBeHidden({ timeout: 5000 });
  });
});
