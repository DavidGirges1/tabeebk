"use client";

import React from "react";
import { Building2, User, Layers, SlidersHorizontal } from "lucide-react";
import { FilterState } from "@/lib/hooks/use-filters";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface MobileBottomNavProps {
  activeTab: FilterState["tab"];
  onTabChange: (tab: FilterState["tab"]) => void;
  onOpenFilter?: () => void;
  activeFilterCount?: number;
}

export function MobileBottomNav({
  activeTab,
  onTabChange,
  onOpenFilter,
  activeFilterCount = 0,
}: MobileBottomNavProps) {
  const tabs: { id: FilterState["tab"]; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "all", label: "الكل", icon: Layers },
    { id: "providers", label: "المنشآت", icon: Building2 },
    { id: "doctors", label: "الأطباء", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border/80 px-2 py-1.5 shadow-lg safe-area-inset-bottom">
      <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all select-none min-h-[48px]",
                isActive
                  ? "text-primary font-bold bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5 mb-0.5", isActive && "stroke-[2.5]")} />
              <span className="text-[11px] leading-none">{tab.label}</span>
            </button>
          );
        })}

        {onOpenFilter && (
          <button
            onClick={onOpenFilter}
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-muted-foreground hover:text-foreground transition-all select-none relative min-h-[48px]"
          >
            <div className="relative">
              <SlidersHorizontal className="w-5 h-5 mb-0.5" />
              {activeFilterCount > 0 && (
                <Badge className="absolute -top-1 -right-2 h-4 w-4 p-0 flex items-center justify-center rounded-full text-[9px] font-bold bg-primary text-primary-foreground">
                  {activeFilterCount}
                </Badge>
              )}
            </div>
            <span className="text-[11px] leading-none">تصفية</span>
          </button>
        )}
      </div>
    </nav>
  );
}
