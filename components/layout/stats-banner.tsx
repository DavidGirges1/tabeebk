"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { PROVIDER_TYPES_MAP, cn } from "@/lib/utils";
import { ProviderTypeEnum } from "@/lib/supabase/types";
import { Building2, ChevronRight, ChevronLeft } from "lucide-react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(true);

  const typesList = Object.entries(PROVIDER_TYPES_MAP) as [
    ProviderTypeEnum,
    (typeof PROVIDER_TYPES_MAP)[ProviderTypeEnum]
  ][];

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    const absScroll = Math.abs(scrollLeft);
    
    setCanScrollRight(absScroll > 15);
    setCanScrollLeft(absScroll < maxScroll - 15);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const handleScroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    // In RTL, moving left means advancing forward (negative scrollLeft in modern browsers)
    const amount = dir === "left" ? -260 : 260;
    el.scrollBy({ left: amount, behavior: "smooth" });
    setTimeout(checkScroll, 300);
  };

  return (
    <div className="relative group w-full">
      {/* Desktop Scroll Button - Right (Backwards in RTL) */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => handleScroll("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background/95 backdrop-blur border border-border shadow-md items-center justify-center text-foreground hover:bg-muted transition-all active:scale-95 -mr-3"
          aria-label="التمرير لليمين"
          title="السابق"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Desktop Scroll Button - Left (Forwards in RTL) */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => handleScroll("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background/95 backdrop-blur border border-border shadow-md items-center justify-center text-foreground hover:bg-muted transition-all active:scale-95 -ml-3"
          aria-label="التمرير لليسار"
          title="التالي"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto py-1 scrollbar-none scroll-smooth"
      >
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
    </div>
  );
}
