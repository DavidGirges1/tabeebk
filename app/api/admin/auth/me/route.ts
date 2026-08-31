import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const user = await getAdminFromRequest(request);

  if (!user) {
    return NextResponse.json(
      { success: false, error: "غير مصرح، يرجى تسجيل الدخول" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user,
  });
}
