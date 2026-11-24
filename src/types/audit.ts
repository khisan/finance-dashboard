import type { ApprovalEntityType } from "./approval"

export type AuditAction =
  | "SUBMIT"
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "STATUS_CHANGE"
  | "APPROVE"
  | "REJECT"
  | "CANCEL"

/** Append-only entry describing who changed what and when. */
export interface AuditLog {
  id: string
  entityType?: ApprovalEntityType
  entityId?: string
  action: AuditAction
  actorId?: string
  actorEmail?: string
  actorRole?: string
  occurredAt?: string
  before?: Record<string, unknown>
  after?: Record<string, unknown>
  changeRequestId?: string
  description?: string
  selfApprovalOverride?: boolean
}
