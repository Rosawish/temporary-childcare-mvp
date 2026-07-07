"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { AppShell, Card, PageTitle } from "@/components/AppShell";
import { createBooking, currentParent, defaultBookingTimes, estimateAmount, loadDb, money } from "@/lib/store";
import type { MockDb } from "@/lib/types";

export default function NewBookingPage() {
  return (
    <Suspense fallback={<AppShell><PageTitle title="建立今日臨時短託預約" subtitle="載入預約表單中..." /></AppShell>}>
      <NewBookingContent />
    </Suspense>
  );
}

function NewBookingContent() {
  const router = useRouter();
  const search = useSearchParams();
  const [db, setDb] = useState<MockDb>();
  const [childId, setChildId] = useState("");
  const [centerId, setCenterId] = useState(search.get("centerId") ?? "center-happy");
  const [startTime, setStartTime] = useState(defaultBookingTimes().startTime);
  const [endTime, setEndTime] = useState(defaultBookingTimes().endTime);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loaded = loadDb();
    const parent = currentParent();
    const firstChild = loaded.children.find((item) => item.parentUserId === parent?.id);
    setDb(loaded);
    setChildId(firstChild?.id ?? "");
  }, []);

  const parent = typeof window !== "undefined" ? currentParent() : undefined;
  const children = db?.children.filter((child) => child.parentUserId === parent?.id) ?? [];
  const plans = db?.servicePlans.filter((plan) => plan.centerId === centerId && plan.isActive) ?? [];
  const selectedPlan = plans[0];
  const estimate = useMemo(() => selectedPlan ? estimateAmount(startTime, endTime, selectedPlan.pricePerHour, selectedPlan.minimumMinutes) : 0, [selectedPlan, startTime, endTime]);

  if (!db || !parent) return null;

  function submit() {
    try {
      if (!agreed) throw new Error("請先同意服務規範、個資、影像與緊急處理告知");
      if (!selectedPlan) throw new Error("此機構目前沒有可預約方案");
      const booking = createBooking({ parentUserId: parent!.id, childProfileId: childId, centerId, servicePlanId: selectedPlan.id, startTime, endTime });
      router.push(`/parent/bookings/${booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "建立預約失敗");
    }
  }

  return (
    <AppShell>
      <PageTitle title="建立今日臨時短託預約" subtitle="選孩子、機構與時段，送出後會自動產生老師通知模板。" />
      <div className="grid gap-4 lg:grid-cols-[1fr_.7fr]">
        <Card>
          <div className="grid gap-3 sm:grid-cols-2">
            <label><span className="label">選擇孩子</span><select className="field mt-1" value={childId} onChange={(e) => setChildId(e.target.value)}>{children.map((child) => <option key={child.id} value={child.id}>{child.name}</option>)}</select></label>
            <label><span className="label">選擇機構</span><select className="field mt-1" value={centerId} onChange={(e) => setCenterId(e.target.value)}>{db.centers.map((center) => <option key={center.id} value={center.id}>{center.name}</option>)}</select></label>
            <label><span className="label">服務方案</span><input className="field mt-1" value={selectedPlan?.name ?? "無可用方案"} readOnly /></label>
            <label><span className="label">每小時價格</span><input className="field mt-1" value={money(selectedPlan?.pricePerHour ?? 0)} readOnly /></label>
            <label><span className="label">開始時間</span><input className="field mt-1" type="datetime-local" value={startTime.slice(0, 16)} onChange={(e) => setStartTime(`${e.target.value}:00`)} /></label>
            <label><span className="label">結束時間</span><input className="field mt-1" type="datetime-local" value={endTime.slice(0, 16)} onChange={(e) => setEndTime(`${e.target.value}:00`)} /></label>
          </div>
          <label className="mt-4 flex items-start gap-2 rounded-md bg-slate-50 p-3 text-sm text-slate-700">
            <input className="mt-1" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>我已閱讀並同意服務規範、個資告知、影像告知與緊急處理同意。影像僅限服務期間查看，不得錄影、下載、截圖或外流。</span>
          </label>
          {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
          <button className="btn-primary mt-4 w-full sm:w-auto" onClick={submit}>送出預約</button>
        </Card>
        <Card>
          <h2 className="mb-3 font-bold">費用預估</h2>
          <p className="text-3xl font-bold text-leaf">{money(estimate)}</p>
          <p className="mt-2 text-sm text-slate-600">依最短計費 {selectedPlan?.minimumMinutes ?? 0} 分鐘與預約時段計算，完成接回後會產生最終費用。</p>
          <div className="mt-4 rounded-md bg-honey/15 p-3 text-sm text-amber-900">Demo 建議：幸福小屋短託、今日 16:30–18:00、小安。</div>
        </Card>
      </div>
    </AppShell>
  );
}
