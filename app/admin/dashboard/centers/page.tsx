import { AppShell, Card, PageTitle } from "@/components/AppShell";

export default function AdminCentersDashboardPage() {
  return (
    <AppShell mode="admin">
      <PageTitle title="機構媒合與營運分析" subtitle="後續可擴充機構留存、供給時段、名額使用率與品質分群。" />
      <Card><p className="text-sm text-slate-600">第一版資料已整合在平台總覽的機構排名與合規指標中。</p></Card>
    </AppShell>
  );
}
