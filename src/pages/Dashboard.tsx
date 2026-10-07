import React, { useState } from "react"
import { Loan, LoanStatus } from "../types/loan"

// Dummy Data
// Dummy Data Loan System
const initialLoans: Loan[] = [
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

export const LoanDashboard = () => {
  const [loans] = useState<Loan[]>(initialLoans)
  const [selectedLoan, setSelectedLoan] = useState<Loan>(initialLoans[0])

  // Helper Format Rupiah
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val)
  }
}
