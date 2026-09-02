import { test, expect } from "@playwright/test";

test.describe("Card Details Modal & Action Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should open modal when clicking a facility or doctor card", async ({ page }) => {
    const firstCard = page
      .locator("div.group.relative.cursor-pointer.rounded-2xl")
      .first();

    await expect(firstCard).toBeVisible({ timeout: 15000 });
    
    // Click either the details button or the card
    const detailsBtn = firstCard.getByRole("button", { name: /التفاصيل/i });
    if (await detailsBtn.isVisible()) {
      await detailsBtn.click();
    } else {
      await firstCard.click();
    }

    // Dialog should open
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 10000 });

    // Click the "إغلاق" button inside the dialog
    const closeBtn = dialog.getByRole("button", { name: /إغلاق/i }).first();
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    await expect(dialog).toBeHidden({ timeout: 5000 });
  });
});
