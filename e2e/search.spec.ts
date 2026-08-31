import { test, expect } from "@playwright/test";

test.describe("Search Functionality & Filter Pills", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display search input with proper placeholder", async ({ page }) => {
    const searchInput = page.getByRole("textbox", { name: "بحث في الدليل الطبي" });
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute(
      "placeholder",
      /ابحث باسم المستشفى، الطبيب، التخصص، أو العنوان/i
    );
  });

  test("should filter results when typing a search query", async ({ page }) => {
    const searchInput = page.getByRole("textbox", { name: "بحث في الدليل الطبي" });
    await searchInput.fill("مستشفى");

    // Wait for debounce and check active filter pills
    const pill = page.getByText(/بحث: "مستشفى"/i);
    await expect(pill).toBeVisible({ timeout: 5000 });
  });

  test("should clear search query using the clear button in search input", async ({ page }) => {
    const searchInput = page.getByRole("textbox", { name: "بحث في الدليل الطبي" });
    await searchInput.fill("القاهرة");

    const clearButton = page.getByLabel("مسح البحث");
    await expect(clearButton).toBeVisible();
    await clearButton.click();

    await expect(searchInput).toHaveValue("");
  });

  test("should show empty state for non-matching queries and allow reset", async ({ page }) => {
    const searchInput = page.getByRole("textbox", { name: "بحث في الدليل الطبي" });
    await searchInput.fill("xyznonexistingsearch12345");

    await expect(page.getByText("لم يتم العثور على نتائج")).toBeVisible({ timeout: 6000 });
    
    // Check reset button in empty state
    const resetButton = page.getByRole("button", { name: /إعادة ضبط جميع الفلاتر/i });
    await expect(resetButton).toBeVisible();
    await resetButton.click();

    await expect(searchInput).toHaveValue("");
  });
});
