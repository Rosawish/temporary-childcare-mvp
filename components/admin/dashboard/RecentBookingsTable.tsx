import { formatDateTime, formatMoney } from "@/lib/admin/format";

export function RecentBookingsTable({ data }: { data: Array<{ id: string; createdAt: string; parentName: string; childName: string; centerName: string; status: string; amount: number; paymentStatus: string }> }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-slate-200 text-slate-500">
          <tr><th className="py-3">預約時間</th><th>家長</th><th>孩子</th><th>機構</th><th>狀態</th><th>金額</th><th>付款</th></tr>
        </thead>
        <tbody>
          {data.map((booking) => (
            <tr key={booking.id} className="border-b border-slate-100">
              <td className="py-3">{formatDateTime(booking.createdAt)}</td>
              <td>{booking.parentName}</td>
              <td>{booking.childName}</td>
              <td className="font-semibold">{booking.centerName}</td>
              <td>{booking.status}</td>
              <td>{formatMoney(booking.amount)}</td>
              <td>{booking.paymentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
