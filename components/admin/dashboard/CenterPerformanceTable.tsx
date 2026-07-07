import { formatMoney } from "@/lib/admin/format";

export function CenterPerformanceTable({ data }: { data: Array<{ centerName: string; bookingCount: number; completedBookingCount: number; revenue: number; averageRating: number; documentStatus: string; isBookable: boolean }> }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-slate-200 text-slate-500">
          <tr><th className="py-3">排名</th><th>機構名稱</th><th>預約數</th><th>完成數</th><th>營收</th><th>平均評分</th><th>文件狀態</th><th>可預約</th></tr>
        </thead>
        <tbody>
          {data.map((center, index) => (
            <tr key={center.centerName} className="border-b border-slate-100">
              <td className="py-3 font-bold">{index + 1}</td>
              <td className="font-semibold">{center.centerName}</td>
              <td>{center.bookingCount}</td>
              <td>{center.completedBookingCount}</td>
              <td>{formatMoney(center.revenue)}</td>
              <td>{center.averageRating || "-"}</td>
              <td>{center.documentStatus}</td>
              <td>{center.isBookable ? "是" : "否"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
