"use client";

import React from "react";
import Link from "next/link";
import {
  HeartPulse,
  LogOut,
  ExternalLink,
  ShieldCheck,
  User,
  Database,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminUser } from "@/lib/admin-auth";

interface AdminHeaderProps {
  user: AdminUser | null;
  onLogout: () => void;
}

export function AdminHeader({ user, onLogout }: AdminHeaderProps) {
  return (
    <header className="w-full bg-slate-900 text-white border-b border-slate-800 shadow-md select-none sticky top-0 z-30">
      <div className="container max-w-7xl mx-auto px-3.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-primary to-emerald-500 flex items-center justify-center text-white shadow-md shadow-primary/20 shrink-0">
            <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-black text-xs sm:text-base md:text-lg text-white leading-tight">
                لوحة التحكم والإدارة
              </h1>
              
              {/* Online indicator dot */}
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-1.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">متصل</span>
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium hidden sm:block">
              دليل الرعاية الطبية بالمحافظات
            </p>
          </div>
        </div>

        {/* Right: User profile badge & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* DB Status Badge (Desktop only) */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-300 text-xs font-semibold">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>قاعدة البيانات:</span>
            <span className="text-emerald-400 font-bold">نشطة</span>
          </div>

          {/* User Badge - Compact on mobile */}
          {user && (
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/90 border border-slate-700/80 px-2 py-1 sm:px-3.5 sm:py-1.5 rounded-xl sm:rounded-2xl">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-blue-600 to-primary text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm shrink-0">
                {user.avatarLetter || "أ"}
              </div>
              <div className="text-right max-w-[90px] sm:max-w-none truncate">
                <p className="text-[11px] sm:text-xs font-extrabold text-white leading-tight truncate">
                  {user.displayName}
                </p>
                <p className="text-[9px] sm:text-[10px] text-amber-300 font-medium hidden sm:block">
                  {user.role}
                </p>
              </div>
            </div>
          )}

          {/* View Website Button */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8 sm:h-10 px-2.5 sm:px-3.5 rounded-xl bg-slate-800 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700 text-xs font-bold gap-1.5"
          >
            <Link href="/" target="_blank" rel="noopener noreferrer" title="معاينة الموقع كما يظهر للمستخدمين">
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span className="hidden md:inline">معاينة الموقع</span>
            </Link>
          </Button>

          {/* Logout Button */}
          <Button
            variant="destructive"
            size="sm"
            onClick={onLogout}
            className="h-8 sm:h-10 px-2.5 sm:px-3.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold gap-1 shadow-sm"
            title="تسجيل الخروج من لوحة التحكم"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">خروج</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
