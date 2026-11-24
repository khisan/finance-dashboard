import { apiGet, apiPost, apiPut } from "./http"
import type { Invoice, InvoiceListItem } from "@/types/invoice"
import type { ApprovalRequest } from "@/types/approval"

export type InvoiceCreateInput = Pick<
  Invoice,
  | "loanId"
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
  const result = await apiGet<Invoice>(`/invoices/${encodeURIComponent(id)}`)
  return result ?? null
}

export async function createInvoice(body: InvoiceCreateInput): Promise<ApprovalRequest> {
  return apiPost<ApprovalRequest>("/invoices", body)
}

export async function updateInvoice(id: string, body: InvoiceCreateInput): Promise<ApprovalRequest> {
  return apiPut<ApprovalRequest>(`/invoices/${encodeURIComponent(id)}`, body)
}
