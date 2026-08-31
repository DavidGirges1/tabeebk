"use client";

import React from "react";
import { LayoutDashboard, User, Building2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type AdminTab = "overview" | "doctors" | "providers" | "governorates";

interface AdminNavTabsProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  doctorsCount?: number;
  providersCount?: number;
  govsCount?: number;
}

export function AdminNavTabs({
  activeTab,
  onTabChange,
  doctorsCount = 0,
  providersCount = 0,
  govsCount = 0,
}: AdminNavTabsProps) {
  const tabs = [
    {
      id: "overview" as AdminTab,
      label: "لوحة التحكم الرئيسية",
      shortLabel: "الرئيسية",
      icon: LayoutDashboard,
    },
    {
      id: "doctors" as AdminTab,
      label: "إدارة الأطباء",
      shortLabel: "الأطباء",
      icon: User,
      badge: doctorsCount > 0 ? doctorsCount.toLocaleString("ar-EG") : undefined,
    },
    {
      id: "providers" as AdminTab,
      label: "إدارة المنشآت والمستشفيات",
      shortLabel: "المنشآت",
      icon: Building2,
      badge: providersCount > 0 ? providersCount.toLocaleString("ar-EG") : undefined,
    },
    {
      id: "governorates" as AdminTab,
      label: "إدارة المحافظات",
      shortLabel: "المحافظات",
      icon: MapPin,
      badge: govsCount > 0 ? govsCount.toLocaleString("ar-EG") : undefined,
    },
  ];

  return (
    <>
      {/* Desktop & Tablet Navigation Tabs */}
      <div className="hidden md:flex items-center gap-2 p-1.5 rounded-2xl bg-muted/80 border border-border/80 shadow-inner select-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-black transition-all",
                isActive
                  ? "bg-card text-foreground shadow-md border border-border scale-[1.01]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4",
                  isActive ? "text-primary stroke-[2.5]" : "text-muted-foreground"
                )}
              />
              <span>{tab.label}</span>
              {tab.badge && (
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className="text-[11px] font-mono px-2 py-0"
                >
                  {tab.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Fixed Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-2 py-1.5 shadow-2xl safe-area-inset-bottom">
        <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all select-none min-h-[50px]",
                  isActive
                    ? "text-primary-foreground font-black bg-primary/90 shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                <Icon className={cn("w-5 h-5 mb-0.5", isActive && "stroke-[2.5]")} />
                <span className="text-[11px] leading-tight font-bold">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
