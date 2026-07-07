import { NextRequest, NextResponse } from "next/server";

export type AdminAuthResult = { ok: true } | { ok: false; response: NextResponse };

export function getCurrentUser(request: NextRequest) {
  const headerRole = request.headers.get("x-demo-role");
  const cookieRole = request.cookies.get("demo_role")?.value;
  const role = headerRole ?? cookieRole;
  if (!role) return null;
  return { role };
}

export function requireAdmin(request: NextRequest): AdminAuthResult {
  const user = getCurrentUser(request);
  if (!user) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (user.role !== "admin") {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true };
}
