"use client";

import React from "react";
import {
  User,
  Building2,
  MapPin,
  Layers,
  PlusCircle,
  Stethoscope,
  FlaskConical,
  Scan,
  Eye,
  Activity,
  Pill,
  ExternalLink,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PROVIDER_TYPES_MAP, ProviderTypeMeta } from "@/lib/utils";
import { ProviderTypeEnum } from "@/lib/supabase/types";

interface OverviewTabProps {
  stats: {
    totalGovernorates: number;
    totalProviders: number;
    totalDoctors: number;
    totalEntities: number;
    typeCounts: Record<string, number>;
    recentProviders: any[];
    recentDoctors: any[];
  } | null;
  onNavigateTab: (tab: "overview" | "doctors" | "providers" | "governorates") => void;
  onNavigateToProvidersWithType?: (type: string) => void;
  onAddNewDoctor: () => void;
  onAddNewProvider: () => void;
}

export function OverviewTab({
  stats,
  onNavigateTab,
  onNavigateToProvidersWithType,
  onAddNewDoctor,
  onAddNewProvider,
}: OverviewTabProps) {
  const totalDoctors = stats?.totalDoctors || 0;
  const totalProviders = stats?.totalProviders || 0;
  const totalGovernorates = stats?.totalGovernorates || 0;
  const totalEntities = stats?.totalEntities || totalDoctors + totalProviders;

  const typeConfig: { type: ProviderTypeEnum; label: string; icon: any; color: string; bg: string }[] = [
    { type: "hospital", label: "مستشفيات ومراكز طبية", icon: Building2, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900" },
    { type: "lab", label: "معامل تحاليل", icon: FlaskConical, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900" },
    { type: "radiology", label: "مراكز أشعة", icon: Scan, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-900" },
    { type: "eye_center", label: "مراكز وجراحة عيون", icon: Eye, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900" },
    { type: "physical_therapy", label: "علاج طبيعي وتأهيل", icon: Activity, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900" },
    { type: "clinic", label: "عيادات ومجمعات طبية", icon: Stethoscope, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900" },
    { type: "pharmacy", label: "صيدليات", icon: Pill, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in select-none">
      {/* Welcome Banner */}
      {/* Welcome Banner */}
      <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-l from-primary/10 via-blue-50 to-emerald-50/60 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-primary/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground text-[10px] sm:text-xs px-2.5 py-0.5 font-bold">
              لوحة التحكم 2026
            </Badge>
            <span className="text-[11px] sm:text-xs text-muted-foreground font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              تحديث فوري ومباشر
            </span>
          </div>
          <h2 className="text-lg sm:text-3xl font-black text-foreground tracking-tight leading-tight">
            مرحباً بك في نظام إدارة الشبكة الطبية
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl leading-relaxed hidden sm:block">
            يمكنك من هنا تعديل أي بيانات حالية، أو إضافة أطباء ومستشفيات ومراكز جديدة بكل سهولة ويسر. أي تغيير يتم حفظه يظهر فوراً للزوار على الموقع.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 sm:flex sm:flex-row items-stretch gap-2.5 w-full md:w-auto shrink-0 pt-1 sm:pt-0">
          <Button
            onClick={onAddNewDoctor}
            aria-label="إضافة طبيب جديد"
            className="h-10 sm:h-13 text-xs sm:text-base font-bold rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 gap-1.5 sm:gap-2 min-h-[42px]"
          >
            <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>إضافة طبيب جديد</span>
          </Button>

          <Button
            onClick={onAddNewProvider}
            aria-label="إضافة منشأة / مستشفى"
            className="h-10 sm:h-13 text-xs sm:text-base font-bold rounded-xl sm:rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 gap-1.5 sm:gap-2 min-h-[42px]"
          >
            <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>إضافة منشأة / مستشفى</span>
          </Button>
        </div>
      </div>

      {/* Main Metric Cards - 2x2 grid on mobile for clean visibility */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
        {/* Doctors Card */}
        <div
          onClick={() => onNavigateTab("doctors")}
          className="group cursor-pointer p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-card border-2 border-border hover:border-emerald-500 hover:shadow-lg transition-all space-y-2.5 sm:space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <User className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <Badge className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[10px] sm:text-xs px-2 py-0.5 font-bold">
              الأطباء
            </Badge>
          </div>

          <div>
            <p className="text-2xl sm:text-4xl font-black text-foreground">
              {totalDoctors.toLocaleString("ar-EG")}
            </p>
            <p className="text-xs sm:text-sm font-bold text-muted-foreground mt-0.5 sm:mt-1">
              إجمالي الأطباء المسجلين
            </p>
          </div>

          <div className="pt-1.5 sm:pt-2 border-t flex items-center justify-between text-[11px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span>إدارة وتعديل</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Providers Card */}
        <div
          onClick={() => onNavigateTab("providers")}
          className="group cursor-pointer p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-card border-2 border-border hover:border-blue-500 hover:shadow-lg transition-all space-y-2.5 sm:space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <Badge className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-[10px] sm:text-xs px-2 py-0.5 font-bold">
              المنشآت
            </Badge>
          </div>

          <div>
            <p className="text-2xl sm:text-4xl font-black text-foreground">
              {totalProviders.toLocaleString("ar-EG")}
            </p>
            <p className="text-xs sm:text-sm font-bold text-muted-foreground mt-0.5 sm:mt-1">
              إجمالي المنشآت الطبية
            </p>
          </div>

          <div className="pt-1.5 sm:pt-2 border-t flex items-center justify-between text-[11px] sm:text-xs font-bold text-blue-600 dark:text-blue-400">
            <span>إدارة وتعديل</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Governorates Card */}
        <div
          onClick={() => onNavigateTab("governorates")}
          className="group cursor-pointer p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-card border-2 border-border hover:border-purple-500 hover:shadow-lg transition-all space-y-2.5 sm:space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <Badge className="bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 text-[10px] sm:text-xs px-2 py-0.5 font-bold">
              المحافظات
            </Badge>
          </div>

          <div>
            <p className="text-2xl sm:text-4xl font-black text-foreground">
              {totalGovernorates.toLocaleString("ar-EG")}
            </p>
            <p className="text-xs sm:text-sm font-bold text-muted-foreground mt-0.5 sm:mt-1">
              محافظات الجمهورية المغطاة
            </p>
          </div>

          <div className="pt-1.5 sm:pt-2 border-t flex items-center justify-between text-[11px] sm:text-xs font-bold text-purple-600 dark:text-purple-400">
            <span>عرض التوزيع</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Total Network Card */}
        <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900 text-white border-2 border-slate-800 shadow-md space-y-2.5 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center">
              <Layers className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] sm:text-xs px-2 py-0.5 font-bold">
              الشبكة
            </Badge>
          </div>

          <div>
            <p className="text-2xl sm:text-4xl font-black text-white">
              {totalEntities.toLocaleString("ar-EG")}
            </p>
            <p className="text-xs sm:text-sm font-bold text-slate-400 mt-0.5 sm:mt-1">
              إجمالي الشبكة 2026
            </p>
          </div>

          <div className="pt-1.5 sm:pt-2 border-t border-slate-800 flex items-center gap-1 text-[11px] sm:text-xs text-emerald-400 font-semibold truncate">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>محدثة بالكامل</span>
          </div>
        </div>
      </div>

      {/* Breakdown By Facility Type */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <span>توزيع المنشآت الطبية حسب التخصص</span>
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateTab("providers")}
            className="text-xs font-bold text-primary gap-1"
          >
            <span>عرض كل المنشآت</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {typeConfig.map((item) => {
            const count = stats?.typeCounts?.[item.type] || 0;
            const Icon = item.icon;

            return (
              <div
                key={item.type}
                onClick={() => {
                  if (onNavigateToProvidersWithType) {
                    onNavigateToProvidersWithType(item.type);
                  } else {
                    onNavigateTab("providers");
                  }
                }}
                className={`cursor-pointer p-4 rounded-2xl border ${item.bg} hover:shadow-md transition-all flex items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-white dark:bg-slate-900 ${item.color} shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">{item.label}</p>
                    <p className="text-xl font-black text-foreground">
                      {count.toLocaleString("ar-EG")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Helpful Instructions for Seniors */}
      <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-900/60 space-y-3">
        <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-300 font-extrabold text-base">
          <HeartHandshake className="w-5 h-5 text-amber-700 dark:text-amber-400" />
          <span>إرشادات سريعة لتسهيل العمل:</span>
        </div>
        <ul className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
          <li>
            <strong>لتعديل بيانات طبيب أو مستشفى:</strong> انتقل إلى تبويب (الأطباء) أو (المنشآت)، واكتب الاسم في شريط البحث، ثم اضغط زر <strong>✏️ تعديل</strong>.
          </li>
          <li>
            <strong>لإضافة بيانات جديدة:</strong> اضغط على زر <strong>➕ إضافة طبيب</strong> أو <strong>➕ إضافة منشأة</strong> بالأعلى، واملأ الخانات المطلوبة ثم اضغط <strong>حفظ</strong>.
          </li>
          <li>
            <strong>لمعاينة الموقع كما يراه الأعضاء:</strong> اضغط زر <strong>معاينة الموقع</strong> في أعلى الصفحة وسيفتح الموقع في نافذة جديدة.
          </li>
        </ul>
      </div>
    </div>
  );
}
