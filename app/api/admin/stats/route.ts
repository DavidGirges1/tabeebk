import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح، يرجى تسجيل الدخول" }, { status: 401 });
    }

    const [
      govsCountRes,
      provsCountRes,
      docsCountRes,
      provsByTypeRes,
      recentProvidersRes,
      recentDoctorsRes,
    ] = await Promise.all([
      supabaseAdmin.from("governorates").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("providers").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("doctors").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("providers").select("provider_type"),
      supabaseAdmin.from("providers").select("*, governorates(*)").order("id", { ascending: false }).limit(5),
      supabaseAdmin.from("doctors").select("*, governorates(*)").order("id", { ascending: false }).limit(5),
    ]);

    const typeCounts: Record<string, number> = {};
    (provsByTypeRes.data || []).forEach((p) => {
      typeCounts[p.provider_type] = (typeCounts[p.provider_type] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalGovernorates: govsCountRes.count || 0,
        totalProviders: provsCountRes.count || 0,
        totalDoctors: docsCountRes.count || 0,
        totalEntities: (provsCountRes.count || 0) + (docsCountRes.count || 0),
        typeCounts,
        recentProviders: recentProvidersRes.data || [],
        recentDoctors: recentDoctorsRes.data || [],
      },
    });
  } catch (err: any) {
    console.error("Admin stats error:", err);
    return NextResponse.json({ success: false, error: err.message || "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
