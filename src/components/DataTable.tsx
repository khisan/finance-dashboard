import { useMemo, useState } from "react"
import type { ReactNode } from "react"
import { Card, Skeleton, EmptyState, ErrorState } from "@/components/ui"

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  className?: string
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  loading: boolean
  error?: string | null
  onRetry?: () => void
  searchKeys?: (keyof T)[]
  pageSize?: number
  emptyMessage?: string
  title?: string
  subtitle?: string
}

/**
 * Generic reusable table for read-only resource pages.
 * Owns search input, client-side pagination, loading skeleton,
 * error + retry, and empty state. Pages own only fetch + columns.
 */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  loading,
  error,
  onRetry,
  searchKeys,
  pageSize = 8,
  emptyMessage = "Belum ada data.",
  title,
  subtitle,
}: DataTableProps<T>) {
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const keys =
      searchKeys ?? (Object.keys(rows[0] ?? {}) as (keyof T)[])
    const ql = q.trim().toLowerCase()
    if (!ql) return rows
    return rows.filter((r) =>
      keys.some((k) =>
        String((r as Record<string, unknown>)[k]).toLowerCase().includes(ql),
      ),
    )
  }, [rows, q, searchKeys])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  if (loading) {
    return (
      <Card>
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </Card>
    )
  }

  if (error && onRetry) {
    return (
      <Card>
        <ErrorState
          title={title ?? "Gagal memuat data"}
          description={error}
          onRetry={onRetry}
        />
      </Card>
    )
  }

  if (!rows || rows.length === 0) {
    return (
      <Card>
        <EmptyState title={title ?? "Tidak ada data"} description={emptyMessage} />
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      {(title || subtitle) && (
        <div className="px-4 py-3 border-b border-stone-200">
          <div className="flex items-start justify-between gap-3">
            <div>
              {title && <h1 className="text-lg font-semibold text-stone-900">{title}</h1>}
              {subtitle && (
                <p className="text-sm text-stone-500 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 space-y-3 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            placeholder="Cari..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className={`px-4 py-3 font-medium ${c.className ?? ""}`}
                  >
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((row, i) => (
                <tr key={i} className="hover:bg-stone-50/70">
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className="px-4 py-3 text-stone-600"
                    >
                      {c.render
                        ? c.render(row)
                        : String((row as Record<string, unknown>)[c.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-200 px-4 py-3 text-xs text-stone-400">
          <span>
            Menampilkan {paged.length} dari {filtered.length} data
          </span>
          <span>Halaman {page} dari {totalPages}</span>
        </div>
      </div>
    </Card>
  )
}
