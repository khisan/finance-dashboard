export type LoanStatus = "PENDING" | "APPROVED" | "REJECTED" | "DISBURSED" | "PAID"

export type CollateralType =
  | "REAL_ESTATE"
  | "VEHICLE"
  | "DEPOSIT"
  | "GOLD"
  | "OTHER"

export type DisbursementStatus = "PENDING" | "PROCESSED" | "COMPLETED" | "FAILED"

export type InvoiceStatus = "UNPAID" | "PARTIALLY_PAID" | "PAID" | "OVERDUE"

export type UserRole = "USER" | "ADMIN"
