import { useCanWrite } from "@/hooks/useAuth"
import { formatRupiah, type DashboardLoan } from "@/lib/dashboard"

export function LoanPanel({ loan }: { loan: DashboardLoan }) {
  const canWrite = useCanWrite()

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="border-b border-slate-100 pb-3 text-lg font-bold text-slate-900">
        No. Pinjaman: <span className="text-blue-600">{loan.id}</span>
      </h3>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Borrower:</span>
          <span className="font-semibold text-slate-900">{loan.borrowerName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Loan Amount:</span>
          <span className="font-semibold text-slate-900">
            {formatRupiah(loan.loanAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Tenor & Rate:</span>
          <span className="font-medium text-slate-900">
            {loan.tenorMonths} Bulan ({loan.interestRate}%)
          </span>
        </div>
      </div>

      {/* Collateral Section */}
      <div className="mt-6 rounded-xl bg-slate-50 p-4 border border-slate-100">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Collateral Info
        </p>
        <p className="mt-2 font-semibold text-slate-900">{loan.collateral.type}</p>
        <p className="text-xs text-slate-500">Doc No: {loan.collateral.documentNo}</p>
        <div className="mt-2 flex justify-between text-xs border-t border-slate-200 pt-2">
          <span className="text-slate-500">Est. Value:</span>
          <span className="font-bold text-emerald-600">
            {formatRupiah(loan.collateral.estimatedValue)}
          </span>
        </div>
      </div>

      {/* Ations: Disbursement & Settlement (read-only for finance) */}
      <div className="mt-6 space-y-2">
        {canWrite && loan.status === "PENDING" ? (
          <button className="cursor-pointer w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors">
            Process Disbursement
          </button>
        ) : null}

        {canWrite && loan.status === "ACTIVE" ? (
          <button className="cursor-pointer w-full rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition-colors">
            Process Settlement (Pelunasan)
          </button>
        ) : null}

        {loan.status === "SETTLED" && (
          <div className="rounded-xl bg-purple-50 p-3 text-center text-xs font-medium text-purple-700 border border-purple-100">
            Loan ini telah LUNAS pada {loan.settlementDate}
          </div>
        )}
      </div>
    </div>
  )
}
