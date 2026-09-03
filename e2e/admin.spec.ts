import { test, expect } from "@playwright/test";

test.describe("Admin Module E2E Test Suite", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("1. Unauthenticated user sees Admin Login screen and protected APIs return 401", async ({
    page,
    request,
  }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("بوابة الإدارة المركزية")).toBeVisible();
    await expect(page.getByPlaceholder(/اسم المستخدم/i)).toBeVisible();
    await expect(page.getByPlaceholder(/كلمة المرور/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /تسجيل الدخول إلى النظام/i })).toBeVisible();

    const doctorsRes = await request.get("/api/admin/doctors");
    expect(doctorsRes.status()).toBe(401);

    const providersRes = await request.get("/api/admin/providers");
    expect(providersRes.status()).toBe(401);

    const statsRes = await request.get("/api/admin/stats");
    expect(statsRes.status()).toBe(401);

    const govsRes = await request.get("/api/admin/governorates");
    expect(govsRes.status()).toBe(401);
  });

  test("2. Displays error notification on invalid login credentials", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    await page.getByPlaceholder(/اسم المستخدم/i).fill("wronguser");
    await page.getByPlaceholder(/كلمة المرور/i).fill("wrongpass");
    await page.getByRole("button", { name: /تسجيل الدخول إلى النظام/i }).click();

    await expect(page.getByText(/فشل في تسجيل الدخول/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/كلمة المرور غير صحيحة/i)).toBeVisible();
  });

  test("3. Successfully logs in with authorized admin account and loads dashboard", async ({
    page,
  }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    await page.getByPlaceholder(/اسم المستخدم/i).fill("tamersobhy123");
    await page.getByPlaceholder(/كلمة المرور/i).fill("tamer@sobhy@123");
    await page.getByRole("button", { name: /تسجيل الدخول إلى النظام/i }).click();

    await expect(page.getByText("لوحة التحكم والإدارة")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("header").getByText("أ/ تامر صبحي عبدالله")).toBeVisible();
    await expect(page.getByText("مدير النظام ورئيس مجلس الإدارة")).toBeVisible();
    await expect(page.getByRole("button", { name: /خروج/i })).toBeVisible();
  });

  test("4. Overview tab displays dashboard metrics and navigates to tabs", async ({ page }) => {
    await page.goto("/admin");
    await page.getByPlaceholder(/اسم المستخدم/i).fill("tamersobhy123");
    await page.getByPlaceholder(/كلمة المرور/i).fill("tamer@sobhy@123");
    await page.getByRole("button", { name: /تسجيل الدخول إلى النظام/i }).click();
    await expect(page.getByText("لوحة التحكم والإدارة")).toBeVisible({ timeout: 10000 });

    await expect(page.getByText("مرحباً بك في نظام إدارة الشبكة الطبية")).toBeVisible();
    await expect(page.getByText("إجمالي الأطباء المسجلين")).toBeVisible();
    await expect(page.getByText("إجمالي المنشآت الطبية")).toBeVisible();
    await expect(page.getByText("محافظات الجمهورية المغطاة")).toBeVisible();
    await expect(page.getByText("إجمالي الشبكة 2026")).toBeVisible();

    await expect(page.getByText("توزيع المنشآت الطبية حسب التخصص")).toBeVisible();
    await expect(page.getByText("مستشفيات ومراكز طبية")).toBeVisible();
    await expect(page.getByText("معامل تحاليل")).toBeVisible();

    await expect(page.getByRole("button", { name: /إضافة طبيب جديد/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /إضافة منشأة \/ مستشفى/i })).toBeVisible();
  });

  test("5. Doctors tab allows searching, filtering, and opening Add/Edit/Delete modals", async ({
    page,
  }) => {
    await page.goto("/admin");
    await page.getByPlaceholder(/اسم المستخدم/i).fill("tamersobhy123");
    await page.getByPlaceholder(/كلمة المرور/i).fill("tamer@sobhy@123");
    await page.getByRole("button", { name: /تسجيل الدخول إلى النظام/i }).click();
    await expect(page.getByText("لوحة التحكم والإدارة")).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: /إدارة الأطباء/i }).click();

    await expect(page.getByText("إدارة بيانات الأطباء والاستشاريين")).toBeVisible();
    const searchInput = page.getByPlaceholder(/ابحث باسم الطبيب/i);
    await expect(searchInput).toBeVisible();

    await searchInput.fill("أحمد");
    await page.waitForTimeout(600);

    await page.getByRole("button", { name: /➕ إضافة طبيب جديد/i }).click();
    await expect(page.getByText("إضافة طبيب أو استشاري جديد")).toBeVisible();
    await expect(page.getByPlaceholder(/مثال: د\. مجدي يعقوب/i)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByText("إضافة طبيب أو استشاري جديد")).not.toBeVisible();

    await searchInput.clear();
    await page.waitForTimeout(600);

    const editBtn = page.getByRole("button", { name: /تعديل/i }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await expect(page.getByText("تعديل بيانات الطبيب")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByText("تعديل بيانات الطبيب")).not.toBeVisible();
    }

    const deleteBtn = page.getByRole("button", { name: /حذف/i }).first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await expect(page.getByText(/تأكيد حذف/i)).toBeVisible();
      await expect(page.getByText(/العنصر المراد حذفه نهائياً/i)).toBeVisible();
      await page.getByRole("button", { name: /تراجع وإلغاء/i }).click();
      await expect(page.getByText(/العنصر المراد حذفه نهائياً/i)).not.toBeVisible();
    }
  });

  test("6. Providers tab allows facility type pills filtering and modal interactions", async ({
    page,
  }) => {
    await page.goto("/admin");
    await page.getByPlaceholder(/اسم المستخدم/i).fill("tamersobhy123");
    await page.getByPlaceholder(/كلمة المرور/i).fill("tamer@sobhy@123");
    await page.getByRole("button", { name: /تسجيل الدخول إلى النظام/i }).click();
    await expect(page.getByText("لوحة التحكم والإدارة")).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: /إدارة المنشآت والمستشفيات/i }).click();

    await expect(page.getByText("إدارة المستشفيات والمنشآت والمراكز الطبية")).toBeVisible();
    await expect(page.getByRole("button", { name: /جميع المنشآت/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /مستشفيات ومراكز/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /معامل تحاليل/i })).toBeVisible();

    await page.getByRole("button", { name: /معامل تحاليل/i }).click();
    await page.waitForTimeout(500);

    await page.getByRole("button", { name: /➕ إضافة منشأة \/ مستشفى جديد/i }).click();
    await expect(page.getByText("إضافة منشأة أو مستشفى جديد")).toBeVisible();
    await expect(page.getByPlaceholder(/مثال: مستشفى السلام الدولي/i)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByText("إضافة منشأة أو مستشفى جديد")).not.toBeVisible();

    await page.getByRole("button", { name: /إعادة ضبط الفلاتر/i }).click();
    await page.waitForTimeout(500);
  });

  test("7. Governorates tab displays all governorates and allows adding/editing", async ({
    page,
  }) => {
    await page.goto("/admin");
    await page.getByPlaceholder(/اسم المستخدم/i).fill("tamersobhy123");
    await page.getByPlaceholder(/كلمة المرور/i).fill("tamer@sobhy@123");
    await page.getByRole("button", { name: /تسجيل الدخول إلى النظام/i }).click();
    await expect(page.getByText("لوحة التحكم والإدارة")).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: /إدارة المحافظات/i }).click();

    await expect(page.getByText("إدارة وتوزيع المحافظات والمناطق")).toBeVisible();
    await expect(page.getByText(/إجمالي المحافظات المسجلة:/i)).toBeVisible();

    await page.getByRole("button", { name: /➕ إضافة محافظة جديدة/i }).click();
    await expect(page.getByRole("heading", { name: /إضافة محافظة جديدة/i })).toBeVisible();
    await expect(page.getByPlaceholder(/مثال: القاهرة \/ الإسكندرية/i)).toBeVisible();

    await page.getByRole("button", { name: /إلغاء/i }).click();
    await expect(page.getByRole("heading", { name: /إضافة محافظة جديدة/i })).not.toBeVisible();
  });

  test("8. Admin can log out successfully and session is cleared", async ({ page, context }) => {
    await page.goto("/admin");
    await page.getByPlaceholder(/اسم المستخدم/i).fill("tamersobhy123");
    await page.getByPlaceholder(/كلمة المرور/i).fill("tamer@sobhy@123");
    await page.getByRole("button", { name: /تسجيل الدخول إلى النظام/i }).click();
    await expect(page.getByText("لوحة التحكم والإدارة")).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: /خروج/i }).click();
    await expect(page.getByText("بوابة الإدارة المركزية")).toBeVisible({ timeout: 5000 });

    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) => c.name === "med_admin_session");
    expect(!sessionCookie || sessionCookie.value === "").toBeTruthy();
  });

  test("9. Public website footer includes link to admin portal", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const adminLink = page.getByRole("link", { name: /بوابة الإدارة/i });
    await expect(adminLink).toBeVisible();

    await adminLink.click();
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("بوابة الإدارة المركزية")).toBeVisible();
  });

  test("10. Full CRUD lifecycle: Add, edit, and delete doctor without RLS errors", async ({ page }) => {
    const testDocName = "د. اختبار المشرف الآلي 2026";

    // 1. Login
    await page.goto("/admin");
    await page.getByPlaceholder(/اسم المستخدم/i).fill("tamersobhy123");
    await page.getByPlaceholder(/كلمة المرور/i).fill("tamer@sobhy@123");
    await page.getByRole("button", { name: /تسجيل الدخول إلى النظام/i }).click();
    await expect(page.getByText("لوحة التحكم والإدارة")).toBeVisible({ timeout: 10000 });

    // 2. Go to Doctors tab
    await page.getByRole("button", { name: /إدارة الأطباء/i }).click();

    // 3. Add new doctor
    await page.getByRole("button", { name: /➕ إضافة طبيب جديد/i }).click();
    await expect(page.getByText("إضافة طبيب أو استشاري جديد")).toBeVisible();

    await page.getByPlaceholder(/مثال: د\. مجدي يعقوب/i).fill(testDocName);
    await page.getByPlaceholder(/مثال: شارع التحرير/i).fill("شارع التجربة، برج الأطباء");
    await page.getByPlaceholder(/مثال: 01012345678/i).fill("01011112222");

    await page.getByRole("button", { name: /إضافة الطبيب الآن/i }).click();

    // 4. Assert Success Toast
    await expect(page.getByText(/تمت إضافة الطبيب بنجاح/i)).toBeVisible({ timeout: 15000 });

    // 5. Search for the newly created doctor
    const searchInput = page.getByPlaceholder(/ابحث باسم الطبيب/i);
    await searchInput.fill(testDocName);
    await page.waitForTimeout(1000);

    const docCard = page.locator("div.space-y-2").filter({ hasText: testDocName }).first();
    await expect(docCard).toBeVisible({ timeout: 10000 });

    // 6. Edit doctor
    await page.getByRole("button", { name: /تعديل/i }).first().click();
    await expect(page.getByText("تعديل بيانات الطبيب")).toBeVisible();

    const addressInput = page.getByPlaceholder(/مثال: شارع التحرير/i);
    await addressInput.fill("عنوان محدث جديد بالكامل");
    await page.getByRole("button", { name: /حفظ التعديلات/i }).click();

    await expect(page.getByText(/تم حفظ تعديلات بيانات الطبيب بنجاح/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("عنوان محدث جديد بالكامل")).toBeVisible({ timeout: 10000 });

    // 7. Delete doctor
    await page.getByRole("button", { name: /حذف/i }).first().click();
    await expect(page.getByText(/تأكيد حذف/i)).toBeVisible();
    await page.getByRole("button", { name: /نعم، حذف نهائي/i }).click();

    await expect(page.getByText(/تم حذف الطبيب/i)).toBeVisible({ timeout: 15000 });
  });
});
