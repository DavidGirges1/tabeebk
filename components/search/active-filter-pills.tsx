"use client";

import React from "react";
import { X, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Governorate, ProviderTypeEnum } from "@/lib/supabase/types";
import { PROVIDER_TYPES_MAP } from "@/lib/utils";
import { FilterState } from "@/lib/hooks/use-filters";

interface ActiveFilterPillsProps {
  filters: FilterState;
  governorates: Governorate[];
  onRemove: (key: keyof FilterState) => void;
  onReset: () => void;
}

export function ActiveFilterPills({
  filters,
  governorates,
  onRemove,
  onReset,
}: ActiveFilterPillsProps) {
  const selectedGov = governorates.find((g) => String(g.id) === filters.gov);
  const selectedTypeMeta = filters.type
    ? PROVIDER_TYPES_MAP[filters.type as ProviderTypeEnum]
    : null;

  const hasActiveFilters = Boolean(
    filters.q || filters.gov || filters.type || filters.specialty
  );

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-1 select-none animate-in fade-in duration-200">
      <span className="text-xs font-semibold text-muted-foreground ml-1">
        الفلاتر النشطة:
      </span>

      {filters.q && (
        <Badge
          variant="secondary"
          className="h-8 px-3 rounded-full gap-1.5 text-xs font-medium bg-muted text-foreground border border-border/80 shadow-none"
        >
          <span>بحث: "{filters.q}"</span>
          <button
            type="button"
            onClick={() => onRemove("q")}
            className="hover:opacity-70 text-muted-foreground hover:text-foreground p-0.5"
            aria-label="إزالة فلتر البحث"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </Badge>
      )}

      {selectedGov && (
        <Badge
          variant="secondary"
          className="h-8 px-3 rounded-full gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 shadow-none"
        >
          <span>المحافظة: {selectedGov.name_ar}</span>
          <button
            type="button"
            onClick={() => onRemove("gov")}
            className="hover:opacity-70 text-emerald-700 dark:text-emerald-400 p-0.5"
            aria-label="إزالة فلتر المحافظة"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </Badge>
      )}

      {selectedTypeMeta && (
        <Badge
          variant="secondary"
          className={`h-8 px-3 rounded-full gap-1.5 text-xs font-medium shadow-none ${selectedTypeMeta.badgeClass}`}
        >
          <span>
            {selectedTypeMeta.emoji} {selectedTypeMeta.labelAr}
          </span>
          <button
            type="button"
            onClick={() => onRemove("type")}
            className="hover:opacity-70 p-0.5"
            aria-label="إزالة فلتر نوع الخدمة"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </Badge>
      )}

      {filters.specialty && (
        <Badge
          variant="secondary"
          className="h-8 px-3 rounded-full gap-1.5 text-xs font-medium bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800 shadow-none"
        >
          <span>التخصص: {filters.specialty}</span>
          <button
            type="button"
            onClick={() => onRemove("specialty")}
            className="hover:opacity-70 text-indigo-700 dark:text-indigo-400 p-0.5"
            aria-label="إزالة فلتر التخصص"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </Badge>
      )}

      <button
        type="button"
        onClick={onReset}
        className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 mr-2 px-1.5 py-1 rounded-lg hover:bg-primary/5 transition-colors"
      >
        <RotateCcw className="w-3 h-3" />
        مسح الكل
      </button>
    </div>
  );
}
