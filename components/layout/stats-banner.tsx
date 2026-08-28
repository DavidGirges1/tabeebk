"use client";

import React from "react";
import { PROVIDER_TYPES_MAP, cn } from "@/lib/utils";
import { ProviderTypeEnum } from "@/lib/supabase/types";

interface StatsBannerProps {
  selectedType: string;
  onSelectType: (type: string) => void;
  typeCounts?: Record<string, number>;
}

export function StatsBanner({
  selectedType,
  onSelectType,
  typeCounts = {},
}: StatsBannerProps) {
  const typesList = Object.entries(PROVIDER_TYPES_MAP) as [
    ProviderTypeEnum,
    (typeof PROVIDER_TYPES_MAP)[ProviderTypeEnum]
  ][];

  return (
    <div className="w-full overflow-x-auto py-2 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max pb-1">
        <button
          onClick={() => onSelectType("")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-semibold transition-all shadow-sm select-none min-h-[40px]",
            !selectedType
              ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10"
              : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border-border/80"
          )}
        >
          <span>🏥 جميع التخصصات</span>
          {typeCounts["all"] !== undefined && (
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold",
                !selectedType
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {typeCounts["all"]}
            </span>
          )}
        </button>

        {typesList.map(([key, meta]) => {
          const isSelected = selectedType === key;
          const count = typeCounts[key];

          return (
            <button
              key={key}
              onClick={() => onSelectType(isSelected ? "" : key)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-semibold transition-all shadow-sm select-none min-h-[40px]",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border-border/80"
              )}
            >
              <span>{meta.emoji}</span>
              <span>{meta.labelAr}</span>
              {count !== undefined && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold",
                    isSelected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
