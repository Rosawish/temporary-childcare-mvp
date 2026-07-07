"use client";

export function DateRangeFilter({ months, onChange }: { months: number; onChange: (months: number) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
      日期區間
      <select className="field w-36" value={months} onChange={(event) => onChange(Number(event.target.value))}>
        <option value={3}>近 3 個月</option>
        <option value={6}>近 6 個月</option>
        <option value={12}>近 12 個月</option>
      </select>
    </label>
  );
}
