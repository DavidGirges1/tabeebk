"use client";

import React, { useState } from "react";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  HeartPulse,
  LogIn,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AdminLoginProps {
  onLoginSuccess: (user: any) => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username.trim() || !password.trim()) {
      setErrorMsg("يرجى إدخال اسم المستخدم وكلمة المرور للمتابعة");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onLoginSuccess(data.user);
      } else {
        setErrorMsg(data.error || "بيانات الدخول غير صحيحة، يرجى التأكد من اسم المستخدم وكلمة المرور");
      }
    } catch (err: any) {
      setErrorMsg("تعذر الاتصال بالخادم، يرجى التحقق من الاتصال والمحاولة مجدداً");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-center items-center px-4 py-8 select-none text-slate-100 font-sans"
    >
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-900/95 border border-slate-800 shadow-2xl rounded-3xl p-6 sm:p-8 backdrop-blur-2xl space-y-6">
        {/* Header / Logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary via-blue-600 to-emerald-500 text-white shadow-xl shadow-primary/30 mb-1 ring-4 ring-primary/20">
            <HeartPulse className="w-9 h-9 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              بوابة الإدارة المركزية
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              منظومة دليل شبكة الرعاية والخدمات الطبية 2026
            </p>
          </div>

          <div className="flex items-center justify-center pt-1">
            <Badge className="bg-emerald-950/80 text-emerald-300 border-emerald-800/80 text-[11px] px-3.5 py-1 font-semibold gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>منطقة مؤمنة للمشرفين المعتمدين</span>
            </Badge>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-950/70 border border-red-800/80 text-red-200 text-sm flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-right">
              <p className="font-bold text-red-100">فشل في تسجيل الدخول</p>
              <p className="text-xs text-red-300 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-right">
          {/* Username Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span>اسم المستخدم</span>
            </label>
            <div className="relative">
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم المصرح به..."
                disabled={isLoading}
                dir="ltr"
                className="h-13 text-base font-semibold bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 rounded-2xl px-4 text-left placeholder:text-right focus-visible:ring-primary focus-visible:border-primary shadow-inner"
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span>كلمة المرور</span>
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور..."
                disabled={isLoading}
                dir="ltr"
                className="h-13 text-base font-semibold bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 rounded-2xl pl-12 pr-4 text-left placeholder:text-right focus-visible:ring-primary focus-visible:border-primary shadow-inner"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1.5 rounded-lg"
                title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-amber-400" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-13 text-base font-bold rounded-2xl bg-gradient-to-r from-primary via-blue-600 to-primary hover:from-primary/90 hover:to-primary/90 text-white shadow-lg shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99] min-h-[52px] gap-2"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>جاري التحقق والدخول...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <LogIn className="w-5 h-5" />
                <span>تسجيل الدخول إلى النظام</span>
              </div>
            )}
          </Button>
        </form>

        {/* Security and Governance Note */}
        <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400 space-y-1 text-center">
          <p className="text-slate-300 font-bold flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>إشعار أمني للمشرفين</span>
          </p>
          <p className="leading-relaxed">
            يُرجى استخدام بيانات الاعتماد الرسمية المعتمدة للوصول إلى لوحة التحكم والعمليات الإدارية.
          </p>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="mt-8 text-center text-xs text-slate-500 font-medium">
        <p>جميع الحقوق محفوظة © 2026 • صندوق علاج العاملين وأسرهم بالجمارك والضرائب</p>
      </div>
    </div>
  );
}
