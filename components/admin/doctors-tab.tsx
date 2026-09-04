"use client";

import React, { useState, useEffect } from "react";
import {
  User,
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
  Filter,
  Sparkles,
  FileText,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Governorate, DoctorWithGovernorate } from "@/lib/supabase/types";
import { parsePhones } from "@/lib/utils";
import { MEDICAL_SPECIALTIES } from "@/lib/constants/specialties";

interface DoctorsTabProps {
  governorates: Governorate[];
  onAddNew: () => void;
  onEdit: (doctor: DoctorWithGovernorate) => void;
  onDelete: (doctor: DoctorWithGovernorate) => void;
  toastSuccess: (msg: string) => void;
  toastError: (msg: string) => void;
  refreshTrigger?: number;
}

export function DoctorsTab({
  governorates,
  onAddNew,
  onEdit,
  onDelete,
  toastSuccess,
  toastError,
  refreshTrigger = 0,
}: DoctorsTabProps) {
  const [doctors, setDoctors] = useState<DoctorWithGovernorate[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGov, setSelectedGov] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch doctors whenever page, searchQuery, selectedGov, selectedSpecialty change
  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", "15");
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (selectedGov) params.set("gov", selectedGov);
      if (selectedSpecialty) params.set("specialty", selectedSpecialty);

      const res = await fetch(`/api/admin/doctors?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setDoctors(data.data || []);
        setTotalCount(data.count || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        toastError(data.error || "تعذر تحميل قائمة الأطباء");
      }
    } catch (err: any) {
      toastError("فشل الاتصال بالخادم أثناء جلب الأطباء");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [page, selectedGov, selectedSpecialty, refreshTrigger]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchDoctors();
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedGov("");
    setSelectedSpecialty("");
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in select-none">
      {/* Top Action Bar */}
      <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-card border-2 border-border shadow-sm space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div>
            <h2 className="text-base sm:text-2xl font-black text-foreground flex items-center gap-1.5 sm:gap-2.5">
              <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>إدارة بيانات الأطباء والاستشاريين</span>
            </h2>
            <p className="text-[11px] sm:text-sm text-muted-foreground mt-0.5">
              المسجلين: <strong className="text-foreground">{totalCount.toLocaleString("ar-EG")}</strong> طبيب
            </p>
          </div>

          <Button
            onClick={onAddNew}
            aria-label="➕ إضافة طبيب جديد"
            className="h-9 sm:h-12 px-3 sm:px-6 text-xs sm:text-base font-bold rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 gap-1.5 shrink-0 min-h-[38px]"
          >
            <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">➕ إضافة طبيب جديد</span>
            <span className="sm:hidden">إضافة طبيب</span>
          </Button>
        </div>

        {/* Search & Filters Controls */}
        <div className="space-y-2 pt-2 border-t">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الطبيب، التخصص، أو العنوان..."
              className="h-10 sm:h-12 pr-10 pl-10 text-xs sm:text-base font-medium rounded-xl bg-muted/40"
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

          {/* Filters Row - 2 columns on mobile */}
          <div className="grid grid-cols-12 gap-2">
            {/* Governorate Filter */}
            <div className="col-span-6 sm:col-span-5">
              <select
                value={selectedGov}
                onChange={(e) => {
                  setSelectedGov(e.target.value);
                  setPage(1);
                }}
                className="w-full h-9 sm:h-11 px-2 sm:px-3 rounded-xl border border-input bg-muted/40 text-xs sm:text-sm font-semibold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <option value="">كل المحافظات</option>
                {governorates.map((gov) => (
                  <option key={gov.id} value={gov.id}>
                    {gov.name_ar}
                  </option>
                ))}
              </select>
            </div>

            {/* Specialty Filter */}
            <div className="col-span-4 sm:col-span-5">
              <select
                value={selectedSpecialty}
                onChange={(e) => {
                  setSelectedSpecialty(e.target.value);
                  setPage(1);
                }}
                className="w-full h-9 sm:h-11 px-2 sm:px-3 rounded-xl border border-input bg-muted/40 text-xs sm:text-sm font-semibold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <option value="">كل التخصصات</option>
                {MEDICAL_SPECIALTIES.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters */}
            <div className="col-span-2 sm:col-span-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                disabled={!searchQuery && !selectedGov && !selectedSpecialty}
                className="w-full h-9 sm:h-11 rounded-xl text-xs font-bold gap-1 p-0 sm:px-3 border-border hover:bg-muted"
                title="إعادة ضبط الفلاتر"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">إعادة ضبط</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="p-12 text-center space-y-3 bg-card rounded-3xl border">
          <div className="w-10 h-10 border-4 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-muted-foreground">جاري تحميل بيانات الأطباء...</p>
        </div>
      ) : doctors.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center space-y-4 bg-card rounded-3xl border-2 border-dashed border-border">
          <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-foreground">لم يتم العثور على أطباء مطابقة</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
              جرب تغيير كلمة البحث أو الفلتر، أو أضف طبيباً جديداً بالضغط على الزر الأخضر بالأعلى.
            </p>
          </div>
          <Button onClick={onAddNew} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl gap-2">
            <PlusCircle className="w-4 h-4" />
            <span>إضافة طبيب الآن</span>
          </Button>
        </div>
      ) : (
        /* Doctors List */
        <div className="space-y-3">
          {doctors.map((doctor) => {
            const phoneList = parsePhones(doctor.phones);

            return (
              <div
                key={doctor.id}
                className="p-5 rounded-3xl bg-card border-2 border-border hover:border-emerald-500/60 transition-all shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Left: Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-foreground">
                      {doctor.doctor_name_ar}
                    </h3>

                    {doctor.specialty_ar && (
                      <Badge className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-xs font-bold px-2.5 py-0.5">
                        <Stethoscope className="w-3.5 h-3.5 ml-1" />
                        {doctor.specialty_ar}
                      </Badge>
                    )}

                    {doctor.governorates && (
                      <Badge variant="outline" className="text-xs font-bold px-2.5 py-0.5 bg-muted/60 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 ml-1" />
                        {doctor.governorates.name_ar}
                      </Badge>
                    )}
                  </div>

                  {/* Address */}
                  {doctor.address_ar && (
                    <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{doctor.address_ar}</span>
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
                  {doctor.notes_ar && (
                    <p className="text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-2 rounded-xl flex items-start gap-1.5">
                      <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{doctor.notes_ar}</span>
                    </p>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0">
                  <Button
                    variant="outline"
                    onClick={() => onEdit(doctor)}
                    className="h-11 px-4 rounded-xl text-sm font-bold text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-950 gap-1.5 min-h-[44px]"
                  >
                    <Edit className="w-4 h-4" />
                    <span>تعديل</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => onDelete(doctor)}
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
