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

/** Label ramah manusia untuk relasi loan, mis. "LN-2026-0001 — Siti Rahma". */
export function loanLabel(loan: {
  loanNumber?: string | null
  loanId?: string | null
  customerName?: string | null
}): string {
  const number = loan.loanNumber || loan.loanId || "—"
  return loan.customerName ? `${number} — ${loan.customerName}` : number
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
