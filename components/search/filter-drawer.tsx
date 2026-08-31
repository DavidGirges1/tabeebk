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

      <SheetContent side="right" className="w-full sm:max-w-md p-6 overflow-y-auto">
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              تصفية النتائج
            </span>
            {activeCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeCount} فلتر نشط
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <FilterSidebar
            filters={filters}
            governorates={governorates}
            specialties={specialties}
            governorateCounts={governorateCounts}
            typeCounts={typeCounts}
            onFilterChange={handleFilterSelect}
            onReset={onReset}
          />
        </div>

        <SheetFooter className="sticky bottom-0 bg-background pt-4 border-t gap-2">
          <Button
            onClick={() => setIsOpen(false)}
            className="w-full h-12 rounded-xl font-bold text-sm shadow-md"
          >
            عرض النتائج
          </Button>

          {activeCount > 0 && (
            <Button
              variant="outline"
              onClick={onReset}
              className="w-full h-11 rounded-xl text-xs gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              إعادة ضبط الفلاتر
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
