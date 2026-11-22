import { apiGet, apiPost, apiPut } from "./http"
import { getCustomerById, getCustomerNames } from "./customerService"
import { getCollateralsByLoanId } from "./collateralService"
import { getGuarantorsByLoanId } from "./guarantorService"
import { getInvoicesByLoanId } from "./invoiceService"
import { getDisbursementsByLoanId } from "./disbursementService"
import type { Loan, LoanListItem, LoanDetail } from "@/types/loan"

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
  const loan = await apiGet<Loan>(`/loans/${encodeURIComponent(id)}`)
  return (await withCustomerNames([loan as LoanListItem]))[0]
}

/**
 * Backend tidak punya endpoint detail gabungan. Susun dari GET /loans/{id}
 * + customer + 4 endpoint turunan, semua dipanggil paralel.
 */
export async function getLoanDetail(id: string): Promise<LoanDetail | null> {
  const loan = await getLoanById(id)
  if (!loan) return null

  const [customer, collaterals, guarantors, invoices, disbursements] = await Promise.all([
    getCustomerById(loan.customerId),
    getCollateralsByLoanId(id),
    getGuarantorsByLoanId(id),
    getInvoicesByLoanId(id),
    getDisbursementsByLoanId(id),
  ])

  return {
    ...loan,
    borrowerName: customer?.fullName ?? loan.customerName ?? loan.customerId,
    customerEmail: customer?.email ?? "",
    customerAddress: customer?.address ?? "",
    collateral: collaterals.length > 0 ? collaterals[0] : null,
    guarantors,
    invoices,
    disbursements,
  }
}

export async function createLoan(body: LoanCreateInput): Promise<Loan> {
  return apiPost<Loan>("/loans", body)
}

/** PUT /api/loans/{id} — status tidak boleh dikirim, diatur lewat PATCH. */
export async function updateLoan(id: string, body: LoanCreateInput): Promise<Loan> {
  return apiPut<Loan>(`/loans/${encodeURIComponent(id)}`, body)
}
