/**
 * Unified Medical Specialties Constants & Taxonomy Normalization
 * Handles canonical categorization, compound specialty expansions, and doctor title stripping.
 */

// Canonical normalized specialty categories shown in filters and dropdowns
export const CANONICAL_SPECIALTIES = [
  "باطنة عامة وتخصصية",
  "جراحة عامة ومناظير",
  "قلب وأوعية دموية",
  "عظام ومفاصل",
  "أنف وأذن وحنجرة",
  "عيون ورمد",
  "أطفال وحديثي الولادة",
  "نساء وتوليد",
  "مخ وأعصاب",
  "جلدية وتناسلية",
  "علاج طبيعي وتأهيل",
  "روماتيزم ومفاصل",
  "جهاز هضمي وكبد",
  "كلى ومسالك بولية",
  "غدد صماء وسكر",
  "أمراض صدرية",
  "أورام وجراحة الأورام",
  "أمراض الدم",
  "أسنان وجراحة الفم",
  "حميات وأمراض معدية",
  "أوعية دموية وقدم سكري",
  "جراحة مخ وأعصاب",
  "جراحة عظام",
  "جراحة أطفال",
] as const;

// Popular specialties for quick chips
export const POPULAR_SPECIALTIES = [
  "عيون",
  "عظام",
  "أسنان",
  "جلدية",
  "قلب وأوعية دموية",
  "مخ وأعصاب",
  "نساء وتوليد",
  "أطفال",
  "باطنة",
  "أنف وأذن وحنجرة",
  "أمراض صدرية",
  "جراحة عامة",
  "علاج طبيعي",
  "مسالك بولية",
  "جهاز هضمي وكبد",
  "غدد صماء وسكر",
  "أورام",
  "روماتيزم",
] as const;

// Alphabetical list of normalized medical specialties for filters
export const MEDICAL_SPECIALTIES = [
  "أنف وأذن وحنجرة",
  "أسنان",
  "أطفال",
  "أمراض الدم",
  "أمراض صدرية",
  "أورام",
  "أوعية دموية وقدم سكري",
  "باطنة",
  "جراحة عامة",
  "جراحة عظام",
  "جراحة مخ وأعصاب",
  "جلدية وتناسلية",
  "جهاز هضمي وكبد",
  "حميات",
  "روماتيزم",
  "عيون ورمد",
  "عظام",
  "علاج طبيعي",
  "غدد صماء وسكر",
  "قلب وأوعية دموية",
  "كلى ومسالك بولية",
  "مخ وأعصاب",
  "نساء وتوليد",
] as const;

export type MedicalSpecialty = (typeof MEDICAL_SPECIALTIES)[number];

/**
 * Mapping table connecting canonical/selected specialties to raw variants and aliases.
 */
