import { test, expect } from "@playwright/test";

test.describe("Category Tabs & Sidebar Filtering", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should switch between tabs (All, Providers, Doctors)", async ({ page }) => {
    // 1. Click on Providers tab
    const providersTab = page.getByRole("tab", { name: /المنشآت/i });
    await providersTab.click();
    // Wait for URL or aria-selected to confirm
    await expect(providersTab).toHaveAttribute("data-state", "active", { timeout: 5000 });

    // 2. Click on Doctors tab
    const doctorsTab = page.getByRole("tab", { name: /الأطباء/i });
    await doctorsTab.click();
    await expect(doctorsTab).toHaveAttribute("data-state", "active", { timeout: 5000 });

    // 3. Click back on All tab
    const allTab = page.getByRole("tab", { name: /الكل/i });
    await allTab.click();
    await expect(allTab).toHaveAttribute("data-state", "active", { timeout: 5000 });
  });

  test("should display governorate list and filter results when selected", async ({ page }) => {
    // Look for governorate filter sidebar on desktop (lg: breakpoint)
    const aside = page.locator("aside").first();

    // Wait for sidebar to be visible
    const isSidebarVisible = await aside.isVisible({ timeout: 5000 }).catch(() => false);

    if (!isSidebarVisible) {
      // Skip test if sidebar is not rendered at current viewport size
      test.skip();
      return;
    }

    // The governorate list is in a scrollable div — look for any button that is NOT "كل المحافظات" or "جميع المنشآت"
    // Governorate buttons are simple span with gov name
    const govContainer = aside.locator("div.max-h-56").first();
    await expect(govContainer).toBeVisible({ timeout: 5000 });

    // Get all buttons in the gov container, skip first one (كل المحافظات)
    const govBtns = govContainer.locator("button");
    const count = await govBtns.count();

    if (count < 2) {
      // Not enough govs to test filtering
      return;
    }

    // Click the second button (first actual governorate, not "كل المحافظات")
    const govBtn = govBtns.nth(1);
    await govBtn.scrollIntoViewIfNeeded();
    await govBtn.click();

    // The filter pill "المحافظة: ..." should appear
    await expect(page.getByText(/المحافظة:/i)).toBeVisible({ timeout: 10000 });
  });
});
