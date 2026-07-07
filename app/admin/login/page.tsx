"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    if (email === "admin@example.com" && password === "password123") {
      window.localStorage.setItem("temporary-childcare-admin", "admin-demo");
      router.push("/admin/dashboard");
      return;
    }

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        setError("請使用 admin@example.com / password123");
        return;
      }
      router.push("/admin/dashboard");
    } catch {
      setError("請使用 admin@example.com / password123");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-mist px-4 py-10">
      <section className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-md bg-leaf text-white"><ShieldCheck /></span>
          <div>
            <h1 className="text-2xl font-bold text-ink">管理員登入</h1>
            <p className="text-sm text-slate-600">平台經營儀錶板 Demo</p>
          </div>
        </div>
        <label className="block"><span className="label">Email</span><input className="field mt-1" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label className="mt-3 block"><span className="label">Password</span><input className="field mt-1" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
        <button className="btn-primary mt-5 w-full" onClick={submit}>登入管理後台</button>
      </section>
    </main>
  );
}
