"use client";

import React from "react";
import { PROVIDER_TYPES_MAP, cn } from "@/lib/utils";
import { ProviderTypeEnum } from "@/lib/supabase/types";
import { Building2 } from "lucide-react";

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
    <div className="w-full overflow-x-auto py-1 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max pb-1 px-1">
        <button
          onClick={() => onSelectType("")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 shadow-sm select-none border min-h-[38px]",
            !selectedType
              ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/25 scale-[1.02]"
              : "bg-card text-muted-foreground hover:bg-muted/80 hover:text-foreground border-border/70 hover:border-border"
          )}
        >
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          <span>كل المنشآت الطبية</span>
          {typeCounts["all"] !== undefined && (
            <span
              className={cn(
                "text-[10px] px-2 py-0.5 rounded-full font-mono font-bold",
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
                "flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-200 shadow-sm select-none border min-h-[38px]",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/25 scale-[1.02]"
                  : "bg-card text-muted-foreground hover:bg-muted/80 hover:text-foreground border-border/70 hover:border-border"
              )}
            >
              <span className="text-sm leading-none">{meta.emoji}</span>
              <span>{meta.labelAr}</span>
              {count !== undefined && (
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-mono font-bold",
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
