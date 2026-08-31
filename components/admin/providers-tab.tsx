"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Search,
  PlusCircle,
  Edit,
  Trash2,
  Phone,
  MapPin,
  Stethoscope,
  X,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Governorate, ProviderWithGovernorate, ProviderTypeEnum } from "@/lib/supabase/types";
import { PROVIDER_TYPES_MAP, parsePhones } from "@/lib/utils";

interface ProvidersTabProps {
  governorates: Governorate[];
  onAddNew: () => void;
  onEdit: (provider: ProviderWithGovernorate) => void;
  onDelete: (provider: ProviderWithGovernorate) => void;
  toastSuccess: (msg: string) => void;
  toastError: (msg: string) => void;
}

const FACILITY_TYPES: { id: string; label: string; emoji: string }[] = [
  { id: "", label: "جميع المنشآت", emoji: "🏢" },
  { id: "hospital", label: "مستشفيات ومراكز", emoji: "🏥" },
  { id: "lab", label: "معامل تحاليل", emoji: "🧪" },
  { id: "radiology", label: "مراكز أشعة", emoji: "🩻" },
  { id: "eye_center", label: "مراكز عيون", emoji: "👁️" },
  { id: "physical_therapy", label: "علاج طبيعي", emoji: "🏃" },
  { id: "clinic", label: "عيادات ومجمعات", emoji: "🩺" },
  { id: "pharmacy", label: "صيدليات", emoji: "💊" },
];

export function ProvidersTab({
  governorates,
  onAddNew,
  onEdit,
  onDelete,
  toastSuccess,
  toastError,
}: ProvidersTabProps) {
  const [providers, setProviders] = useState<ProviderWithGovernorate[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGov, setSelectedGov] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchProviders = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", "15");
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (selectedGov) params.set("gov", selectedGov);
      if (selectedType) params.set("type", selectedType);

      const res = await fetch(`/api/admin/providers?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setProviders(data.data || []);
        setTotalCount(data.count || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        toastError(data.error || "تعذر تحميل قائمة المنشآت الطبية");
      }
    } catch (err: any) {
      toastError("فشل الاتصال بالخادم أثناء جلب المنشآت");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [page, selectedGov, selectedType]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchProviders();
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedGov("");
    setSelectedType("");
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in select-none">
      {/* Top Action Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-card border-2 border-border shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2.5">
              <Building2 className="w-6 h-6 text-primary" />
              <span>إدارة المستشفيات والمنشآت والمراكز الطبية</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              إجمالي المنشآت: <strong className="text-foreground">{totalCount.toLocaleString("ar-EG")}</strong> صرح طبي
            </p>
          </div>

          <Button
            onClick={onAddNew}
            className="w-full sm:w-auto h-13 px-6 text-base font-bold rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 gap-2 min-h-[50px]"
          >
            <PlusCircle className="w-5 h-5" />
            <span>➕ إضافة منشأة / مستشفى جديد</span>
          </Button>
        </div>

        {/* Type Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t">
          {FACILITY_TYPES.map((t) => {
            const isSelected = selectedType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedType(t.id);
                  setPage(1);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                    : "bg-muted hover:bg-muted/80 text-foreground border border-border"
                }`}
              >
                <span>{t.emoji}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Filters Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المستشفى أو المركز، العنوان، أو الهاتف..."
              className="h-12 pr-11 pl-10 text-sm sm:text-base font-medium rounded-xl bg-muted/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                title="مسح البحث"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Governorate Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedGov}
              onChange={(e) => {
                setSelectedGov(e.target.value);
                setPage(1);
              }}
              className="w-full h-12 px-3 rounded-xl border border-input bg-muted/40 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <option value="">كل المحافظات</option>
              {governorates.map((gov) => (
                <option key={gov.id} value={gov.id}>
                  {gov.name_ar}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters Button */}
          <div className="sm:col-span-3">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="w-full h-12 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة ضبط الفلاتر</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="p-12 text-center space-y-3 bg-card rounded-3xl border">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-muted-foreground">جاري تحميل بيانات المنشآت الطبية...</p>
        </div>
      ) : providers.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center space-y-4 bg-card rounded-3xl border-2 border-dashed border-border">
          <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-foreground">لم يتم العثور على منشآت مطابقة</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
              جرب تغيير كلمة البحث أو الفلتر، أو أضف منشأة جديدة بالضغط على الزر بالأعلى.
            </p>
          </div>
          <Button onClick={onAddNew} className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl gap-2">
            <PlusCircle className="w-4 h-4" />
            <span>إضافة منشأة الآن</span>
          </Button>
        </div>
      ) : (
        /* Providers List */
        <div className="space-y-3">
          {providers.map((provider) => {
            const typeMeta = PROVIDER_TYPES_MAP[provider.provider_type as ProviderTypeEnum] || {
              labelAr: "منشأة طبية",
              badgeClass: "bg-muted text-foreground",
              emoji: "🏥",
            };
            const phoneList = parsePhones(provider.phones);

            return (
              <div
                key={provider.id}
                className="p-5 rounded-3xl bg-card border-2 border-border hover:border-primary/60 transition-all shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Left: Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-foreground">
                      {provider.name_ar}
                    </h3>

                    <Badge className={`text-xs font-bold px-2.5 py-0.5 border ${typeMeta.badgeClass}`}>
                      <span className="ml-1">{typeMeta.emoji}</span>
                      <span>{typeMeta.labelAr}</span>
                    </Badge>

                    {provider.governorates && (
                      <Badge variant="outline" className="text-xs font-bold px-2.5 py-0.5 bg-muted/60 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 ml-1" />
                        {provider.governorates.name_ar}
                      </Badge>
                    )}
                  </div>

                  {/* Specialty / Departments */}
                  {provider.specialty_ar && (
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                      <Stethoscope className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{provider.specialty_ar}</span>
                    </p>
                  )}

                  {/* Address */}
                  {provider.address_ar && (
                    <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{provider.address_ar}</span>
                    </p>
                  )}

                  {/* Phones */}
                  {phoneList.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      {phoneList.map((ph, idx) => (
                        <a
                          key={idx}
                          href={`tel:${ph}`}
                          className="inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          <span dir="ltr">{ph}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  {provider.notes_ar && (
                    <p className="text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-2 rounded-xl flex items-start gap-1.5">
                      <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{provider.notes_ar}</span>
                    </p>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0">
                  <Button
                    variant="outline"
                    onClick={() => onEdit(provider)}
                    className="h-11 px-4 rounded-xl text-sm font-bold text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-950 gap-1.5 min-h-[44px]"
                  >
                    <Edit className="w-4 h-4" />
                    <span>تعديل</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => onDelete(provider)}
                    className="h-11 px-4 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950 gap-1.5 min-h-[44px]"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>حذف</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="p-4 rounded-2xl bg-card border flex items-center justify-between gap-4">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="h-11 px-4 rounded-xl text-sm font-bold gap-1.5"
          >
            <ChevronRight className="w-4 h-4" />
            <span>الصفحة السابقة</span>
          </Button>

          <span className="text-xs sm:text-sm font-bold text-muted-foreground">
            صفحة <strong className="text-foreground">{page}</strong> من <strong className="text-foreground">{totalPages}</strong>
          </span>

          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="h-11 px-4 rounded-xl text-sm font-bold gap-1.5"
          >
            <span>الصفحة التالية</span>
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