const SPECIALTY_RELATIONS_MAP: Record<string, string[]> = {
  "جراحة عامة": [
    "جراحة عامة",
    "جراحة عامة ومناظير",
    "جراحة مناظير",
    "جراحة ومناظير",
    "جراحة عامة وأطفال",
    "جراحة",
  ],
  "جراحة عامة ومناظير": [
    "جراحة عامة",
    "جراحة عامة ومناظير",
    "جراحة مناظير",
    "جراحة ومناظير",
    "جراحة عامة وأطفال",
    "جراحة",
  ],
  "جراحة مناظير": [
    "جراحة مناظير",
    "جراحة ومناظير",
    "جراحة عامة ومناظير",
    "جراحة عامة",
  ],
  "جراحة ومناظير": [
    "جراحة ومناظير",
    "جراحة مناظير",
    "جراحة عامة ومناظير",
    "جراحة عامة",
  ],
  "غدد صماء": [
    "غدد صماء",
    "غدد صماء وسكر",
    "غدد وسكر",
    "باطنة وغدد صماء وسكر",
    "باطنة وسكر",
    "سكر",
  ],
  "غدد صماء وسكر": [
    "غدد صماء",
    "غدد صماء وسكر",
    "غدد وسكر",
    "باطنة وغدد صماء وسكر",
    "باطنة وسكر",
    "سكر",
  ],
  "غدد وسكر": [
    "غدد صماء",
    "غدد صماء وسكر",
    "غدد وسكر",
    "باطنة وغدد صماء وسكر",
    "باطنة وسكر",
    "سكر",
  ],
  "أنف وأذن": [
    "أنف وأذن",
    "أنف وأذن وحنجرة",
    "أستاذ أنف وأذن",
    "انف واذن",
  ],
  "أنف وأذن وحنجرة": [
    "أنف وأذن",
    "أنف وأذن وحنجرة",
    "أستاذ أنف وأذن",
    "انف واذن",
  ],
  "أستاذ أنف وأذن": [
    "أنف وأذن",
    "أنف وأذن وحنجرة",
    "أستاذ أنف وأذن",
  ],
  "روماتيزم": [
    "روماتيزم",
    "روماتيزم وعلاج طبيعي",
    "علاج طبيعي وروماتيزم",
    "باطنة وروماتيزم",
  ],
  "روماتيزم وعلاج طبيعي": [
    "روماتيزم",
    "روماتيزم وعلاج طبيعي",
    "علاج طبيعي وروماتيزم",
    "باطنة وروماتيزم",
    "علاج طبيعي",
  ],
  "علاج طبيعي": [
    "علاج طبيعي",
    "علاج طبيعي وروماتيزم",
    "روماتيزم وعلاج طبيعي",
  ],
  "علاج طبيعي وروماتيزم": [
    "علاج طبيعي",
    "علاج طبيعي وروماتيزم",
    "روماتيزم وعلاج طبيعي",
    "روماتيزم",
  ],
  "عيون": ["عيون", "رمد", "جراحة عيون"],
  "رمد": ["عيون", "رمد", "جراحة عيون"],
  "عيون ورمد": ["عيون", "رمد", "جراحة عيون"],
  "قلب": [
    "قلب",
    "قلب وأوعية دموية",
    "قلب وباطنة",
    "باطنة وقلب",
    "باطنة وقلب وأوعية دموية",
  ],
  "قلب وأوعية دموية": [
    "قلب",
    "قلب وأوعية دموية",
    "قلب وباطنة",
    "باطنة وقلب",
    "باطنة وقلب وأوعية دموية",
    "أوعية دموية",
  ],
  "قلب وباطنة": [
    "قلب وباطنة",
    "باطنة وقلب",
    "قلب وأوعية دموية",
    "قلب",
    "باطنة",
  ],
  "باطنة": [
    "باطنة",
    "باطنة وجهاز هضمي",
    "باطنة وحميات وأطفال",
    "باطنة ودم",
    "باطنة وروماتيزم",
    "باطنة وسكر",
    "باطنة وصدر",
    "باطنة وغدد صماء وسكر",
    "باطنة وقلب",
    "باطنة وقلب وأوعية دموية",
    "باطنة وكبد",
    "باطنة وكبد وجهاز هضمي",
    "باطنة وكلى",
    "حميات وباطنة",
    "قلب وباطنة",
  ],
  "باطنة عامة وتخصصية": [
    "باطنة",
    "باطنة وجهاز هضمي",
    "باطنة وحميات وأطفال",
    "باطنة ودم",
    "باطنة وروماتيزم",
    "باطنة وسكر",
    "باطنة وصدر",
    "باطنة وغدد صماء وسكر",
    "باطنة وقلب",
    "باطنة وقلب وأوعية دموية",
    "باطنة وكبد",
    "باطنة وكبد وجهاز هضمي",
    "باطنة وكلى",
    "حميات وباطنة",
    "قلب وباطنة",
  ],
  "جهاز هضمي": [
    "جهاز هضمي",
    "جهاز هضمي وكبد",
    "كبد وجهاز هضمي",
    "باطنة وكبد",
    "باطنة وجهاز هضمي",
    "باطنة وكبد وجهاز هضمي",
  ],
  "جهاز هضمي وكبد": [
    "جهاز هضمي",
    "جهاز هضمي وكبد",
    "كبد وجهاز هضمي",
    "باطنة وكبد",
    "باطنة وجهاز هضمي",
    "باطنة وكبد وجهاز هضمي",
  ],
  "كبد وجهاز هضمي": [
    "جهاز هضمي",
    "جهاز هضمي وكبد",
    "كبد وجهاز هضمي",
    "باطنة وكبد",
    "باطنة وجهاز هضمي",
    "باطنة وكبد وجهاز هضمي",
  ],
  "كلى ومسالك": [
    "كلى ومسالك",
    "كلى ومسالك بولية",
    "مسالك بولية",
    "مسالك بولية وكلى",
    "باطنة وكلى",
  ],
  "كلى ومسالك بولية": [
    "كلى ومسالك",
    "كلى ومسالك بولية",
    "مسالك بولية",
    "مسالك بولية وكلى",
    "باطنة وكلى",
  ],
  "مسالك بولية": [
    "مسالك بولية",
    "كلى ومسالك",
    "كلى ومسالك بولية",
    "مسالك بولية وكلى",
    "باطنة وكلى",
  ],
  "جلدية": [
    "جلدية",
    "جلدية وتناسلية",
    "جلدية وتناسلية وذكورة",
  ],
  "جلدية وتناسلية": [
    "جلدية",
    "جلدية وتناسلية",
    "جلدية وتناسلية وذكورة",
  ],
  "حميات": [
    "حميات",
    "استشاري حميات",
    "حميات وباطنة",
    "باطنة وحميات وأطفال",
  ],
  "استشاري حميات": [
    "حميات",
    "استشاري حميات",
    "حميات وباطنة",
  ],
  "أمراض صدرية": [
    "أمراض صدرية",
    "باطنة وصدر",
    "صدر",
  ],
  "أمراض الدم": [
    "أمراض الدم",
    "باطنة ودم",
    "دم",
  ],
  "أورام": [
    "أورام",
    "جراحة الأورام",
  ],
  "أورام وجراحة الأورام": [
    "أورام",
    "جراحة الأورام",
  ],
  "أسنان": [
    "أسنان",
    "وجه وفكين",
  ],
  "أسنان وجراحة الفم": [
    "أسنان",
    "وجه وفكين",
  ],
};

