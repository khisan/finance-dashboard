import type { CollateralType, LoanStatus } from "./enums"

export interface Loan {
  id: string
  customerId: string
  amount: number
  interestRate: number
  tenorMonths: number
  status: LoanStatus
  createdAt?: string
  updatedAt?: string
}

export interface LoanListItem {
  id: string
  customerName: string
  customerId: string
  amount: number
  interestRate: number
  tenorMonths: number
  status: LoanStatus
  createdAt?: string
}

export interface LoanDetail extends LoanListItem {
  borrowerName: string
  customerEmail: string
  customerAddress: string
  collateral: CollateralItem | null
  guarantors: GuarantorItem[]
  invoices: InvoiceItem[]
  disbursements: DisbursementItem[]
}

export interface CollateralItem {
  id: string
  documentNumber: string
  type: CollateralType
  marketValue: number
  pledgedValue: number
  description: string | null
}

export interface Customer {
  id: string
  fullName: string
  identityNumber: string
  email: string
  phoneNumber: string
  address: string
  createdAt?: string
  updatedAt?: string
}

export interface CustomerListItem {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  address: string
}

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

export interface GuarantorItem {
  id: string
  loanId: string
  fullName: string
  email: string
  phoneNumber: string
  relationship: string
}

export interface InvoiceItem {
  id: string
  loanId: string
  invoiceNumber: string
  installmentNumber: number
  principalAmount: number
  interestAmount: number
  penaltyAmount: number
  totalAmount: number
  dueDate: string
  paidAt?: string
  status: InvoiceStatus
}

export interface DisbursementItem {
  id: string
  loanId: string
  disbursementNumber: string
  amount: number
  bankName: string
  bankAccountNumber: string
  bankAccountName: string
  status: DisbursementStatus
  disbursedAt?: string
}
