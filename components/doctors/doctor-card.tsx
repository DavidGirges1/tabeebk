"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Stethoscope, ChevronLeft, User, Copy, Check } from "lucide-react";
import { DoctorWithGovernorate } from "@/lib/supabase/types";
import { parsePhones, formatTelLink, getGoogleMapsUrl } from "@/lib/utils";
import { PhoneActionSheet } from "@/components/common/phone-action-sheet";
import { GoogleMapsIcon } from "@/components/common/google-maps-icon";

import { parseDoctorTitleAndSpecialty } from "@/lib/constants/specialties";

interface DoctorCardProps {
  doctor: DoctorWithGovernorate;
  onSelect?: (doctor: DoctorWithGovernorate) => void;
}

export function DoctorCard({ doctor, onSelect }: DoctorCardProps) {
  const [showPhoneSheet, setShowPhoneSheet] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const phones = parsePhones(doctor.phones);
  const parsedDoctor = parseDoctorTitleAndSpecialty(
    doctor.doctor_name_ar,
    doctor.specialty_ar,
    doctor.notes_ar
  );

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (phones.length > 1) {
      setShowPhoneSheet(true);
    } else if (phones.length === 1) {
      window.location.href = `tel:${formatTelLink(phones[0])}`;
    }
  };

  const handleCopyAddress = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!doctor.address_ar) return;
    try {
      await navigator.clipboard.writeText(doctor.address_ar);
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Card
        onClick={() => onSelect?.(doctor)}
        className="group relative cursor-pointer flex flex-col justify-between hover:shadow-lg hover:border-indigo-500/50 border-border/80 hover:-translate-y-0.5 transition-all duration-200 bg-card rounded-2xl overflow-hidden"
      >
        <CardHeader className="pb-3 space-y-2.5">
          {/* Header Badges */}
          <div className="flex items-center justify-between gap-2">
            <Badge
              variant="secondary"
              className="text-[11px] font-bold gap-1 py-0.5 px-2.5 rounded-full bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800"
              data-testid="doctor-title-badge"
            >
              <User className="w-3 h-3" />
              <span>{parsedDoctor.title}</span>
            </Badge>

            {doctor.governorates?.name_ar && (
              <Badge
                variant="outline"
                className="text-[11px] font-semibold text-muted-foreground border-border gap-1 bg-muted/40 rounded-full"
              >
                <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>{doctor.governorates.name_ar}</span>
              </Badge>
            )}
          </div>

          {/* Doctor Name */}
          <CardTitle className="text-base sm:text-lg font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
            {parsedDoctor.displayName}
          </CardTitle>

          {/* Specialty */}
          {parsedDoctor.specialty && (
            <div
              className="flex items-center gap-1.5 text-xs text-indigo-700 dark:text-indigo-400 font-semibold line-clamp-1"
              data-testid="doctor-specialty-text"
            >
              <Stethoscope className="w-3.5 h-3.5 shrink-0" />
              <span>{parsedDoctor.specialty}</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="pb-3 text-xs sm:text-sm text-muted-foreground space-y-2">
          {/* Clinic Address */}
          {doctor.address_ar ? (
            <div className="flex items-start justify-between gap-1.5 leading-relaxed">
              <div className="flex items-start gap-1.5 line-clamp-2">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <span>{doctor.address_ar}</span>
              </div>
              <div
                className="flex items-center gap-0.5 shrink-0 mt-0.5"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GoogleMapsIcon className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground/60 italic">
              العنوان غير محدد تفصيلياً
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-2 pb-3.5 border-t bg-muted/20 flex items-center justify-between gap-2">
          {/* Phone dialer trigger */}
          {phones.length > 0 ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handlePhoneClick}
              className="h-10 px-3.5 gap-1.5 text-xs font-bold rounded-xl bg-background border-border hover:bg-indigo-600 hover:text-white hover:border-indigo-600 active:scale-95 transition-all min-h-[40px]"
              aria-label={`الاتصال بـ ${doctor.doctor_name_ar}`}
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600 group-hover:text-inherit" />
              <span dir="ltr" className="font-mono">
                {phones.length === 1 ? phones[0] : `${phones.length} أرقام`}
              </span>
            </Button>
          ) : (
            <span className="text-[11px] text-muted-foreground font-medium">
              الهاتف غير متاح
            </span>
          )}

          <Button
            size="sm"
            variant="ghost"
            className="h-10 px-3 text-xs text-muted-foreground group-hover:text-indigo-600 gap-1 font-semibold mr-auto min-h-[40px]"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(doctor);
            }}
            aria-label={`عرض تفاصيل ${doctor.doctor_name_ar}`}
          >
            <span>التفاصيل</span>
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </Button>
        </CardFooter>
      </Card>

      {/* Multiple Phones Popup */}
      <PhoneActionSheet
        isOpen={showPhoneSheet}
        onClose={() => setShowPhoneSheet(false)}
        title={doctor.doctor_name_ar}
        phones={phones}
      />
    </>
  );
}
