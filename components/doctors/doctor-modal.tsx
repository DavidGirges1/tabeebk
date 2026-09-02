"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DoctorWithGovernorate } from "@/lib/supabase/types";
import { parsePhones, formatTelLink, getGoogleMapsUrl } from "@/lib/utils";
import { MapPin, Phone, Stethoscope, Copy, Check, FileText, Share2, User } from "lucide-react";
import { GoogleMapsIcon } from "@/components/common/google-maps-icon";
import { parseDoctorTitleAndSpecialty } from "@/lib/constants/specialties";

interface DoctorModalProps {
  doctor: DoctorWithGovernorate | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DoctorModal({ doctor, isOpen, onClose }: DoctorModalProps) {
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState<number | null>(null);

  if (!doctor) return null;

  const phones = parsePhones(doctor.phones);
  const parsedDoctor = parseDoctorTitleAndSpecialty(
    doctor.doctor_name_ar,
    doctor.specialty_ar,
    doctor.notes_ar
  );

  const handleCopyAddress = async () => {
    if (!doctor.address_ar) return;
    try {
      await navigator.clipboard.writeText(doctor.address_ar);
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyPhone = async (phone: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedPhone(idx);
      setTimeout(() => setCopiedPhone(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = async () => {
    const shareText = `${parsedDoctor.displayName}\nاللقب: ${parsedDoctor.title}\nالتخصص: ${parsedDoctor.specialty || ""}\n${doctor.governorates?.name_ar || ""}\nالعنوان: ${doctor.address_ar || "غير متوفر"}\nالهاتف: ${phones.join(" / ") || "غير متوفر"}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: parsedDoctor.displayName,
          text: shareText,
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("تم نسخ تفاصيل الطبيب إلى الحافظة");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-6">
        <DialogHeader className="space-y-3 pb-2 border-b">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold leading-tight">
                  {parsedDoctor.displayName}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300">
                    <User className="w-3 h-3 ml-1" />
                    {parsedDoctor.title}
                  </Badge>
                  {parsedDoctor.specialty && (
                    <Badge variant="secondary" className="text-xs bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300">
                      <Stethoscope className="w-3 h-3 ml-1" />
                      {parsedDoctor.specialty}
                    </Badge>
                  )}
                  {doctor.governorates?.name_ar && (
                    <Badge variant="outline" className="text-xs gap-1 border-muted-foreground/30">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      محافظة {doctor.governorates.name_ar}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 my-2 text-sm">
          {/* Clinic Address */}
          {doctor.address_ar && (
            <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-muted/40 border">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground block text-xs mb-0.5">
                    عنوان العيادة:
                  </span>
                  <span className="text-muted-foreground leading-relaxed">
                    {doctor.address_ar}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-background/80 rounded-lg"
                  onClick={handleCopyAddress}
                  title={copiedAddr ? "تم النسخ" : "نسخ العنوان"}
                  aria-label="نسخ العنوان"
                >
                  {copiedAddr ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                  title="البحث في خرائط Google"
                  aria-label="البحث في خرائط Google"
                >
                  <a
                    href={getGoogleMapsUrl(doctor.doctor_name_ar, doctor.address_ar)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GoogleMapsIcon className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          )}

          {/* Phone Numbers List */}
          {phones.length > 0 ? (
            <div className="space-y-2 p-3.5 rounded-xl bg-muted/40 border">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground mb-1">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>أرقام الحجز والاستفسار ({phones.length}):</span>
              </div>

              <div className="space-y-2">
                {phones.map((phone, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-background border"
                  >
                    <span className="font-mono text-sm font-semibold" dir="ltr">
                      {phone}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                        onClick={() => handleCopyPhone(phone, idx)}
                      >
                        {copiedPhone === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </Button>

                      <Button
                        asChild
                        size="sm"
                        className="h-8 px-3 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-none"
                      >
                        <a href={`tel:${formatTelLink(phone)}`}>
                          <Phone className="w-3 h-3" />
                          <span>اتصال</span>
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-muted/30 border text-xs text-muted-foreground text-center font-medium" data-testid="doctor-no-phone">
              الهاتف غير متاح
            </div>
          )}

          {/* Notes */}
          {doctor.notes_ar && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
              <FileText className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-xs mb-0.5">ملاحظات / فرع:</span>
                <span className="text-xs leading-relaxed">{doctor.notes_ar}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 pt-3 border-t mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-1.5 text-xs rounded-xl h-10 px-3 font-medium"
          >
            <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
            <span>مشاركة بطاقة الطبيب</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="rounded-xl h-10 px-5 text-xs font-semibold"
          >
            إغلاق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
