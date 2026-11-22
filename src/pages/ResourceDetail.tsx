import { useCallback, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { ReactNode } from "react"
import { Button, StatusChip } from "@/components/ui"
import { CreateModal, type FormField } from "@/components/CreateModal"
import { DetailView, type DetailField, type DetailSection } from "@/components/DetailView"
import { useAsync } from "@/hooks/useApi"
import { formatDate, formatIDR } from "@/lib/format"
import { toFormValues } from "@/lib/formValues"
import {
  customerCreateFields,
  loanCreateFields,
  collateralCreateFields,
  guarantorCreateFields,
  invoiceCreateFields,
  disbursementCreateFields,
  userCreateFields,
} from "@/forms/createFields"
import { getCustomerById, updateCustomer } from "@/services/customerService"
import { getLoanDetail, updateLoan } from "@/services/loanService"
import { getCollateralById, updateCollateral } from "@/services/collateralService"
import { getGuarantorById, updateGuarantor } from "@/services/guarantorService"
import { getInvoiceById, updateInvoice } from "@/services/invoiceService"
import { getDisbursementById, updateDisbursement } from "@/services/disbursementService"
import { getUserByEmail } from "@/services/userService"
import type { CollateralType } from "@/types/enums"

type DetailRecord = Record<string, unknown>
type EditPayload = Record<string, unknown>

interface ResourceConfig {
  label: string
  listPath: string
  canEdit: boolean
  editFields: FormField[]
  getDetail: (id: string) => Promise<DetailRecord | null>
  update: (id: string, body: EditPayload) => Promise<unknown>
  recordLabel: (record: DetailRecord) => string
  fields: (record: DetailRecord) => DetailField[]
  sections?: (record: DetailRecord) => DetailSection[]
}

const str = (value: unknown): string =>
  value == null || value === "" ? "—" : String(value)

const money = (value: unknown): ReactNode =>
  typeof value === "number" || typeof value === "string"
    ? formatIDR(value as number | string)
    : "—"

const date = (value: unknown): ReactNode => formatDate(value as string | null)

const f = (label: string, value: ReactNode, wide = false): DetailField => ({
  label,
  value,
  wide,
})

const TYPE_LABEL: Record<CollateralType, string> = {
  REAL_ESTATE: "Tanah/Bangunan",
  VEHICLE: "Kendaraan",
  DEPOSIT: "Deposit",
  GOLD: "Emas",
  OTHER: "Lainnya",
}

const configs: Record<string, ResourceConfig> = {
  customers: {
    label: "Nasabah",
    listPath: "/customers",
    canEdit: true,
    editFields: customerCreateFields,
    getDetail: async (id) => (await getCustomerById(id)) as unknown as DetailRecord | null,
    update: (id, body) => updateCustomer(id, body as unknown as Parameters<typeof updateCustomer>[1]),
    recordLabel: (r) => str(r.fullName),
    fields: (r) => [
      f("ID", str(r.id)),
      f("Nama Lengkap", str(r.fullName)),
      f("Nomor Identitas", str(r.identityNumber)),
      f("Email", str(r.email)),
      f("Telepon", str(r.phoneNumber)),
      f("Alamat", str(r.address), true),
      f("Dibuat", date(r.createdAt)),
      f("Diupdate", date(r.updatedAt)),
    ],
  },
  loans: {
    label: "Pinjaman",
    listPath: "/loans",
    canEdit: true,
    editFields: loanCreateFields,
    getDetail: async (id) => (await getLoanDetail(id)) as unknown as DetailRecord | null,
    update: (id, body) => updateLoan(id, body as unknown as Parameters<typeof updateLoan>[1]),
    recordLabel: (r) => str(r.id),
    fields: (r) => [
      f("ID Pinjaman", str(r.id)),
      f("Nasabah", str(r.borrowerName)),
      f("Customer ID", str(r.customerId)),
      f("Email Nasabah", str(r.customerEmail)),
      f("Alamat Nasabah", str(r.customerAddress), true),
      f("Jumlah Pinjaman", money(r.amount)),
      f("Suku Bunga", `${str(r.interestRate)}%`),
      f("Tenor", `${str(r.tenorMonths)} bulan`),
      f("Status", <StatusChip status={str(r.status)} />),
      f("Dibuat", date(r.createdAt)),
    ],
    sections: (r) => {
      const collateral = r.collateral as DetailRecord | null
      return [
        {
          title: "Agunan",
          rows: collateral ? [collateral] : [],
          emptyText: "Belum ada agunan untuk pinjaman ini.",
          columns: [
            { key: "documentNumber", header: "No. Dokumen", render: (x) => str(x.documentNumber) },
            {
              key: "type",
              header: "Tipe",
              render: (x) => TYPE_LABEL[x.type as CollateralType] ?? str(x.type),
            },
            { key: "marketValue", header: "Nilai Estimasi", render: (x) => money(x.marketValue) },
            { key: "pledgedValue", header: "Nilai Jaminan", render: (x) => money(x.pledgedValue) },
          ],
        },
        {
          title: "Penjamin",
          rows: (r.guarantors as DetailRecord[]) ?? [],
          emptyText: "Belum ada penjamin untuk pinjaman ini.",
          columns: [
            { key: "fullName", header: "Nama", render: (x) => str(x.fullName) },
            { key: "relationship", header: "Hubungan", render: (x) => str(x.relationship) },
            { key: "email", header: "Email", render: (x) => str(x.email) },
            { key: "phoneNumber", header: "Telepon", render: (x) => str(x.phoneNumber) },
          ],
        },
        {
          title: "Faktur Tagihan",
          rows: (r.invoices as DetailRecord[]) ?? [],
          emptyText: "Belum ada faktur untuk pinjaman ini.",
          columns: [
            { key: "invoiceNumber", header: "No. Faktur", render: (x) => str(x.invoiceNumber) },
            { key: "installmentNumber", header: "Angsuran", render: (x) => str(x.installmentNumber) },
            { key: "totalAmount", header: "Total", render: (x) => money(x.totalAmount) },
            { key: "dueDate", header: "Jatuh Tempo", render: (x) => date(x.dueDate) },
            { key: "status", header: "Status", render: (x) => str(x.status) },
          ],
        },
        {
          title: "Pencairan",
          rows: (r.disbursements as DetailRecord[]) ?? [],
          emptyText: "Belum ada pencairan untuk pinjaman ini.",
          columns: [
            { key: "disbursementNumber", header: "No. Pencairan", render: (x) => str(x.disbursementNumber) },
            { key: "amount", header: "Nominal", render: (x) => money(x.amount) },
            { key: "bankName", header: "Bank", render: (x) => str(x.bankName) },
            { key: "status", header: "Status", render: (x) => str(x.status) },
          ],
        },
      ]
    },
  },
  collaterals: {
    label: "Agunan",
    listPath: "/collaterals",
    canEdit: true,
    editFields: collateralCreateFields,
    getDetail: async (id) => (await getCollateralById(id)) as unknown as DetailRecord | null,
    update: (id, body) => updateCollateral(id, body as unknown as Parameters<typeof updateCollateral>[1]),
    recordLabel: (r) => str(r.documentNumber),
    fields: (r) => [
      f("ID", str(r.id)),
      f("Pinjaman", str(r.loanId)),
      f("Tipe", TYPE_LABEL[r.type as CollateralType] ?? str(r.type)),
      f("No. Dokumen", str(r.documentNumber)),
      f("Nilai Estimasi", money(r.marketValue)),
      f("Nilai Jaminan", money(r.pledgedValue)),
      f("Deskripsi", str(r.description), true),
      f("Dibuat", date(r.createdAt)),
      f("Diupdate", date(r.updatedAt)),
    ],
  },
  guarantors: {
    label: "Penjamin",
    listPath: "/guarantors",
    canEdit: true,
    editFields: guarantorCreateFields,
    getDetail: async (id) => (await getGuarantorById(id)) as unknown as DetailRecord | null,
    update: (id, body) => updateGuarantor(id, body as unknown as Parameters<typeof updateGuarantor>[1]),
    recordLabel: (r) => str(r.fullName),
    fields: (r) => [
      f("ID", str(r.id)),
      f("Pinjaman", str(r.loanId)),
      f("Nama Lengkap", str(r.fullName)),
      f("Nomor Identitas", str(r.identityNumber)),
      f("Email", str(r.email)),
      f("Telepon", str(r.phoneNumber)),
      f("Hubungan", str(r.relationship)),
      f("Alamat", str(r.address), true),
      f("Dibuat", date(r.createdAt)),
    ],
  },
  invoices: {
    label: "Faktur",
    listPath: "/invoices",
    canEdit: true,
    editFields: invoiceCreateFields,
    getDetail: async (id) => (await getInvoiceById(id)) as unknown as DetailRecord | null,
    update: (id, body) => updateInvoice(id, body as unknown as Parameters<typeof updateInvoice>[1]),
    recordLabel: (r) => str(r.invoiceNumber),
    fields: (r) => [
      f("ID", str(r.id)),
      f("Pinjaman", str(r.loanId)),
      f("No. Faktur", str(r.invoiceNumber)),
      f("Angsuran Ke-", str(r.installmentNumber)),
      f("Pokok", money(r.principalAmount)),
      f("Bunga", money(r.interestAmount)),
      f("Denda", money(r.penaltyAmount)),
      f("Total", money(r.totalAmount)),
      f("Jatuh Tempo", date(r.dueDate)),
      f("Dibayar", date(r.paidAt)),
      f("Status", str(r.status)),
      f("Dibuat", date(r.createdAt)),
    ],
  },
  disbursements: {
    label: "Pencairan",
    listPath: "/disbursements",
    canEdit: true,
    editFields: disbursementCreateFields,
    getDetail: async (id) => (await getDisbursementById(id)) as unknown as DetailRecord | null,
    update: (id, body) => updateDisbursement(id, body as unknown as Parameters<typeof updateDisbursement>[1]),
    recordLabel: (r) => str(r.disbursementNumber),
    fields: (r) => [
      f("ID", str(r.id)),
      f("Pinjaman", str(r.loanId)),
      f("No. Pencairan", str(r.disbursementNumber)),
      f("Nominal", money(r.amount)),
      f("Bank", str(r.bankName)),
      f("No. Rekening", str(r.bankAccountNumber)),
      f("Atas Nama", str(r.bankAccountName)),
      f("Status", str(r.status)),
      f("Tanggal Pencairan", date(r.disbursedAt)),
      f("Dibuat", date(r.createdAt)),
    ],
  },
  users: {
    label: "Pengguna",
    listPath: "/users",
    // Backend hanya punya GET by email & POST — tidak ada PUT /api/users/{id}.
    canEdit: false,
    editFields: userCreateFields,
    getDetail: async (email) => (await getUserByEmail(email)) as unknown as DetailRecord,
    update: async () => {
      throw new Error("Backend belum menyediakan endpoint update user.")
    },
    recordLabel: (r) => str(r.name),
    fields: (r) => [
      f("Nama", str(r.name)),
      f("Email", str(r.email)),
      f("Role", str(r.role)),
    ],
  },
}

/** Full-page view detail for every resource except Settings. */
export default function ResourceDetail({ resource }: { resource: string }) {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const config = configs[resource]

  const fetchDetail = useCallback(() => {
    if (!config) return Promise.resolve(null)
    return config.getDetail(id)
  }, [config, id])

  const { data, loading, error, refetch } = useAsync<DetailRecord | null>(
    `detail-${resource}-${id}`,
    fetchDetail,
  )

  if (!config) {
    return <DetailView title="Halaman tidak ditemukan" subtitle={resource} fields={[]} />
  }

  const record = data ?? undefined
  const detailError = error ?? (data === null ? "Data tidak ditemukan." : null)

  return (
    <>
      <DetailView
        title={`Detail ${config.label}`}
        subtitle={record ? config.recordLabel(record) : id}
        fields={record ? config.fields(record) : []}
        sections={record ? config.sections?.(record) : undefined}
        loading={loading}
        error={detailError}
        onRetry={refetch}
        actions={
          <>
            <button
              type="button"
              onClick={() => navigate(config.listPath)}
              className="rounded-lg border border-stone-200 px-3.5 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
            >
              Kembali
            </button>
            {config.canEdit && record ? (
              <Button type="button" onClick={() => setEditing(true)}>
                Edit
              </Button>
            ) : null}
          </>
        }
      />

      {editing && record ? (
        <CreateModal
          title={`Edit ${config.label}`}
          subtitle="Perubahan akan disimpan ke backend dengan PUT."
          fields={config.editFields}
          initialValues={toFormValues(config.editFields, record)}
          submitLabel="Simpan Perubahan"
          onSubmit={(payload: EditPayload) => config.update(id, payload)}
          onSuccess={() => void refetch()}
          onClose={() => setEditing(false)}
        />
      ) : null}
    </>
  )
}
