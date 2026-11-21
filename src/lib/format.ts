// Date / money formatting helpers (id-ID locale, Indonesian UI)
// Core UI only: money accepts number | string | null (BigDecimal->string backend safe)
export function formatIDR(value: number | string | null | undefined): string {
  const num = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN
  if (!Number.isFinite(num)) return "—"
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })
}
