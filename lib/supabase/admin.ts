import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gdqqbritubbcbgpkqxby.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseKey = serviceRoleKey || anonKey;

if (!serviceRoleKey && typeof window === "undefined") {
  console.warn(
    "[SupabaseAdmin] SUPABASE_SERVICE_ROLE_KEY is not set. Falling back to ANON key. If RLS is enabled without write policies, inserts/updates will fail with 42501. Run Data/admin-rls-update.sql in Supabase or set SUPABASE_SERVICE_ROLE_KEY."
  );
}

/**
 * Supabase client for admin operations
 * Prioritizes service role key if available for administrative bypass of RLS,
 * otherwise falls back to public anon key.
 */
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Formats database errors into user-friendly Arabic messages
 */
export function formatAdminDatabaseError(error: any): string {
  if (!error) return "حدث خطأ غير متوقع في قاعدة البيانات";
  if (
    error.code === "42501" ||
    error.message?.includes("row-level security") ||
    error.message?.includes("violates row")
  ) {
    return "خطأ في صلاحيات قاعدة البيانات (RLS): يرجى إضافة مفتاح الخدمة SUPABASE_SERVICE_ROLE_KEY في ملف .env.local أو تشغيل سكريبت Data/admin-rls-update.sql في Supabase SQL Editor.";
  }
  return error.message || "حدث خطأ أثناء معالجة الطلب";
}

