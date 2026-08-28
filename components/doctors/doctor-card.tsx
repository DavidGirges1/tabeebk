"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Stethoscope, ChevronLeft, User } from "lucide-react";
import { DoctorWithGovernorate } from "@/lib/supabase/types";
import { parsePhones, formatTelLink } from "@/lib/utils";
import { PhoneActionSheet } from "@/components/common/phone-action-sheet";

interface DoctorCardProps {
  doctor: DoctorWithGovernorate;
  onSelect?: (doctor: DoctorWithGovernorate) => void;
}

export function DoctorCard({ doctor, onSelect }: DoctorCardProps) {
  const [showPhoneSheet, setShowPhoneSheet] = useState(false);
  const phones = parsePhones(doctor.phones);

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (phones.length > 1) {
      setShowPhoneSheet(true);
    } else if (phones.length === 1) {
      window.location.href = `tel:${formatTelLink(phones[0])}`;
    }
  };

  return (
    <>
      <Card
        onClick={() => onSelect?.(doctor)}
        className="group relative cursor-pointer flex flex-col justify-between hover:shadow-md hover:border-indigo-500/40 border-border/80 transition-all duration-200 bg-card overflow-hidden"
      >
        <CardHeader className="pb-3 space-y-2">
          {/* Header Badges */}
          <div className="flex items-center justify-between gap-2">
            <Badge
              variant="secondary"
              className="text-[11px] font-medium gap-1 py-0.5 px-2.5 bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800"
            >
              <User className="w-3 h-3" />
              <span>طبيب / استشاري</span>
            </Badge>

            {doctor.governorates?.name_ar && (
              <Badge
                variant="outline"
                className="text-[11px] font-medium text-muted-foreground border-border gap-1 bg-muted/30"
              >
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span>{doctor.governorates.name_ar}</span>
              </Badge>
            )}
          </div>

          {/* Doctor Name */}
          <CardTitle className="text-base sm:text-lg font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
            {doctor.doctor_name_ar}
          </CardTitle>

          {/* Specialty */}
          {doctor.specialty_ar && (
            <div className="flex items-center gap-1.5 text-xs text-indigo-700 dark:text-indigo-400 font-semibold line-clamp-1">
              <Stethoscope className="w-3.5 h-3.5 shrink-0" />
              <span>{doctor.specialty_ar}</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="pb-3 text-xs sm:text-sm text-muted-foreground space-y-2">
          {/* Clinic Address */}
          {doctor.address_ar ? (
            <div className="flex items-start gap-1.5 line-clamp-2 leading-relaxed">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <span>{doctor.address_ar}</span>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground/60 italic">
              العنوان غير محدد تفصيلياً
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-2 pb-4 border-t bg-muted/20 flex items-center justify-between gap-2">
          {/* Phone dialer trigger */}
          {phones.length > 0 ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handlePhoneClick}
              className="h-9 px-3 gap-1.5 text-xs font-semibold rounded-xl bg-background border-border hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors min-h-[38px]"
              aria-label={`الاتصال بـ ${doctor.doctor_name_ar}`}
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600 group-hover:text-inherit" />
              <span dir="ltr" className="font-mono">
                {phones.length === 1 ? phones[0] : `${phones.length} أرقام`}
              </span>
            </Button>
          ) : (
            <span className="text-[11px] text-muted-foreground">لا يوجد هاتف</span>
          )}

          <Button
            size="sm"
            variant="ghost"
            className="h-9 px-2.5 text-xs text-muted-foreground group-hover:text-indigo-600 gap-1 font-medium mr-auto"
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
