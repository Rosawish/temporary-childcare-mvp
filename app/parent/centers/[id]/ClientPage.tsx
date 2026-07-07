"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, FileText, Star } from "lucide-react";
import { AppShell, Card, PageTitle } from "@/components/AppShell";
import { centerRemaining, loadDb, money, reviewAverage } from "@/lib/store";
import type { MockDb } from "@/lib/types";

export default function CenterDetailPage() {
  const params = useParams<{ id: string }>();
  const [db, setDb] = useState<MockDb>();
  useEffect(() => setDb(loadDb()), []);
  if (!db) return null;
  const center = db.centers.find((item) => item.id === params.id);
  if (!center) return <AppShell><PageTitle title="找不到機構" /></AppShell>;
  const plan = db.servicePlans.find((item) => item.centerId === center.id);
  const documents = db.documents.filter((item) => item.centerId === center.id);
  const staff = db.staff.filter((item) => item.centerId === center.id);
  const photos = db.photos.filter((item) => item.centerId === center.id);
  const reviews = db.reviews.filter((item) => item.centerId === center.id);
  const canBook = center.reviewStatus === "approved" && centerRemaining(center.id, db) > 0;

  return (
    <AppShell>
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <PageTitle title={center.name} subtitle={`${center.address}｜${center.phone}`} />
        <Link className={`btn-primary ${!canBook ? "pointer-events-none opacity-50" : ""}`} href={`/parent/bookings/new?centerId=${center.id}`}>選擇此機構預約</Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
        <div className="space-y-4">
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`status-pill ${center.reviewStatus === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{center.reviewStatus === "approved" ? "平台已審核" : "審核補件中"}</span>
              <span className="status-pill bg-slate-100 text-slate-700"><Star size={14} /> {reviewAverage(center.id, db).toFixed(1)}</span>
              <span className="status-pill bg-honey/20 text-amber-800">剩餘 {centerRemaining(center.id, db)} 名額</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-700">{center.description}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <p className="text-sm"><b>單位編號：</b>{center.registrationNumber}</p>
              <p className="text-sm"><b>統一編號：</b>{center.businessNumber}</p>
              <p className="text-sm"><b>服務時間：</b>{center.openHours}</p>
              <p className="text-sm"><b>每小時價格：</b>{money(plan?.pricePerHour ?? 0)}</p>
              <p className="text-sm"><b>最短計費：</b>{plan?.minimumMinutes} 分鐘</p>
              <p className="text-sm"><b>逾時計費：</b>{plan?.overtimePolicy}</p>
              <p className="text-sm sm:col-span-2"><b>取消規則：</b>{plan?.cancellationPolicy}</p>
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 flex items-center gap-2 font-bold"><FileText size={18} /> 合法登記與文件</h2>
            <div className="grid gap-2">
              {documents.map((doc) => (
                <div key={doc.id} className="rounded-md border border-slate-200 p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <b>{doc.documentName}</b>
                    <span className={`status-pill ${doc.reviewStatus === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{doc.reviewStatus}</span>
                  </div>
                  <p className="mt-1 text-slate-600">{doc.issuedBy}｜{doc.documentNumber}｜有效至 {doc.validUntil}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 font-bold">老師 / 照顧人員</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {staff.map((person) => (
                <div key={person.id} className="rounded-md bg-slate-50 p-3">
                  <p className="font-semibold">{person.name}｜{person.title}</p>
                  <p className="text-sm text-slate-600">{person.qualification}，{person.experienceYears} 年經驗</p>
                  <p className="mt-2 text-sm text-slate-600">{person.bio}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h2 className="mb-3 font-bold">環境照片</h2>
            <div className="space-y-3">
              {photos.map((photo) => (
                <figure key={photo.id} className="overflow-hidden rounded-md border border-slate-200">
                  <img src={photo.photoUrl} alt={photo.spaceName} className="h-40 w-full object-cover" />
                  <figcaption className="p-2 text-sm text-slate-600">{photo.spaceName}｜{photo.description}</figcaption>
                </figure>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="mb-3 flex items-center gap-2 font-bold"><CheckCircle2 size={18} /> 安全措施</h2>
            <ul className="space-y-2 text-sm text-slate-700">
              {center.safetyMeasures.map((item) => <li key={item}>• {item}</li>)}
            </ul>
            <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-600">{center.cameraPolicy}</p>
          </Card>
          <Card>
            <h2 className="mb-3 font-bold">家長評價</h2>
            <div className="space-y-3">
              {reviews.map((review) => <p key={review.id} className="rounded-md bg-slate-50 p-3 text-sm">★ {review.rating}｜{review.comment}</p>)}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
