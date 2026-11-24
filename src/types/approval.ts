export type ApprovalEntityType =
  | "CUSTOMER"
  | "COLLATERAL"
  | "LOAN"
  | "GUARANTOR"
  | "INVOICE"
  | "DISBURSEMENT"

export type ApprovalOperation = "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE"

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"

/** A staged mutation. Business data changes only after finance/admin approves. */
export interface ApprovalRequest {
  id: string
  entityType: ApprovalEntityType
  operation: ApprovalOperation
  entityId?: string
  businessNumber?: string
  targetStatus?: string
  status: ApprovalStatus
  reason?: string
  requestedById?: string
  requestedByEmail?: string
  requestedByRole?: string
  requestedAt?: string
  decidedById?: string
  decidedByEmail?: string
  decidedAt?: string
  decisionNote?: string
  selfApprovalOverride?: boolean
  payload?: Record<string, unknown>
  before?: Record<string, unknown>
}

export interface DecisionRequest {
  note: string
}
