import type { Loan } from "@/types/loan"

/** Shape used by this dashboard view (dummy data + newly created loans). */
export interface DashboardLoan {
  id: string
  /** UUID from backend; dummy rows don't have one. */
  backendId?: string
  borrowerName: string
  loanAmount: number
  tenorMonths: number
  interestRate: number
  status: string
  disbursementDate?: string
  settlementDate?: string
  collateral: {
    id: string
    type: string
    estimatedValue: number
    documentNo: string
  }
}

export const initialLoans: DashboardLoan[] = [
  {
    id: "LN-2026-001",
    borrowerName: "PT Nusantara Jaya",
    loanAmount: 250000000,
    tenorMonths: 12,
    interestRate: 8.5,
    status: "ACTIVE",
    disbursementDate: "15 Jan 2026",
    collateral: {
      id: "COL-001",
      type: "Sertifikat Tanah (SHM)",
      estimatedValue: 400000000,
      documentNo: "SHM-88321/2021",
    },
  },
  {
    id: "LN-2026-002",
    borrowerName: "Budi Santoso",
    loanAmount: 50000000,
    tenorMonths: 6,
    interestRate: 6.0,
    status: "DISBURSED",
    disbursementDate: "01 Okt 2026",
    collateral: {
      id: "COL-002",
      type: "BPKB Mobil Toyota Avanza",
      estimatedValue: 120000000,
      documentNo: "BPKB-B1234XYZ",
    },
  },
  {
    id: "LN-2026-003",
    borrowerName: "Siti Rahma",
    loanAmount: 150000000,
    tenorMonths: 24,
    interestRate: 9.0,
    status: "SETTLED",
    disbursementDate: "10 Feb 2025",
    settlementDate: "10 Feb 2026",
    collateral: {
      id: "COL-003",
      type: "Emas Batangan Antam 100g",
      estimatedValue: 180000000,
      documentNo: "CERT-ANTAM-9921",
    },
  },
]

export const formatRupiah = (val: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val)

export const getStatusBadge = (status: string): string => {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "DISBURSED":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "SETTLED":
      return "bg-purple-50 text-purple-700 border-purple-200"
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

/** Map a freshly created loan (backend response) into a dashboard row. */
export function toDashboardLoan(loan: Loan): DashboardLoan {
  return {
    id: loan.loanNumber || loan.id,
    backendId: loan.id,
    borrowerName: loan.customerName || "Nasabah baru",
    loanAmount: Number(loan.amount),
    tenorMonths: loan.tenorMonths,
    interestRate: loan.interestRate,
    status: loan.status,
    disbursementDate: "-",
    collateral: {
      id: "-",
      type: "Belum didaftarkan",
      estimatedValue: 0,
      documentNo: "-",
    },
  }
}
