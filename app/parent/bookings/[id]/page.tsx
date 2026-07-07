"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell, Card, PageTitle } from "@/components/AppShell";
import { loadDb, money, statusText, timeOnly } from "@/lib/store";
import type { MockDb } from "@/lib/types";

export default function BookingDetailPage() {
  const params = useParams<{ id: string }>();
  const [db, setDb] = useState<MockDb>();
  useEffect(() => setDb(loadDb()), []);
  if (!db) return null;
  const booking = db.bookings.find((item) => item.id === params.id);
  if (!booking) return <AppShell><PageTitle title="找不到預約" /></AppShell>;
  const center = db.centers.find((item) => item.id === booking.centerId);
  const child = db.children.find((item) => item.id === booking.childProfileId);
  const plan = db.servicePlans.find((item) => item.id === booking.servicePlanId);

  return (
    <AppShell>
      <PageTitle title="預約詳情" subtitle={`${child?.name}｜${center?.name}`} />
      <div className="grid gap-4 lg:grid-cols-[1fr_.8fr]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="status-pill bg-honey/20 text-amber-800">{statusText(booking.status)}</span>
            <span className="rounded-md bg-slate-100 px-3 py-2 font-mono text-lg font-bold">報到代碼 {booking.checkinCode}</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <p><b>孩子：</b>{child?.name}</p>
            <p><b>機構：</b>{center?.name}</p>
            <p><b>方案：</b>{plan?.name}</p>
            <p><b>費用預估：</b>{money(booking.estimatedAmount)}</p>
            <p><b>預約時段：</b>{timeOnly(booking.startTime)} - {timeOnly(booking.endTime)}</p>
            <p><b>機構電話：</b>{center?.phone}</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link className="btn-secondary" href={`/parent/bookings/${booking.id}/status`}>查看孩子狀態</Link>
            <Link className="btn-secondary" href={`/parent/bookings/${booking.id}/camera`}>查看開放空間監控</Link>
            <Link className="btn-secondary" href={`/parent/bookings/${booking.id}/payment`}>付款</Link>
            <Link className="btn-secondary" href={`/parent/bookings/${booking.id}/review`}>留下評價</Link>
          </div>
        </Card>
        <Card>
          <h2 className="mb-3 font-bold">老師通知模板</h2>
          <pre className="whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-sm leading-7 text-slate-700">{booking.teacherNoticeText}</pre>
        </Card>
      </div>
    </AppShell>
  );
}
