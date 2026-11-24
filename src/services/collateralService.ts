import { apiGet, apiPost, apiPut } from "./http"
import type { Collateral, CollateralListItem, CollateralForm } from "@/types/collateral"
import type { ApprovalRequest } from "@/types/approval"

export async function getCollaterals(): Promise<CollateralListItem[]> {
  return apiGet<CollateralListItem[]>("/collaterals")
}

export async function getCollateralsByLoanId(loanId: string): Promise<CollateralListItem[]> {
  return apiGet<CollateralListItem[]>(`/collaterals/loan/${loanId}`)
}

export async function getCollateralById(id: string): Promise<Collateral | null> {
  const result = await apiGet<Collateral>(`/collaterals/${encodeURIComponent(id)}`)
  return result ?? null
}

export async function createCollateral(body: CollateralForm): Promise<ApprovalRequest> {
  return apiPost<ApprovalRequest>("/collaterals", body)
}

export async function updateCollateral(id: string, body: CollateralForm): Promise<ApprovalRequest> {
  return apiPut<ApprovalRequest>(`/collaterals/${encodeURIComponent(id)}`, body)
}
