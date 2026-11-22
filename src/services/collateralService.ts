import { apiGet, apiPost } from "./http"
import type { Collateral, CollateralListItem, CollateralForm } from "@/types/collateral"

export async function getCollaterals(): Promise<CollateralListItem[]> {
  return apiGet<CollateralListItem[]>("/collaterals")
}

export async function getCollateralsByLoanId(loanId: string): Promise<CollateralListItem[]> {
  return apiGet<CollateralListItem[]>(`/collaterals/loan/${loanId}`)
}

export async function getCollateralById(id: string): Promise<Collateral | null> {
  const list = await apiGet<Collateral[]>("/collaterals")
  return list.find((c) => c.id === id) ?? null
}

export async function createCollateral(body: CollateralForm): Promise<Collateral> {
  return apiPost<Collateral>("/collaterals", body)
}
