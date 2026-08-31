import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/admin-auth";
import { supabaseAdmin, formatAdminDatabaseError } from "@/lib/supabase/admin";

// GET - List all governorates with counts
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح، يرجى تسجيل الدخول" }, { status: 401 });
    }

    const [govsRes, provsRes, docsRes] = await Promise.all([
      supabaseAdmin.from("governorates").select("*").order("id", { ascending: true }),
      supabaseAdmin.from("providers").select("governorate_id"),
      supabaseAdmin.from("doctors").select("governorate_id"),
    ]);

    if (govsRes.error) {
      return NextResponse.json({ success: false, error: govsRes.error.message }, { status: 500 });
    }

    const provCounts: Record<number, number> = {};
    (provsRes.data || []).forEach((p) => {
      provCounts[p.governorate_id] = (provCounts[p.governorate_id] || 0) + 1;
    });

    const docCounts: Record<number, number> = {};
    (docsRes.data || []).forEach((d) => {
      docCounts[d.governorate_id] = (docCounts[d.governorate_id] || 0) + 1;
    });

    const enrichedGovernorates = (govsRes.data || []).map((gov) => ({
      ...gov,
      providersCount: provCounts[gov.id] || 0,
      doctorsCount: docCounts[gov.id] || 0,
      totalCount: (provCounts[gov.id] || 0) + (docCounts[gov.id] || 0),
    }));

    return NextResponse.json({
      success: true,
      data: enrichedGovernorates,
    });
  } catch (err: any) {
    console.error("Governorates API error:", err);
    return NextResponse.json({ success: false, error: err.message || "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

// POST - Add governorate
export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح، يرجى تسجيل الدخول" }, { status: 401 });
    }

    const body = await request.json();
    const { name_ar, region } = body;

    if (!name_ar || !name_ar.trim()) {
      return NextResponse.json({ success: false, error: "اسم المحافظة مطلوب" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("governorates")
      .insert([{ name_ar: name_ar.trim(), region: region ? region.trim() : null }])
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: formatAdminDatabaseError(error) }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "تم إضافة المحافظة بنجاح",
      data,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

// PUT - Update governorate
export async function PUT(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح، يرجى تسجيل الدخول" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name_ar, region } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "معرف المحافظة مطلوب" }, { status: 400 });
    }

    if (!name_ar || !name_ar.trim()) {
      return NextResponse.json({ success: false, error: "اسم المحافظة مطلوب" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("governorates")
      .update({ name_ar: name_ar.trim(), region: region ? region.trim() : null })
      .eq("id", parseInt(String(id), 10))
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: formatAdminDatabaseError(error) }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "تم تعديل المحافظة بنجاح",
      data,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
