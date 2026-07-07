"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell, Card, PageTitle } from "@/components/AppShell";
import { loadDb, mockPay, money, statusText } from "@/lib/store";
import type { MockDb } from "@/lib/types";

export default function PaymentPage() {
  const params = useParams<{ id: string }>();
  const [db, setDb] = useState<MockDb>();
  const [message, setMessage] = useState("");
  useEffect(() => setDb(loadDb()), []);
  if (!db) return null;
  const booking = db.bookings.find((item) => item.id === params.id);
  if (!booking) return <AppShell><PageTitle title="找不到預約" /></AppShell>;
  const paid = db.payments.find((item) => item.bookingId === booking.id && item.paymentStatus === "paid");
  const amount = booking.finalAmount ?? booking.estimatedAmount;

  function pay() {
    try {
      mockPay(booking!.id);
      setDb(loadDb());
      setMessage("付款成功，已更新為 paid。");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "付款失敗");
    }
  }

  return (
    <AppShell>
      <PageTitle title="Mock Payment" subtitle="MVP 階段不串接真實金流。" />
      <Card className="max-w-xl">
        <div className="space-y-3 text-sm">
          <p>預約狀態：<b>{statusText(booking.status)}</b></p>
          <p>照顧費用：<b>{money(amount)}</b></p>
          <p>付款方式：<b>mock</b></p>
          <p>付款狀態：<b>{paid ? "paid" : "pending"}</b></p>
        </div>
        {booking.status !== "completed" ? <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm font-semibold text-amber-800">booking 完成後才可以付款。</p> : null}
        {message ? <p className="mt-4 text-sm font-semibold text-leaf">{message}</p> : null}
        <div className="mt-5 flex gap-2">
          <button className="btn-primary" disabled={booking.status !== "completed"} onClick={pay}>完成 mock payment</button>
          <Link className="btn-secondary" href={`/parent/bookings/${booking.id}/review`}>前往評價</Link>
        </div>
      </Card>
    </AppShell>
  );
}
