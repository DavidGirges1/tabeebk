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
import { ProviderWithGovernorate } from "@/lib/supabase/types";
import { PROVIDER_TYPES_MAP, parsePhones, formatTelLink, getGoogleMapsUrl } from "@/lib/utils";
import { MapPin, Phone, Building2, Stethoscope, Copy, Check, FileText, Share2 } from "lucide-react";
import { GoogleMapsIcon } from "@/components/common/google-maps-icon";

interface ProviderModalProps {
  provider: ProviderWithGovernorate | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProviderModal({ provider, isOpen, onClose }: ProviderModalProps) {
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState<number | null>(null);

  if (!provider) return null;

  const typeMeta = PROVIDER_TYPES_MAP[provider.provider_type];
  const phones = parsePhones(provider.phones);

  const handleCopyAddress = async () => {
    if (!provider.address_ar) return;
    try {
      await navigator.clipboard.writeText(provider.address_ar);
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
    const shareText = `${provider.name_ar}\n${typeMeta?.labelAr || ""}\n${provider.governorates?.name_ar || ""}\nالعنوان: ${provider.address_ar || "غير متوفر"}\nالهاتف: ${provider.phones || "غير متوفر"}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: provider.name_ar,
          text: shareText,
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("تم نسخ تفاصيل المنشأة إلى الحافظة");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-6">
        <DialogHeader className="space-y-3 pb-2 border-b">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                {typeMeta?.emoji || "🏥"}
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold leading-tight">
                  {provider.name_ar}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  {typeMeta && (
                    <Badge variant="secondary" className={`text-xs ${typeMeta.badgeClass}`}>
                      {typeMeta.labelAr}
                    </Badge>
                  )}
                  {provider.governorates?.name_ar && (
                    <Badge variant="outline" className="text-xs gap-1 border-muted-foreground/30">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      محافظة {provider.governorates.name_ar}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 my-2 text-sm">
          {/* Specialty / Service */}
          {provider.specialty_ar && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/40 border">
              <Stethoscope className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground block text-xs mb-0.5">
                  الخدمة / التخصص:
                </span>
                <span className="text-muted-foreground">{provider.specialty_ar}</span>
              </div>
            </div>
          )}

          {/* Address */}
          {provider.address_ar && (
            <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-muted/40 border">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground block text-xs mb-0.5">
                    العنوان التفصيلي:
                  </span>
                  <span className="text-muted-foreground leading-relaxed">
                    {provider.address_ar}
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
                    href={getGoogleMapsUrl(provider.name_ar, provider.address_ar)}
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
                <span>أرقام الهاتف المتاحة ({phones.length}):</span>
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
            <div className="p-3.5 rounded-xl bg-muted/30 border text-xs text-muted-foreground text-center">
              لا توجد أرقام هواتف مسجلة لهذه المنشأة
            </div>
          )}

          {/* Notes */}
          {provider.notes_ar && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
              <FileText className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-xs mb-0.5">ملاحظات:</span>
                <span className="text-xs leading-relaxed">{provider.notes_ar}</span>
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
            <span>مشاركة المنشأة</span>
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
