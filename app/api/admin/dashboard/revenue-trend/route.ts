import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getRevenueTrend } from "@/lib/admin/dashboardMetrics";
import { seedData } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;
  const months = Number(request.nextUrl.searchParams.get("months") ?? 12);
  return NextResponse.json(getRevenueTrend(seedData, months));
}
