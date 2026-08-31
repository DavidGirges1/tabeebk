import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/admin-auth";
import { supabaseAdmin, formatAdminDatabaseError } from "@/lib/supabase/admin";
import { sanitizeSearchQuery } from "@/lib/utils";

// GET - List / Search doctors
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح، يرجى تسجيل الدخول" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const gov = searchParams.get("gov") || "";
    const specialty = searchParams.get("specialty") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(100, Math.max(5, parseInt(searchParams.get("pageSize") || "20", 10)));

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabaseAdmin
      .from("doctors")
      .select("*, governorates(*)", { count: "exact" });

    if (gov) {
      query = query.eq("governorate_id", parseInt(gov, 10));
    }
    if (specialty) {
      const safeSpec = sanitizeSearchQuery(specialty);
      if (safeSpec) {
        query = query.ilike("specialty_ar", `%${safeSpec}%`);
      }
    }
    if (q) {
      const safeQ = sanitizeSearchQuery(q);
      if (safeQ) {
        query = query.or(
          `doctor_name_ar.ilike.%${safeQ}%,specialty_ar.ilike.%${safeQ}%,address_ar.ilike.%${safeQ}%,phones.ilike.%${safeQ}%,notes_ar.ilike.%${safeQ}%`
        );
      }
    }

    query = query.order("id", { ascending: false }).range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error("Doctors fetch error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    });
  } catch (err: any) {
    console.error("Doctors API error:", err);
    return NextResponse.json({ success: false, error: err.message || "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

// POST - Add new doctor
export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح، يرجى تسجيل الدخول" }, { status: 401 });
    }

    const body = await request.json();
    const { doctor_name_ar, governorate_id, specialty_ar, address_ar, phones, notes_ar } = body;

    if (!doctor_name_ar || !doctor_name_ar.trim()) {
      return NextResponse.json({ success: false, error: "اسم الطبيب مطلوب" }, { status: 400 });
    }

    if (!governorate_id) {
      return NextResponse.json({ success: false, error: "المحافظة مطلوبة" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("doctors")
      .insert([
        {
          doctor_name_ar: doctor_name_ar.trim(),
          governorate_id: parseInt(String(governorate_id), 10),
          specialty_ar: specialty_ar ? specialty_ar.trim() : null,
          address_ar: address_ar ? address_ar.trim() : null,
          phones: phones ? phones.trim() : null,
          notes_ar: notes_ar ? notes_ar.trim() : null,
        },
      ])
      .select("*, governorates(*)")
      .single();

    if (error) {
      console.error("Doctor insert error:", error);
      return NextResponse.json({ success: false, error: formatAdminDatabaseError(error) }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "تم إضافة الطبيب بنجاح",
      data,
    });
  } catch (err: any) {
    console.error("Doctor POST error:", err);
    return NextResponse.json({ success: false, error: err.message || "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

// PUT - Update existing doctor
export async function PUT(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح، يرجى تسجيل الدخول" }, { status: 401 });
    }

    const body = await request.json();
    const { id, doctor_name_ar, governorate_id, specialty_ar, address_ar, phones, notes_ar } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "معرف الطبيب مطلوب" }, { status: 400 });
    }

    if (!doctor_name_ar || !doctor_name_ar.trim()) {
      return NextResponse.json({ success: false, error: "اسم الطبيب مطلوب" }, { status: 400 });
    }

    if (!governorate_id) {
      return NextResponse.json({ success: false, error: "المحافظة مطلوبة" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("doctors")
      .update({
        doctor_name_ar: doctor_name_ar.trim(),
        governorate_id: parseInt(String(governorate_id), 10),
        specialty_ar: specialty_ar ? specialty_ar.trim() : null,
        address_ar: address_ar ? address_ar.trim() : null,
        phones: phones ? phones.trim() : null,
        notes_ar: notes_ar ? notes_ar.trim() : null,
      })
      .eq("id", parseInt(String(id), 10))
      .select("*, governorates(*)")
      .single();

    if (error) {
      console.error("Doctor update error:", error);
      return NextResponse.json({ success: false, error: formatAdminDatabaseError(error) }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "تم تعديل بيانات الطبيب بنجاح",
      data,
    });
  } catch (err: any) {
    console.error("Doctor PUT error:", err);
    return NextResponse.json({ success: false, error: err.message || "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

// DELETE - Remove doctor
export async function DELETE(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح، يرجى تسجيل الدخول" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "معرف الطبيب مطلوب للحذف" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("doctors")
      .delete()
      .eq("id", parseInt(id, 10));

    if (error) {
      console.error("Doctor delete error:", error);
      return NextResponse.json({ success: false, error: formatAdminDatabaseError(error) }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف الطبيب بنجاح",
    });
  } catch (err: any) {
    console.error("Doctor DELETE error:", err);
    return NextResponse.json({ success: false, error: err.message || "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
