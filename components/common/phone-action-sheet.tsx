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
import { Phone, Copy, Check, ExternalLink } from "lucide-react";
import { formatTelLink } from "@/lib/utils";

interface PhoneActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  phones: string[];
}

export function PhoneActionSheet({
  isOpen,
  onClose,
  title,
  phones,
}: PhoneActionSheetProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (phone: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (e) {
      console.error("Failed to copy phone", e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold">
                أرقام التواصل والاتصال
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm line-clamp-1">
                {title}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-2.5 my-2">
          {phones.map((phone, idx) => {
            const cleanTel = formatTelLink(phone);
            const isCopied = copiedIndex === idx;

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl border bg-muted/40 hover:bg-muted/70 transition-colors gap-2"
              >
                <div className="flex items-center gap-2 font-mono text-sm font-semibold text-foreground">
                  <span className="text-muted-foreground text-xs">#{idx + 1}</span>
                  <span dir="ltr">{phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-3 gap-1.5 text-xs"
                    onClick={() => handleCopy(phone, idx)}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>نسخ</span>
                      </>
                    )}
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    className="h-9 px-4 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm"
                  >
                    <a href={`tel:${cleanTel}`}>
                      <Phone className="w-3.5 h-3.5" />
                      <span>اتصال</span>
                    </a>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <Button variant="ghost" className="w-full text-xs text-muted-foreground" onClick={onClose}>
            إغلاق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
