import { Card } from "@/components/ui"
import { formatDate, formatIDR } from "@/lib/format"
import { useAsync } from "@/hooks/useApi"
import { getInvoices } from "@/services/invoiceService"
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
  const { data, loading, error, refetch } = useAsync<InvoiceListItem[]>(
    "invoices",
    getInvoices,
  )

  const columns = [
    { key: "id", header: "ID" },
    { key: "invoiceNumber", header: "Nomor Faktur" },
    { key: "loanId", header: "Pinjaman" },
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
    <Card className="overflow-hidden">
      <DataTable<InvoiceListItem>
        columns={columns}
        rows={data ?? []}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchKeys={["invoiceNumber", "loanId"]}
        pageSize={8}
        emptyMessage="Belum ada faktur tagihan. Data akan muncul setelah tersedia."
        title="Faktur Tagihan"
        subtitle="Data invoice / faktur tagihan"
      />
    </Card>
  )
}
