import { useState } from "react"
import { Button } from "@/components/ui"
import { CreateModal } from "@/components/CreateModal"
import { RowActions } from "@/components/RowActions"
import { guarantorCreateFields } from "@/forms/createFields"
import { useAsync } from "@/hooks/useApi"
import { loanLabel } from "@/lib/format"
import { toFormValues } from "@/lib/formValues"
import {
  createGuarantor,
  getGuarantorById,
  getGuarantors,
  updateGuarantor,
} from "@/services/guarantorService"
import type { GuarantorListItem } from "@/types/guarantor"
import { DataTable } from "@/components/DataTable"

export default function GuarantorsPage() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<{ id: string; values: Record<string, string> } | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const { data, loading, error, refetch } = useAsync<GuarantorListItem[]>(
    "guarantors",
    getGuarantors,
  )

  const openEdit = async (id: string) => {
    setEditError(null)
    try {
      const detail = await getGuarantorById(id)
      if (!detail) throw new Error("Data penjamin tidak ditemukan.")
      setEditing({ id, values: toFormValues(guarantorCreateFields, detail) })
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Gagal memuat data penjamin.")
    }
  }

  const columns = [
    { key: "id", header: "ID" },
    { key: "fullName", header: "Nama" },
    { key: "relationship", header: "Hubungan" },
    { key: "email", header: "Email" },
    { key: "phoneNumber", header: "Telepon" },
    {
      key: "loanId",
      header: "Pinjaman",
      render: (r) => {
        const row = r as GuarantorListItem
        return (
          <span title={row.loanId} className="whitespace-nowrap">
            {loanLabel(row)}
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
      <DataTable<GuarantorListItem>
        columns={columns}
        rows={data ?? []}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchKeys={["fullName", "email", "relationship", "loanNumber", "customerName"]}
        pageSize={8}
        emptyMessage="Belum ada penjamin. Tambah pinjaman dulu, lalu daftarkan penjaminnya."
        title="Penjamin"
        subtitle="Data guarantor / penjamin pinjaman"
        action={<Button onClick={() => setOpen(true)}>+ Tambah Penjamin</Button>}
        rowActions={(r) => (
          <RowActions
            detailPath={`/guarantors/${encodeURIComponent(r.id)}`}
            onEdit={() => void openEdit(r.id)}
          />
        )}
      />
      {open && (
        <CreateModal
          title="Tambah Penjamin"
          fields={guarantorCreateFields}
          onSubmit={createGuarantor}
          onSuccess={() => refetch()}
          onClose={() => setOpen(false)}
        />
      )}
      {editing && (
        <CreateModal
          title="Edit Penjamin"
          fields={guarantorCreateFields}
          initialValues={editing.values}
          submitLabel="Simpan Perubahan"
          onSubmit={(payload) =>
            updateGuarantor(editing.id, payload as unknown as Parameters<typeof updateGuarantor>[1])
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
