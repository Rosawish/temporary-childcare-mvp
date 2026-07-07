"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell, Card, PageTitle } from "@/components/AppShell";
import { createReview, loadDb } from "@/lib/store";
import type { MockDb } from "@/lib/types";

export default function ReviewPage() {
  const params = useParams<{ id: string }>();
  const [db, setDb] = useState<MockDb>();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("老師回報清楚，臨時加班時很有幫助。");
  const [wouldUseAgain, setWouldUseAgain] = useState(true);
  const [message, setMessage] = useState("");
  useEffect(() => setDb(loadDb()), []);
  if (!db) return null;
  const exists = db.reviews.some((item) => item.bookingId === params.id);

  function submit() {
    try {
      createReview(params.id, rating, comment, wouldUseAgain);
      setDb(loadDb());
      setMessage("評價已送出，謝謝你的回饋。");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "評價失敗");
    }
  }

  return (
    <AppShell>
      <PageTitle title="留下評價" subtitle="payment_status = paid 後，每筆 booking 可建立一筆 review。" />
      <Card className="max-w-xl">
        <label className="block"><span className="label">星等</span><select className="field mt-1" value={rating} onChange={(e) => setRating(Number(e.target.value))}>{[5, 4, 3, 2, 1].map((star) => <option key={star} value={star}>{star} 星</option>)}</select></label>
        <label className="mt-3 block"><span className="label">文字回饋</span><textarea className="field mt-1" rows={5} value={comment} onChange={(e) => setComment(e.target.value)} /></label>
        <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={wouldUseAgain} onChange={(e) => setWouldUseAgain(e.target.checked)} /> 願意再次使用</label>
        {exists ? <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-600">此預約已建立評價。</p> : null}
        {message ? <p className="mt-4 text-sm font-semibold text-leaf">{message}</p> : null}
        <button className="btn-primary mt-5" disabled={exists} onClick={submit}>送出評價</button>
      </Card>
    </AppShell>
  );
}
