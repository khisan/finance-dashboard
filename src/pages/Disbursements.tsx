import { useState } from "react"
import { Button } from "@/components/ui"
import { CreateModal } from "@/components/CreateModal"
import { RowActions } from "@/components/RowActions"
import { disbursementCreateFields } from "@/forms/createFields"
import { formatDate, formatIDR } from "@/lib/format"
import { toFormValues } from "@/lib/formValues"
import { useAsync } from "@/hooks/useApi"
import { proposalNotice, useNotice } from "@/hooks/useNotice"
import {
  createDisbursement,
  getDisbursementById,
  getDisbursements,
  updateDisbursement,
} from "@/services/disbursementService"
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
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<{ id: string; values: Record<string, string> } | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const { setNotice, node: noticeNode } = useNotice()
  const { data, loading, error, refetch } = useAsync<DisbursementListItem[]>(
    "disbursements",
    getDisbursements,
  )

  const openEdit = async (id: string) => {
    setEditError(null)
    try {
      const detail = await getDisbursementById(id)
      if (!detail) throw new Error("Data pencairan tidak ditemukan.")
      setEditing({ id, values: toFormValues(disbursementCreateFields, detail) })
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Gagal memuat data pencairan.")
    }
  }

  const columns = [
    { key: "disbursementNumber", header: "No. Pencairan" },
    {
      key: "loanNumber",
      header: "No. Pinjaman",
      render: (r) => (
        <span className="whitespace-nowrap">
          {(r as DisbursementListItem).loanNumber || "—"}
        </span>
      ),
    },
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
    <>
      {editError ? (
        <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {editError}
        </p>
      ) : null}
      {noticeNode}
      <DataTable<DisbursementListItem>
        columns={columns}
        rows={data ?? []}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchKeys={["disbursementNumber", "loanNumber", "customerName", "bankName"]}
        pageSize={8}
        emptyMessage="Belum ada pencairan. Tambah pinjaman dulu, lalu catat pencairannya."
        title="Pencairan"
        subtitle="Data disbursement / pencairan pinjaman"
        action={<Button onClick={() => setOpen(true)}>+ Tambah Pencairan</Button>}
        rowActions={(r) => (
          <RowActions
            detailPath={`/disbursements/${encodeURIComponent(r.id)}`}
            onEdit={() => void openEdit(r.id)}
          />
        )}
      />
      {open && (
        <CreateModal
          title="Tambah Pencairan"
          subtitle="Nomor dibuat otomatis backend. Proposal menunggu approval."
          fields={disbursementCreateFields}
          onSubmit={createDisbursement}
          onSuccess={(result) => {
            setNotice(proposalNotice(result))
            refetch()
          }}
          onClose={() => setOpen(false)}
        />
      )}
      {editing && (
        <CreateModal
          title="Edit Pencairan"
          subtitle="Nomor tidak dapat diubah. Perubahan diterapkan setelah approval."
          fields={disbursementCreateFields}
          initialValues={editing.values}
          submitLabel="Simpan Perubahan"
          onSubmit={(payload) =>
            updateDisbursement(editing.id, payload as unknown as Parameters<typeof updateDisbursement>[1])
          }
          onSuccess={(result) => {
            setEditing(null)
            setNotice(proposalNotice(result))
            refetch()
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  )
}
