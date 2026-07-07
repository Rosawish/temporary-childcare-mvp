import { AppShell, Card, PageTitle } from "@/components/AppShell";

export default function AdminComplianceDashboardPage() {
  return (
    <AppShell mode="admin">
      <PageTitle title="文件、證照、照顧人員與監控審核分析" subtitle="後續可擴充合規健康度與到期提醒工作流。" />
      <Card><p className="text-sm text-slate-600">第一版資料已整合在平台總覽的合規 KPI 與待處理事項中。</p></Card>
    </AppShell>
  );
}
