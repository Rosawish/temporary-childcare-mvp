import { AppShell, Card, PageTitle } from "@/components/AppShell";

export default function AdminIncidentsDashboardPage() {
  return (
    <AppShell mode="admin">
      <PageTitle title="異常事件、申訴與風險分析" subtitle="後續可擴充 SLA、嚴重度趨勢與機構風險分級。" />
      <Card><p className="text-sm text-slate-600">第一版資料已整合在平台總覽的未處理事件與待處理事項中。</p></Card>
    </AppShell>
  );
}
