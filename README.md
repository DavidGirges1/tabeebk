# 🏥 دليل الرعاية الطبية بالمحافظات 2026 | Med Aggregator

> **الموقع الإلكتروني والمنظومة الرقمية لشبكة التعاقدات الطبية لصندوق علاج العاملين بمصلحتي الجمارك والضرائب.**  
> **إشراف وإهداء:** الأستاذ / **تامر صبحي عبدالله** (عضو مجلس الإدارة عن القاهرة والوجه القبلي)  
> **تصميم وبرمجة:** **David E. Girgis**

---

## 🌟 نظرة عامة (Overview)

منصة وتطبيق ويب متكامل مصمم بأحدث التقنيات لخدمة العاملين بمصلحتي الجمارك وضرائب القيمة المضافة وأسرهم الكريمة، للبحث والاستعلام الفوري عن شبكة الخدمات الطبية المعتمدة بجميع محافظات جمهورية مصر العربية، والاطلاع على لائحة الاشتراكات والحدود القصوى للعلاج وقواعد صرف أدوية الأمراض المزمنة.

---

## 📱 المميزات الرئيسية (Features)

### 1. 🔍 محرك بحث وفلترة فوري ومتطور
- **بحث لحظي متسامح (300ms Debounce):** بحث ذكي بالاسم، التخصص، العنوان، أرقام الهواتف، والملاحظات مع دعم معالجة الحروف والهمزات العربية.
- **مزامنة الروابط (URL State Synchronization):** كل فلتر أو كلمة بحث أو صفحة يتم حفظها فورياً في الرابط (`?q=...&gov=1&type=hospital&page=1`) لإمكانية مشاركة الروابط والاحتفاظ بها.
- **فلاتر متعددة:** تصفية حسب المحافظة (23 محافظة)، نوع المنشأة (مستشفيات، معامل، أشعة، عيون، علاج طبيعي، عيادات، صيدليات)، والتخصص الطبي.
- **بطاقات الفلاتر النشطة (Active Pills):** إزالة أي فلتر بضغطة واحدة مع زر "مسح الكل".

### 2. 📱 تجربة مستخدم تركز على الهاتف أولاً (Mobile-First UI/UX)
- **أهداف لمس مريحة (44px+ Touch Targets):** تصميم متوافق مع معايير إمكانية الوصول وسهولة الاستخدام على كافة الشاشات.
- **درج فلاتر جانبي منزلق (Slide-out Filter Drawer):** فتح وإغلاق الفلاتر بسلاسة تامة على الهواتف.
- **شريط تنقل سفلي مثبت (Sticky Bottom Nav):** سهولة التبديل بين المنشآت الطبية، الأطباء، وتصفية النتائج.
- **اتصال ومشاركة فورية:** أزرار اتصال مباشر `tel:` مع نافذة منبثقة للمنشآت ذات الأرقام المتعددة تتيح الاتصال أو النسخ بضغطة واحدة.

### 3. 📜 صفحات ومحتوى متكامل
- **صفحة التقدمة (`/introduction`):** كلمة ترحيبية وإهداء من الأستاذ / **تامر صبحي عبدالله** بتصميم ورقي رسمي فاخر.
- **صفحة لائحة الاشتراكات والخدمات (`/bylaws`):**
  - جدول الاشتراكات ونسب المساهمات واستقطاعات العاملين والمعاشات ولائحة علاج الوالدة.
  - جداول الحدود القصوى لأكثر من 40 إجراء جراحي وفحوصات مع بحث فوري.
  - جدول مخصصات صرف أدوية الأمراض المزمنة (32 حالة ومرض مزمن) مع محرك بحث تفاعلي.
  - قائمة الخدمات المستثناة وتعليمات الموافقات الإلكترونية وصرف الأدوية.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/) مع [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Database & Backend:** [Supabase](https://supabase.com/) (PostgreSQL Database + `@supabase/ssr`)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) مع خط **Cairo** العربي
- **Components:** [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 التشغيل المحلي (Local Development)

### 1. استنساخ المشروع وتثبيت الحزم
```bash
git clone <repository-url>
cd med-aggregator
npm install
```

### 2. إعداد المتغيرات البيئية (Environment Variables)
أنشئ ملف `.env.local` في المجلد الرئيسي وضع بداخله مفاتيح Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://gdqqbritubbcbgpkqxby.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. تشغيل خادم التطوير
```bash
npm run dev
```
افتح المتصفح على [http://localhost:3000](http://localhost:3000) لتصفح التطبيق.

---

## ☁️ النشر على Vercel (Vercel Deployment)

المشروع جاهز ومُهيأ بالكامل للنشر الفوري على منصة **Vercel**:

1. قم برفع الكود إلى مستودعك على GitHub أو GitLab.
2. توجه إلى لوحة تحكم [Vercel](https://vercel.com/) واضغط على **"Add New Project"**.
3. قم باختيار المستودع وحدد إعدادات البناء الافتراضية لـ Next.js.
4. أضف المتغيرات البيئية التالية في قسم **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. اضغط **Deploy**.

---

## 📁 هيكل المشروع (Project Structure)

```
├── app/
│   ├── layout.tsx                 # Root layout with Cairo font, RTL direction & Footer
│   ├── page.tsx                   # Main server component with prefetching
│   ├── globals.css                # Tailwind design system tokens
│   ├── error.tsx                  # Global error boundary
│   ├── not-found.tsx              # Custom 404 page
│   ├── introduction/
│   │   └── page.tsx               # Official paper-letter tribute page (أ/ تامر صبحي)
│   ├── bylaws/
│   │   └── page.tsx               # Bylaws, contribution tables & caps directory
│   └── api/
│       └── search/route.ts        # Fast serverless search API
├── components/
│   ├── ui/                        # Reusable shadcn/ui primitives
│   ├── providers/                 # Medical facility cards, modals & grid list
│   ├── doctors/                   # Doctor cards, modals & grid list
│   ├── search/                    # Search bar, sidebar, drawer, pills & pagination
│   ├── bylaws/                    # Searchable interactive tables for caps & chronic meds
│   ├── layout/                    # Navbar, sticky mobile bottom nav, footer & banners
│   └── common/                    # Empty states & multi-phone action sheets
├── lib/
│   ├── supabase/                  # SSR Supabase clients & complete database types
│   ├── hooks/                     # useDebounce & useFilters URL synchronizer
│   └── utils.ts                   # Arabic normalization & phone parsers
├── Data/                          # Initial raw CSVs, SQL schema & markdown (gitignored)
├── .env.example
├── .gitignore
└── package.json
```

---

## 👨‍💻 فريق العمل والحقوق (Credits)

- **إشراف وإهداء:** **أ/ تامر صبحي عبدالله**  
  *عضو مجلس الإدارة عن القاهرة والوجه القبلي — صندوق الرعاية الصحية والاجتماعية للعاملين بمصلحتي الجمارك والضرائب.*
- **تصميم وتطوير وبرمجة:** **David E. Girgis**
- **النسخة:** إصدار عام 2026 المعتمد.
- **حقوق النشر:** جميع الحقوق محفوظة © 2026.
