"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User,
  MapPin,
  Stethoscope,
  Phone,
  FileText,
  Save,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Governorate } from "@/lib/supabase/types";
import { MEDICAL_SPECIALTIES, POPULAR_SPECIALTIES } from "@/lib/constants/specialties";

interface DoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doctorData: any) => Promise<boolean>;
  initialData?: any | null;
  governorates: Governorate[];
}

export function DoctorModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  governorates,
}: DoctorModalProps) {
  const isEditing = !!initialData?.id;

  const [doctorName, setDoctorName] = useState("");
  const [governorateId, setGovernorateId] = useState<number | string>("");
  const [specialty, setSpecialty] = useState("");
  const [address, setAddress] = useState("");
  const [phones, setPhones] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (initialData) {
      setDoctorName(initialData.doctor_name_ar || "");
      setGovernorateId(initialData.governorate_id || (governorates[0]?.id ?? ""));
      setSpecialty(initialData.specialty_ar || "");
      setAddress(initialData.address_ar || "");
      setPhones(initialData.phones || "");
      setNotes(initialData.notes_ar || "");
    } else {
      setDoctorName("");
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

    if (!doctorName.trim()) {
      setErrorMsg("يرجى إدخال اسم الطبيب");
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
        doctor_name_ar: doctorName.trim(),
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
      setErrorMsg(err.message || "حدث خطأ أثناء حفظ البيانات");
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
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              {isEditing ? <User className="w-6 h-6" /> : <PlusCircle className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black">
                {isEditing ? "تعديل بيانات الطبيب" : "إضافة طبيب أو استشاري جديد"}
              </h3>
              <p className="text-xs text-slate-300">
                {isEditing ? "تحديث وتعديل البيانات المسجلة" : "إدخال بيانات طبيب جديد للشبكة"}
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

          {/* Doctor Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <User className="w-4 h-4 text-primary" />
              <span>اسم الطبيب أو الاستشاري (ثلاثي أو رباعي) * :</span>
            </label>
            <Input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="مثال: د. مجدي يعقوب / أ.د أحمد سامي..."
              required
              className="h-12 text-base font-semibold rounded-xl bg-muted/40"
            />
          </div>

          {/* Governorate & Specialty (2 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {/* Specialty Dropdown */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-primary" />
                <span>التخصص الطبي (مطابق لقاعدة البيانات والفلاتر) :</span>
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full h-12 px-3.5 rounded-xl border border-input bg-muted/40 text-base font-semibold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <option value="">-- اختر التخصص الطبي --</option>
                {specialty && !MEDICAL_SPECIALTIES.includes(specialty as any) && (
                  <option value={specialty}>{specialty} (مسجل حالياً)</option>
                )}
                {MEDICAL_SPECIALTIES.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Specialty Suggestions */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>أو اختر من التخصصات الأكثر شيوعاً:</span>
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
              {POPULAR_SPECIALTIES.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => setSpecialty(spec)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    specialty === spec
                      ? "bg-primary text-primary-foreground border-primary font-bold shadow-sm"
                      : "bg-muted/60 hover:bg-muted text-foreground border-border"
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              <span>عنوان العيادة / المركز بالتفصيل :</span>
            </label>
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="مثال: شارع التحرير، برج الأطباء، الدور الثالث..."
              className="h-12 text-base font-semibold rounded-xl bg-muted/40"
            />
          </div>

          {/* Phone Numbers */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-primary" />
              <span>أرقام الهواتف والتواصل :</span>
            </label>
            <Input
              type="text"
              value={phones}
              onChange={(e) => setPhones(e.target.value)}
              placeholder="مثال: 01012345678 / 0223456789"
              dir="ltr"
              className="h-12 text-base font-mono rounded-xl bg-muted/40"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-primary" />
              <span>ملاحظات إضافية أو مواعيد العيادة :</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: الحجز مسبقاً، يومياً من 5 إلى 9 مساءً عدا الجمعة..."
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
              className="w-full sm:w-auto h-12 px-8 rounded-2xl text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 gap-2 min-h-[48px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جاري الحفظ...</span>
                </div>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{isEditing ? "حفظ التعديلات" : "إضافة الطبيب الآن"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
