import { useState } from "react"
import { Button } from "@/components/ui"
import { CreateModal } from "@/components/CreateModal"
import { RowActions } from "@/components/RowActions"
import { collateralCreateFields } from "@/forms/createFields"
import { useAsync } from "@/hooks/useApi"
import { formatIDR } from "@/lib/format"
import { toFormValues } from "@/lib/formValues"
import {
  createCollateral,
  getCollateralById,
  getCollaterals,
  updateCollateral,
} from "@/services/collateralService"
import type { CollateralListItem } from "@/types/collateral"
import type { CollateralType } from "@/types/enums"
import { DataTable } from "@/components/DataTable"

const TYPE_LABEL: Record<CollateralType, string> = {
  REAL_ESTATE: "Tanah/Bangunan",
  VEHICLE: "Kendaraan",
  DEPOSIT: "Deposit",
  GOLD: "Emas",
  OTHER: "Lainnya",
}

export default function CollateralsPage() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<{ id: string; values: Record<string, string> } | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const { data, loading, error, refetch } = useAsync<CollateralListItem[]>(
    "collaterals",
    getCollaterals,
  )

  const openEdit = async (id: string) => {
    setEditError(null)
    try {
      const detail = await getCollateralById(id)
      if (!detail) throw new Error("Data agunan tidak ditemukan.")
      setEditing({ id, values: toFormValues(collateralCreateFields, detail) })
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Gagal memuat data agunan.")
    }
  }

  const columns = [
    { key: "id", header: "ID" },
    {
      key: "type",
      header: "Tipe",
      render: (r) =>
        TYPE_LABEL[(r as { type: CollateralType }).type],
    },
    {
      key: "documentNumber",
      header: "Nomor Dokumen",
      render: (r) =>
        String((r as { documentNumber?: string }).documentNumber),
    },
    {
      key: "marketValue",
      header: "Nilai Estimasi",
      render: (r) =>
        formatIDR((r as { marketValue: number }).marketValue),
    },
    {
      key: "pledgedValue",
      header: "Nilai Jaminan",
      render: (r) =>
        formatIDR((r as { pledgedValue: number }).pledgedValue),
    },
    { key: "loanId", header: "Pinjaman" },
  ]

  return (
    <>
      {editError ? (
        <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {editError}
        </p>
      ) : null}
      <DataTable<CollateralListItem>
        columns={columns}
        rows={data ?? []}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchKeys={["documentNumber", "type", "loanId"]}
        pageSize={8}
        emptyMessage="Belum ada agunan. Tambah pinjaman dulu, lalu daftarkan agunannya."
        title="Agunan"
        subtitle="Data collateral / agunan pinjaman"
        action={<Button onClick={() => setOpen(true)}>+ Tambah Agunan</Button>}
        rowActions={(r) => (
          <RowActions
            detailPath={`/collaterals/${encodeURIComponent(r.id)}`}
            onEdit={() => void openEdit(r.id)}
          />
        )}
      />
      {open && (
        <CreateModal
          title="Tambah Agunan"
          fields={collateralCreateFields}
          onSubmit={createCollateral}
          onSuccess={() => refetch()}
          onClose={() => setOpen(false)}
        />
      )}
      {editing && (
        <CreateModal
          title="Edit Agunan"
          fields={collateralCreateFields}
          initialValues={editing.values}
          submitLabel="Simpan Perubahan"
          onSubmit={(payload) =>
            updateCollateral(editing.id, payload as unknown as Parameters<typeof updateCollateral>[1])
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
