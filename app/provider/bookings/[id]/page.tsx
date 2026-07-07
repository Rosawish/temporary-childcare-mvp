"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell, Card, PageTitle } from "@/components/AppShell";
import { addCareLog, dateTime, loadDb, statusText, timeOnly, updateBookingStatus } from "@/lib/store";
import type { BookingStatus, CareStatusType, MockDb } from "@/lib/types";

const actions: { label: string; status: BookingStatus; note: string; type: CareStatusType }[] = [
  { label: "孩子報到 checked_in", status: "checked_in", note: "孩子已完成報到，狀態穩定。", type: "arrived" },
  { label: "開始照顧 in_care", status: "in_care", note: "已進入活動區，由張雅婷老師陪同。", type: "activity" },
  { label: "準備接回 ready_pickup", status: "ready_pickup", note: "已整理物品，可由授權接回人接回。", type: "ready_pickup" },
  { label: "完成接回 completed", status: "completed", note: "家長完成接回確認。", type: "ready_pickup" }
];

export default function ProviderBookingDetailPage() {
  const params = useParams<{ id: string }>();
  const [db, setDb] = useState<MockDb>();
  const [statusType, setStatusType] = useState<CareStatusType>("activity");
  const [note, setNote] = useState("正在閱讀區聽故事，情緒穩定。");
  useEffect(() => setDb(loadDb()), []);
  if (!db) return null;
  const booking = db.bookings.find((item) => item.id === params.id);
  if (!booking) return <AppShell mode="provider"><PageTitle title="找不到預約" /></AppShell>;
  const child = db.children.find((item) => item.id === booking.childProfileId);
  const parent = db.parents.find((item) => item.id === booking.parentUserId);
  const logs = db.careLogs.filter((item) => item.bookingId === booking.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  function runAction(action: (typeof actions)[number]) {
    updateBookingStatus(booking!.id, action.status);
    addCareLog(booking!.id, action.type, action.note);
    setDb(loadDb());
  }

  function addLog() {
    addCareLog(booking!.id, statusType, note);
    setDb(loadDb());
  }

  return (
    <AppShell mode="provider">
      <PageTitle title="預約詳情與照顧紀錄" subtitle={`${child?.name}｜家長 ${parent?.name}｜${timeOnly(booking.startTime)} - ${timeOnly(booking.endTime)}`} />
      <div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
        <div className="space-y-4">
          <Card>
            <p className="text-sm text-slate-500">目前狀態</p>
            <p className="mt-1 text-3xl font-bold text-leaf">{statusText(booking.status)}</p>
            <p className="mt-3 text-sm text-slate-600">報到代碼：<b>{booking.checkinCode}</b></p>
            <div className="mt-4 grid gap-2">
              {actions.map((action) => (
                <button key={action.status} className="btn-secondary justify-start" onClick={() => runAction(action)}>{action.label}</button>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="mb-3 font-bold">新增照顧狀態紀錄</h2>
            <label><span className="label">類型</span><select className="field mt-1" value={statusType} onChange={(e) => setStatusType(e.target.value as CareStatusType)}><option value="activity">activity</option><option value="snack">snack</option><option value="emotional">emotional</option><option value="incident">incident</option><option value="ready_pickup">ready_pickup</option></select></label>
            <label className="mt-3 block"><span className="label">紀錄</span><textarea className="field mt-1" rows={4} value={note} onChange={(e) => setNote(e.target.value)} /></label>
            <button className="btn-primary mt-4" onClick={addLog}>新增紀錄</button>
          </Card>
        </div>
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
