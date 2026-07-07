"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell, Card, PageTitle } from "@/components/AppShell";
import { dateTime, loadDb, statusText } from "@/lib/store";
import type { MockDb } from "@/lib/types";

export default function BookingStatusPage() {
  const params = useParams<{ id: string }>();
  const [db, setDb] = useState<MockDb>();
  useEffect(() => {
    setDb(loadDb());
    const timer = window.setInterval(() => setDb(loadDb()), 1200);
    return () => window.clearInterval(timer);
  }, []);
  if (!db) return null;
  const booking = db.bookings.find((item) => item.id === params.id);
  if (!booking) return <AppShell><PageTitle title="找不到預約" /></AppShell>;
  const logs = db.careLogs.filter((item) => item.bookingId === booking.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const arrived = ["checked_in", "in_care", "ready_pickup", "completed"].includes(booking.status);
  const canPickup = ["ready_pickup", "completed"].includes(booking.status);

  return (
    <AppShell>
      <PageTitle title="孩子狀態" subtitle="機構更新報到與照顧紀錄後，家長端會看到最新狀態。" />
      <div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
        <Card>
          <p className="text-sm text-slate-500">目前預約狀態</p>
          <p className="mt-1 text-3xl font-bold text-leaf">{statusText(booking.status)}</p>
          <div className="mt-4 space-y-2 text-sm">
            <p>是否已抵達：<b>{arrived ? "是" : "尚未"}</b></p>
            <p>目前活動：<b>{logs[0]?.note ?? "等待機構更新"}</b></p>
            <p>情緒狀態：<b>{logs.find((log) => log.statusType === "emotional")?.note ?? "無特殊狀況"}</b></p>
            <p>是否可接回：<b>{canPickup ? "可以" : "尚未開放接回"}</b></p>
          </div>
          <Link className="btn-secondary mt-5" href={`/parent/bookings/${booking.id}/camera`}>查看監控</Link>
        </Card>
        <Card>
          <h2 className="mb-3 font-bold">照顧紀錄</h2>
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="rounded-md border border-slate-200 p-3">
                <p className="font-semibold">{log.note}</p>
                <p className="mt-1 text-xs text-slate-500">{log.createdBy}｜{dateTime(log.createdAt)}｜{log.statusType}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
