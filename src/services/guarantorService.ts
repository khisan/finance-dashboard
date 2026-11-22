import { apiGet, apiPost } from "./http"
import type { Guarantor, GuarantorListItem } from "@/types/guarantor"

export type GuarantorCreateInput = Omit<Guarantor, "id" | "createdAt" | "updatedAt">

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

export async function createGuarantor(body: GuarantorCreateInput): Promise<Guarantor> {
  return apiPost<Guarantor>("/guarantors", body)
}
