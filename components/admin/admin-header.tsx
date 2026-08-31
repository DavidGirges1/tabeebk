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
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
              <HeartPulse className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base sm:text-lg text-white leading-tight">
                  لوحة التحكم والإدارة
                </h1>
                <Badge className="bg-primary/20 text-primary-foreground border-primary/30 text-[10px] px-2 py-0.5">
                  2026
                </Badge>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                دليل الرعاية الطبية بالمحافظات
              </p>
            </div>
          </div>

          {/* Database indicator on mobile */}
          <div className="sm:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Supabase متصل</span>
          </div>
        </div>

        {/* Right: User profile badge & Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* DB Status Badge (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-300 text-xs font-semibold">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>قاعدة البيانات:</span>
            <span className="text-emerald-400 font-bold">نشطة</span>
          </div>

          {/* User Badge */}
          {user && (
            <div className="flex items-center gap-2.5 bg-slate-800/90 border border-slate-700/80 px-3.5 py-1.5 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {user.avatarLetter || "أ"}
              </div>
              <div className="text-right">
                <p className="text-xs font-extrabold text-white leading-tight">
                  {user.displayName}
                </p>
                <p className="text-[10px] text-amber-300 font-medium">
                  {user.role}
                </p>
              </div>
            </div>
          )}

          {/* View Website Button (Opens in New Tab) */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-10 px-3.5 rounded-xl bg-slate-800 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700 text-xs font-bold gap-1.5"
          >
            <Link href="/" target="_blank" rel="noopener noreferrer" title="معاينة الموقع كما يظهر للمستخدمين">
              <ExternalLink className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">معاينة الموقع</span>
            </Link>
          </Button>

          {/* Logout Button */}
          <Button
            variant="destructive"
            size="sm"
            onClick={onLogout}
            className="h-10 px-3.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold gap-1.5 shadow-sm"
            title="تسجيل الخروج من لوحة التحكم"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
