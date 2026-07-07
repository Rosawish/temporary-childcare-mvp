import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getOverviewMetrics } from "@/lib/admin/dashboardMetrics";
import { seedData } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;
  return NextResponse.json(getOverviewMetrics(seedData));
}
