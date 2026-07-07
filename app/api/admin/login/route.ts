import { NextRequest, NextResponse } from "next/server";
import { seedData } from "@/lib/mockData";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const admin = seedData.admins.find((item) => item.email === body.email && item.password === body.password);
  if (!admin) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const response = NextResponse.json({ id: admin.id, name: admin.name, email: admin.email, role: admin.role });
  response.cookies.set("demo_role", "admin", { path: "/", sameSite: "lax" });
  return response;
}
