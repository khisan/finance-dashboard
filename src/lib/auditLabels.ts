import type { ApprovalEntityType } from "@/types/approval"
import type { AuditAction } from "@/types/audit"

/** Shared human-readable labels for audit/proposal screens. */
export const ENTITY_LABEL: Record<ApprovalEntityType, string> = {
  CUSTOMER: "Nasabah",
  COLLATERAL: "Agunan",
  LOAN: "Pinjaman",
  GUARANTOR: "Penjamin",
  INVOICE: "Faktur",
  DISBURSEMENT: "Pencairan",
}

export const ACTION_LABEL: Record<AuditAction, string> = {
  SUBMIT: "Proposal dikirim",
  CREATE: "Dibuat",
  UPDATE: "Diubah",
  DELETE: "Dihapus",
  STATUS_CHANGE: "Status diubah",
  APPROVE: "Disetujui",
  REJECT: "Ditolak",
  CANCEL: "Dibatalkan",
}
