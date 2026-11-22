import { apiGet, apiPost } from "./http"
import type { Invoice, InvoiceListItem } from "@/types/invoice"

export type InvoiceCreateInput = Pick<
  Invoice,
  | "loanId"
  | "invoiceNumber"
  | "installmentNumber"
  | "principalAmount"
  | "interestAmount"
  | "dueDate"
> &
  Partial<Pick<Invoice, "penaltyAmount" | "paidAt" | "status">>

export async function getInvoices(): Promise<InvoiceListItem[]> {
  return apiGet<InvoiceListItem[]>("/invoices")
}

export async function getInvoicesByLoanId(loanId: string): Promise<InvoiceListItem[]> {
  return apiGet<InvoiceListItem[]>(`/invoices/loan/${loanId}`)
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const list = await apiGet<Invoice[]>("/invoices")
  return list.find((i) => i.id === id) ?? null
}

export async function createInvoice(body: InvoiceCreateInput): Promise<Invoice> {
  return apiPost<Invoice>("/invoices", body)
}
