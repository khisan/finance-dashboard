import type { CollateralType } from "./enums"

export interface Collateral {
  id: string
  loanId: string
  type: CollateralType
  documentNumber: string
  marketValue: number
  pledgedValue: number
  description: string | null
  createdAt?: string
  updatedAt?: string
}

export interface CollateralListItem {
  id: string
  loanId: string
  type: CollateralType
  documentNumber: string
  marketValue: number
  pledgedValue: number
}

export interface CollateralForm extends Partial<Collateral> {
  loanId: string
  type: CollateralType
  documentNumber: string
  marketValue: number
  pledgedValue: number
  description?: string
}
