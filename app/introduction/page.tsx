import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Building2, HeartHandshake, Award, Stamp } from "lucide-react";

export const metadata = {
  title: "تقدمة وكلمة ترحيبية | أ/ تامر صبحي عبدالله",
  description:
    "كلمة ترحيبية من الأستاذ تامر صبحي عبدالله، عضو مجلس الإدارة عن القاهرة والوجه القبلي لصندوق علاج العاملين بمصلحتي الجمارك والضرائب.",
};

export default function IntroductionPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
      <Navbar />

      <main className="container max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1">
        {/* Back Link */}
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground">
            <Link href="/">
              <ArrowRight className="w-4 h-4" />
              العودة إلى الدليل الطبي والبحث
            </Link>
          </Button>
        </div>

        {/* Paper Letter Container */}
        <article className="relative bg-amber-50/40 dark:bg-slate-900 border-2 border-amber-200/80 dark:border-amber-900/40 shadow-xl rounded-3xl p-6 sm:p-12 space-y-8 overflow-hidden backdrop-blur-sm">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-200/40 to-transparent rounded-bl-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-200/40 to-transparent rounded-tr-full pointer-events-none" />

          {/* Letterhead Header */}
          <header className="text-center space-y-4 border-b-2 border-amber-300/60 dark:border-amber-800/60 pb-8">
            <div className="flex justify-center">
              <Badge
                variant="outline"
                className="px-4 py-1 text-xs font-bold gap-2 rounded-full bg-amber-100/80 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
              >
                <HeartHandshake className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>صندوق الرعاية الصحية والاجتماعية للعاملين بمصلحتي الجمارك والضرائب</span>
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-950 dark:text-amber-100 tracking-tight font-serif leading-tight">
              تَقْدِمَة وَكَلِمَة تَرْحِيبِيَّة
            </h1>

            <div className="flex items-center justify-center gap-3 text-xs sm:text-sm text-amber-800/80 dark:text-amber-300/80 font-medium">
              <span>إشراف وإهداء:</span>
              <span className="font-bold text-amber-950 dark:text-amber-100 bg-amber-200/50 dark:bg-amber-900/50 px-2.5 py-0.5 rounded-lg">
                أ/ تامر صبحي عبدالله
              </span>
            </div>
          </header>

          {/* Letter Body */}
          <div className="space-y-6 text-base sm:text-lg text-slate-800 dark:text-slate-200 leading-loose font-serif">
            {/* Greeting */}
            <p className="font-bold text-lg sm:text-xl text-amber-950 dark:text-amber-100 border-r-4 border-amber-500 pr-3 py-1">
              زملائي وزميلاتي الأعزاء العاملين بمصلحتي الجمارك وضرائب القيمة المضافة،
            </p>

            <p className="text-center font-bold text-amber-900 dark:text-amber-200 text-lg py-2">
              السلام عليكم ورحمة الله وبركاته،
            </p>

            <p className="indent-8 text-justify">
              يسعدني أن أضع بين أيديكم الموقع الإلكتروني الشخصي لتعاقدات صندوق العلاج الخاص بالعاملين، هذا الصرح التكافلي الذي نفخر جميعاً بالانتماء إليه.
            </p>

            <p className="indent-8 text-justify">
              لقد حرصت أن يكون هذا الموقع دليلاً شاملاً وواضحاً، يضم شبكة التعاقدات الطبية من مستشفيات ومراكز الأشعة والتحاليل والصيدليات والأطباء بكافة محافظات الجمهورية، ليضمن لكم ولأسركم الكريمة خدمة طبية لائقة وكريمة تليق بعطائكم.
            </p>

            <p className="indent-8 text-justify">
              إن صندوقكم وُجد من أجلكم، وسيظل قوياً بتكاتفكم ودعمكم وثقتكم الغالية، ونعاهدكم أمام الله على بذل كل الجهد لتطوير منظومته والارتقاء بخدماته والاستماع إلى كافة مقترحاتكم.
            </p>

            <p className="indent-8 text-justify">
              أسأل الله تعالى أن يديم علينا جميعاً نعمة الصحة والعافية، وأن يوفقنا لما فيه صالح زملائنا.
            </p>
          </div>

          {/* Signature & Seal Block */}
          <footer className="pt-8 border-t-2 border-amber-300/60 dark:border-amber-800/60 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-amber-800/80 dark:text-amber-300/80 text-xs sm:text-sm">
              <Award className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-bold text-foreground">دليل تعاقدات الرعاية الطبية 2026</p>
                <p className="text-xs text-muted-foreground">خدمة تكافلية لخدمة الزملاء وأسرهم</p>
              </div>
            </div>

            <div className="text-center sm:text-left space-y-1 bg-amber-100/50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">أخوكم وزميلكم</p>
              <p className="text-lg font-extrabold text-amber-950 dark:text-amber-100 font-serif">
                تامر صبحي عبدالله
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                عضو مجلس الإدارة عن القاهرة والوجه القبلي
              </p>
            </div>
          </footer>
        </article>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <Link
            href="/"
            className="group flex items-center justify-between p-5 rounded-2xl border bg-card hover:border-primary/50 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                  تصفح الشبكة الطبية
                </h3>
                <p className="text-xs text-muted-foreground">
                  721 منشأة طبية و 336 طبيب بـ 23 محافظة
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
          </Link>

          <Link
            href="/bylaws"
            className="group flex items-center justify-between p-5 rounded-2xl border bg-card hover:border-emerald-500/50 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-emerald-600 transition-colors">
                  لائحة الاشتراكات وقواعد العلاج
                </h3>
                <p className="text-xs text-muted-foreground">
                  الحدود القصوى ونسب المساهمة وجداول الأمراض
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-600 group-hover:-translate-x-1 transition-all" />
          </Link>
        </div>
      </main>
    </div>
  );
}
