"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Building2,
  MapPin,
  Stethoscope,
  Phone,
  FileText,
  Save,
  PlusCircle,
  FlaskConical,
  Scan,
  Eye,
  Activity,
  Pill,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Governorate, ProviderTypeEnum } from "@/lib/supabase/types";
import { PROVIDER_TYPES_MAP } from "@/lib/utils";

interface ProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (providerData: any) => Promise<boolean>;
  initialData?: any | null;
  governorates: Governorate[];
}

const PROVIDER_TYPES: { type: ProviderTypeEnum; label: string; emoji: string }[] = [
  { type: "hospital", label: "مستشفيات ومراكز طبية", emoji: "🏥" },
  { type: "lab", label: "معامل تحاليل", emoji: "🧪" },
  { type: "radiology", label: "مراكز أشعة", emoji: "🩻" },
  { type: "eye_center", label: "مراكز وجراحة عيون", emoji: "👁️" },
  { type: "physical_therapy", label: "علاج طبيعي وتأهيل", emoji: "🏃" },
  { type: "clinic", label: "عيادات ومجمعات طبية", emoji: "🩺" },
  { type: "pharmacy", label: "صيدليات", emoji: "💊" },
];

export function ProviderModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  governorates,
}: ProviderModalProps) {
  const isEditing = !!initialData?.id;

  const [name, setName] = useState("");
  const [providerType, setProviderType] = useState<ProviderTypeEnum>("hospital");
  const [governorateId, setGovernorateId] = useState<number | string>("");
  const [specialty, setSpecialty] = useState("");
  const [address, setAddress] = useState("");
  const [phones, setPhones] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name_ar || "");
      setProviderType(initialData.provider_type || "hospital");
      setGovernorateId(initialData.governorate_id || (governorates[0]?.id ?? ""));
      setSpecialty(initialData.specialty_ar || "");
      setAddress(initialData.address_ar || "");
      setPhones(initialData.phones || "");
      setNotes(initialData.notes_ar || "");
    } else {
      setName("");
      setProviderType("hospital");
      setGovernorateId(governorates[0]?.id || "");
      setSpecialty("");
      setAddress("");
      setPhones("");
      setNotes("");
    }
    setErrorMsg("");
  }, [initialData, governorates, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("يرجى إدخال اسم المنشأة الطبية");
      return;
    }

    if (!governorateId) {
      setErrorMsg("يرجى اختيار المحافظة");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        id: initialData?.id,
        name_ar: name.trim(),
        provider_type: providerType,
        governorate_id: parseInt(String(governorateId), 10),
        specialty_ar: specialty.trim() || null,
        address_ar: address.trim() || null,
        phones: phones.trim() || null,
        notes_ar: notes.trim() || null,
      };

      const success = await onSave(payload);
      if (success) {
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ أثناء حفظ بيانات المنشأة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in overflow-y-auto select-none">
      <div
        className="w-full max-w-2xl bg-card text-card-foreground border-2 border-border rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md">
              {isEditing ? <Building2 className="w-6 h-6" /> : <PlusCircle className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black">
                {isEditing ? "تعديل بيانات المنشأة الطبية" : "إضافة منشأة أو مستشفى جديد"}
              </h3>
              <p className="text-xs text-slate-300">
                {isEditing ? "تحديث بيانات المستشفى أو المركز" : "إدخال صرح طبي جديد لشبكة التعاقدات"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-bold">
              {errorMsg}
            </div>
          )}

          {/* Facility Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-primary" />
              <span>اسم المستشفى أو المركز الطبي أو المعمل * :</span>
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: مستشفى السلام الدولي / معمل المختبر / مركز كايرو سكان..."
              required
              className="h-12 text-base font-semibold rounded-xl bg-muted/40"
            />
          </div>

          {/* Type & Governorate (2 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Facility Type Selector */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>نوع المنشأة الطبية * :</span>
              </label>
              <select
                value={providerType}
                onChange={(e) => setProviderType(e.target.value as ProviderTypeEnum)}
                required
                className="w-full h-12 px-3.5 rounded-xl border border-input bg-muted/40 text-base font-semibold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                {PROVIDER_TYPES.map((t) => (
                  <option key={t.type} value={t.type}>
                    {t.emoji} {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Governorate Dropdown */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                <span>المحافظة * :</span>
              </label>
              <select
                value={governorateId}
                onChange={(e) => setGovernorateId(e.target.value)}
                required
                className="w-full h-12 px-3.5 rounded-xl border border-input bg-muted/40 text-base font-semibold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                {governorates.map((gov) => (
                  <option key={gov.id} value={gov.id}>
                    {gov.name_ar} {gov.region ? `(${gov.region})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Specialty / Departments */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-primary" />
              <span>التخصص أو الخدمات المتاحة (اختياري) :</span>
            </label>
            <Input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="مثال: طوارئ 24 ساعة، عناية مركزة، غسيل كلوي، قسطرة قلب..."
              className="h-12 text-base font-semibold rounded-xl bg-muted/40"
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              <span>العنوان بالتفصيل :</span>
            </label>
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="مثال: شارع النصر، أمام مستشفى المعادي العسكري..."
              className="h-12 text-base font-semibold rounded-xl bg-muted/40"
            />
          </div>

          {/* Phone Numbers */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-primary" />
              <span>أرقام الهواتف والخط الساخن :</span>
            </label>
            <Input
              type="text"
              value={phones}
              onChange={(e) => setPhones(e.target.value)}
              placeholder="مثال: 19000 / 0225123456 / 01099887766"
              dir="ltr"
              className="h-12 text-base font-mono rounded-xl bg-muted/40"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-primary" />
              <span>ملاحظات إضافية أو تعليمات التحويل والخصم :</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: خصم خاص 20% على التحاليل، تقديم كارنيه الصندوق مباشرة..."
              rows={3}
              className="w-full p-3 rounded-xl border border-input bg-muted/40 text-base font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            />
          </div>

          {/* Footer Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto h-12 px-6 rounded-2xl text-base font-bold"
            >
              إلغاء
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto h-12 px-8 rounded-2xl text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 gap-2 min-h-[48px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جاري الحفظ...</span>
                </div>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{isEditing ? "حفظ التعديلات" : "إضافة المنشأة الآن"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
