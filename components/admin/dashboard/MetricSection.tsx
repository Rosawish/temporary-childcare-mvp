import type { ReactNode } from "react";

export function MetricSection({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-ink">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
