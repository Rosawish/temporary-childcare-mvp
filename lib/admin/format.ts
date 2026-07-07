export function formatMoney(value: number) {
  return `NT$${Math.round(value).toLocaleString("zh-TW")}`;
}

export function formatNumber(value: number) {
  return Math.round(value).toLocaleString("zh-TW");
}

export function formatPercent(value: number) {
  return `${Number(value).toFixed(1)}%`;
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("zh-TW", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
}
