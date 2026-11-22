import type { ReactNode } from "react"
import { Card, ErrorState, Skeleton } from "@/components/ui"

export interface DetailField {
  label: string
  value: ReactNode
  wide?: boolean
}

export interface DetailTableColumn {
  key: string
  header: string
  render: (row: Record<string, unknown>) => ReactNode
}

export interface DetailSection {
  title: string
  rows: Record<string, unknown>[]
  columns: DetailTableColumn[]
  emptyText?: string
}

export interface DetailViewProps {
  title: string
  subtitle?: string
  fields: DetailField[]
  sections?: DetailSection[]
  actions?: ReactNode
  loading?: boolean
  error?: string | null
  onRetry?: () => void
}

/** Read-only full-page detail layout shared by every resource. */
export function DetailView({
  title,
  subtitle,
  fields,
  sections,
  actions,
  loading,
  error,
  onRetry,
}: DetailViewProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <Skeleton className="mb-4 h-6 w-1/3" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <ErrorState
          title={`Gagal memuat ${title}`}
          description={error}
          onRetry={onRetry}
        />
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-200 px-5 py-4">
          <div>
            <h1 className="text-lg font-semibold text-stone-900">{title}</h1>
            {subtitle ? <p className="mt-0.5 text-sm text-stone-500">{subtitle}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
        </div>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-4 px-5 py-5 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className={field.wide ? "sm:col-span-2" : ""}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                {field.label}
              </dt>
              <dd className="mt-1 break-words text-sm text-stone-800">
                {field.value ?? "—"}
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      {sections?.map((section) => (
        <Card key={section.title} className="overflow-hidden">
          <div className="border-b border-stone-200 px-5 py-3">
            <h2 className="text-sm font-semibold text-stone-800">{section.title}</h2>
          </div>
          {section.rows.length === 0 ? (
            <p className="px-5 py-6 text-sm text-stone-400">
              {section.emptyText ?? "Belum ada data."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                    {section.columns.map((c) => (
                      <th key={c.key} className="px-5 py-3 font-medium">
                        {c.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row, i) => (
                    <tr key={i} className="border-t border-stone-100">
                      {section.columns.map((c) => (
                        <td key={c.key} className="px-5 py-3 text-stone-700">
                          {c.render(row)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
