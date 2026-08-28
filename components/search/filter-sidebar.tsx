"use client";

import React, { useState } from "react";
import { Filter, MapPin, Building, Stethoscope, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Governorate, ProviderTypeEnum } from "@/lib/supabase/types";
import { PROVIDER_TYPES_MAP, cn } from "@/lib/utils";
import { FilterState } from "@/lib/hooks/use-filters";

interface FilterSidebarProps {
  filters: FilterState;
  governorates: Governorate[];
  specialties?: string[];
  governorateCounts?: Record<number, number>;
  typeCounts?: Record<string, number>;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  className?: string;
}

export function FilterSidebar({
  filters,
  governorates,
  specialties = [],
  governorateCounts = {},
  typeCounts = {},
  onFilterChange,
  onReset,
  className,
}: FilterSidebarProps) {
  const [govSearch, setGovSearch] = useState("");

  const filteredGovs = governorates.filter((g) =>
    g.name_ar.toLowerCase().includes(govSearch.trim().toLowerCase())
  );

  const providerTypeKeys = Object.keys(PROVIDER_TYPES_MAP) as ProviderTypeEnum[];

  return (
    <aside className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b">
        <div className="flex items-center gap-2 font-bold text-base text-foreground">
          <Filter className="w-5 h-5 text-primary" />
          <span>تصفية النتائج</span>
        </div>
        {(filters.gov || filters.type || filters.specialty || filters.q) && (
          <button
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            إعادة ضبط
          </button>
        )}
      </div>

      {/* Provider Types (Facilities) - Only if tab is not 'doctors' */}
      {filters.tab !== "doctors" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-primary" />
              نوع المنشأة الطبية
            </h4>
            {filters.type && (
              <button
                onClick={() => onFilterChange({ type: "" })}
                className="text-[11px] text-primary hover:underline"
              >
                الكل
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            <button
              onClick={() => onFilterChange({ type: "" })}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-right",
                !filters.type
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span>🏥 جميع المنشآت</span>
              {typeCounts["all"] !== undefined && (
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-mono",
                    !filters.type
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted-foreground/10 text-muted-foreground"
                  )}
                >
                  {typeCounts["all"]}
                </span>
              )}
            </button>

            {providerTypeKeys.map((typeKey) => {
              const meta = PROVIDER_TYPES_MAP[typeKey];
              const isSelected = filters.type === typeKey;
              const count = typeCounts[typeKey];

              return (
                <button
                  key={typeKey}
                  onClick={() =>
                    onFilterChange({ type: isSelected ? "" : typeKey })
                  }
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-right",
                    isSelected
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span>{meta.emoji}</span>
                    <span>{meta.labelAr}</span>
                  </span>

                  {count !== undefined && (
                    <span
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-mono",
                        isSelected
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted-foreground/10 text-muted-foreground"
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
      )}

      {/* Governorates Filter */}
      <div className="space-y-3 pt-3 border-t">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            المحافظة ({governorates.length})
          </h4>
          {filters.gov && (
            <button
              onClick={() => onFilterChange({ gov: "" })}
              className="text-[11px] text-primary hover:underline"
            >
              الكل
            </button>
          )}
        </div>

        {/* Search inside governorates */}
        {governorates.length > 8 && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-muted-foreground" />
            <input
              type="text"
              value={govSearch}
              onChange={(e) => setGovSearch(e.target.value)}
              placeholder="ابحث عن محافظة..."
              className="w-full h-8 pr-8 pl-2 text-xs rounded-lg border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}

        <div className="max-h-56 overflow-y-auto space-y-1 pr-1 pl-1 scrollbar-thin">
          <button
            onClick={() => onFilterChange({ gov: "" })}
            className={cn(
              "w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all text-right",
              !filters.gov
                ? "bg-primary/10 text-primary font-bold border border-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <span>كل المحافظات</span>
          </button>

          {filteredGovs.map((gov) => {
            const isSelected = filters.gov === String(gov.id);
            const count = governorateCounts[gov.id];

            return (
              <button
                key={gov.id}
                onClick={() =>
                  onFilterChange({ gov: isSelected ? "" : String(gov.id) })
                }
                className={cn(
                  "w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all text-right",
                  isSelected
                    ? "bg-primary/10 text-primary font-bold border border-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{gov.name_ar}</span>
                {count !== undefined && (
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Specialties (if available and tab allows) */}
      {specialties.length > 0 && (
        <div className="space-y-3 pt-3 border-t">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-primary" />
              التخصص
            </h4>
            {filters.specialty && (
              <button
                onClick={() => onFilterChange({ specialty: "" })}
                className="text-[11px] text-primary hover:underline"
              >
                الكل
              </button>
            )}
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1 pr-1 pl-1 scrollbar-thin">
            <button
              onClick={() => onFilterChange({ specialty: "" })}
              className={cn(
                "w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all text-right",
                !filters.specialty
                  ? "bg-primary/10 text-primary font-bold border border-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span>جميع التخصصات</span>
            </button>

            {specialties.map((spec) => {
              const isSelected = filters.specialty === spec;

              return (
                <button
                  key={spec}
                  onClick={() =>
                    onFilterChange({ specialty: isSelected ? "" : spec })
                  }
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all text-right",
                    isSelected
                      ? "bg-primary/10 text-primary font-bold border border-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="truncate">{spec}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
