import { useState } from "react"
import { Button } from "@/components/ui"
import { CreateModal } from "@/components/CreateModal"
import { collateralCreateFields } from "@/forms/createFields"
import { useAsync } from "@/hooks/useApi"
import { formatIDR } from "@/lib/format"
import { createCollateral, getCollaterals } from "@/services/collateralService"
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
  const { data, loading, error, refetch } = useAsync<CollateralListItem[]>(
    "collaterals",
    getCollaterals,
  )

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
    </>
  )
}
