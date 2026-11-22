import { formatRupiah } from "@/lib/dashboard"

const metrics = [
  { label: "Total Active Exposure", value: 450000000, accent: "text-slate-900" },
  { label: "Ready for Disbursement", value: 50000000, accent: "text-blue-600" },
  { label: "Collateral Value", value: 700000000, accent: "text-blue-600" },
  { label: "Settled This Month", value: 150000000, accent: "text-blue-600" },
]

export function MetricCards() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-xs font-medium text-slate-500 uppercase">
            {metric.label}
          </p>
          <p className={`mt-2 text-2xl font-bold ${metric.accent}`}>
            {formatRupiah(metric.value)}
          </p>
        </div>
      ))}
    </div>
  )
}
