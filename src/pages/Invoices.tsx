import { useState } from "react"
import { Button } from "@/components/ui"
import { CreateModal } from "@/components/CreateModal"
import { RowActions } from "@/components/RowActions"
import { invoiceCreateFields } from "@/forms/createFields"
import { formatDate, formatIDR } from "@/lib/format"
import { toFormValues } from "@/lib/formValues"
import { useAsync } from "@/hooks/useApi"
import { proposalNotice, useNotice } from "@/hooks/useNotice"
import {
  createInvoice,
  getInvoiceById,
  getInvoices,
  updateInvoice,
} from "@/services/invoiceService"
import type { InvoiceListItem } from "@/types/invoice"
import type { InvoiceStatus } from "@/types/enums"
import { DataTable } from "@/components/DataTable"

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  UNPAID: "Belum Bayar",
  PARTIALLY_PAID: "Parsial",
  PAID: "Lunas",
  OVERDUE: "Terlambat",
}

const STATUS_CLASS: Record<InvoiceStatus, string> = {
  UNPAID: "bg-amber-50 text-amber-700 border-amber-200",
  PARTIALLY_PAID: "bg-blue-50 text-blue-700 border-blue-200",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  OVERDUE: "bg-red-50 text-red-700 border-red-200",
}

export default function InvoicesPage() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<{ id: string; values: Record<string, string> } | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const { setNotice, node: noticeNode } = useNotice()
  const { data, loading, error, refetch } = useAsync<InvoiceListItem[]>(
    "invoices",
    getInvoices,
  )

  const openEdit = async (id: string) => {
    setEditError(null)
    try {
      const detail = await getInvoiceById(id)
      if (!detail) throw new Error("Data faktur tidak ditemukan.")
      setEditing({ id, values: toFormValues(invoiceCreateFields, detail) })
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Gagal memuat data faktur.")
    }
  }

  const columns = [
    { key: "invoiceNumber", header: "No. Faktur" },
    {
      key: "loanNumber",
      header: "No. Pinjaman",
      render: (r) => (
        <span className="whitespace-nowrap">
          {(r as InvoiceListItem).loanNumber || "—"}
        </span>
      ),
    },
    { key: "installmentNumber", header: "Nomor Angsuran" },
    {
      key: "totalAmount",
      header: "Total",
      render: (r) => formatIDR((r as { totalAmount: number }).totalAmount),
    },
    {
      key: "dueDate",
      header: "Jatuh Tempo",
      render: (r) =>
        formatDate((r as { dueDate: string | null }).dueDate),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => {
        const s = (r as { status: InvoiceStatus }).status
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_CLASS[s]}`}
          >
            {STATUS_LABEL[s]}
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
      {noticeNode}
      <DataTable<InvoiceListItem>
        columns={columns}
        rows={data ?? []}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchKeys={["invoiceNumber", "loanNumber", "customerName"]}
        pageSize={8}
        emptyMessage="Belum ada faktur. Tambah pinjaman dulu, lalu buat fakturnya."
        title="Faktur Tagihan"
        subtitle="Data invoice / faktur tagihan"
        action={<Button onClick={() => setOpen(true)}>+ Tambah Faktur</Button>}
        rowActions={(r) => (
          <RowActions
            detailPath={`/invoices/${encodeURIComponent(r.id)}`}
            onEdit={() => void openEdit(r.id)}
          />
        )}
      />
      {open && (
        <CreateModal
          title="Tambah Faktur"
          subtitle="Nomor dibuat otomatis backend, total dihitung ulang. Proposal menunggu approval."
          fields={invoiceCreateFields}
          onSubmit={createInvoice}
          onSuccess={(result) => {
            setNotice(proposalNotice(result))
            refetch()
          }}
          onClose={() => setOpen(false)}
        />
      )}
      {editing && (
        <CreateModal
          title="Edit Faktur"
          subtitle="Nomor tidak dapat diubah. Perubahan diterapkan setelah approval."
          fields={invoiceCreateFields}
          initialValues={editing.values}
          submitLabel="Simpan Perubahan"
          onSubmit={(payload) =>
            updateInvoice(editing.id, payload as unknown as Parameters<typeof updateInvoice>[1])
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
