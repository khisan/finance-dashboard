import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { formatRupiah, type DashboardLoan } from "@/lib/dashboard"

interface LoanDetailModalProps {
  loan: DashboardLoan
  onClose: () => void
}

function DetailItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-slate-900">{children}</dd>
    </div>
  )
}

/** Lightweight modal for the dashboard's dummy rows (no backend detail page). */
export function LoanDetailModal({ loan, onClose }: LoanDetailModalProps) {
  const navigate = useNavigate()

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 py-10"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Detail pinjaman ${loan.id}`}
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Detail Pinjaman {loan.id}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">{loan.borrowerName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>
        <dl className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2">
          <DetailItem label="Jumlah">
            <span className="font-medium">{formatRupiah(loan.loanAmount)}</span>
          </DetailItem>
          <DetailItem label="Tenor & Bunga">
            {loan.tenorMonths} bulan · {loan.interestRate}%
          </DetailItem>
          <DetailItem label="Status">{loan.status}</DetailItem>
          <DetailItem label="Agunan">{loan.collateral.type}</DetailItem>
          <div className="sm:col-span-2">
            <DetailItem label="No. Dokumen Agunan">
              {loan.collateral.documentNo}
            </DetailItem>
          </div>
          {loan.disbursementDate ? (
            <DetailItem label="Tanggal Pencairan">{loan.disbursementDate}</DetailItem>
          ) : null}
          {loan.settlementDate ? (
            <DetailItem label="Tanggal Pelunasan">{loan.settlementDate}</DetailItem>
          ) : null}
        </dl>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Tutup
          </button>
          {loan.backendId ? (
            <button
              type="button"
              onClick={() => {
                const backendId = loan.backendId
                onClose()
                if (backendId) navigate(`/loans/${backendId}`)
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Buka Halaman Detail
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
