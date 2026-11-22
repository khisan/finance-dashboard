import { apiGet, apiPost, apiPut } from "./http"
import type { Disbursement, DisbursementListItem } from "@/types/disbursement"

export type DisbursementCreateInput = Pick<
  Disbursement,
  | "loanId"
  | "disbursementNumber"
  | "amount"
  | "bankName"
  | "bankAccountNumber"
  | "bankAccountName"
>

export async function getDisbursements(): Promise<DisbursementListItem[]> {
  return apiGet<DisbursementListItem[]>("/disbursements")
}

export async function getDisbursementsByLoanId(loanId: string): Promise<DisbursementListItem[]> {
  return apiGet<DisbursementListItem[]>(`/disbursements/loan/${loanId}`)
}

export async function getDisbursementById(id: string): Promise<Disbursement | null> {
  const result = await apiGet<Disbursement>(`/disbursements/${encodeURIComponent(id)}`)
  return result ?? null
}

export async function createDisbursement(
  body: DisbursementCreateInput,
): Promise<Disbursement> {
  return apiPost<Disbursement>("/disbursements", body)
}

export async function updateDisbursement(
  id: string,
  body: DisbursementCreateInput,
): Promise<Disbursement> {
  return apiPut<Disbursement>(`/disbursements/${encodeURIComponent(id)}`, body)
}
