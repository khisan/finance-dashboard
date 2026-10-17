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

export const Dashboard = () => {
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

  // Helper Badge Color
  const getStatusBadge = (status: LoanStatus) => {
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

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      {/* HEADER & CREATE LOAN TRIGGER */}
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Loan Operation & Management
          </h1>
          <p className="text-sm text-slate-500">
            Kelola pinjaman, jaminan (collateral), pencairan, dan pelunasan
          </p>
        </div>
        {/* CREATE LOAN BUTTON */}
        <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors">
          + Create New Loan
        </button>
      </header>

      {/* Metric Overview*/}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">
            Total Active Exposure
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatRupiah(450000000)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">
            Ready for Disbursement
          </p>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {formatRupiah(50000000)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">
            Collateral Value
          </p>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {formatRupiah(700000000)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">
            Settled This Month
          </p>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {formatRupiah(150000000)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Loan List (2 Kolom) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Loan List</h2>
            <span className="text-xs font-medium text-slate-400">
              Total: {loans.length} Loans
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase">
                  <th className="pb-3 font-semibold">Loan ID & Borrower</th>
                  <th className="pb-3 font-semibold">Amount & Tenor</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loans.map((loan) => (
                  <tr
                    key={loan.id}
                    onClick={() => setSelectedLoan(loan)}
                    className={`cursor-pointer transition-colors ${selectedLoan.id === loan.id ? "bg-blue-50/50" : "hover:bg-slate-50"}`}
                  >
                    <td className="py-4">
                      <p className="font-semibold text-slate-900">{loan.id}</p>
                      <p className="text-xs text-slate-500">
                        {loan.borrowerName}
                      </p>
                    </td>
                    <td className="py-4">
                      <p className="font-medium text-slate-900">
                        {formatRupiah(loan.loanAmount)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {loan.tenorMonths} Bunga: {loan.interestRate}%
                      </p>
                    </td>
                    <td className="py-4">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(loan.status)}`}
                      >
                        {loan.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-xs font-semibold text-blue-600 hover:underline">
                        View Detail →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Loan Detail, Collateral, Disbursement & Settlement Panel (1 Kolom) */}
        <div className="space-y-6">
          {/* Loan Detail & Collateral Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="border-b border-slate-100 pb-3 text-lg font-bold text-slate-900">
              Loan Detail:{" "}
              <span className="text-blue-600">{selectedLoan.id}</span>
            </h3>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Borrower:</span>
                <span className="font-semibold text-slate-900">
                  {selectedLoan.borrowerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Loan Amount:</span>
                <span className="font-semibold text-slate-900">
                  {formatRupiah(selectedLoan.loanAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tenor & Rate:</span>
                <span className="font-medium text-slate-900">
                  {selectedLoan.tenorMonths} Bulan ({selectedLoan.interestRate}
                  %)
                </span>
              </div>
            </div>

            {/* Collateral Section */}
            <div className="mt-6 rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Collateral Info
              </p>
              <p className="mt-2 font-semibold text-slate-900">
                {selectedLoan.collateral.type}
              </p>
              <p className="text-xs text-slate-500">
                Doc No: {selectedLoan.collateral.documentNo}
              </p>
              <div className="mt-2 flex justify-between text-xs border-t border-slate-200 pt-2">
                <span className="text-slate-500">Est. Value:</span>
                <span className="font-bold text-emerald-600">
                  {formatRupiah(selectedLoan.collateral.estimatedValue)}
                </span>
              </div>
            </div>

            {/* Ations: Disbursement & Settlement*/}
            <div className="mt-6 space-y-2">
              {selectedLoan.status === "PENDING" && (
                <button className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors">
                  Process Disbursement
                </button>
              )}

              {selectedLoan.status === "ACTIVE" && (
                <button className="w-full rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition-colors">
                  Process Settlement (Pelunasan)
                </button>
              )}

              {selectedLoan.status === "SETTLED" && (
                <div className="rounded-xl bg-purple-50 p-3 text-center text-xs font-medium text-purple-700 border border-purple-100">
                  Loan ini telah LUNAS pada {selectedLoan.settlementDate}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
