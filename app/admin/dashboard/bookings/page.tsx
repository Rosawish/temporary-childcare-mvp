import { AppShell, Card, PageTitle } from "@/components/AppShell";

export default function AdminBookingsDashboardPage() {
  return (
    <AppShell mode="admin">
      <PageTitle title="預約與媒合成效分析" subtitle="後續可擴充轉換率、取消原因、時段熱度與區域供需。" />
      <Card><p className="text-sm text-slate-600">第一版資料已整合在平台總覽的預約趨勢、狀態分布與最近預約列表中。</p></Card>
    </AppShell>
  );
}
