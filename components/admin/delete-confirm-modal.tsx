"use client";

import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  itemTypeLabel: string;
  isLoading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  itemTypeLabel,
  isLoading = false,
}: DeleteConfirmModalProps) {
  // Close on Escape key
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in select-none"
    >
      <div
        className="w-full max-w-lg bg-card text-card-foreground border-2 border-red-200 dark:border-red-900 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6"
        dir="rtl"
      >
        {/* Warning Icon & Header */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 shadow-inner">
            <AlertTriangle className="w-8 h-8 animate-bounce" />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="text-xl sm:text-2xl font-black text-foreground">
              {title || `تأكيد حذف ${itemTypeLabel}`}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">
              يرجى مراجعة هذا الإجراء بعناية قبل التأكيد.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground p-1 rounded-xl hover:bg-muted transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Item To Delete Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 space-y-2">
          <p className="text-xs font-bold text-red-800 dark:text-red-300">
            العنصر المراد حذفه نهائياً:
          </p>
          <p className="text-lg font-black text-red-900 dark:text-red-100">
            {itemName}
          </p>
          <p className="text-xs text-red-700 dark:text-red-400">
            ⚠️ تنبيه: سيتم حذف هذا السجل نهائياً من قاعدة بيانات المنظومة ولن يتمكن الزوار من العثور عليه.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto h-12 px-6 rounded-2xl text-base font-bold"
          >
            تراجع وإلغاء
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto h-12 px-6 rounded-2xl text-base font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 gap-2 min-h-[48px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>جاري الحذف...</span>
              </div>
            ) : (
              <>
                <Trash2 className="w-5 h-5" />
                <span>نعم، حذف نهائي</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
