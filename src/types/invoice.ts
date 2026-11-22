import type { InvoiceStatus } from "./enums"

export interface Invoice {
  id: string
  loanId: string
  loanNumber: string
  customerName: string
  invoiceNumber: string
  installmentNumber: number
  principalAmount: number
  interestAmount: number
  penaltyAmount: number
  totalAmount: number
  dueDate: string
  paidAt?: string
  status: InvoiceStatus
  createdAt?: string
  updatedAt?: string
}

export interface InvoiceListItem {
  id: string
  loanId: string
  loanNumber: string
  customerName: string
  invoiceNumber: string
  installmentNumber: number
  principalAmount: number
  interestAmount: number
  penaltyAmount: number
  totalAmount: number
  dueDate: string
  status: InvoiceStatus
}
