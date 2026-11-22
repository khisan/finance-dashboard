
import type { ReactNode, InputHTMLAttributes } from "react"
import { Search, CircleAlert, Inbox } from "lucide-react"

const border = "border-border"
const bgSurface = "bg-surface"
const bgElevated = "bg-card"

/** MD3-simple card */
export function Card({ className, children, ...rest }: React.ComponentProps<"div">) {
  return (
    <div
      className={`rounded-xl border border-stone-200 bg-white shadow-sm ${className ?? ""}`}
      {...rest}
    >
      {children}
    </div>
  )
}

/** Stat card */
export function StatCard({
  title,
  value,
  hint,
  icon,
  iconClass,
}: {
  title: string
  value: string
  hint?: string
  icon: ReactNode
  iconClass?: string
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">{title}</p>
          <p className="text-lg font-semibold text-stone-900 truncate">{value}</p>
          {hint ? <p className="text-xs text-stone-400 truncate">{hint}</p> : null}
        </div>
        <div className={`shrink-0 w-10 h-10 rounded-lg ${iconClass ?? "bg-blue-50 text-blue-600"} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

/** Primary action button (Tambah / Create). */
export function Button({ className = "", ...rest }: React.ComponentProps<"button">) {
  return (
    <button
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60 ${className}`}
      {...rest}
    />
  )
}

/** Page header */
export function PageHeader({ title, subtitle, action, className }: {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <Card className={`p-4 mb-4 ${className ?? ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-stone-900">{title}</h1>
          {subtitle ? <p className="text-sm text-stone-500 mt-0.5">{subtitle}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </Card>
  )
}

/** Status chip per backend loan status */
export function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
    DISBURSED: "bg-blue-50 text-blue-700 border-blue-200",
    PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[status] ?? "bg-stone-100 text-stone-600 border-stone-200"}`}>
      {status}
    </span>
  )
}

/** Simple data table */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  renderCell,
  className,
}: {
  columns: { key: string; label: string }[]
  rows: T[]
  renderCell: (row: T, col: string) => ReactNode
  className?: string
}) {
  if (rows.length === 0) return null
  return (
    <div className={`overflow-x-auto rounded-lg border border-stone-200 ${className ?? ""}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-stone-50 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 font-medium">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-stone-50/70">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-stone-600">{renderCell(row, c.key)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Empty state */
export function EmptyState({ title, description, action }: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center">
        <Inbox className="w-6 h-6" aria-hidden="true" />
      </div>
      <p className="mt-4 text-sm font-medium text-stone-700">{title}</p>
      {description ? <p className="mt-1 text-sm text-stone-500 max-w-xs">{description}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  )
}

/** Error state */
export function ErrorState({ title, description, onRetry }: {
  title: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
        <CircleAlert className="w-6 h-6" aria-hidden="true" />
      </div>
      <p className="mt-4 text-sm font-medium text-red-700">{title}</p>
      {description ? <p className="mt-1 text-sm text-red-500 max-w-xs">{description}</p> : null}
      {onRetry ? <button onClick={onRetry} className="mt-3 text-sm font-medium text-blue-600 underline">Try again</button> : null}
    </div>
  )
}

/** Skeleton loader */
export function Skeleton({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`animate-pulse rounded bg-stone-200 ${className ?? ""}`} {...rest} />
}

/** Search input (value/onChange forwarded) */
export function SearchInput({ className = "", ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" aria-hidden="true" />
      <input
        className={`w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 bg-white text-sm text-stone-800 placeholder-stone-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 ${className}`}
        placeholder="Cari..."
        {...rest}
      />
    </div>
  )
}
