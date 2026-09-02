import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/types";
import { sanitizeSearchQuery } from "@/lib/utils";
import { getSpecialtyFilterQueries } from "@/lib/constants/specialties";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab") || "all";
    const rawQ = searchParams.get("q") || "";
    const safeQ = sanitizeSearchQuery(rawQ);
    const gov = searchParams.get("gov") || "";
    const type = searchParams.get("type") || "";
    const specialty = searchParams.get("specialty") || "";
    const page = parseInt(searchParams.get("page") || "1", 10) || 1;
    const pageSize = parseInt(searchParams.get("pageSize") || "12", 10) || 12;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let providersPromise = null;
    let doctorsPromise = null;

    // 1. Query Providers (Facilities)
    if (tab === "all" || tab === "providers") {
      let query = supabase
        .from("providers")
        .select("*, governorates(*)", { count: "exact" });

      if (gov) {
        query = query.eq("governorate_id", parseInt(gov, 10));
      }
      if (type) {
        query = query.eq("provider_type", type as any);
      }
      // Note: specialty filter is only for doctors, never leaks into providers tab
      if (tab === "all" && specialty) {
        const safeSpec = sanitizeSearchQuery(specialty);
        if (safeSpec) {
          const specQueries = getSpecialtyFilterQueries(safeSpec);
          const orClauses = specQueries
            .map((sq) => `specialty_ar.ilike.%${sq}%,name_ar.ilike.%${sq}%,notes_ar.ilike.%${sq}%`)
            .join(",");
          if (orClauses) {
            query = query.or(orClauses);
          }
        }
      }
      if (safeQ) {
        query = query.or(
          `name_ar.ilike.%${safeQ}%,specialty_ar.ilike.%${safeQ}%,address_ar.ilike.%${safeQ}%,phones.ilike.%${safeQ}%,notes_ar.ilike.%${safeQ}%`
        );
      }

      query = query.order("id", { ascending: true }).range(from, to);
      providersPromise = query;
    }

    // 2. Query Doctors
    if (tab === "all" || tab === "doctors") {
      // If facility type filter is selected, skip doctors when in 'all' mode
      if (!type) {
        let query = supabase
          .from("doctors")
          .select("*, governorates(*)", { count: "exact" });

        if (gov) {
          query = query.eq("governorate_id", parseInt(gov, 10));
        }
        if (specialty) {
          const safeSpec = sanitizeSearchQuery(specialty);
          if (safeSpec) {
            const specQueries = getSpecialtyFilterQueries(safeSpec);
            const orClauses = specQueries
              .map(
                (sq) =>
                  `specialty_ar.ilike.%${sq}%,doctor_name_ar.ilike.%${sq}%,notes_ar.ilike.%${sq}%`
              )
              .join(",");
            if (orClauses) {
              query = query.or(orClauses);
            }
          }
        }
        if (safeQ) {
          query = query.or(
            `doctor_name_ar.ilike.%${safeQ}%,specialty_ar.ilike.%${safeQ}%,address_ar.ilike.%${safeQ}%,phones.ilike.%${safeQ}%,notes_ar.ilike.%${safeQ}%`
          );
        }

        query = query.order("id", { ascending: true }).range(from, to);
        doctorsPromise = query;
      }
    }

    const [providersRes, doctorsRes] = await Promise.all([
      providersPromise,
      doctorsPromise,
    ]);

    return NextResponse.json({
      providers: providersRes?.data || [],
      providersCount: providersRes?.count || 0,
      doctors: doctorsRes?.data || [],
      doctorsCount: doctorsRes?.count || 0,
    });
  } catch (err: any) {
    console.error("API search error:", err);
    return NextResponse.json(
      { providers: [], providersCount: 0, doctors: [], doctorsCount: 0, error: err.message || "Failed to search" },
      { status: 200 }
    );
  }
}
