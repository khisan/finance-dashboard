import { apiGet } from "./http"
import type { ApprovalEntityType } from "@/types/approval"
import type { AuditAction, AuditLog } from "@/types/audit"

export interface AuditFilter {
  entityType?: ApprovalEntityType
  entityId?: string
  actorId?: string
  action?: AuditAction
  from?: string
  to?: string
}

export async function getAuditLogs(filter: AuditFilter = {}): Promise<AuditLog[]> {
  const params = new URLSearchParams()
  if (filter.entityType) params.set("entityType", filter.entityType)
  if (filter.entityId) params.set("entityId", filter.entityId)
  if (filter.actorId) params.set("actorId", filter.actorId)
  if (filter.action) params.set("action", filter.action)
  if (filter.from) params.set("from", filter.from)
  if (filter.to) params.set("to", filter.to)
  const suffix = params.toString()
  return apiGet<AuditLog[]>(`/audit-logs${suffix ? `?${suffix}` : ""}`)
}
