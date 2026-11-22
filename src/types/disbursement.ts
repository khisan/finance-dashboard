import type { DisbursementStatus } from "./enums"

export interface DisbursementListItem {
  id: string
  loanId: string
  disbursementNumber: string
  amount: number
  bankName: string
  bankAccountName: string
  disbursedAt?: string
  status: DisbursementStatus
}

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
