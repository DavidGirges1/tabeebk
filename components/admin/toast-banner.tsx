"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title?: string;
  message: string;
}

interface ToastBannerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastBanner({ toasts, onDismiss }: ToastBannerProps) {
  useEffect(() => {
    if (toasts.length === 0) return;

    const timer = setTimeout(() => {
      onDismiss(toasts[0].id);
    }, 4500);

    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 space-y-2 pointer-events-none select-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            dir="rtl"
            className={cn(
              "pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3.5 backdrop-blur-lg animate-in slide-in-from-top-4 duration-300",
              isSuccess && "bg-emerald-950/90 border-emerald-600/80 text-emerald-100",
              isError && "bg-red-950/90 border-red-600/80 text-red-100",
              !isSuccess && !isError && "bg-blue-950/90 border-blue-600/80 text-blue-100"
            )}
          >
            {isSuccess && <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />}
            {!isSuccess && !isError && <Info className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />}

            <div className="flex-1 space-y-0.5">
              {toast.title && <p className="font-extrabold text-sm">{toast.title}</p>}
              <p className="text-xs sm:text-sm font-medium leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-white/60 hover:text-white p-1 rounded-lg transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
