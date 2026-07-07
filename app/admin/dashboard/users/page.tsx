import { AppShell, Card, PageTitle } from "@/components/AppShell";

export default function AdminUsersDashboardPage() {
  return <BasicDashboardPage title="會員與家長使用分析" />;
}

function BasicDashboardPage({ title }: { title: string }) {
  return (
    <AppShell mode="admin">
      <PageTitle title={title} subtitle="第二階段第一版先集中於平台總覽，後續可接入分頁深度分析。" />
      <Card><p className="text-sm text-slate-600">請先回到 /admin/dashboard 查看完整 KPI、圖表與待處理事項。</p></Card>
    </AppShell>
  );
}
