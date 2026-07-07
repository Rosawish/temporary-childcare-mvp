"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { loginParent, resetDemoData } from "@/lib/store";

export default function ParentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("parent@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  function submit() {
    const parent = loginParent(email, password);
    if (!parent) {
      setError("登入失敗，請使用 seed 帳號 parent@example.com / password123");
      return;
    }
    router.push("/parent/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-mist px-4 py-10">
      <section className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-md bg-leaf text-white">
            <ShieldCheck />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-ink">家長登入</h1>
            <p className="text-sm text-slate-600">快速建立今日臨時短託預約</p>
          </div>
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="label">Email</span>
            <input className="field mt-1" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="block">
            <span className="label">Password</span>
            <input className="field mt-1" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
          <button className="btn-primary w-full" onClick={submit}>登入並開始</button>
          <button className="btn-secondary w-full" onClick={() => { resetDemoData(); setEmail("parent@example.com"); setPassword("password123"); }}>
            重置 Demo 資料
          </button>
        </div>
      </section>
    </main>
  );
}
