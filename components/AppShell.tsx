"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { Baby, BarChart3, Building2, Home, Search, Settings } from "lucide-react";

export function AppShell({ children, mode = "parent" }: { children: ReactNode; mode?: "parent" | "provider" | "admin" }) {
  const nav =
    mode === "parent"
      ? [
          { href: "/parent/dashboard", label: "首頁", icon: Home },
          { href: "/parent/children", label: "孩子", icon: Baby },
          { href: "/parent/search", label: "搜尋", icon: Search }
        ]
      : mode === "provider"
        ? [
          { href: "/provider/bookings", label: "預約", icon: Building2 },
          { href: "/provider/login", label: "帳號", icon: Settings }
        ]
        : [
          { href: "/admin/dashboard", label: "總覽", icon: BarChart3 },
          { href: "/admin/login", label: "帳號", icon: Settings }
        ];

  return (
    <main className="min-h-screen bg-mist">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href={mode === "parent" ? "/parent/dashboard" : mode === "provider" ? "/provider/bookings" : "/admin/dashboard"} className="flex items-center gap-2 font-bold text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-leaf text-white">托</span>
            臨時短托
          </Link>
          <nav className="flex items-center gap-1">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-leaf">
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </main>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm ${className}`}>{children}</section>;
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-bold text-ink">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-500">{text}</div>;
}
