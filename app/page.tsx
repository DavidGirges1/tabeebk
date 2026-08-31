import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { AggregatorView } from "@/components/search/aggregator-view";
import { sanitizeSearchQuery } from "@/lib/utils";
import {
  Governorate,
  ProviderWithGovernorate,
  DoctorWithGovernorate,
} from "@/lib/supabase/types";

interface PageProps {
  searchParams: Promise<{
    tab?: "all" | "providers" | "doctors";
    q?: string;
    gov?: string;
    type?: string;
    specialty?: string;
    page?: string;
  }>;
}

export const revalidate = 60; // 1-minute ISR caching

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const tab = resolvedParams.tab || "all";
  const q = resolvedParams.q || "";
  const gov = resolvedParams.gov || "";
  const type = resolvedParams.type || "";
  const specialty = resolvedParams.specialty || "";
  const page = parseInt(resolvedParams.page || "1", 10) || 1;
  const pageSize = 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await createServerSupabaseClient();

  // 1. Fetch Governorates
  const { data: governoratesData } = await supabase
    .from("governorates")
    .select("*")
    .order("id", { ascending: true });

  const governorates: Governorate[] = governoratesData || [];

  const safeQ = sanitizeSearchQuery(q);
  const safeSpecialty = sanitizeSearchQuery(specialty);

  // 2. Fetch Initial Providers
  let providersQuery = supabase
    .from("providers")
    .select("*, governorates(*)", { count: "exact" });

  if (gov) {
    providersQuery = providersQuery.eq("governorate_id", parseInt(gov, 10));
  }
  if (type) {
    providersQuery = providersQuery.eq("provider_type", type as any);
  }
  if (safeSpecialty) {
    providersQuery = providersQuery.ilike("specialty_ar", `%${safeSpecialty}%`);
  }
  if (safeQ) {
    providersQuery = providersQuery.or(
      `name_ar.ilike.%${safeQ}%,specialty_ar.ilike.%${safeQ}%,address_ar.ilike.%${safeQ}%,phones.ilike.%${safeQ}%,notes_ar.ilike.%${safeQ}%`
    );
  }

  providersQuery = providersQuery.order("id", { ascending: true }).range(from, to);

  // 3. Fetch Initial Doctors
  let doctorsQuery = supabase
    .from("doctors")
    .select("*, governorates(*)", { count: "exact" });

  if (gov) {
    doctorsQuery = doctorsQuery.eq("governorate_id", parseInt(gov, 10));
  }
  if (safeSpecialty) {
    doctorsQuery = doctorsQuery.ilike("specialty_ar", `%${safeSpecialty}%`);
  }
  if (safeQ) {
    doctorsQuery = doctorsQuery.or(
      `doctor_name_ar.ilike.%${safeQ}%,specialty_ar.ilike.%${safeQ}%,address_ar.ilike.%${safeQ}%,phones.ilike.%${safeQ}%,notes_ar.ilike.%${safeQ}%`
    );
  }

  doctorsQuery = doctorsQuery.order("id", { ascending: true }).range(from, to);

  // 4. Fetch Aggregate stats (Governorate counts & Type counts)
  const [
    providersResult,
    doctorsResult,
    allProvidersTypesResult,
    allDoctorsSpecsResult,
    govCountsProvResult,
    govCountsDocResult,
  ] = await Promise.all([
    tab !== "doctors" ? providersQuery : Promise.resolve({ data: [], count: 0 }),
    tab !== "providers" && !type ? doctorsQuery : Promise.resolve({ data: [], count: 0 }),
    supabase.from("providers").select("provider_type, governorate_id"),
    supabase.from("doctors").select("specialty_ar, governorate_id"),
    supabase.from("providers").select("governorate_id"),
    supabase.from("doctors").select("governorate_id"),
  ]);

  const initialProviders = (providersResult.data as ProviderWithGovernorate[]) || [];
  const initialProvidersCount = providersResult.count || 0;

  const initialDoctors = (doctorsResult.data as DoctorWithGovernorate[]) || [];
  const initialDoctorsCount = doctorsResult.count || 0;

  // Compute facility type counts
  const allProvidersList = (allProvidersTypesResult.data as { provider_type: string; governorate_id: number }[]) || [];
  const typeCounts: Record<string, number> = {
    all: allProvidersList.length,
  };
  allProvidersList.forEach((row) => {
    typeCounts[row.provider_type] = (typeCounts[row.provider_type] || 0) + 1;
  });

  // Compute governorate counts
  const governorateCounts: Record<number, number> = {};
  const govCountsProv = (govCountsProvResult.data as { governorate_id: number }[]) || [];
  const govCountsDoc = (govCountsDocResult.data as { governorate_id: number }[]) || [];

  govCountsProv.forEach((r) => {
    governorateCounts[r.governorate_id] =
      (governorateCounts[r.governorate_id] || 0) + 1;
  });
  govCountsDoc.forEach((r) => {
    governorateCounts[r.governorate_id] =
      (governorateCounts[r.governorate_id] || 0) + 1;
  });

  // Compute unique specialties
  const allDoctorsSpecs = (allDoctorsSpecsResult.data as { specialty_ar: string | null; governorate_id: number }[]) || [];
  const specialtiesSet = new Set<string>();
  allDoctorsSpecs.forEach((d) => {
    if (d.specialty_ar && d.specialty_ar.length > 2 && d.specialty_ar.length < 35) {
      specialtiesSet.add(d.specialty_ar.trim());
    }
  });
  const initialSpecialties = Array.from(specialtiesSet).slice(0, 30);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <AggregatorView
        initialGovernorates={governorates}
        initialProviders={initialProviders}
        initialProvidersCount={initialProvidersCount}
        initialDoctors={initialDoctors}
        initialDoctorsCount={initialDoctorsCount}
        initialGovernorateCounts={governorateCounts}
        initialTypeCounts={typeCounts}
        initialSpecialties={initialSpecialties}
      />
    </div>
  );
}
