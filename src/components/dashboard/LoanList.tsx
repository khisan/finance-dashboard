import {
  formatRupiah,
  getStatusBadge,
  type DashboardLoan,
} from "@/lib/dashboard"

interface LoanListProps {
  loans: DashboardLoan[]
  selectedId: string
  onSelect: (loan: DashboardLoan) => void
  onViewDetail: (loan: DashboardLoan) => void
}

export function LoanList({
  loans,
  selectedId,
  onSelect,
  onViewDetail,
}: LoanListProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Loan List</h2>
        <span className="text-xs font-medium text-slate-400">
          Total: {loans.length} Loans
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase">
              <th className="pb-3 font-semibold">No. Pinjaman & Nasabah</th>
              <th className="pb-3 font-semibold">Amount & Tenor</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loans.map((loan) => (
              <tr
                key={loan.id}
                onClick={() => onSelect(loan)}
                className={`cursor-pointer transition-colors ${selectedId === loan.id ? "bg-blue-50/50" : "hover:bg-slate-50"}`}
              >
                <td className="py-4">
                  <p className="font-semibold text-slate-900">{loan.id}</p>
                  <p className="text-xs text-slate-500">{loan.borrowerName}</p>
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
                <td className="py-4">
                  <button
                    type="button"
                    data-action="view-detail"
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewDetail(loan)
                    }}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View Detail →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
