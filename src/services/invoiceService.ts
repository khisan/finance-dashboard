import { apiGet } from "./http"
import type { Invoice, InvoiceListItem } from "@/types/invoice"

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
