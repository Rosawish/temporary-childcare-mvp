"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Baby, Building2, Camera, ClipboardCheck, CreditCard, FileWarning, RefreshCw, Star, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ActionItemsPanel } from "@/components/admin/dashboard/ActionItemsPanel";
import { BookingTrendChart, PieStatusChart, RatingDistributionChart, RevenueTrendChart, TopCentersChart } from "@/components/admin/dashboard/Charts";
import { CenterPerformanceTable } from "@/components/admin/dashboard/CenterPerformanceTable";
import { DateRangeFilter } from "@/components/admin/dashboard/DateRangeFilter";
import { KpiCard } from "@/components/admin/dashboard/KpiCard";
import { MetricSection } from "@/components/admin/dashboard/MetricSection";
import { RecentBookingsTable } from "@/components/admin/dashboard/RecentBookingsTable";
import { getActionItems, getBookingTrend, getOverviewMetrics, getRecentBookings, getRevenueTrend, getStatusDistribution, getTopCenters } from "@/lib/admin/dashboardMetrics";
import { formatMoney, formatNumber, formatPercent } from "@/lib/admin/format";
import { seedData } from "@/lib/mockData";

type Overview = Awaited<ReturnType<typeof fetchOverviewShape>>;
type LoadState = {
  overview?: Overview;
  revenueTrend: Array<Record<string, number | string>>;
  bookingTrend: Array<Record<string, number | string>>;
  topCenters: Array<{ centerName: string; bookingCount: number; completedBookingCount: number; revenue: number; averageRating: number; documentStatus: string; isBookable: boolean }>;
  distributions?: { bookingStatus: Array<Record<string, number | string>>; paymentStatus: Array<Record<string, number | string>>; reviewRatings: Array<{ rating: number; count: number }> };
  actionItems?: Record<string, unknown[]>;
  recentBookings: Array<{ id: string; createdAt: string; parentName: string; childName: string; centerName: string; status: string; amount: number; paymentStatus: string }>;
};

async function fetchOverviewShape() {
  return {
    users: { totalParents: 0, totalChildren: 0, parentActiveRate: 0 },
    centers: { totalCenters: 0, bookableCenters: 0 },
    bookings: { totalBookings: 0, bookingsThisMonth: 0, completionRate: 0 },
    revenue: { totalRevenue: 0, revenueThisMonth: 0, averageOrderValue: 0 },
    reviews: { averageRating: 0 },
    compliance: { pendingDocuments: 0, expiringDocuments: 0 },
    incidents: { openIncidents: 0 },
    camera: { totalCameraViews: 0 }
  };
}

