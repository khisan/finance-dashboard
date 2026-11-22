import type { UserRole } from "./enums"

export interface GuarantorListItem {
  id: string
  loanId: string
  loanNumber: string
  customerName: string
  fullName: string
  relationship: string
  email: string
  phoneNumber: string
}

export interface Guarantor {
  id: string
  loanId: string
  loanNumber: string
  customerName: string
  fullName: string
  identityNumber: string
  email: string
  phoneNumber: string
  relationship: string
  address: string
  createdAt?: string
  updatedAt?: string
}
