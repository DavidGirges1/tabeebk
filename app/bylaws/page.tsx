import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileSpreadsheet,
  HeartPulse,
  Pill,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Building2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Percent,
  Clock,
  Sparkles,
} from "lucide-react";
import { BylawsInteractiveSection } from "@/components/bylaws/bylaws-interactive-section";

export const metadata = {
  title: "لائحة الاشتراكات وقواعد العلاج | صندوق الرعاية الطبية 2026",
  description:
    "لائحة الاشتراكات ونسب المساهمة، جدول الحدود القصوى للخدمات الجراحية والعلاجية، ومخصصات صرف أدوية الأمراض المزمنة.",
};

export default function BylawsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col justify-between">
      <Navbar />

      <main className="container max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 space-y-10">
        {/* Breadcrumb / Back Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground self-start min-h-[38px]">
            <Link href="/">
              <ArrowRight className="w-4 h-4" />
              العودة إلى الدليل الطبي والبحث
            </Link>
          </Button>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
              إصدار عام 2026 المعتمد
            </Badge>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="secondary" className="px-3 py-1 text-xs font-bold gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>صندوق الرعاية الصحية والاجتماعية للعاملين بمصلحتي الجمارك والضرائب</span>
          </Badge>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            لائحة الاشتراكات وقواعد العلاج والتغطيات
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            الدليل المعتمد لنسب المساهمات المالية، جداول الحدود القصوى للعمليات الجراحية، مخصصات الأمراض المزمنة، وضوابط الموافقات الطبية.
          </p>

          <div className="inline-block bg-muted/60 px-3 py-1 rounded-xl text-xs text-muted-foreground font-medium">
            إشراف: <strong className="text-foreground">أ/ تامر صبحي عبدالله</strong> - عضو مجلس الإدارة عن القاهرة والوجه القبلي
          </div>
        </div>

        {/* Section 2: Periodic Subscriptions & Member Contributions */}
        <section id="subscriptions" className="space-y-6">
          <div className="flex items-center gap-2.5 pb-2 border-b-2 border-primary/20">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                2. لائحة الاشتراكات ونسب المساهمة
              </h2>
              <p className="text-xs text-muted-foreground">
                قيمة الاستقطاعات ونسب مساهمة الأعضاء والمستفيدين في الخدمات العلاجية
              </p>
            </div>
          </div>

          {/* Subscriptions Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                أولاً: جدول الاشتراكات الدورية
              </h3>
              <span className="text-[11px] text-muted-foreground sm:hidden flex items-center gap-1 font-medium bg-muted/60 px-2 py-0.5 rounded-full">
                <span>اسحب أفقياً</span>
                <ArrowLeft className="w-3 h-3 text-primary animate-pulse" />
              </span>
            </div>

            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead className="bg-muted/80 text-foreground font-bold border-b">
                  <tr>
                    <th className="p-3.5 sm:p-4 min-w-[180px]">فئة العضو</th>
                    <th className="p-3.5 sm:p-4 min-w-[160px]">قيمة / نسبة الاشتراك</th>
                    <th className="p-3.5 sm:p-4 min-w-[300px]">الشروط والضوابط المعتمدة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-primary">الأعضاء العاملون</td>
                    <td className="p-3.5 sm:p-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      <span className="bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        5% شهرياً
                      </span>
                    </td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground leading-relaxed">
                      تُستقطع من إجمالي الأجر الوظيفي والأجر المكمل شهرياً.
                    </td>
                  </tr>

                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">المحالون للمعاش</td>
                    <td className="p-3.5 sm:p-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      <span className="bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        1% سنوياً
                      </span>
                    </td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground leading-relaxed">
                      من إجمالي المعاش السنوي.
                    </td>
                  </tr>

                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">أسرة العضو المتوفي</td>
                    <td className="p-3.5 sm:p-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      <span className="bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        1% سنوياً
                      </span>
                    </td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground leading-relaxed">
                      من إجمالي المعاش السنوي، وتُعفى الأسرة تماماً من سداد اشتراك سنة ميلادية كاملة تالية لتاريخ الوفاة.
                    </td>
                  </tr>

                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">زوجة العضو الموظفة العاملة</td>
                    <td className="p-3.5 sm:p-4 font-mono font-bold text-amber-700 dark:text-amber-400">
                      <span className="bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                        تحمل 50% من التكلفة
                      </span>
                    </td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground leading-relaxed">
                      تتحمل 50% من جميع الخدمات العلاجية، ما عدا الزوجة التي ليس لها غطاء علاجي سوى التأمين الصحي الحكومي فلا تتحمل تلك النسبة.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Member Contribution Percentages */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                ثانياً: نسب مساهمة العضو في الخدمات العلاجية المباشرة
              </h3>
              <span className="text-[11px] text-muted-foreground sm:hidden flex items-center gap-1 font-medium bg-muted/60 px-2 py-0.5 rounded-full">
                <span>اسحب أفقياً</span>
                <ArrowLeft className="w-3 h-3 text-emerald-600 animate-pulse" />
              </span>
            </div>

            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead className="bg-muted/80 text-foreground font-bold border-b">
                  <tr>
                    <th className="p-3.5 sm:p-4 min-w-[200px]">نوع الخدمة الطبية</th>
                    <th className="p-3.5 sm:p-4 min-w-[140px]">نسبة مساهمة العضو</th>
                    <th className="p-3.5 sm:p-4 min-w-[280px]">طريقة السداد وملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { title: "الكشف الطبي بالعيادات", rate: "25%", notes: "تسدد نقداً لمقدم الخدمة مباشرة" },
                    { title: "الأشعة والتحاليل الطبية", rate: "25%", notes: "تسدد نقداً لمقدم الخدمة مباشرة" },
                    { title: "جلسات العلاج الطبيعي", rate: "25%", notes: "تسدد نقداً لمقدم الخدمة مباشرة" },
                    { title: "أجور العمليات والعلاج بالمستشفى", rate: "10%", notes: "تسدد نقداً بالمستشفى / المركز" },
                    { title: "أي تدخل جراحي بالعيادات الخارجية", rate: "10%", notes: "تسدد نقداً" },
                    { title: "جميع الخدمات لأصحاب المعاشات والأرامل", rate: "10%", notes: "تسدد نقداً من قيمة أي خدمة علاجية مقدمة" },
                    { title: "صرف الأدوية العادية", rate: "10%", notes: "تسدد نقداً عند الصرف من الصيدليات المتعاقدة" },
                    { title: "إجراءات الزوجة العاملة (غير الأدوية)", rate: "50%", notes: "من قيمة أي إجراء طبي عدا الأدوية (ما لم تكن خاضعة للتأمين الصحي فقط)" },
                  ].map((item, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3.5 sm:p-4 font-semibold text-foreground">{item.title}</td>
                      <td className="p-3.5 sm:p-4 font-mono font-bold text-primary">
                        <span className="bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">
                          {item.rate}
                        </span>
                      </td>
                      <td className="p-3.5 sm:p-4 text-muted-foreground">{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mother's Treatment Bylaws */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              ثالثاً: لائحة علاج الوالدة (الأرملة والمطلقة)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold text-amber-950 dark:text-amber-200">
                      حالة: العائل الوحيد
                    </CardTitle>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-900 border-amber-300">
                      5,000 جنيه سنوياً
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <p><strong>رسوم الكارنيه:</strong> 500 جنيه سنوياً.</p>
                  <p className="leading-relaxed">
                    <strong>الضوابط:</strong> تقيد المبالغ إلكترونياً بكارتة حساب. لدخول المستشفى يلزم إحالة من الطبيب المعالج وموافقة الصندوق لمدة 5 أيام قابلة للتجديد.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold text-foreground">
                      حالة: مع وجود إخوة أشقاء
                    </CardTitle>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-900 border-slate-300">
                      2,500 جنيه سنوياً
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <p><strong>رسوم الكارنيه:</strong> 250 جنيه سنوياً.</p>
                  <p className="leading-relaxed">
                    <strong>الضوابط:</strong> تقيد المبالغ إلكترونياً بكارتة حساب. لدخول المستشفى يلزم إحالة من الطبيب المعالج وموافقة الصندوق لمدة 5 أيام قابلة للتجديد.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 3 & 4: Interactive Tables with Search */}
        <BylawsInteractiveSection />

        {/* Section 5: Excluded Services & Administrative Instructions */}
        <section id="guidelines" className="space-y-6 pt-6 border-t-2">
          <div className="flex items-center gap-2.5 pb-2 border-b-2 border-primary/20">
            <div className="p-2 rounded-xl bg-destructive/10 text-destructive">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                5. الخدمات المستثناة والضوابط التنظيمية والموافقات
              </h2>
              <p className="text-xs text-muted-foreground">
                المستثنيات من التغطية، شروط اعتماد الروشتات، وتعليمات الموافقات الإلكترونية الفورية
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Excluded Services List */}
            <Card className="border-destructive/30 bg-destructive/5 lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-destructive flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  قائمة الخدمات المستثناة تماماً
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  {[
                    "جراحات التجميل وشفط الدهون.",
                    "الفحوصات الطبية الشاملة الدورية بدون مرض.",
                    "الإبر الصينية، التغذية، وعلاج السمنة والتخسيس.",
                    "علاج البهاق (لغير البنات).",
                    "عمليات قصر النظر وتشريط القرنية والليزر.",
                    "الموجات الصوتية لمتابعة الحمل، والولادات بعد الأولى.",
                    "العلاج بالخلايا الجذعية وجراحات الليزر المستثناة.",
                    "علاج الآلام بالحقن (أتعاب الحقن فقط بالعيادة الخارجية).",
                    "تحاليل ما قبل الزواج، السفر للخارج، والشهادات الطبية.",
                    "التردد الحراري (فيما عدا علاج الأورام الخبيثة).",
                    "تحاليل المخدرات والشهادات القانونية.",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-destructive font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Medication Dispensing Guidelines */}
            <Card className="border-border bg-card lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Pill className="w-5 h-5 text-emerald-600" />
                  تعليمات صرف الأدوية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2.5 text-xs sm:text-sm text-muted-foreground list-decimal list-inside leading-relaxed">
                  <li>إحضار تقرير طبي مفصل عن الحالة من الطبيب المعالج.</li>
                  <li>إحضار نتائج الأشعة والتحاليل الدالة على تفاصيل الحالة.</li>
                  <li>إحضار روشتة حديثة موضح بها أسماء الأدوية والجرعات بدقة.</li>
                  <li>التوجه لإدارة الصندوق لاعتماد الروشتة من المستشار الطبي.</li>
                  <li>ختم الروشتة أو إصدار إذن صرف لصرفه من الصيدليات المتعاقدة.</li>
                  <li>تجديد الروشتة كل 6 شهور على الأكثر.</li>
                  <li>الصرف مرة واحدة كل 30 يوماً دون استثناء.</li>
                </ol>
              </CardContent>
            </Card>

            {/* Electronic Approvals Instructions */}
            <Card className="border-border bg-card lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  تعليمات الموافقات الإلكترونية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2.5 text-xs sm:text-sm text-muted-foreground list-decimal list-inside leading-relaxed">
                  <li>التوجه مباشرة للجهة المتعاقدة دون الحاجة لموافقة ورقية مسبقة.</li>
                  <li>إحضار روشتة أصلية معتمدة لم يمر عليها أكثر من شهر.</li>
                  <li>الخدمة سارية للكارنيهات المجددة والسارية فقط.</li>
                  <li>موافقات والدة العضو تتم عن طريق إدارة الصندوق فقط (من 9 ص حتى 2 ظ في أيام العمل الرسمية).</li>
                  <li>تشمل الموافقات الإلكترونية: الأشعة، التحاليل، الطوارئ، العيادات الخارجية، والقسم الداخلي.</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
