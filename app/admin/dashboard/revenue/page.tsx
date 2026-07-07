import { AppShell, Card, PageTitle } from "@/components/AppShell";

export default function AdminRevenueDashboardPage() {
  return (
    <AppShell mode="admin">
      <PageTitle title="營收與付款分析" subtitle="後續可擴充 cohort、退款、抽成與機構結算分析。" />
      <Card><p className="text-sm text-slate-600">第一版資料已整合在平台總覽的營收 KPI、營收趨勢與付款狀態分布中。</p></Card>
    </AppShell>
  );
}
