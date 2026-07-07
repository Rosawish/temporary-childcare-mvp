import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getRecentBookings } from "@/lib/admin/dashboardMetrics";
import { seedData } from "@/lib/mockData";

export const dynamic = "force-static";

export async function GET(request: NextRequest) {
  if (process.env.GITHUB_PAGES === "true") return NextResponse.json(getRecentBookings(seedData, 10));
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? 10);
  return NextResponse.json(getRecentBookings(seedData, limit));
}
