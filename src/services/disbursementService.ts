import { apiGet } from "./http"
import type { Disbursement, DisbursementListItem } from "@/types/disbursement"

export async function getDisbursements(): Promise<DisbursementListItem[]> {
  return apiGet<DisbursementListItem[]>("/disbursements")
}

export async function getDisbursementsByLoanId(loanId: string): Promise<DisbursementListItem[]> {
  return apiGet<DisbursementListItem[]>(`/disbursements/loan/${loanId}`)
}

export async function getDisbursementById(id: string): Promise<Disbursement | null> {
  const list = await apiGet<Disbursement[]>("/disbursements")
  return list.find((d) => d.id === id) ?? null
}
