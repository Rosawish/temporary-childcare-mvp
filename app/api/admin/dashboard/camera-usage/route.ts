import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getCameraUsage } from "@/lib/admin/dashboardMetrics";
import { seedData } from "@/lib/mockData";

export const dynamic = "force-static";

export async function GET(request: NextRequest) {
  if (process.env.GITHUB_PAGES === "true") return NextResponse.json(getCameraUsage(seedData));
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;
  return NextResponse.json(getCameraUsage(seedData));
}
