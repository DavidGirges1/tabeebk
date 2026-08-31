"use client";

import React, { useState } from "react";
import {
  MapPin,
  Building2,
  User,
  PlusCircle,
  Edit,
  Save,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Governorate } from "@/lib/supabase/types";

interface EnrichedGovernorate extends Governorate {
  providersCount?: number;
  doctorsCount?: number;
  totalCount?: number;
}

interface GovernoratesTabProps {
  governorates: EnrichedGovernorate[];
  onRefresh: () => void;
  toastSuccess: (msg: string) => void;
  toastError: (msg: string) => void;
}

export function GovernoratesTab({
  governorates,
  onRefresh,
  toastSuccess,
  toastError,
}: GovernoratesTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGov, setEditingGov] = useState<EnrichedGovernorate | null>(null);
  const [nameAr, setNameAr] = useState("");
  const [region, setRegion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleOpenAdd = () => {
    setEditingGov(null);
    setNameAr("");
    setRegion("");
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleOpenEdit = (gov: EnrichedGovernorate) => {
    setEditingGov(gov);
    setNameAr(gov.name_ar);
    setRegion(gov.region || "");
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim()) {
      setErrorMsg("اسم المحافظة مطلوب");
      return;
    }

    setIsLoading(true);
    try {
      const isEditing = !!editingGov?.id;
      const res = await fetch("/api/admin/governorates", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingGov?.id,
          name_ar: nameAr.trim(),
          region: region.trim() || null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toastSuccess(isEditing ? "تم تعديل المحافظة بنجاح" : "تمت إضافة المحافظة بنجاح");
        setModalOpen(false);
        onRefresh();
      } else {
        setErrorMsg(data.error || "فشل في حفظ المحافظة");
      }
    } catch (err: any) {
      setErrorMsg("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in select-none">
      {/* Top Action Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-card border-2 border-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <span>إدارة وتوزيع المحافظات والمناطق</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            إجمالي المحافظات المسجلة: <strong className="text-foreground">{governorates.length}</strong> محافظة
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto h-13 px-6 text-base font-bold rounded-2xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20 gap-2 min-h-[50px]"
        >
          <PlusCircle className="w-5 h-5" />
          <span>➕ إضافة محافظة جديدة</span>
        </Button>
      </div>

      {/* Governorates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {governorates.map((gov) => {
          const provCount = gov.providersCount || 0;
          const docCount = gov.doctorsCount || 0;
          const total = gov.totalCount || provCount + docCount;

          return (
            <div
              key={gov.id}
              className="p-5 rounded-3xl bg-card border-2 border-border hover:border-purple-500/60 transition-all shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
                    <span>{gov.name_ar}</span>
                  </h3>
                  {gov.region && (
                    <Badge variant="secondary" className="text-xs font-semibold mt-1">
                      {gov.region}
                    </Badge>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEdit(gov)}
                  className="h-9 w-9 p-0 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
                  title="تعديل اسم المحافظة"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              {/* Stats within Governorate */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <span className="text-muted-foreground block text-[10px]">المنشآت:</span>
                    <strong className="text-foreground font-bold">{provCount.toLocaleString("ar-EG")}</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <span className="text-muted-foreground block text-[10px]">الأطباء:</span>
                    <strong className="text-foreground font-bold">{docCount.toLocaleString("ar-EG")}</strong>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Governorate Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in select-none">
          <div
            className="w-full max-w-md bg-card text-card-foreground border-2 border-border rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5"
            dir="rtl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                <span>{editingGov ? "تعديل المحافظة" : "إضافة محافظة جديدة"}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground">اسم المحافظة (بالعربية) * :</label>
                <Input
                  type="text"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="مثال: القاهرة / الإسكندرية / أسيوط..."
                  required
                  className="h-12 text-base font-semibold rounded-xl bg-muted/40"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground">الإقليم أو النطاق الجغرافي :</label>
                <Input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="مثال: القاهرة الكبرى / الوجه البحري والقناة / الوجه القبلي..."
                  className="h-12 text-base font-semibold rounded-xl bg-muted/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  disabled={isLoading}
                  className="h-12 px-5 rounded-xl font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 px-6 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white gap-2 min-h-[48px]"
                >
                  <Save className="w-4 h-4" />
                  <span>{isLoading ? "جاري الحفظ..." : "حفظ المحافظة"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
