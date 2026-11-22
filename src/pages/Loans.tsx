import { useState } from "react"
import { Button, StatusChip } from "@/components/ui"
import { CreateModal } from "@/components/CreateModal"
import { RowActions } from "@/components/RowActions"
import { loanCreateFields } from "@/forms/createFields"
import { formatDate, formatIDR } from "@/lib/format"
import { toFormValues } from "@/lib/formValues"
import { useAsync } from "@/hooks/useApi"
import { createLoan, getLoanById, getLoans, updateLoan } from "@/services/loanService"
import type { LoanListItem } from "@/types/loan"
import { DataTable } from "@/components/DataTable"

export default function LoansPage() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<{ id: string; values: Record<string, string> } | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const { data, loading, error, refetch } = useAsync<LoanListItem[]>(
    "loans",
    getLoans,
  )

  const openEdit = async (id: string) => {
    setEditError(null)
    try {
      const detail = await getLoanById(id)
      if (!detail) throw new Error("Data pinjaman tidak ditemukan.")
      setEditing({ id, values: toFormValues(loanCreateFields, detail) })
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Gagal memuat data pinjaman.")
    }
  }

  const columns = [
    { key: "loanNumber", header: "No. Pinjaman" },
    {
      key: "customerName",
      header: "Nasabah",
    },
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
      {editError ? (
        <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {editError}
        </p>
      ) : null}
      <DataTable<LoanListItem>
        columns={columns}
        rows={data ?? []}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchKeys={["loanNumber", "customerName", "id"]}
        pageSize={8}
        emptyMessage="Belum ada pinjaman. Tambah nasabah dulu, lalu buat pinjaman."
        title="Pinjaman"
        subtitle="Data peminjaman nasabah"
        action={
          <Button onClick={() => setOpen(true)}>+ Tambah Pinjaman</Button>
        }
        rowActions={(r) => (
          <RowActions
            detailPath={`/loans/${encodeURIComponent(r.id)}`}
            onEdit={() => void openEdit(r.id)}
          />
        )}
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
      {editing && (
        <CreateModal
          title="Edit Pinjaman"
          subtitle="Status tidak bisa diubah lewat form ini (PUT menolak field status)."
          fields={loanCreateFields}
          initialValues={editing.values}
          submitLabel="Simpan Perubahan"
          onSubmit={(payload) =>
            updateLoan(editing.id, payload as unknown as Parameters<typeof updateLoan>[1])
          }
          onSuccess={() => {
            setEditing(null)
            refetch()
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  )
}
