"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell, Card, PageTitle } from "@/components/AppShell";
import { currentProviderCenterId, loadDb, money, statusText, timeOnly } from "@/lib/store";
import type { BookingStatus, MockDb } from "@/lib/types";

export default function ProviderBookingsPage() {
  const [db, setDb] = useState<MockDb>();
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  useEffect(() => {
    setDb(loadDb());
    const timer = window.setInterval(() => setDb(loadDb()), 1200);
    return () => window.clearInterval(timer);
  }, []);
  if (!db) return null;
  const centerId = currentProviderCenterId();
  const center = db.centers.find((item) => item.id === centerId);
  const bookings = db.bookings.filter((item) => item.centerId === centerId && (filter === "all" || item.status === filter));

  return (
    <AppShell mode="provider">
      <PageTitle title={`${center?.name ?? "機構"} 預約管理`} subtitle="用表格快速確認今日預約、狀態與待處理事項。" />
      <Card className="mb-5">
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "confirmed", "checked_in", "in_care", "ready_pickup", "completed"] as const).map((item) => (
            <button key={item} className={`rounded-md px-3 py-2 text-sm font-semibold ${filter === item ? "bg-leaf text-white" : "bg-slate-100 text-slate-600"}`} onClick={() => setFilter(item)}>
              {item === "all" ? "全部" : statusText(item)}
            </button>
          ))}
        </div>
      </Card>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3">孩子</th>
                <th>家長</th>
                <th>時段</th>
                <th>狀態</th>
                <th>金額</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const child = db.children.find((item) => item.id === booking.childProfileId);
                const parent = db.parents.find((item) => item.id === booking.parentUserId);
                return (
                  <tr key={booking.id} className="border-b border-slate-100">
                    <td className="py-3 font-semibold">{child?.name}</td>
                    <td>{parent?.name}</td>
                    <td>{timeOnly(booking.startTime)} - {timeOnly(booking.endTime)}</td>
                    <td><span className="status-pill bg-honey/20 text-amber-800">{statusText(booking.status)}</span></td>
                    <td>{money(booking.finalAmount ?? booking.estimatedAmount)}</td>
                    <td><Link className="btn-secondary" href={`/provider/bookings/${booking.id}`}>管理</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
