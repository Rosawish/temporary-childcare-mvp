"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { loginProvider } from "@/lib/store";

export default function ProviderLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("provider@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  function submit() {
    if (!loginProvider(email, password)) {
      setError("請使用 provider@example.com / password123");
      return;
    }
    router.push("/provider/bookings");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-mist px-4 py-10">
      <section className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-md bg-leaf text-white"><Building2 /></span>
          <div>
            <h1 className="text-2xl font-bold text-ink">機構登入</h1>
            <p className="text-sm text-slate-600">幸福小屋短託後台 Demo</p>
          </div>
        </div>
        <label className="block"><span className="label">Email</span><input className="field mt-1" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="mt-3 block"><span className="label">Password</span><input className="field mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
        <button className="btn-primary mt-5 w-full" onClick={submit}>登入後台</button>
      </section>
    </main>
  );
}
