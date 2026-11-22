import { useState } from "react"
import { Button } from "@/components/ui"
import { CreateModal } from "@/components/CreateModal"
import { guarantorCreateFields } from "@/forms/createFields"
import { useAsync } from "@/hooks/useApi"
import { createGuarantor, getGuarantors } from "@/services/guarantorService"
import type { GuarantorListItem } from "@/types/guarantor"
import { DataTable } from "@/components/DataTable"

export default function GuarantorsPage() {
  const [open, setOpen] = useState(false)
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
    <>
      <DataTable<GuarantorListItem>
        columns={columns}
        rows={data ?? []}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchKeys={["fullName", "email", "relationship", "loanId"]}
        pageSize={8}
        emptyMessage="Belum ada penjamin. Tambah pinjaman dulu, lalu daftarkan penjaminnya."
        title="Penjamin"
        subtitle="Data guarantor / penjamin pinjaman"
        action={<Button onClick={() => setOpen(true)}>+ Tambah Penjamin</Button>}
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
    </>
  )
}
