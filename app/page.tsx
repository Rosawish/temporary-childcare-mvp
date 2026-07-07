import Link from "next/link";

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-mist px-4 py-10">
      <section className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-soft">
        <div className="mb-6">
          <p className="text-sm font-semibold text-leaf">臨時短托 MVP</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">托育服務媒合平台 Demo</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">請選擇要測試的角色入口。GitHub Pages 版本使用 mock data 與前端狀態，適合展示流程與介面。</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link className="btn-primary" href="/parent/login">家長端</Link>
          <Link className="btn-secondary" href="/provider/login">機構端</Link>
          <Link className="btn-secondary" href="/admin/login">管理員端</Link>
        </div>
      </section>
    </main>
  );
}
