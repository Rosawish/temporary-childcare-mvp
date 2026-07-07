"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarClock, MapPin, Star } from "lucide-react";
import { AppShell, Card, PageTitle } from "@/components/AppShell";
import { centerRemaining, currentParent, loadDb, money, reviewAverage, statusText, timeOnly } from "@/lib/store";
import type { MockDb, ParentUser } from "@/lib/types";

export default function ParentDashboardPage() {
  const [db, setDb] = useState<MockDb>();
  const [parent, setParent] = useState<ParentUser>();

  useEffect(() => {
    setDb(loadDb());
    setParent(currentParent());
  }, []);

  if (!db || !parent) return null;
  const children = db.children.filter((child) => child.parentUserId === parent.id);
  const bookings = db.bookings.filter((booking) => booking.parentUserId === parent.id && !["completed", "cancelled"].includes(booking.status));
  const centers = db.centers.filter((center) => center.reviewStatus === "approved");

  return (
    <AppShell>
      <PageTitle title={`Hi，${parent.name}`} subtitle="今天如果臨時卡住，先讓孩子安全抵達，再慢慢處理後面的事。" />
      <Link href="/parent/search" className="mb-6 flex min-h-28 items-center justify-between rounded-lg bg-coral px-5 py-5 text-white shadow-soft">
        <div>
          <p className="text-sm font-semibold opacity-90">快速媒合</p>
          <h2 className="mt-1 text-3xl font-bold">今日臨時短託</h2>
          <p className="mt-2 text-sm opacity-90">查看附近合法審核、價格透明、可即時預約據點</p>
        </div>
        <CalendarClock className="hidden sm:block" size={44} />
      </Link>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <h2 className="mb-3 font-bold">我的孩子</h2>
          <div className="space-y-3">
            {children.map((child) => (
              <div key={child.id} className="rounded-md bg-slate-50 p-3">
                <p className="font-semibold">{child.name}，{child.age} 歲</p>
                <p className="text-sm text-slate-600">{child.schoolName} {child.className}，放學 {child.schoolLeaveTime}</p>
              </div>
            ))}
          </div>
          <Link className="btn-secondary mt-4 w-full" href="/parent/children">管理孩子資料</Link>
        </Card>

        <Card>
          <h2 className="mb-3 font-bold">進行中預約</h2>
          <div className="space-y-3">
            {bookings.map((booking) => {
              const center = db.centers.find((item) => item.id === booking.centerId);
              const child = db.children.find((item) => item.id === booking.childProfileId);
              return (
                <Link key={booking.id} href={`/parent/bookings/${booking.id}`} className="block rounded-md border border-slate-200 p-3 hover:border-leaf">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{child?.name}｜{center?.name}</p>
                      <p className="text-sm text-slate-600">{timeOnly(booking.startTime)} - {timeOnly(booking.endTime)}</p>
                    </div>
                    <span className="status-pill bg-honey/20 text-amber-800">{statusText(booking.status)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 font-bold">附近可預約短託據點</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {centers.map((center) => {
            const plan = db.servicePlans.find((item) => item.centerId === center.id);
            return (
              <Link key={center.id} href={`/parent/centers/${center.id}`} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-leaf">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">{center.name}</h3>
                  <span className="status-pill bg-emerald-50 text-emerald-700">已審核</span>
                </div>
                <p className="mt-2 flex items-center gap-1 text-sm text-slate-600"><MapPin size={15} /> {center.distanceKm} km</p>
                <p className="mt-2 text-sm">{money(plan?.pricePerHour ?? 0)} / 小時，剩餘 {centerRemaining(center.id, db)} 名額</p>
                <p className="mt-2 flex items-center gap-1 text-sm text-amber-700"><Star size={15} /> {reviewAverage(center.id, db).toFixed(1)}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
