"use client";

import React, { useState } from "react";
import { Filter, SlidersHorizontal, RotateCcw } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilterSidebar } from "./filter-sidebar";
import { Governorate } from "@/lib/supabase/types";
import { FilterState } from "@/lib/hooks/use-filters";

interface FilterDrawerProps {
  filters: FilterState;
  governorates: Governorate[];
  specialties?: string[];
  governorateCounts?: Record<number, number>;
  typeCounts?: Record<string, number>;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  activeCount: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function FilterDrawer({
  filters,
  governorates,
  specialties = [],
  governorateCounts = {},
  typeCounts = {},
  onFilterChange,
  onReset,
  activeCount,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: FilterDrawerProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = setControlledOpen || setInternalOpen;

  const handleFilterSelect = (newFilters: Partial<FilterState>) => {
    onFilterChange(newFilters);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="h-12 px-4 rounded-2xl gap-2 text-sm font-semibold border-border/80 shadow-sm relative shrink-0 min-h-[44px]"
        >
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <span>تصفية</span>
          {activeCount > 0 && (
            <Badge
              variant="default"
              className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px] font-bold bg-primary text-primary-foreground"
            >
              {activeCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="w-full sm:max-w-xl mx-auto p-5 sm:p-6 overflow-y-auto max-h-[88vh] rounded-t-[28px] border-t shadow-2xl">
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1.5 bg-muted-foreground/25 rounded-full mx-auto -mt-1 mb-3 select-none" />

        <SheetHeader className="pb-3 border-b">
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-base sm:text-lg font-bold">
              <Filter className="w-5 h-5 text-primary" />
              تصفية ودقة البحث
            </span>
            {activeCount > 0 && (
              <Badge variant="secondary" className="text-xs px-2.5 py-0.5 rounded-full font-bold">
                {activeCount} فلتر نشط
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="py-3">
          <FilterSidebar
            filters={filters}
            governorates={governorates}
            specialties={specialties}
            governorateCounts={governorateCounts}
            typeCounts={typeCounts}
            onFilterChange={handleFilterSelect}
            onReset={onReset}
            hideHeader={true}
          />
        </div>

        <SheetFooter className="sticky bottom-0 bg-background/95 backdrop-blur-md pt-3 pb-3 border-t gap-2.5">
          <Button
            onClick={() => setIsOpen(false)}
            className="w-full h-12 rounded-xl font-bold text-sm shadow-md min-h-[44px]"
          >
            عرض النتائج {activeCount > 0 ? `(${activeCount} فلتر)` : ""}
          </Button>

          {activeCount > 0 && (
            <Button
              variant="outline"
              onClick={onReset}
              className="w-full h-11 rounded-xl text-xs gap-1.5 min-h-[44px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              إعادة ضبط كل الفلاتر
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
