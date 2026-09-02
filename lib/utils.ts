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
 * Validates whether a phone string matches realistic Egyptian phone patterns:
 * - Mobile: 010, 011, 012, 015 followed by 8 digits (11 digits total)
 * - Landlines: Area code (02, 03, 013, 040, 045, 047, 048, 050, 055, 057, 062, 064, 065, 066, 068, 069, 082, 084, 086, 088, 092, 093, 095, 096, 097) + 7 to 8 digits
 * - Hotlines: 5 digits (15xxx, 16xxx, 19xxx)
 */
export function isValidEgyptianPhone(phone: string): boolean {
  if (!phone || typeof phone !== "string") return false;
  // Clean whitespace, dashes, parentheses
  const cleaned = phone.replace(/[\s\-_()]+/g, "");
  
  // Reject pure placeholder texts
  if (
    /^(لا\s*يوجد|غير\s*متاح|غير\s*متوفر|بدون|أرقام|\d+\s*أرقام|null|undefined|none|n\/a|—|-+)$/i.test(
      phone.trim()
    )
  ) {
    return false;
  }

  // Extract digits
  const digits = cleaned.replace(/[^\d+]/g, "");
  if (!digits || digits.length < 5) return false;

  const normalized = digits.startsWith("+20")
    ? "0" + digits.slice(3)
    : digits.startsWith("20") && digits.length >= 11
    ? "0" + digits.slice(2)
    : digits;

  // Mobile check: 01[0125] + 8 digits = 11 digits
  if (/^01[0125]\d{8}$/.test(normalized)) return true;

  // Cairo/Giza: 02 + 8 digits = 10 digits
  if (/^02\d{8}$/.test(normalized)) return true;

  // Alex: 03 + 7 digits = 9 digits
  if (/^03\d{7}$/.test(normalized)) return true;

  // Other governorate area codes + 7 digits
  if (/^0(13|40|45|47|48|50|55|57|62|64|65|66|68|69|82|84|86|88|92|93|95|96|97)\d{7}$/.test(normalized)) {
    return true;
  }

  // Hotlines (5 digits starting with 15, 16, 19)
  if (/^1[569]\d{3}$/.test(normalized)) return true;

  // If it's a 7-8 digit local number without area code
  if (/^\d{7,8}$/.test(normalized)) return true;

  return false;
}

/**
 * Splits concatenated phone numbers into an array of clean, validated phone strings.
 * Filters out raw placeholder strings (e.g. "2 أرقام", "لا يوجد", "-") and invalid numbers.
 */
export function parsePhones(phonesStr: string | null | undefined): string[] {
  if (!phonesStr) return [];
  const raw = phonesStr.trim();
  if (!raw || /^(لا\s*يوجد|غير\s*متاح|غير\s*متوفر|بدون|أرقام|\d+\s*أرقام|null|undefined|none|n\/a|—|-+)$/i.test(raw)) {
    return [];
  }

  const parts = raw
    .split(/[\/\n,]+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && !/^[\s—\-_]+$/.test(p))
    .filter((p) => isValidEgyptianPhone(p));

  // Deduplicate
  return Array.from(new Set(parts));
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


