import { apiGet } from "./http"
import type { LoanListItem } from "@/types/loan"

export async function getLoans(): Promise<LoanListItem[]> {
  return apiGet<LoanListItem[]>("/loans")
}

export async function getLoansByCustomerId(customerId: string): Promise<LoanListItem[]> {
  return apiGet<LoanListItem[]>(`/loans/customer/${customerId}`)
}

export async function getLoanById(id: string): Promise<LoanListItem | null> {
  const list = await apiGet<LoanListItem[]>("/loans")
  return list.find((l) => l.id === id) ?? null
}
