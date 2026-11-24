import { useCallback, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button, StatusChip } from "@/components/ui"
import { AuditTrailCard } from "@/components/AuditTrailCard"
import { CreateModal } from "@/components/CreateModal"
import { DetailView, type DetailSection } from "@/components/DetailView"
import { loanCreateFields } from "@/forms/createFields"
import { useAsync } from "@/hooks/useApi"
import { date, f, money, str, TYPE_LABEL } from "@/lib/detailFields"
import { toFormValues } from "@/lib/formValues"
import { getLoanDetail, updateLoan } from "@/services/loanService"
import type { CollateralType } from "@/types/enums"
import type { LoanDetail as LoanDetailData } from "@/types/loan"

type Row = Record<string, unknown>

/**
 * Loan has no combined detail endpoint, so getLoanDetail() gathers the loan,
 * customer and the four related resources. Kept in its own file because the
 * aggregate sections make it much larger than the other detail pages.
 */
function loanSections(loan: LoanDetailData): DetailSection[] {
  const collateral = loan.collateral as unknown as Row | null
  return [
    {
      title: "Agunan",
      rows: collateral ? [collateral] : [],
      emptyText: "Belum ada agunan untuk pinjaman ini.",
      columns: [
        {
          key: "documentNumber",
          header: "No. Dokumen",
          render: (x) => str(x.documentNumber),
        },
        {
          key: "type",
          header: "Tipe",
          render: (x) => TYPE_LABEL[x.type as CollateralType] ?? str(x.type),
        },
        {
          key: "marketValue",
          header: "Nilai Estimasi",
          render: (x) => money(x.marketValue),
        },
        {
          key: "pledgedValue",
          header: "Nilai Jaminan",
          render: (x) => money(x.pledgedValue),
        },
      ],
    },
    {
      title: "Penjamin",
      rows: loan.guarantors as unknown as Row[],
      emptyText: "Belum ada penjamin untuk pinjaman ini.",
      columns: [
        { key: "fullName", header: "Nama", render: (x) => str(x.fullName) },
        {
          key: "relationship",
          header: "Hubungan",
          render: (x) => str(x.relationship),
        },
        { key: "email", header: "Email", render: (x) => str(x.email) },
        {
          key: "phoneNumber",
          header: "Telepon",
          render: (x) => str(x.phoneNumber),
        },
      ],
    },
    {
      title: "Faktur Tagihan",
      rows: loan.invoices as unknown as Row[],
      emptyText: "Belum ada faktur untuk pinjaman ini.",
      columns: [
        {
          key: "invoiceNumber",
          header: "No. Faktur",
          render: (x) => str(x.invoiceNumber),
        },
        {
          key: "installmentNumber",
          header: "Angsuran",
          render: (x) => str(x.installmentNumber),
        },
        {
          key: "totalAmount",
          header: "Total",
          render: (x) => money(x.totalAmount),
        },
        {
          key: "dueDate",
          header: "Jatuh Tempo",
          render: (x) => date(x.dueDate),
        },
        { key: "status", header: "Status", render: (x) => str(x.status) },
      ],
    },
    {
      title: "Pencairan",
      rows: loan.disbursements as unknown as Row[],
      emptyText: "Belum ada pencairan untuk pinjaman ini.",
      columns: [
        {
          key: "disbursementNumber",
          header: "No. Pencairan",
          render: (x) => str(x.disbursementNumber),
        },
        { key: "amount", header: "Nominal", render: (x) => money(x.amount) },
        { key: "bankName", header: "Bank", render: (x) => str(x.bankName) },
        { key: "status", header: "Status", render: (x) => str(x.status) },
      ],
    },
  ]
}

export default function LoanDetail() {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)

  const fetchDetail = useCallback(() => getLoanDetail(id), [id])
  const { data, loading, error, refetch } = useAsync<LoanDetailData | null>(
    `loan-detail-${id}`,
    fetchDetail,
  )

  const record = data ?? undefined
  const detailError = error ?? (data === null ? "Data tidak ditemukan." : null)

  return (
    <>
      <DetailView
        title="Detail Pinjaman"
        subtitle={record ? str(record.loanNumber) : id}
        fields={
          record
            ? [
                f("No. Pinjaman", str(record.loanNumber)),
                f("ID Pinjaman", str(record.id)),
                f("Nasabah", str(record.borrowerName)),
                f("Customer ID", str(record.customerId)),
                f("Email Nasabah", str(record.customerEmail)),
                f("Alamat Nasabah", str(record.customerAddress)),
                f("Jumlah Pinjaman", money(record.amount)),
                f("Suku Bunga", `${str(record.interestRate)}%`),
                f("Tenor", `${str(record.tenorMonths)} bulan`),
                f("Status", <StatusChip status={str(record.status)} />),
                f("Dibuat", date(record.createdAt)),
              ]
            : []
        }
        sections={record ? loanSections(record) : undefined}
        loading={loading}
        error={detailError}
        onRetry={refetch}
        footer={record ? <AuditTrailCard entityId={id} entityType="LOAN" /> : undefined}
        actions={
          <>
            <button
              type="button"
              onClick={() => navigate("/loans")}
              className="rounded-lg border border-stone-200 px-3.5 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
            >
              Kembali
            </button>
            {record ? (
              <Button type="button" onClick={() => setEditing(true)}>
                Edit
              </Button>
            ) : null}
          </>
        }
      />

      {editing && record ? (
        <CreateModal
          title="Edit Pinjaman"
          subtitle="Perubahan menjadi proposal; diterapkan setelah disetujui finance/admin."
          fields={loanCreateFields}
          initialValues={toFormValues(loanCreateFields, record)}
          submitLabel="Simpan Perubahan"
          onSubmit={(payload) =>
            updateLoan(
              id,
              payload as unknown as Parameters<typeof updateLoan>[1],
            )
          }
          onSuccess={() => void refetch()}
          onClose={() => setEditing(false)}
        />
      ) : null}
    </>
  )
}
