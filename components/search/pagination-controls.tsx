"use client";

import React from "react";
import { ChevronRight, ChevronLeft, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isPending?: boolean;
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  isPending = false,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers array with ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t mt-8">
      <div className="text-xs sm:text-sm text-muted-foreground font-medium order-2 sm:order-1">
        عرض <span className="font-semibold text-foreground">{startItem}</span> إلى{" "}
        <span className="font-semibold text-foreground">{endItem}</span> من أصل{" "}
        <span className="font-semibold text-foreground">{totalItems}</span> نتيجة
      </div>

      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        {/* Next/Prev buttons in RTL (Next page goes Left) */}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1 || isPending}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-10 px-3 rounded-xl gap-1 text-xs font-semibold"
          aria-label="الصفحة السابقة"
        >
          <ChevronRight className="w-4 h-4" />
          <span className="hidden sm:inline">السابق</span>
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === "...") {
              return (
                <div
                  key={`ellipsis-${idx}`}
                  className="w-9 h-9 flex items-center justify-center text-muted-foreground text-xs"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              );
            }

            const pageNum = Number(p);
            const isActive = pageNum === currentPage;

            return (
              <Button
                key={pageNum}
                variant={isActive ? "default" : "outline"}
                size="sm"
                disabled={isPending}
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  "w-10 h-10 p-0 rounded-xl text-xs font-bold transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm scale-105"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages || isPending}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-10 px-3 rounded-xl gap-1 text-xs font-semibold"
          aria-label="الصفحة التالية"
        >
          <span className="hidden sm:inline">التالي</span>
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
