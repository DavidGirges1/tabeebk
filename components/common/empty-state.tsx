import React from "react";
import { SearchX, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  query?: string;
  onReset?: () => void;
}

export function EmptyState({ query, onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed bg-muted/20 my-6">
      <div className="p-4 bg-muted/60 text-muted-foreground rounded-2xl mb-4">
        <SearchX className="w-10 h-10 stroke-[1.5]" />
      </div>

      <h3 className="text-lg font-bold text-foreground mb-1.5">
        لم يتم العثور على نتائج
      </h3>

      <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
        {query ? (
          <>
            لم نتمكن من إيجاد أي نتائج تطابق البحث عن{" "}
            <span className="font-semibold text-foreground">"{query}"</span>.
            جرّب التأكد من صحة الكلمات أو تقليل الفلاتر المحددة.
          </>
        ) : (
          "لا توجد عناصر تطابق معايير الفلترة المحددة حالياً. جرّب اختيار محافظة أخرى أو إعادة ضبط الفلاتر."
        )}
      </p>

      {onReset && (
        <Button
          onClick={onReset}
          variant="outline"
          className="gap-2 rounded-xl text-xs sm:text-sm font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          إعادة ضبط جميع الفلاتر
        </Button>
      )}
    </div>
  );
}
