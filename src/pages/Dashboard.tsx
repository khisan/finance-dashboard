import { useState } from "react"
import { LoanDetailModal } from "@/components/dashboard/LoanDetailModal"
import { LoanList } from "@/components/dashboard/LoanList"
import { LoanPanel } from "@/components/dashboard/LoanPanel"
import { MetricCards } from "@/components/dashboard/MetricCards"
import { CreateModal } from "@/components/CreateModal"
import { loanCreateFields } from "@/forms/createFields"
import { useCanWrite } from "@/hooks/useAuth"
import {
  initialLoans,
  type DashboardLoan,
} from "@/lib/dashboard"
import { createLoan } from "@/services/loanService"
import type { ApprovalRequest } from "@/types/approval"

/** Operation overview: static metrics + dummy loans + newly created loans. */
export const Dashboard = () => {
  const canWrite = useCanWrite()
  const [loans, setLoans] = useState<DashboardLoan[]>(initialLoans)
  const [selectedLoan, setSelectedLoan] = useState<DashboardLoan>(
    initialLoans[0],
  )
  const [open, setOpen] = useState(false)
  const [detailLoan, setDetailLoan] = useState<DashboardLoan | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const handleCreated = (proposal: ApprovalRequest) => {
    // Data is only written after approval, so don't add it to the local list yet.
    setNotice(
      `Proposal ${proposal.businessNumber ?? proposal.id} dikirim. Pinjaman akan muncul setelah disetujui finance/admin.`,
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
        {canWrite ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="cursor-pointer flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
          >
            + Create New Loan
          </button>
        ) : null}
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
            className="cursor-pointer font-semibold hover:underline"
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

      {canWrite && open ? (
        <CreateModal
          title="Buat Pinjaman Baru"
          subtitle="Proposal menunggu persetujuan finance/admin; status awal PENDING setelah disetujui."
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
