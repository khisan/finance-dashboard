import { apiGet, apiPost } from "./http"
import type { Loan, LoanListItem } from "@/types/loan"

export interface LoanCreateInput {
  customerId: string
  amount: number
  interestRate: number
  tenorMonths: number
}

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

export async function createLoan(body: LoanCreateInput): Promise<Loan> {
  return apiPost<Loan>("/loans", body)
}
