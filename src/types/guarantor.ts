import type { UserRole } from "./enums"

export interface Guarantor {
  id: string
  loanId: string
  fullName: string
  identityNumber: string
  email: string
  phoneNumber: string
  relationship: string
  address: string
  createdAt?: string
  updatedAt?: string
}
