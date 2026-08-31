import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/admin-auth";
import { supabaseAdmin, formatAdminDatabaseError } from "@/lib/supabase/admin";
import { sanitizeSearchQuery } from "@/lib/utils";

// GET - List / Search providers
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح، يرجى تسجيل الدخول" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const gov = searchParams.get("gov") || "";
    const type = searchParams.get("type") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(100, Math.max(5, parseInt(searchParams.get("pageSize") || "20", 10)));

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabaseAdmin
      .from("providers")
      .select("*, governorates(*)", { count: "exact" });

    if (gov) {
      query = query.eq("governorate_id", parseInt(gov, 10));
    }
    if (type) {
      query = query.eq("provider_type", type as any);
    }
    if (q) {
      const safeQ = sanitizeSearchQuery(q);
      if (safeQ) {
        query = query.or(
          `name_ar.ilike.%${safeQ}%,specialty_ar.ilike.%${safeQ}%,address_ar.ilike.%${safeQ}%,phones.ilike.%${safeQ}%,notes_ar.ilike.%${safeQ}%`
        );
      }
    }

    query = query.order("id", { ascending: false }).range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error("Providers fetch error:", error);
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
    console.error("Providers API error:", err);
    return NextResponse.json({ success: false, error: err.message || "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

// POST - Add new provider
export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح، يرجى تسجيل الدخول" }, { status: 401 });
    }

    const body = await request.json();
    const { name_ar, provider_type, governorate_id, specialty_ar, address_ar, phones, notes_ar } = body;

    if (!name_ar || !name_ar.trim()) {
      return NextResponse.json({ success: false, error: "اسم المنشأة الطبية مطلوب" }, { status: 400 });
    }

    if (!provider_type) {
      return NextResponse.json({ success: false, error: "نوع المنشأة مطلوب (مستشفى، معمل، أشعة، إلخ)" }, { status: 400 });
    }

    if (!governorate_id) {
      return NextResponse.json({ success: false, error: "المحافظة مطلوبة" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("providers")
      .insert([
        {
          name_ar: name_ar.trim(),
          provider_type: provider_type,
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
      console.error("Provider insert error:", error);
      return NextResponse.json({ success: false, error: formatAdminDatabaseError(error) }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "تم إضافة المنشأة الطبية بنجاح",
      data,
    });
  } catch (err: any) {
    console.error("Provider POST error:", err);
    return NextResponse.json({ success: false, error: err.message || "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

// PUT - Update existing provider
export async function PUT(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح، يرجى تسجيل الدخول" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name_ar, provider_type, governorate_id, specialty_ar, address_ar, phones, notes_ar } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "معرف المنشأة مطلوب" }, { status: 400 });
    }

    if (!name_ar || !name_ar.trim()) {
      return NextResponse.json({ success: false, error: "اسم المنشأة الطبية مطلوب" }, { status: 400 });
    }

    if (!provider_type) {
      return NextResponse.json({ success: false, error: "نوع المنشأة مطلوب" }, { status: 400 });
    }

    if (!governorate_id) {
      return NextResponse.json({ success: false, error: "المحافظة مطلوبة" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("providers")
      .update({
        name_ar: name_ar.trim(),
        provider_type: provider_type,
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
      console.error("Provider update error:", error);
      return NextResponse.json({ success: false, error: formatAdminDatabaseError(error) }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "تم تعديل بيانات المنشأة الطبية بنجاح",
      data,
    });
  } catch (err: any) {
    console.error("Provider PUT error:", err);
    return NextResponse.json({ success: false, error: err.message || "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

// DELETE - Remove provider
export async function DELETE(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "غير مصرح، يرجى تسجيل الدخول" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "معرف المنشأة مطلوب للحذف" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("providers")
      .delete()
      .eq("id", parseInt(id, 10));

    if (error) {
      console.error("Provider delete error:", error);
      return NextResponse.json({ success: false, error: formatAdminDatabaseError(error) }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف المنشأة الطبية بنجاح",
    });
  } catch (err: any) {
    console.error("Provider DELETE error:", err);
    return NextResponse.json({ success: false, error: err.message || "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
