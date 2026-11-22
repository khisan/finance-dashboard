import { useState } from "react"
import { Button } from "@/components/ui"
import { CreateModal } from "@/components/CreateModal"
import { RowActions } from "@/components/RowActions"
import { customerCreateFields } from "@/forms/createFields"
import { useAsync } from "@/hooks/useApi"
import { toFormValues } from "@/lib/formValues"
import {
  createCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
} from "@/services/customerService"
import type { CustomerListItem } from "@/types/customer"
import { DataTable } from "@/components/DataTable"

export default function CustomersPage() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<{ id: string; values: Record<string, string> } | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const { data, loading, error, refetch } = useAsync<CustomerListItem[]>(
    "customers",
    getCustomers,
  )

  const openEdit = async (id: string) => {
    setEditError(null)
    try {
      const detail = await getCustomerById(id)
      if (!detail) throw new Error("Data nasabah tidak ditemukan.")
      setEditing({ id, values: toFormValues(customerCreateFields, detail) })
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Gagal memuat data nasabah.")
    }
  }

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
      {editError ? (
        <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {editError}
        </p>
      ) : null}
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
        rowActions={(r) => (
          <RowActions
            detailPath={`/customers/${encodeURIComponent(r.id)}`}
            onEdit={() => void openEdit(r.id)}
          />
        )}
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
      {editing && (
        <CreateModal
          title="Edit Nasabah"
          subtitle="Perubahan disimpan dengan PUT /api/customers/{id}."
          fields={customerCreateFields}
          initialValues={editing.values}
          submitLabel="Simpan Perubahan"
          onSubmit={(payload) =>
            updateCustomer(editing.id, payload as unknown as Parameters<typeof updateCustomer>[1])
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
