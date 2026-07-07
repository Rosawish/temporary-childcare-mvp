import Link from "next/link";

type ActionItems = Record<string, unknown[]>;

const labels: Record<string, { label: string; href: string }> = {
  pendingCenterReviews: { label: "待審核機構", href: "/admin/centers" },
  pendingDocumentReviews: { label: "待審核文件", href: "/admin/documents" },
  expiringDocuments: { label: "即將到期文件", href: "/admin/documents" },
  expiredDocuments: { label: "已過期文件", href: "/admin/documents" },
  pendingStaffReviews: { label: "待審核照顧人員", href: "/admin/staff" },
  pendingCameraReviews: { label: "待審核監控", href: "/admin/cameras" },
  openIncidents: { label: "未處理事件", href: "/admin/incidents" },
  failedPayments: { label: "付款失敗", href: "/admin/payments" },
  refundPending: { label: "待處理退款", href: "/admin/payments" }
};

export function ActionItemsPanel({ items }: { items: ActionItems }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(labels).map(([key, config]) => {
        const count = items[key]?.length ?? 0;
        return (
          <Link key={key} href={config.href} className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3 hover:border-leaf">
            <span className="text-sm font-semibold text-slate-700">{config.label}</span>
            <span className={`status-pill ${count ? "bg-amber-100 text-amber-800" : "bg-emerald-50 text-emerald-700"}`}>{count}</span>
          </Link>
        );
      })}
    </div>
  );
}
