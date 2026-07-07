"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MapPin, Star } from "lucide-react";
import { AppShell, Card, PageTitle } from "@/components/AppShell";
import { centerRemaining, loadDb, money, reviewAverage } from "@/lib/store";
import type { MockDb } from "@/lib/types";

export default function SearchPage() {
  const [db, setDb] = useState<MockDb>();
  const [maxPrice, setMaxPrice] = useState(400);
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  useEffect(() => setDb(loadDb()), []);

  const centers = useMemo(() => {
    if (!db) return [];
    return db.centers.filter((center) => {
      const plan = db.servicePlans.find((item) => item.centerId === center.id);
      if (onlyAvailable && centerRemaining(center.id, db) <= 0) return false;
      if ((plan?.pricePerHour ?? 9999) > maxPrice) return false;
      return true;
    });
  }, [db, maxPrice, onlyAvailable]);

  if (!db) return null;

  return (
    <AppShell>
      <PageTitle title="搜尋附近短託機構" subtitle="MVP 先使用 mock location data，依距離、價格與剩餘名額篩選。" />
      <Card className="mb-5">
        <div className="grid gap-3 md:grid-cols-4">
          <label><span className="label">地點</span><input className="field mt-1" defaultValue="公立幼兒園附近" /></label>
          <label><span className="label">時段</span><select className="field mt-1" defaultValue="today"><option value="today">今日 16:30 後</option></select></label>
          <label><span className="label">最高每小時價格：{money(maxPrice)}</span><input className="mt-3 w-full accent-leaf" type="range" min="250" max="500" step="10" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} /></label>
          <label className="flex items-end gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} /> 只看有名額</label>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {centers.map((center) => {
          const plan = db.servicePlans.find((item) => item.centerId === center.id);
          const approvedDocs = db.documents.filter((item) => item.centerId === center.id && item.reviewStatus === "approved").length;
          const isApproved = center.reviewStatus === "approved";
          return (
            <Link key={center.id} href={`/parent/centers/${center.id}`} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-leaf">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">{center.name}</h2>
                  <p className="mt-1 flex items-center gap-1 text-sm text-slate-600"><MapPin size={15} /> {center.distanceKm} km｜{center.address}</p>
                </div>
                <span className={`status-pill ${isApproved ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{isApproved ? "平台已審核" : "補件中"}</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <div className="rounded-md bg-slate-50 p-2"><p className="text-slate-500">剩餘名額</p><p className="font-bold">{centerRemaining(center.id, db)}</p></div>
                <div className="rounded-md bg-slate-50 p-2"><p className="text-slate-500">價格</p><p className="font-bold">{money(plan?.pricePerHour ?? 0)}</p></div>
                <div className="rounded-md bg-slate-50 p-2"><p className="text-slate-500">開放時間</p><p className="font-bold">{center.openHours}</p></div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {center.tags.map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{tag}</span>)}
              </div>
              <p className="mt-3 flex items-center gap-1 text-sm text-amber-700"><Star size={15} /> {reviewAverage(center.id, db).toFixed(1)}｜合法文件 approved {approvedDocs} 筆</p>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
