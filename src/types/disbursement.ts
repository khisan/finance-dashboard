import type { DisbursementStatus } from "./enums"

export interface Disbursement {
  id: string
  loanId: string
  disbursementNumber: string
  amount: number
  bankName: string
  bankAccountNumber: string
  bankAccountName: string
  status: DisbursementStatus
  disbursedAt?: string
  createdAt?: string
  updatedAt?: string
}
