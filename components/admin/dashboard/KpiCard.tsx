import type { ReactNode } from "react";

export function KpiCard({ label, value, description, tone = "default", icon }: { label: string; value: string; description: string; tone?: "default" | "good" | "warn" | "danger"; icon?: ReactNode }) {
  const toneClass = {
    default: "bg-slate-50 text-slate-600",
    good: "bg-emerald-50 text-emerald-700",
    warn: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700"
  }[tone];

  return (
    <article className="min-h-36 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        {icon ? <span className={`grid h-9 w-9 place-items-center rounded-md ${toneClass}`}>{icon}</span> : null}
      </div>
      <p className="mt-3 text-2xl font-bold text-ink">{value}</p>
      <p className="mt-3 text-xs leading-5 text-slate-500">{description}</p>
    </article>
  );
}
