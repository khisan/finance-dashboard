import { apiGet, apiPost } from "./http"
import { getCustomerNames } from "./customerService"
import type { Loan, LoanListItem } from "@/types/loan"

export interface LoanCreateInput {
  customerId: string
  amount: number
  interestRate: number
  tenorMonths: number
}

/** LoanResponse backend tidak punya customerName — ambil dari /api/customers/{id}. */
async function withCustomerNames(loans: LoanListItem[]): Promise<LoanListItem[]> {
  if (loans.length === 0) return loans
  const names = await getCustomerNames(loans.map((l) => l.customerId))
  return loans.map((loan) => ({
    ...loan,
    customerName: names[loan.customerId] ?? loan.customerName ?? loan.customerId,
  }))
}

export async function getLoans(): Promise<LoanListItem[]> {
  return withCustomerNames(await apiGet<LoanListItem[]>("/loans"))
}

export async function getLoansByCustomerId(customerId: string): Promise<LoanListItem[]> {
  return withCustomerNames(await apiGet<LoanListItem[]>(`/loans/customer/${customerId}`))
}

export async function getLoanById(id: string): Promise<LoanListItem | null> {
  const list = await apiGet<LoanListItem[]>("/loans")
  const loan = list.find((l) => l.id === id)
  return loan ? (await withCustomerNames([loan]))[0] : null
}

export async function createLoan(body: LoanCreateInput): Promise<Loan> {
  return apiPost<Loan>("/loans", body)
}
