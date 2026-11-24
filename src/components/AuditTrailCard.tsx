import { useCallback } from "react"
import { Link } from "react-router-dom"
import { Card, Skeleton } from "@/components/ui"
import { useAsync } from "@/hooks/useApi"
import { ACTION_LABEL, ENTITY_LABEL } from "@/lib/auditLabels"
import { formatDateTime } from "@/lib/format"
import { getAuditLogs } from "@/services/auditService"
import type { ApprovalEntityType } from "@/types/approval"
import type { AuditLog } from "@/types/audit"

export interface AuditTrailCardProps {
  /** Internal UUID of the row being viewed. */
  entityId?: string
  /** Used to scope the "Lihat semua" link to this entity type. */
  entityType?: ApprovalEntityType
  limit?: number
}

/**
 * Compact audit footer for detail pages: who touched this row, what they did,
 * and when. Full history (with before/after values) lives on /audit-trail.
 */
export function AuditTrailCard({
  entityId,
  entityType,
  limit = 5,
}: AuditTrailCardProps) {
  const fetchLogs = useCallback(
    () => (entityId ? getAuditLogs({ entityId }) : Promise.resolve([] as AuditLog[])),
    [entityId],
  )
  const { data, loading, error, refetch } = useAsync<AuditLog[]>(
    `audit-card-${entityId}`,
    fetchLogs,
    Boolean(entityId),
  )

  if (!entityId) return null

  const logs = (data ?? []).slice(0, limit)
  const allUrl = `/audit-trail?${new URLSearchParams({
    entityId,
    ...(entityType ? { entityType } : {}),
  }).toString()}`

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold text-stone-800">Audit Trail</h2>
          <p className="mt-0.5 text-xs text-stone-500">
            Riwayat siapa membuat, mengubah, dan menyetujui data ini
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={refetch}
            className="cursor-pointer text-xs font-semibold text-stone-500 hover:text-stone-800"
          >
            Muat ulang
          </button>
          <Link
            to={allUrl}
            className="rounded-lg border border-stone-200 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
          >
            Lihat semua
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2 px-5 py-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="px-5 py-4 text-sm text-red-600">
          Gagal memuat audit trail: {error}
        </div>
      ) : logs.length === 0 ? (
        <p className="px-5 py-6 text-sm text-stone-400">
          Belum ada aktivitas yang tercatat untuk data ini.
        </p>
      ) : (
        <ul className="divide-y divide-stone-100">
          {logs.map((log) => (
            <li
              key={log.id}
              className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 px-5 py-3 text-sm"
            >
              <div className="min-w-0">
                <span className="font-semibold text-stone-800">
                  {ACTION_LABEL[log.action] ?? log.action}
                </span>
                {log.entityType ? (
                  <span className="ml-2 text-xs text-stone-400">
                    {ENTITY_LABEL[log.entityType] ?? log.entityType}
                  </span>
                ) : null}
                <p className="mt-0.5 text-xs text-stone-500">
                  {log.actorEmail ?? "system"}
                  {log.actorRole ? ` · ${log.actorRole}` : ""}
                  {log.selfApprovalOverride ? " · override" : ""}
                </p>
                {log.description ? (
                  <p className="mt-0.5 truncate text-xs text-stone-400" title={log.description}>
                    {log.description}
                  </p>
                ) : null}
              </div>
              <time className="shrink-0 text-xs text-stone-400">
                {formatDateTime(log.occurredAt)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
