import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getTopCenters } from "@/lib/admin/dashboardMetrics";
import { seedData } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? 10);
  return NextResponse.json(getTopCenters(seedData, limit));
}
