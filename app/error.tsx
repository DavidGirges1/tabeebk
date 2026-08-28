"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-3xl border bg-card shadow-lg space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-foreground">
          حدث خطأ أثناء تحميل البيانات
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          نعتذر، واجهنا مشكلة في جلب البيانات من الخادم. يرجى المحاولة مرة أخرى أو التحقق من الاتصال.
        </p>

        <div className="pt-2">
          <Button
            onClick={() => reset()}
            className="gap-2 rounded-xl h-11 px-6 font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    </div>
  );
}
