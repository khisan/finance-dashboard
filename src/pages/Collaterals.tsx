import { Card } from "@/components/ui"
import { useAsync } from "@/hooks/useApi"
import { formatIDR } from "@/lib/format"
import { getCollaterals } from "@/services/collateralService"
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
    <Card className="overflow-hidden">
      <DataTable<CollateralListItem>
        columns={columns}
        rows={data ?? []}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchKeys={["documentNumber", "type", "loanId"]}
        pageSize={8}
        emptyMessage="Belum ada agunan. Data akan muncul setelah tersedia."
        title="Agunan"
        subtitle="Data collateral / agunan pinjaman"
      />
    </Card>
  )
}
