import type { FormField, SelectOption } from "@/components/CreateModal"
import { getCustomers } from "@/services/customerService"
import { getLoans } from "@/services/loanService"

/** Filled lazily when a create dialog opens, so the list is always current. */
export async function customerOptions(): Promise<SelectOption[]> {
  const rows = await getCustomers()
  return rows.map((c) => ({ value: c.id, label: `${c.fullName} — ${c.email}` }))
}

export async function loanOptions(): Promise<SelectOption[]> {
  const rows = await getLoans()
  return rows.map((l) => ({
    value: l.id,
    label: `${l.loanNumber} — ${l.customerName || "Nasabah"}`,
  }))
}

const loanIdField: FormField = {
  name: "loanId",
  label: "Pinjaman",
  type: "select",
  required: true,
  options: loanOptions,
  hint: "Buat pinjaman dulu jika daftar masih kosong.",
}

export const customerCreateFields: FormField[] = [
  {
    name: "fullName",
    label: "Nama Lengkap",
    required: true,
    placeholder: "Nama nasabah",
  },
  {
    name: "identityNumber",
    label: "Nomor Identitas",
    required: true,
    placeholder: "KTP / NPWP",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "nama@email.com",
  },
  {
    name: "phoneNumber",
    label: "Telepon",
    required: true,
    placeholder: "08xxxxxxxxxx",
  },
  {
    name: "address",
    label: "Alamat",
    wide: true,
    placeholder: "Alamat lengkap",
  },
]

export const loanCreateFields: FormField[] = [
  {
    name: "customerId",
    label: "Nasabah",
    type: "select",
    required: true,
    options: customerOptions,
    hint: "Buat nasabah dulu jika daftar masih kosong.",
  },
  {
    name: "amount",
    label: "Jumlah Pinjaman",
    type: "number",
    required: true,
    min: 100000,
    step: "any",
    placeholder: "5000000",
    hint: "Minimum 100.000",
  },
  {
    name: "interestRate",
    label: "Suku Bunga (%)",
    type: "number",
    required: true,
    min: 0.01,
    step: "any",
    placeholder: "8.5",
  },
  {
    name: "tenorMonths",
    label: "Tenor (bulan)",
    type: "number",
    required: true,
    min: 1,
    max: 120,
    placeholder: "12",
  },
]

export const collateralCreateFields: FormField[] = [
  loanIdField,
  {
    name: "type",
    label: "Jenis Agunan",
    type: "select",
    required: true,
    options: [
      { value: "REAL_ESTATE", label: "Tanah/Bangunan" },
      { value: "VEHICLE", label: "Kendaraan" },
      { value: "DEPOSIT", label: "Deposit" },
      { value: "GOLD", label: "Emas" },
      { value: "OTHER", label: "Lainnya" },
    ],
  },
  {
    name: "documentNumber",
    label: "Nomor Dokumen",
    required: true,
    placeholder: "SHM-123/2026",
  },
  {
    name: "marketValue",
    label: "Nilai Pasar",
    type: "number",
    required: true,
    min: 1,
    step: "any",
    placeholder: "150.000.000",
  },
  {
    name: "pledgedValue",
    label: "Nilai Gadai",
    type: "number",
    required: true,
    min: 1,
    step: "any",
    placeholder: "120.000.000",
  },
  {
    name: "description",
    label: "Keterangan",
    type: "textarea",
    wide: true,
    placeholder: "Opsional",
  },
]

export const guarantorCreateFields: FormField[] = [
  loanIdField,
  { name: "fullName", label: "Nama Lengkap", required: true },
  { name: "identityNumber", label: "Nomor Identitas", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phoneNumber", label: "Telepon", required: true },
  {
    name: "relationship",
    label: "Hubungan",
    required: true,
    placeholder: "Saudara / Orang Tua / dll.",
  },
  { name: "address", label: "Alamat", wide: true, placeholder: "Opsional" },
]

export const invoiceCreateFields: FormField[] = [
  loanIdField,
  {
    name: "installmentNumber",
    label: "Angsuran Ke-",
    type: "number",
    required: true,
    min: 1,
    placeholder: "3",
  },
  {
    name: "principalAmount",
    label: "Pokok",
    type: "number",
    required: true,
    min: 0,
    step: "any",
    placeholder: "250.000",
  },
  {
    name: "interestAmount",
    label: "Bunga",
    type: "number",
    required: true,
    min: 0,
    step: "any",
    placeholder: "100.000",
  },
  {
    name: "penaltyAmount",
    label: "Denda",
    type: "number",
    min: 0,
    step: "any",
    defaultValue: 0,
    placeholder: "50.000",
  },
  {
    name: "dueDate",
    label: "Jatuh Tempo",
    type: "date",
    required: true,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    defaultValue: "UNPAID",
    options: [
      { value: "UNPAID", label: "Belum Bayar" },
      { value: "PARTIALLY_PAID", label: "Parsial" },
      { value: "PAID", label: "Lunas" },
      { value: "OVERDUE", label: "Terlambat" },
    ],
  },
]

export const disbursementCreateFields: FormField[] = [
  loanIdField,
  {
    name: "amount",
    label: "Jumlah Pencairan",
    type: "number",
    required: true,
    min: 1,
    step: "any",
  },
  { name: "bankName", label: "Nama Bank", required: true, placeholder: "BCA" },
  { name: "bankAccountNumber", label: "Nomor Rekening", required: true },
  { name: "bankAccountName", label: "Nama Pemilik Rekening", required: true },
]

export const userCreateFields: FormField[] = [
  { name: "name", label: "Nama", required: true },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "nama@email.com",
  },
  { name: "password", label: "Password", type: "password", required: true },
  {
    name: "role",
    label: "Role",
    type: "select",
    required: true,
    defaultValue: "user",
    options: [
      { value: "user", label: "User" },
      { value: "admin", label: "Admin" },
      { value: "staff", label: "Staff" },
      { value: "finance", label: "Finance" },
    ],
  },
]

/** Edit variant: password is optional; blank means "keep the current one". */
export const userEditFields: FormField[] = userCreateFields.map((field) =>
  field.name === "password"
    ? {
        ...field,
        required: false,
        hint: "Kosongkan untuk tetap memakai password lama.",
      }
    : field,
)