export default function AdminDashboardPage() {
  const [months, setMonths] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [state, setState] = useState<LoadState>({ revenueTrend: [], bookingTrend: [], topCenters: [], recentBookings: [] });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const overview = getOverviewMetrics(seedData);
      const revenueTrend = getRevenueTrend(seedData, months);
      const bookingTrend = getBookingTrend(seedData, months);
      const topCenters = getTopCenters(seedData, 10);
      const distributions = getStatusDistribution(seedData);
      const actionItems = getActionItems(seedData);
      const recentBookings = getRecentBookings(seedData, 10);
      setState({ overview, revenueTrend, bookingTrend, topCenters, distributions, actionItems, recentBookings });
      setUpdatedAt(new Date().toLocaleString("zh-TW", { hour12: false }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "載入失敗");
    } finally {
      setLoading(false);
    }
  }, [months]);

  useEffect(() => {
    load();
  }, [load]);

  const cards = useMemo(() => {
    const overview = state.overview;
    if (!overview) return [];
    return [
      { label: "會員總數", value: formatNumber(overview.users.totalParents), description: "目前平台累計註冊家長數", icon: <Users size={18} /> },
      { label: "孩子建檔總數", value: formatNumber(overview.users.totalChildren), description: "已建立托育需求資料的孩子數", icon: <Baby size={18} /> },
      { label: "合作機構數", value: formatNumber(overview.centers.totalCenters), description: "平台累計媒合合作機構數", icon: <Building2 size={18} /> },
      { label: "可預約機構數", value: formatNumber(overview.centers.bookableCenters), description: "已通過審核且目前可提供預約的合作機構", tone: "good" as const, icon: <ClipboardCheck size={18} /> },
      { label: "預約總數", value: formatNumber(overview.bookings.totalBookings), description: "平台累計建立的預約媒合數", icon: <ClipboardCheck size={18} /> },
      { label: "本月預約數", value: formatNumber(overview.bookings.bookingsThisMonth), description: "觀察本月需求動能與供給壓力", icon: <ClipboardCheck size={18} /> },
      { label: "累計營收", value: formatMoney(overview.revenue.totalRevenue), description: "已付款金額累計，未扣除退款", tone: "good" as const, icon: <CreditCard size={18} /> },
      { label: "本月營收", value: formatMoney(overview.revenue.revenueThisMonth), description: "本月已付款預約收入", tone: "good" as const, icon: <CreditCard size={18} /> },
      { label: "平均客單價", value: formatMoney(overview.revenue.averageOrderValue), description: "每筆完成付款預約的平均收入", icon: <CreditCard size={18} /> },
      { label: "預約完成率", value: formatPercent(overview.bookings.completionRate), description: "衡量媒合服務是否順利完成", tone: "good" as const, icon: <ClipboardCheck size={18} /> },
      { label: "平均評分", value: overview.reviews.averageRating.toFixed(2), description: "整體服務品質的快速溫度計", icon: <Star size={18} /> },
      { label: "待審核文件", value: formatNumber(overview.compliance.pendingDocuments), description: "需審核文件，避免阻塞機構上架", tone: "warn" as const, icon: <FileWarning size={18} /> },
      { label: "即將到期文件", value: formatNumber(overview.compliance.expiringDocuments), description: "需提醒機構更新，避免影響合法性與可預約狀態", tone: "warn" as const, icon: <FileWarning size={18} /> },
      { label: "未處理事件", value: formatNumber(overview.incidents.openIncidents), description: "需優先追蹤，避免服務風險擴大", tone: overview.incidents.openIncidents ? "danger" as const : "good" as const, icon: <AlertTriangle size={18} /> },
      { label: "監控查看次數", value: formatNumber(overview.camera.totalCameraViews), description: "家長於服務期間查看開放空間監控的次數", icon: <Camera size={18} /> },
      { label: "活躍家長率", value: formatPercent(overview.users.parentActiveRate), description: "近 30 天仍有使用平台的家長比例", icon: <Users size={18} /> }
    ];
  }, [state.overview]);

  return (
    <AppShell mode="admin">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">平台經營儀錶板</h1>
          <p className="mt-1 text-sm text-slate-600">即時掌握會員、媒合、營收、合規、品質與風險狀況。</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <DateRangeFilter months={months} onChange={setMonths} />
          <span className="text-xs text-slate-500">更新時間：{updatedAt || "尚未更新"}</span>
          <button className="btn-secondary" onClick={load}><RefreshCw size={16} /> 重新整理</button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error} <a className="underline" href="/admin/login">前往登入</a>
        </div>
      ) : null}

      {loading ? <Skeleton /> : null}

      {!loading && !error && state.overview ? (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => <KpiCard key={card.label} {...card} />)}
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <MetricSection title="營收趨勢"><RevenueTrendChart data={state.revenueTrend} /></MetricSection>
            <MetricSection title="預約趨勢"><BookingTrendChart data={state.bookingTrend} /></MetricSection>
            <MetricSection title="機構預約排名"><TopCentersChart data={state.topCenters} /></MetricSection>
            <MetricSection title="預約狀態分布"><PieStatusChart data={state.distributions?.bookingStatus ?? []} /></MetricSection>
            <MetricSection title="付款狀態分布"><PieStatusChart data={state.distributions?.paymentStatus ?? []} /></MetricSection>
            <MetricSection title="評價分布"><RatingDistributionChart data={state.distributions?.reviewRatings ?? []} /></MetricSection>
          </div>

          <MetricSection title="待處理事項"><ActionItemsPanel items={state.actionItems ?? {}} /></MetricSection>
          <MetricSection title="機構營運排名表"><CenterPerformanceTable data={state.topCenters} /></MetricSection>
          <MetricSection title="最近預約列表"><RecentBookingsTable data={state.recentBookings} /></MetricSection>
        </div>
      ) : null}
    </AppShell>
  );
}

function Skeleton() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-36 animate-pulse rounded-lg bg-white" />)}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-lg bg-white" />)}
      </div>
    </div>
  );
}
