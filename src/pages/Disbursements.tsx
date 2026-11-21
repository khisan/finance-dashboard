import { Card } from "@/components/ui"
import { formatDate, formatIDR } from "@/lib/format"
import { useAsync } from "@/hooks/useApi"
import { getDisbursements } from "@/services/disbursementService"
import type { DisbursementListItem } from "@/types/disbursement"
import type { DisbursementStatus } from "@/types/enums"
import { DataTable } from "@/components/DataTable"

const STATUS_LABEL: Record<DisbursementStatus, string> = {
  PENDING: "Menunggu",
  PROCESSED: "Diproses",
  COMPLETED: "Selesai",
  FAILED: "Gagal",
}

const STATUS_CLASS: Record<DisbursementStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PROCESSED: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
}

export default function DisbursementsPage() {
  const { data, loading, error, refetch } = useAsync<DisbursementListItem[]>(
    "disbursements",
    getDisbursements,
  )

  const columns = [
    { key: "id", header: "ID" },
    { key: "disbursementNumber", header: "Nomor" },
    { key: "loanId", header: "Pinjaman" },
    {
      key: "amount",
      header: "Nominal",
      render: (r) => formatIDR((r as { amount: number }).amount),
    },
    { key: "bankName", header: "Bank" },
    { key: "bankAccountName", header: "Atas Nama" },
    {
      key: "disbursedAt",
      header: "Tanggal",
      render: (r) =>
        formatDate((r as { disbursedAt: string | null }).disbursedAt),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => {
        const s = (r as { status: DisbursementStatus }).status
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_CLASS[s]}`}
          >
            {STATUS_LABEL[s]}
          </span>
        )
      },
    },
  ]

  return (
    <Card className="overflow-hidden">
      <DataTable<DisbursementListItem>
        columns={columns}
        rows={data ?? []}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchKeys={["disbursementNumber", "loanId", "bankName"]}
        pageSize={8}
        emptyMessage="Belum ada pencairan. Data akan muncul setelah tersedia."
        title="Pencairan"
        subtitle="Data disbursement / pencairan pinjaman"
      />
    </Card>
  )
}
