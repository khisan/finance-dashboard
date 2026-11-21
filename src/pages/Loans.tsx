import { Card } from "@/components/ui"
import { StatusChip } from "@/components/ui"
import { formatDate, formatIDR } from "@/lib/format"
import { useAsync } from "@/hooks/useApi"
import { getLoans } from "@/services/loanService"
import type { LoanListItem } from "@/types/loan"
import { DataTable } from "@/components/DataTable"

export default function LoansPage() {
  const { data, loading, error, refetch } = useAsync<LoanListItem[]>(
    "loans",
    getLoans,
  )

  const columns = [
    { key: "id", header: "ID" },
    { key: "customerName", header: "Nasabah" },
    {
      key: "amount",
      header: "Jumlah",
      render: (r) => formatIDR((r as { amount: number }).amount),
    },
    { key: "tenorMonths", header: "Jangka Waktu (bln)" },
    {
      key: "interestRate",
      header: "Suku Bunga (%)",
      render: (r) =>
        String((r as { interestRate: number }).interestRate),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <StatusChip
          status={(r as { status: string }).status}
        />
      ),
    },
    {
      key: "createdAt",
      header: "Tanggal",
      render: (r) =>
        formatDate((r as { createdAt: string | null }).createdAt),
    },
  ]

  return (
    <Card className="overflow-hidden">
      <DataTable<LoanListItem>
        columns={columns}
        rows={data ?? []}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchKeys={["id", "customerName"]}
        pageSize={8}
        emptyMessage="Belum ada pinjaman. Data akan muncul setelah tersedia."
        title="Pinjaman"
        subtitle="Data peminjaman nasabah"
      />
    </Card>
  )
}
