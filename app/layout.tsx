import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "臨時短托 MVP",
  description: "托育服務媒合平台第一階段 Demo"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
