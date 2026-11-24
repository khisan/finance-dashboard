import { apiDelete, apiGet, apiPatch } from "./http"
import type {
  ApprovalEntityType,
  ApprovalRequest,
  ApprovalStatus,
  DecisionRequest,
} from "@/types/approval"

export interface ApprovalFilter {
  status?: ApprovalStatus
  entityType?: ApprovalEntityType
}

function query(filter: ApprovalFilter): string {
  const params = new URLSearchParams()
  if (filter.status) params.set("status", filter.status)
  if (filter.entityType) params.set("entityType", filter.entityType)
  const suffix = params.toString()
  return suffix ? `?${suffix}` : ""
}

export async function getApprovals(filter: ApprovalFilter = {}): Promise<ApprovalRequest[]> {
  return apiGet<ApprovalRequest[]>(`/approvals${query(filter)}`)
}

export async function getApprovalById(id: string): Promise<ApprovalRequest | null> {
  try {
    return await apiGet<ApprovalRequest>(`/approvals/${encodeURIComponent(id)}`)
  } catch {
    return null
  }
}

export async function approveApproval(id: string, note?: string): Promise<ApprovalRequest> {
  return apiPatch<ApprovalRequest>(
    `/approvals/${encodeURIComponent(id)}/approve`,
    { note: note ?? "" } satisfies DecisionRequest,
  )
}

export async function rejectApproval(id: string, note: string): Promise<ApprovalRequest> {
  return apiPatch<ApprovalRequest>(
    `/approvals/${encodeURIComponent(id)}/reject`,
    { note } satisfies DecisionRequest,
  )
}

export async function cancelApproval(id: string): Promise<ApprovalRequest> {
  return apiDelete<ApprovalRequest>(`/approvals/${encodeURIComponent(id)}`)
}
