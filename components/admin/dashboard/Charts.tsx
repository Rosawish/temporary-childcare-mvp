"use client";

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMoney } from "@/lib/admin/format";

const colors = ["#2f6f62", "#ec7357", "#f4b860", "#64748b", "#38bdf8", "#a78bfa", "#f472b6", "#94a3b8"];

export function RevenueTrendChart({ data }: { data: Array<Record<string, number | string>> }) {
  return (
    <ChartFrame empty={!data.length}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
        <Tooltip formatter={(value) => formatMoney(Number(value))} />
        <Line type="monotone" dataKey="totalRevenue" stroke="#2f6f62" strokeWidth={2} name="營收" />
        <Line type="monotone" dataKey="platformCommission" stroke="#ec7357" strokeWidth={2} name="平台抽成" />
        <Line type="monotone" dataKey="refundedAmount" stroke="#64748b" strokeWidth={2} name="退款" />
      </LineChart>
    </ChartFrame>
  );
}

export function BookingTrendChart({ data }: { data: Array<Record<string, number | string>> }) {
  return (
    <ChartFrame empty={!data.length}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="totalBookings" stroke="#2f6f62" strokeWidth={2} name="總預約" />
        <Line type="monotone" dataKey="completedBookings" stroke="#ec7357" strokeWidth={2} name="完成" />
        <Line type="monotone" dataKey="cancelledBookings" stroke="#64748b" strokeWidth={2} name="取消" />
      </LineChart>
    </ChartFrame>
  );
}

export function TopCentersChart({ data }: { data: Array<{ centerName: string; bookingCount: number; revenue: number }> }) {
  return (
    <ChartFrame empty={!data.length}>
      <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="centerName" type="category" width={120} />
        <Tooltip formatter={(value, name) => (name === "revenue" ? formatMoney(Number(value)) : value)} />
        <Bar dataKey="bookingCount" fill="#2f6f62" name="預約數" />
      </BarChart>
    </ChartFrame>
  );
}

export function PieStatusChart({ data, nameKey = "status" }: { data: Array<Record<string, number | string>>; nameKey?: string }) {
  const filtered = data.filter((item) => Number(item.count) > 0);
  return (
    <ChartFrame empty={!filtered.length}>
      <PieChart>
        <Tooltip />
        <Pie data={filtered} dataKey="count" nameKey={nameKey} innerRadius={48} outerRadius={82} paddingAngle={2}>
          {filtered.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
        </Pie>
      </PieChart>
    </ChartFrame>
  );
}

export function RatingDistributionChart({ data }: { data: Array<{ rating: number; count: number }> }) {
  return (
    <ChartFrame empty={!data.length}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="rating" tickFormatter={(value) => `${value}星`} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#f4b860" name="評價數" />
      </BarChart>
    </ChartFrame>
  );
}

function ChartFrame({ children, empty }: { children: React.ReactElement; empty: boolean }) {
  if (empty) return <div className="grid h-72 place-items-center rounded-md bg-slate-50 text-sm text-slate-500">目前尚無資料</div>;
  return <div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>;
}
