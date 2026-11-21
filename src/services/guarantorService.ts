import { apiGet } from "./http"
import type { Guarantor, GuarantorListItem } from "@/types/guarantor"

export async function getGuarantors(): Promise<GuarantorListItem[]> {
  return apiGet<GuarantorListItem[]>("/guarantors")
}

export async function getGuarantorsByLoanId(loanId: string): Promise<GuarantorListItem[]> {
  return apiGet<GuarantorListItem[]>(`/guarantors/loan/${loanId}`)
}

export async function getGuarantorById(id: string): Promise<Guarantor | null> {
  const list = await apiGet<Guarantor[]>("/guarantors")
  return list.find((g) => g.id === id) ?? null
}
