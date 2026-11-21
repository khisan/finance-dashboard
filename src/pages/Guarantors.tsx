import { Card } from "@/components/ui"
import { useAsync } from "@/hooks/useApi"
import { getGuarantors } from "@/services/guarantorService"
import type { GuarantorListItem } from "@/types/guarantor"
import { DataTable } from "@/components/DataTable"

export default function GuarantorsPage() {
  const { data, loading, error, refetch } = useAsync<GuarantorListItem[]>(
    "guarantors",
    getGuarantors,
  )

  const columns = [
    { key: "id", header: "ID" },
    { key: "fullName", header: "Nama" },
    { key: "relationship", header: "Hubungan" },
    { key: "email", header: "Email" },
    { key: "phoneNumber", header: "Telepon" },
    { key: "loanId", header: "Pinjaman" },
  ]

  return (
    <Card className="overflow-hidden">
      <DataTable<GuarantorListItem>
        columns={columns}
        rows={data ?? []}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchKeys={["fullName", "email", "relationship", "loanId"]}
        pageSize={8}
        emptyMessage="Belum ada data penjamin. Data akan muncul setelah tersedia."
        title="Penjamin"
        subtitle="Data guarantor / penjamin pinjaman"
      />
    </Card>
  )
}
