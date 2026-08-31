import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ProviderTypeEnum } from "./supabase/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes Arabic text for tolerant search matching:
 * - Unifies alefs (أ, إ, آ -> ا)
 * - Unifies teh marbuta / heh (ة -> ه)
 * - Unifies yaa / alef maksura (ى -> ي)
 * - Removes tashkeel / diacritics
 * - Normalizes whitespaces
 */
export function normalizeArabic(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\u064B-\u065F\u0670]/g, "") // Diacritics
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[\s\-_/\\,]+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Sanitizes input string to prevent PostgREST / Supabase filter syntax crashes
 * (strips special characters like commas, parentheses, quotes, percent signs, brackets)
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query) return "";
  return query
    .replace(/[,()"'%\\<>{}[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export interface ProviderTypeMeta {
  labelAr: string;
  labelEn: string;
  badgeClass: string;
  iconName: string;
  emoji: string;
}

export const PROVIDER_TYPES_MAP: Record<ProviderTypeEnum, ProviderTypeMeta> = {
  hospital: {
    labelAr: "مستشفيات ومراكز طبية",
    labelEn: "Hospitals",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    iconName: "Building2",
    emoji: "🏥",
  },
  lab: {
    labelAr: "معامل تحاليل",
    labelEn: "Laboratories",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
    iconName: "FlaskConical",
    emoji: "🧪",
  },
  radiology: {
    labelAr: "مراكز أشعة",
    labelEn: "Radiology",
    badgeClass: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800",
    iconName: "Scan",
    emoji: "🩻",
  },
  eye_center: {
    labelAr: "مراكز وجراحة عيون",
    labelEn: "Eye Centers",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
    iconName: "Eye",
    emoji: "👁️",
  },
  physical_therapy: {
    labelAr: "علاج طبيعي وتأهيل",
    labelEn: "Physical Therapy",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    iconName: "Activity",
    emoji: "🏃",
  },
  clinic: {
    labelAr: "عيادات ومجمعات طبية",
    labelEn: "Clinics",
    badgeClass: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800",
    iconName: "Stethoscope",
    emoji: "🩺",
  },
  pharmacy: {
    labelAr: "صيدليات",
    labelEn: "Pharmacies",
    badgeClass: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
    iconName: "Pill",
    emoji: "💊",
  },
};

/**
 * Splits concatenated phone numbers into an array of clean phone strings.
 */
export function parsePhones(phonesStr: string | null | undefined): string[] {
  if (!phonesStr) return [];
  return phonesStr
    .split(/[\/\n,]+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && !/^[\s—\-_]+$/.test(p));
}

/**
 * Formats a phone string for `tel:` links (removes spaces, dashes).
 */
export function formatTelLink(phone: string): string {
  return phone.replace(/[\s\-_()]+/g, "");
}

/**
 * Generates a Google Maps search URL combining name and address.
 */
export function getGoogleMapsUrl(name: string, address?: string | null): string {
  const query = [name, address].filter(Boolean).join(" ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

