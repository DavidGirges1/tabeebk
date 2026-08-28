"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartPulse,
  Building2,
  BookOpen,
  Sparkles,
  Menu,
  X,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      href: "/",
      label: "الدليل والشبكة الطبية",
      icon: Building2,
      active: pathname === "/",
    },
    {
      href: "/introduction",
      label: "تقدمة",
      icon: Sparkles,
      active: pathname === "/introduction",
      badge: "كلمة ترحيبية",
    },
    {
      href: "/bylaws",
      label: "لائحة الاشتراكات والخدمات",
      icon: BookOpen,
      active: pathname === "/bylaws",
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-all shadow-sm">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group select-none">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary via-primary/90 to-emerald-500 flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg text-foreground tracking-tight">
                دليل الرعاية الطبية
              </span>
              <Badge
                variant="outline"
                className="hidden sm:inline-flex text-[10px] py-0 px-2 font-mono bg-primary/5 text-primary border-primary/20"
              >
                2026
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:flex items-center gap-1.5 font-medium">
              <span>إشراف وإعداد:</span>
              <span className="text-foreground font-bold">أ/ تامر صبحي عبدالله</span>
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all select-none",
                  link.active
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("w-4 h-4", link.active ? "text-primary-foreground" : "text-primary")} />
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-normal mr-1",
                      link.active
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300"
                    )}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Mobile Menu Drawer & Status */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>شبكة معتمدة 2026</span>
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden h-10 w-10 rounded-xl"
                aria-label="القائمة الرئيسية"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-xs p-6 space-y-6">
              <SheetHeader className="pb-4 border-b">
                <SheetTitle className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <span className="text-base font-bold">دليل الرعاية الطبية</span>
                </SheetTitle>
              </SheetHeader>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-1">
                <p className="text-xs text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  إشراف وإهداء:
                </p>
                <p className="text-sm font-extrabold text-foreground">
                  أ/ تامر صبحي عبدالله
                </p>
                <p className="text-[11px] text-muted-foreground">
                  عضو مجلس الإدارة عن القاهرة والوجه القبلي
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2">
                  أقسام الموقع
                </p>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all",
                        link.active
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{link.label}</span>
                      </div>
                      {link.badge && (
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px]",
                            link.active
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-amber-100 text-amber-900"
                          )}
                        >
                          {link.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
