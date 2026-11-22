import { useState } from "react"
import { Button } from "@/components/ui"
import { CreateModal } from "@/components/CreateModal"
import { customerCreateFields } from "@/forms/createFields"
import { useAsync } from "@/hooks/useApi"
import { createCustomer, getCustomers } from "@/services/customerService"
import type { CustomerListItem } from "@/types/customer"
import { DataTable } from "@/components/DataTable"

export default function CustomersPage() {
  const [open, setOpen] = useState(false)
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
    <>
      <DataTable<CustomerListItem>
        columns={columns}
        rows={data ?? []}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchKeys={["fullName", "email", "phoneNumber", "address"]}
        pageSize={8}
        emptyMessage="Belum ada nasabah. Gunakan tombol Tambah untuk membuat data pertama."
        title="Nasabah"
        subtitle="Data nasabah / borrower"
        action={<Button onClick={() => setOpen(true)}>+ Tambah Nasabah</Button>}
      />
      {open && (
        <CreateModal
          title="Tambah Nasabah"
          subtitle="Data akan langsung disimpan ke backend."
          fields={customerCreateFields}
          onSubmit={createCustomer}
          onSuccess={() => refetch()}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
