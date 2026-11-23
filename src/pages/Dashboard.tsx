import { useState } from "react"
import { LoanDetailModal } from "@/components/dashboard/LoanDetailModal"
import { LoanList } from "@/components/dashboard/LoanList"
import { LoanPanel } from "@/components/dashboard/LoanPanel"
import { MetricCards } from "@/components/dashboard/MetricCards"
import { CreateModal } from "@/components/CreateModal"
import { loanCreateFields } from "@/forms/createFields"
import {
  initialLoans,
  toDashboardLoan,
  type DashboardLoan,
} from "@/lib/dashboard"
import { createLoan } from "@/services/loanService"
import type { Loan } from "@/types/loan"

/** Operation overview: static metrics + dummy loans + newly created loans. */
export const Dashboard = () => {
  const [loans, setLoans] = useState<DashboardLoan[]>(initialLoans)
  const [selectedLoan, setSelectedLoan] = useState<DashboardLoan>(
    initialLoans[0],
  )
  const [open, setOpen] = useState(false)
  const [detailLoan, setDetailLoan] = useState<DashboardLoan | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const handleCreated = (loan: Loan) => {
    const created = toDashboardLoan(loan)
    setLoans((prev) => [created, ...prev])
    setSelectedLoan(created)
    setNotice(
      `Pinjaman ${created.id} berhasil dibuat dengan status ${created.status}.`,
    )
  }

  return (
    <div className="rounded-2xl bg-slate-50 p-6 font-sans text-slate-800">
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Loan Operation & Management
          </h1>
          <p className="text-sm text-slate-500">
            Kelola pinjaman, jaminan (collateral), pencairan, dan pelunasan
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
        >
          + Create New Loan
        </button>
      </header>

      {notice ? (
        <div
          role="status"
          className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="font-semibold hover:underline"
          >
            Tutup
          </button>
        </div>
      ) : null}

      <MetricCards />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <LoanList
          loans={loans}
          selectedId={selectedLoan.id}
          onSelect={setSelectedLoan}
          onViewDetail={setDetailLoan}
        />
        <div className="space-y-6">
          <LoanPanel loan={selectedLoan} />
        </div>
      </div>

      {open ? (
        <CreateModal
          title="Buat Pinjaman Baru"
          subtitle="Data akan disimpan ke backend; status awal PENDING."
          fields={loanCreateFields}
          onSubmit={createLoan}
          onSuccess={handleCreated}
          onClose={() => setOpen(false)}
        />
      ) : null}

      {detailLoan ? (
        <LoanDetailModal
          loan={detailLoan}
          onClose={() => setDetailLoan(null)}
        />
      ) : null}
    </div>
  )
}
