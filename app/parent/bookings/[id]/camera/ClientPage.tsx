"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell, Card, PageTitle } from "@/components/AppShell";
import { cameraPermission, currentParent, logCameraAccess } from "@/lib/store";

export default function CameraPage() {
  const params = useParams<{ id: string }>();
  const [agreed, setAgreed] = useState(false);
  const [permission, setPermission] = useState<ReturnType<typeof cameraPermission>>();
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const parent = currentParent();
    if (parent) setPermission(cameraPermission(params.id, parent.id));
  }, [params.id]);

  useEffect(() => {
    const parent = currentParent();
    if (agreed && permission?.ok && permission.feed && parent && !logged) {
      logCameraAccess(params.id, parent.id, permission.feed.id);
      setLogged(true);
    }
  }, [agreed, permission, logged, params.id]);

  const feed = permission?.ok ? permission.feed : undefined;

  return (
    <AppShell>
      <PageTitle title="開放空間監控" subtitle="僅限服務時段、已審核開放空間與該預約家長查看。" />
      {!permission?.ok ? (
        <Card><p className="font-semibold text-red-600">無法查看：{permission?.reason ?? "檢查中"}</p></Card>
      ) : !agreed ? (
        <Card>
          <h2 className="mb-3 font-bold">隱私告知</h2>
          <div className="space-y-2 text-sm text-slate-700">
            <p>不可錄影。</p>
            <p>不可下載。</p>
            <p>不可截圖。</p>
            <p>不可外流或提供第三方查看。</p>
          </div>
          <button className="btn-primary mt-5" onClick={() => setAgreed(true)}>我同意並查看</button>
        </Card>
      ) : feed ? (
        <Card>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-bold">{feed.spaceName}</h2>
            <span className="status-pill bg-emerald-50 text-emerald-700">已記錄本次查看</span>
          </div>
          <iframe className="aspect-video w-full rounded-md border border-slate-200" src={feed.feedUrl} title="mock camera feed" allow="autoplay; encrypted-media" />
        </Card>
      ) : (
        <Card><p className="font-semibold text-red-600">監控資料載入失敗，請返回狀態頁後再試一次。</p></Card>
      )}
    </AppShell>
  );
}
