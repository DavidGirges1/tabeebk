"use client";

import React, { useState } from "react";
import { Search, HeartPulse, Pill, ShieldCheck, Sparkles, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Section 3 Data: Surgical & Service Caps
const SURGICAL_CAPS = [
  { service: "الكشف الطبي", cap: "مغطى بالكامل تعاقدياً", category: "عيادات", rules: "لدى الأطباء المتعاقدين بعياداتهم وبعيادات المستشفيات في جميع المحافظات" },
  { service: "الفحوصات والأشعات والتحاليل", cap: "مغطاة تعاقدياً (مساهمة 25%)", category: "فحوصات", rules: "في المراكز والمعامل والمستشفيات المتعاقد معها (عدا الفحص الشامل وفحوصات ما قبل الزواج والسفر ورخص القيادة وأشعة الحمل التي يتحملها العضو بالكامل)" },
  { service: "علاج الأورام وأمراض الدم الخبيثة (بروتوكول الصحة)", cap: "200,000 جنيه / سنة", category: "أورام", rules: "يشمل العلاج الكيماوي والإشعاعي لدى المستشفيات والمراكز المتعاقدة لجرعات بروتوكول وزارة الصحة" },
  { service: "علاج الأورام (بروتوكول استثنائي خارج الصحة)", cap: "400,000 جنيه / سنة", category: "أورام", rules: "للحالات التي لا تخضع لبروتوكول الصحة وتستدعي بروتوكولاً آخر (نظام الحالات الاستثنائية)، ويجوز لمجلس الإدارة زيادة المبلغ بعد العرض على المستشار الطبي للأورام" },
  { service: "الإقامة بالمستشفيات", cap: "بالدرجة الثانية", category: "إقامة", rules: "غرفة عدد 2 سرير بحمام خاص طبقاً للأسعار المعتمدة السارية بالصندوق" },
  { service: "جراحة القلب والتوسيع بالبالون", cap: "حسب اللائحة", category: "قلب", rules: "بالمراكز المتخصصة وحسب أسعار اللائحة" },
  { service: "الجراحات والمناظير", cap: "مغطاة بالكامل", category: "جراحة", rules: "جميع الجراحات والمناظير الجراحية مغطاة عدا (جراحات التجميل وشفط الدهون)" },
  { service: "العلاج الطبيعي والأمراض النفسية", cap: "حسب اللائحة", category: "تأهيل", rules: "لدى الأطباء والمراكز المتعاقدة عدا علاج السمنة والتخسيس وطبقاً لأسعار الصندوق" },
  { service: "علاج ما بعد الخروج من المستشفى", cap: "1,000 جنيه", category: "أدوية", rules: "صرف علاج لمدة 15 يوماً بعد الخروج من المستشفى" },
  { service: "استئصال المرارة أو البروستاتا", cap: "20,000 جنيه", category: "جراحة", rules: "تعامل طبقاً لتوصيف العمليات الجراحية بحد أقصى للعملية الواحدة شاملة" },
  { service: "الولادة الطبيعية", cap: "1,500 جنيه", category: "ولادة", rules: "منح العضو ولادة واحدة أثناء خدمته وأيضاً زوجته العضوة" },
  { service: "الولادة القيصرية", cap: "2,500 جنيه", category: "ولادة", rules: "ولادة واحدة أثناء الخدمة (مستثنى: عمليات أطفال الأنابيب وحالات العقم). عمليات الإجهاض وولادة جنين متوفي تعامل معاملة العمليات الجراحية ولا تحتسب ولادة" },
  { service: "زرع النخاع", cap: "100,000 جنيه", category: "زراعة", rules: "بحد أقصى للعملية" },
  { service: "استئصال اللوزتين واللحمية (أقل من 12 عاماً)", cap: "1,000 جنيه", category: "جراحة", rules: "شاملة بحد أقصى" },
  { service: "استئصال اللوزتين واللحمية (أكثر من 12 عاماً)", cap: "2,000 جنيه", category: "جراحة", rules: "شاملة بحد أقصى (عدا التجميل والليزر)" },
  { service: "استعدال الحاجز الأنفي", cap: "حسب اللائحة", category: "جراحة", rules: "طبقاً لأسعار الصندوق وتوصيف العمليات الجراحية" },
  { service: "الجلدية", cap: "مغطى تعاقدياً", category: "جلدية", rules: "عدا حالات التجميل وجلسات علاج البهاق والتبريد وحب الشباب" },
  { service: "زراعة القرنية", cap: "15,000 جنيه", category: "عيون", rules: "بحد أقصى للعملية" },
  { service: "كتاركت (مياه بيضاء) وزرع عدسة", cap: "2,500 جنيه", category: "عيون", rules: "شاملة" },
  { service: "حقن العين الواحدة", cap: "1,500 جنيه", category: "عيون", rules: "للحقنة الواحدة" },
  { service: "عدسة ICL / ICD للعين", cap: "50% مساهمة (بحد أقصى 25,000 جنيه)", category: "عيون", rules: "في الحالات التي يخشى فيها فقدان البصر بعد موافقة المستشار الطبي" },
  { service: "مستثنيات العيون", cap: "غير مغطاة", category: "عيون", rules: "عمليات تصحيح الإبصار والحول للأعضاء والأبناء كبار السن، وزرع العدسة بدون إزالة المياه البيضاء" },
  { service: "جراحة القلب المفتوح", cap: "30,000 جنيه", category: "قلب", rules: "بحد أقصى للعملية" },
  { service: "قسطرة قلب تشخيصية", cap: "1,500 جنيه", category: "قلب", rules: "للعملية" },
  { service: "قسطرة قلب علاجية (بالون + دعامة)", cap: "14,000 جنيه", category: "قلب", rules: "شاملة البالون والدعامة" },
  { service: "تركيب دعامة قلب إضافية", cap: "6,000 جنيه", category: "قلب", rules: "بحد أقصى 3 دعامات بخلاف العناية والمستلزمات" },
  { service: "توسيع بالون قلب إضافي", cap: "2,000 جنيه", category: "قلب", rules: "لكل بالون إضافي" },
  { service: "سلك مرشد", cap: "300 جنيه", category: "قلب", rules: "للقطعة" },
  { service: "منظم ضربات قلب دائم", cap: "20,000 جنيه", category: "قلب", rules: "بحد أقصى للجهاز والتركيب" },
  { service: "دراسة وكي فسيولوجي بالموجات للقلب", cap: "30,000 جنيه", category: "قلب", rules: "بحد أقصى للإجراء" },
  { service: "قسطرة مخية", cap: "25,000 جنيه", category: "مخ وأعصاب", rules: "بحد أقصى للإجراء" },
  { service: "قسطرة الشرايين الطرفية", cap: "20,000 جنيه", category: "أوعية دموية", rules: "شاملة تركيب الدعامات" },
  { service: "عملية زرع الكبد", cap: "70,000 جنيه", category: "زراعة", rules: "بحد أقصى للعملية" },
  { service: "عملية زرع الكلى", cap: "50,000 جنيه", category: "زراعة", rules: "شاملة دون المتبرع (40,000 جنيه للعملية + 10,000 جنيه للأدوية)" },
  { service: "سماعة الأذن الطبية", cap: "2,500 جنيه مساهمة", category: "أجهزة تعويضية", rules: "مرة واحدة كل 3 سنوات" },
  { service: "جهاز تعويضي لأطراف القدم لشلل الأطفال", cap: "6,000 جنيه", category: "أجهزة تعويضية", rules: "كل 3 سنوات" },
  { service: "طرف صناعي لبتر تحت الركبة", cap: "10,000 جنيه", category: "أجهزة تعويضية", rules: "كل 3 سنوات" },
  { service: "طرف صناعي لبتر فوق الركبة", cap: "20,000 جنيه", category: "أجهزة تعويضية", rules: "كل 3 سنوات" },
  { service: "زراعة قوقعة الأذن", cap: "30,000 جنيه", category: "زراعة", rules: "شاملة بحد أقصى" },
  { service: "جهاز تنفس صناعي (CPAP / سباب)", cap: "6,000 جنيه", category: "أجهزة تعويضية", rules: "بحد أقصى للجهاز" },
];

// Section 4 Data: Chronic Disease Monthly Allocations
const CHRONIC_DISEASES = [
  { id: 1, condition: "الأورام غير الحميدة", cap: "تغطية أدوية الأورام فقط", notes: "في حالة استخدام كولستومي وأكياس يساهم الصندوق بحد أقصى 1,000 جنيه شهرياً" },
  { id: 2, condition: "العلاج البيولوجي", cap: "حسب اعتماد المستشار الطبي", notes: "مسموح به في بعض الحالات بعد موافقة المستشار الطبي" },
  { id: 3, condition: "الفشل الكلوي", cap: "2,000 جنيه شهرياً", notes: "مخصص شهري للأدوية" },
  { id: 4, condition: "فصل البلازما للأمراض المناعية", cap: "75% مساهمة كحد أقصى", notes: "من قيمة آخر أسعار المؤسسة العلاجية" },
  { id: 5, condition: "القلب الحرج", cap: "400 جنيه شهرياً", notes: "يرفع إلى 600 جنيه في حالات ضعف عضلة القلب (بشرط إيكو يوضح كفاءة العضلة أقل من 30%)" },
  { id: 6, condition: "الموجات التصادمية على العظام", cap: "50% مساهمة", notes: "على مدار 12 جلسة سنوياً" },
  { id: 7, condition: "فيروس B", cap: "1,350 جنيه شهرياً", notes: "صرف العلاج المعتمد" },
  { id: 8, condition: "فيروس C", cap: "1,000 جنيه شهرياً", notes: "تطبيق بروتوكول وزارة الصحة" },
  { id: 9, condition: "العلاج بالأكسجين المضغوط والعلاج الطبيعي", cap: "طبقاً لأسعار الصندوق", notes: "حسب اللائحة المعتمدة" },
  { id: 10, condition: "الروماتويد", cap: "75% مساهمة (بحد أقصى 400 جنيه)", notes: "شهرياً" },
  { id: 11, condition: "الذئبة الحمراء", cap: "75% مساهمة (بحد أقصى 500 جنيه)", notes: "شهرياً" },
  { id: 12, condition: "التليف الكبدي", cap: "250 جنيه شهرياً", notes: "صرف الأدوية المدعمة للكبد" },
  { id: 13, condition: "التهاب الأعصاب الطرفية", cap: "75% مساهمة (بحد أقصى 200 جنيه)", notes: "شهرياً" },
  { id: 14, condition: "جلطة أو ضمور بالمخ", cap: "75% مساهمة (بحد أقصى 600 جنيه)", notes: "شهرياً" },
  { id: 15, condition: "التخاطب وتعديل السلوك", cap: "طبقاً لأسعار الصندوق", notes: "المحددة من المستشارين الطبيين" },
  { id: 16, condition: "الأمراض النفسية والعصبية", cap: "75% مساهمة (بحد أقصى 350 جنيه)", notes: "شهرياً" },
  { id: 17, condition: "الصرع", cap: "75% مساهمة (بحد أقصى 200 جنيه)", notes: "شهرياً" },
  { id: 18, condition: "التصلب المتعدد (MS / التهاب الأعصاب المتناثر)", cap: "15,000 جنيه شهرياً", notes: "صرف العلاج المعتمد" },
  { id: 19, condition: "قصور وظائف الكلى", cap: "75% مساهمة (بحد أقصى 1,000 جنيه)", notes: "شهرياً" },
  { id: 20, condition: "التهاب القولون التقرحي ومرض كرونز", cap: "50% مساهمة (بحد أقصى 400 جنيه)", notes: "شهرياً" },
  { id: 21, condition: "حمى البحر الأبيض المتوسط", cap: "50% مساهمة (بحد أقصى 250 جنيه)", notes: "شهرياً" },
  { id: 22, condition: "الأنيميا التكسيرية", cap: "50% مساهمة (بحد أقصى 750 جنيه)", notes: "شهرياً" },
  { id: 23, condition: "حقن البوتكس للشلل الدماغي", cap: "5,000 جنيه في السنة", notes: "حد أقصى سنوي" },
  { id: 24, condition: "جلطة أوردة الساق", cap: "50% مساهمة (بحد أقصى 400 جنيه)", notes: "شهرياً" },
  { id: 25, condition: "الشبكية والجلوكوما والتهاب العصب البصري", cap: "50% مساهمة (بحد أقصى 250 جنيه)", notes: "شهرياً" },
  { id: 26, condition: "ضمور العضلات", cap: "50% مساهمة (بحد أقصى 500 جنيه)", notes: "شهرياً" },
  { id: 27, condition: "السدة الرئوية وحساسية الصدر", cap: "50% مساهمة (بحد أقصى 300 جنيه)", notes: "شهرياً" },
  { id: 28, condition: "قصور وانسداد الشرايين الطرفية", cap: "50% مساهمة (بحد أقصى 300 جنيه)", notes: "شهرياً" },
  { id: 29, condition: "القدم السكرية", cap: "50% مساهمة (بحد أقصى 750 جنيه)", notes: "شهرياً" },
  { id: 30, condition: "نقص المناعة وتيبس العمود الفقري", cap: "50% مساهمة (بحد أقصى 1,000 جنيه)", notes: "شهرياً" },
  { id: 31, condition: "قصر القامة للأطفال (نقص هرمون النمو)", cap: "50% مساهمة (بحد أقصى 1,000 جنيه)", notes: "شهرياً" },
  { id: 32, condition: "علاج الصدفية", cap: "50% مساهمة (بحد أقصى 300 جنيه)", notes: "شهرياً" },
];

export function BylawsInteractiveSection() {
  const [activeTab, setActiveTab] = useState<"caps" | "chronic">("caps");
  const [capsSearch, setCapsSearch] = useState("");
  const [chronicSearch, setChronicSearch] = useState("");

  const filteredCaps = SURGICAL_CAPS.filter(
    (item) =>
      item.service.includes(capsSearch.trim()) ||
      item.cap.includes(capsSearch.trim()) ||
      item.rules.includes(capsSearch.trim())
  );

  const filteredChronic = CHRONIC_DISEASES.filter(
    (item) =>
      item.condition.includes(chronicSearch.trim()) ||
      item.cap.includes(chronicSearch.trim()) ||
      item.notes.includes(chronicSearch.trim())
  );

  return (
    <section className="space-y-6 pt-4">
      {/* Navigation Tabs between Section 3 and Section 4 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b-2 border-primary/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              3 & 4. جداول التغطيات الجراحية والأمراض المزمنة
            </h2>
            <p className="text-xs text-muted-foreground">
              ابحث واستعلم فورياً عن الحد المالي المعتمد لأي إجراء جراحي أو علاج شهري
            </p>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "caps" | "chronic")}
          className="w-full sm:w-auto"
        >
          <TabsList className="w-full sm:w-auto bg-muted/80">
            <TabsTrigger value="caps" className="text-xs sm:text-sm gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>الحدود القصوى للخدمات ({SURGICAL_CAPS.length})</span>
            </TabsTrigger>
            <TabsTrigger value="chronic" className="text-xs sm:text-sm gap-1.5">
              <Pill className="w-4 h-4 text-emerald-600" />
              <span>أدوية الأمراض المزمنة ({CHRONIC_DISEASES.length})</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab 1: Section 3 Surgical & Services Caps */}
      {activeTab === "caps" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-muted-foreground" />
              <Input
                type="text"
                value={capsSearch}
                onChange={(e) => setCapsSearch(e.target.value)}
                placeholder="ابحث عن عملية جراحية، قسطرة، أشعة، زراعة أعضاء..."
                className="pr-10 pl-9 h-11 rounded-xl text-xs sm:text-sm bg-card"
              />
              {capsSearch && (
                <button
                  onClick={() => setCapsSearch("")}
                  className="absolute left-3 top-3.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5 self-end sm:self-center">
              <span>النتائج:</span>
              <Badge variant="outline" className="font-mono text-xs">
                {filteredCaps.length} إجراء
              </Badge>
            </div>
          </div>

          <div className="rounded-2xl border bg-card shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="bg-muted/80 text-foreground font-bold border-b">
                <tr>
                  <th className="p-3.5 sm:p-4 min-w-[220px]">نوع الخدمة / الإجراء الطبي</th>
                  <th className="p-3.5 sm:p-4 min-w-[180px]">الحد الأقصى / نسبة التغطية</th>
                  <th className="p-3.5 sm:p-4 min-w-[340px]">القواعد والاشتراطات الخاصة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCaps.length > 0 ? (
                  filteredCaps.map((item, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3.5 sm:p-4 font-bold text-foreground">
                        {item.service}
                      </td>
                      <td className="p-3.5 sm:p-4 font-mono font-bold">
                        <span className="bg-primary/10 text-primary dark:bg-primary/20 px-2.5 py-1 rounded-lg border border-primary/20 inline-block">
                          {item.cap}
                        </span>
                      </td>
                      <td className="p-3.5 sm:p-4 text-muted-foreground leading-relaxed">
                        {item.rules}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-muted-foreground">
                      لا توجد إجراءات مطابقة للبحث "{capsSearch}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Section 4 Chronic Disease Monthly Allocations */}
      {activeTab === "chronic" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-muted-foreground" />
              <Input
                type="text"
                value={chronicSearch}
                onChange={(e) => setChronicSearch(e.target.value)}
                placeholder="ابحث عن مرض مزمن (قلب، أورام، روماتويد، كبد، كلى...)"
                className="pr-10 pl-9 h-11 rounded-xl text-xs sm:text-sm bg-card"
              />
              {chronicSearch && (
                <button
                  onClick={() => setChronicSearch("")}
                  className="absolute left-3 top-3.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5 self-end sm:self-center">
              <span>الحالات المزمنة:</span>
              <Badge variant="outline" className="font-mono text-xs">
                {filteredChronic.length} حالة
              </Badge>
            </div>
          </div>

          <div className="rounded-2xl border bg-card shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="bg-muted/80 text-foreground font-bold border-b">
                <tr>
                  <th className="p-3.5 sm:p-4 w-12 text-center">م</th>
                  <th className="p-3.5 sm:p-4 min-w-[200px]">المرض / الحالة المزمنة</th>
                  <th className="p-3.5 sm:p-4 min-w-[180px]">الحد الأقصى المالي / المساهمة</th>
                  <th className="p-3.5 sm:p-4 min-w-[320px]">الشروط والضوابط الطبية المعتمدة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredChronic.length > 0 ? (
                  filteredChronic.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3.5 sm:p-4 text-center font-mono text-muted-foreground font-bold">
                        {item.id}
                      </td>
                      <td className="p-3.5 sm:p-4 font-bold text-foreground">
                        {item.condition}
                      </td>
                      <td className="p-3.5 sm:p-4 font-mono font-bold">
                        <span className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 inline-block">
                          {item.cap}
                        </span>
                      </td>
                      <td className="p-3.5 sm:p-4 text-muted-foreground leading-relaxed">
                        {item.notes}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      لا توجد حالات مطابقة للبحث "{chronicSearch}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
