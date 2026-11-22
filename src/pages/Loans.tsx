import { useState } from "react"
import { Button, StatusChip } from "@/components/ui"
import { CreateModal } from "@/components/CreateModal"
import { loanCreateFields } from "@/forms/createFields"
import { formatDate, formatIDR } from "@/lib/format"
import { useAsync } from "@/hooks/useApi"
import { createLoan, getLoans } from "@/services/loanService"
import type { LoanListItem } from "@/types/loan"
import { DataTable } from "@/components/DataTable"

export default function LoansPage() {
  const [open, setOpen] = useState(false)
  const { data, loading, error, refetch } = useAsync<LoanListItem[]>(
    "loans",
    getLoans,
  )

  console.log("data loans: ", data)

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
      render: (r) => String((r as { interestRate: number }).interestRate),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusChip status={(r as { status: string }).status} />,
    },
    {
      key: "createdAt",
      header: "Tanggal",
      render: (r) => formatDate((r as { createdAt: string | null }).createdAt),
    },
  ]

  return (
    <>
      <DataTable<LoanListItem>
        columns={columns}
        rows={data ?? []}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchKeys={["id", "customerName"]}
        pageSize={8}
        emptyMessage="Belum ada pinjaman. Tambah nasabah dulu, lalu buat pinjaman."
        title="Pinjaman"
        subtitle="Data peminjaman nasabah"
        action={
          <Button onClick={() => setOpen(true)}>+ Tambah Pinjaman</Button>
        }
      />
      {open && (
        <CreateModal
          title="Tambah Pinjaman"
          subtitle="Status awal akan ditetapkan backend sebagai PENDING."
          fields={loanCreateFields}
          onSubmit={createLoan}
          onSuccess={() => refetch()}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
