import { AppShell, Card, PageTitle } from "@/components/AppShell";

export default function AdminReviewsDashboardPage() {
  return (
    <AppShell mode="admin">
      <PageTitle title="評價與服務品質分析" subtitle="後續可擴充低分歸因、機構 NPS 與再次使用率。" />
      <Card><p className="text-sm text-slate-600">第一版資料已整合在平台總覽的平均評分與評價分布中。</p></Card>
    </AppShell>
  );
}
