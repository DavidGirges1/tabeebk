"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartPulse, HeartHandshake, ShieldCheck, Code, Sparkles, Building2, User, BookOpen, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  const pathname = usePathname();

  // Hide the public footer on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="w-full border-t bg-slate-900 text-slate-200 mt-auto select-none">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Col 1: Portal & Owner Identity */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-emerald-500 flex items-center justify-center text-white shadow-md">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white block">
                  دليل الرعاية الطبية بالمحافظات 2026
                </span>
                <span className="text-xs text-slate-400">
                  صندوق الرعاية الصحية والاجتماعية للعاملين بمصلحتي الجمارك والضرائب
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed text-justify">
              الموقع الإلكتروني والمنظومة الرقمية الشاملة لشبكة التعاقدات الطبية، صُممت لتسهيل وصول الزملاء الأعضاء وأسرهم الكريمة بجميع المحافظات لكافة المستشفيات والمراكز والأطباء المعتمدين ولائحة العلاج.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <HeartHandshake className="w-4 h-4" />
                <span>إشراف وإهداء:</span>
              </div>
              <p className="text-sm font-bold text-white">
                الأستاذ / تامر صبحي عبدالله
              </p>
              <p className="text-xs text-slate-300 font-medium">
                عضو مجلس الإدارة عن القاهرة والوجه القبلي
              </p>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
              روابط المنظومة والأقسام
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-300 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-primary" />
                  <span>دليل شبكة التعاقدات والمستشفيات</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/introduction"
                  className="text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>تقدمة وكلمة ترحيبية (أ/ تامر صبحي)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/bylaws"
                  className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>لائحة الاشتراكات والحدود القصوى للعلاج</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/bylaws#subscriptions"
                  className="text-slate-400 hover:text-slate-200 transition-colors block pr-6 text-xs"
                >
                  • نسب المساهمات والاشتراكات الدورية
                </Link>
              </li>
              <li>
                <Link
                  href="/bylaws#guidelines"
                  className="text-slate-400 hover:text-slate-200 transition-colors block pr-6 text-xs"
                >
                  • الخدمات المستثناة وتعليمات الموافقات
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Network Stats & Certification */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
              اعتماد الشبكة الطبية
            </h4>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>721 مستشفى ومركز طبي ومعمل</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>336 عيادة واستشاري متخصص</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تغطية شاملة لـ 23 محافظة مصرية</span>
              </div>
            </div>

            <div className="pt-2">
              <Badge className="bg-emerald-950/80 text-emerald-400 border-emerald-800 text-[11px] py-1 px-2.5">
                قواعد علاج معتمدة 2026
              </Badge>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Credits */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <p>
              جميع الحقوق محفوظة © 2026 صندوق الرعاية الصحية والاجتماعية للعاملين بمصلحتي الجمارك والضرائب.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors text-[11px] font-medium border-r border-slate-700 pr-3 mr-1"
              title="بوابة الإدارة المركزية"
            >
              <Lock className="w-3 h-3" />
              <span>بوابة الإدارة</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/90 px-3.5 py-1.5 rounded-full border border-slate-700 text-slate-300">
            <Code className="w-4 h-4 text-primary" />
            <span>
              تصميم وبرمجة:{" "}
              <strong className="text-white font-mono">David E. Girgis</strong>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
