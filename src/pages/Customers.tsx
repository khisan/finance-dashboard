import { Card } from "@/components/ui"
import { useAsync } from "@/hooks/useApi"
import { getCustomers } from "@/services/customerService"
import type { CustomerListItem } from "@/types/customer"
import { DataTable } from "@/components/DataTable"

export default function CustomersPage() {
  const { data, loading, error, refetch } = useAsync<CustomerListItem[]>(
    "customers",
    getCustomers,
  )

  const columns = [
    { key: "id", header: "ID" },
    { key: "fullName", header: "Nama" },
    { key: "email", header: "Email" },
    {
      key: "phoneNumber",
      header: "Telepon",
      render: (r) =>
        String((r as { phoneNumber?: string }).phoneNumber ?? "—"),
    },
    {
      key: "address",
      header: "Alamat",
      render: (r) => (
        <span className="max-w-[220px] block truncate">
          {(r as { address?: string }).address}
        </span>
      ),
    },
  ]

  return (
    <Card className="overflow-hidden">
      <DataTable<CustomerListItem>
        columns={columns}
        rows={data ?? []}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchKeys={["fullName", "email", "phoneNumber", "address"]}
        pageSize={8}
        emptyMessage="Belum ada nasabah. Data akan muncul setelah tersedia."
        title="Nasabah"
        subtitle="Data nasabah / borrower"
      />
    </Card>
  )
}
