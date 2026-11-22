import { apiGet, apiPost, apiPut } from "./http"
import type { Guarantor, GuarantorListItem } from "@/types/guarantor"

export type GuarantorCreateInput = Omit<
  Guarantor,
  "id" | "loanNumber" | "customerName" | "createdAt" | "updatedAt"
>

export async function getGuarantors(): Promise<GuarantorListItem[]> {
  return apiGet<GuarantorListItem[]>("/guarantors")
}

export async function getGuarantorsByLoanId(loanId: string): Promise<GuarantorListItem[]> {
  return apiGet<GuarantorListItem[]>(`/guarantors/loan/${loanId}`)
}

export async function getGuarantorById(id: string): Promise<Guarantor | null> {
  const result = await apiGet<Guarantor>(`/guarantors/${encodeURIComponent(id)}`)
  return result ?? null
}

export async function createGuarantor(body: GuarantorCreateInput): Promise<Guarantor> {
  return apiPost<Guarantor>("/guarantors", body)
}

export async function updateGuarantor(
  id: string,
  body: GuarantorCreateInput,
): Promise<Guarantor> {
  return apiPut<Guarantor>(`/guarantors/${encodeURIComponent(id)}`, body)
}
