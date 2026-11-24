import { useMemo, useState } from "react"
import { Button } from "@/components/ui"
import { CreateModal } from "@/components/CreateModal"
import { RowActions } from "@/components/RowActions"
import { customerCreateFields } from "@/forms/createFields"
import { useAsync } from "@/hooks/useApi"
import { proposalNotice, useNotice } from "@/hooks/useNotice"
import { toFormValues } from "@/lib/formValues"
import {
  createCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
} from "@/services/customerService"
import type { CustomerListItem } from "@/types/customer"
import type { LoanListItem } from "@/types/loan"
import { getLoans } from "@/services/loanService"
import { DataTable } from "@/components/DataTable"

type CustomerRow = CustomerListItem & { loanNumber: string }

export default function CustomersPage() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<{ id: string; values: Record<string, string> } | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const { setNotice, node: noticeNode } = useNotice()
  const { data, loading, error, refetch } = useAsync<CustomerListItem[]>(
    "customers",
    getCustomers,
  )
  // CustomerResponse tidak punya loanNumber; ambil dari /loans lalu petakan per nasabah.
  const {
    data: loans,
    loading: loansLoading,
    refetch: refetchLoans,
  } = useAsync<LoanListItem[]>("loans", getLoans)

  const loanNumbersByCustomer = useMemo(() => {
    const map = new Map<string, string[]>()
    for (const loan of loans ?? []) {
      if (!loan.loanNumber) continue
      const numbers = map.get(loan.customerId) ?? []
      numbers.push(loan.loanNumber)
      map.set(loan.customerId, numbers)
    }
    return map
  }, [loans])

  const rows = useMemo<CustomerRow[]>(
    () =>
      (data ?? []).map((customer) => ({
        ...customer,
        loanNumber: (loanNumbersByCustomer.get(customer.id) ?? []).join(", ") || "—",
      })),
    [data, loanNumbersByCustomer],
  )

  const retry = () => {
    refetch()
    refetchLoans()
  }

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
    { key: "customerNumber", header: "No. Nasabah" },
    { key: "loanNumber", header: "No. Pinjaman" },
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
      {noticeNode}
      <DataTable<CustomerRow>
        columns={columns}
        rows={rows}
        loading={loading || loansLoading}
        error={error}
        onRetry={retry}
        searchKeys={["customerNumber", "loanNumber", "fullName", "email", "phoneNumber", "address"]}
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
          subtitle="Proposal menunggu persetujuan finance/admin sebelum data disimpan."
          fields={customerCreateFields}
          onSubmit={createCustomer}
          onSuccess={(result) => {
            setNotice(proposalNotice(result))
            refetch()
          }}
          onClose={() => setOpen(false)}
        />
      )}
      {editing && (
        <CreateModal
          title="Edit Nasabah"
          subtitle="Perubahan menjadi proposal dan diterapkan setelah disetujui finance/admin."
          fields={customerCreateFields}
          initialValues={editing.values}
          submitLabel="Simpan Perubahan"
          onSubmit={(payload) =>
            updateCustomer(editing.id, payload as unknown as Parameters<typeof updateCustomer>[1])
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