/**
 * Returns all related search tokens and raw specialty strings for a given specialty filter input.
 */
export function getSpecialtyFilterQueries(specialtyInput: string): string[] {
  if (!specialtyInput || !specialtyInput.trim()) return [];
  const cleanInput = specialtyInput.trim();

  // Strip known title prefixes if present in input
  const strippedInput = cleanInput
    .replace(/^(أستاذ دكتور|أ\.د\.|أستاذ|استشاري|أخصائي|دكتور|د\.)\s+/i, "")
    .trim();

  const results = new Set<string>();
  results.add(cleanInput);
  if (strippedInput && strippedInput !== cleanInput) {
    results.add(strippedInput);
  }

  // Check direct mapped relations
  if (SPECIALTY_RELATIONS_MAP[cleanInput]) {
    SPECIALTY_RELATIONS_MAP[cleanInput].forEach((s) => results.add(s));
  }
  if (strippedInput && SPECIALTY_RELATIONS_MAP[strippedInput]) {
    SPECIALTY_RELATIONS_MAP[strippedInput].forEach((s) => results.add(s));
  }

  // Substring checks for compound tokens (e.g. "باطنة", "قلب", "روماتيزم", "عظام", "مناظير", "سكر")
  Object.keys(SPECIALTY_RELATIONS_MAP).forEach((key) => {
    if (cleanInput.includes(key) || key.includes(cleanInput)) {
      results.add(key);
      SPECIALTY_RELATIONS_MAP[key].forEach((s) => results.add(s));
    }
  });

  return Array.from(results);
}

/**
 * Parses doctor record to separate title/rank from medical specialty and clean name.
 */
export function parseDoctorTitleAndSpecialty(
  doctorName: string,
  rawSpecialty: string | null | undefined,
  notes?: string | null
): { title: string; specialty: string; displayName: string } {
  let title = "";
  let specialty = (rawSpecialty || "").trim();
  const name = (doctorName || "").trim();

  // 1. Strip leading title word from raw specialty (e.g. "أستاذ أنف وأذن" -> "أستاذ" + "أنف وأذن")
  if (/^أستاذ دكتور/i.test(specialty)) {
    title = "أستاذ دكتور";
    specialty = specialty.replace(/^أستاذ دكتور\s*/i, "").trim();
  } else if (/^أستاذ/i.test(specialty)) {
    title = "أستاذ";
    specialty = specialty.replace(/^أستاذ\s*/i, "").trim();
  } else if (/^استشاري/i.test(specialty)) {
    title = "استشاري";
    specialty = specialty.replace(/^استشاري\s*/i, "").trim();
  } else if (/^أخصائي/i.test(specialty)) {
    title = "أخصائي";
    specialty = specialty.replace(/^أخصائي\s*/i, "").trim();
  }

  // 2. If no title yet, check name prefix
  if (!title) {
    if (/^أ\.د\./i.test(name) || /^أستاذ دكتور/i.test(name)) {
      title = "أستاذ دكتور";
    } else if (/^استشاري/i.test(name)) {
      title = "استشاري";
    } else if (/^أخصائي/i.test(name)) {
      title = "أخصائي";
    } else {
      title = "طبيب / استشاري";
    }
  }

  // 3. If specialty became empty (e.g. raw was just "أخصائي"), check notes or default
  if (!specialty || specialty === "أخصائي") {
    if (notes && notes.trim() && !/^ملاحظات/i.test(notes)) {
      specialty = notes.trim();
    } else {
      specialty = "طب عام وباطنة";
    }
  }

  // 4. Check for parenthetical specialty in doctor's name (FIX 5)
  const parenMatch = name.match(/\((.*?)\)/);
  if (parenMatch) {
    const insideParen = parenMatch[1].trim();
    if (
      insideParen.includes("روماتيزم") ||
      insideParen.includes("علاج طبيعي") ||
      insideParen.includes("قلب") ||
      insideParen.includes("باطنة") ||
      insideParen.includes("جراحة") ||
      insideParen.includes("أطفال") ||
      insideParen.includes("جلدية") ||
      insideParen.includes("عيون") ||
      insideParen.includes("عظام") ||
      insideParen.includes("أسنان") ||
      insideParen.includes("نساء") ||
      insideParen.includes("مناظير")
    ) {
      if (!specialty.includes(insideParen)) {
        specialty = insideParen;
      }
    }
  }

  return {
    title,
    specialty,
    displayName: name,
  };
}
