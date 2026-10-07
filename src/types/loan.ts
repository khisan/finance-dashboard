export type LoanStatus =
  | "PENDING"
  | "DISBURSED"
  | "ACTIVE"
  | "SETTLED"
  | "REJECTED"

export interface Collateral {
  id: string
  type: string
  estimatedValue: number
  documentNo: string
}

export interface Loan {
  id: string
  borrowerName: string
  loanAmount: number
  tenorMonths: number
  interestRate: number
  status: LoanStatus
  disbursementDate?: string
  settlementDate?: string
  collateral: Collateral
}
