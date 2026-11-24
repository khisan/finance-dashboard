import { useCallback, useState } from "react"
import { DataTable } from "@/components/DataTable"
import { Card, StatusChip } from "@/components/ui"
import { useAsync } from "@/hooks/useApi"
import { formatDateTime } from "@/lib/format"
import { getAuditLogs } from "@/services/auditService"
import type { ApprovalEntityType } from "@/types/approval"
import type { AuditAction, AuditLog } from "@/types/audit"

const ENTITY_LABEL: Record<ApprovalEntityType, string> = {
  CUSTOMER: "Nasabah",
  COLLATERAL: "Agunan",
  LOAN: "Pinjaman",
  GUARANTOR: "Penjamin",
  INVOICE: "Faktur",
  DISBURSEMENT: "Pencairan",
}

const NUMBER_KEYS: Record<ApprovalEntityType, string[]> = {
  CUSTOMER: ["customer_number", "customerNumber"],
  COLLATERAL: ["collateral_number", "collateralNumber"],
  LOAN: ["loan_number", "loanNumber"],
  GUARANTOR: ["guarantor_number", "guarantorNumber"],
  INVOICE: ["invoice_number", "invoiceNumber"],
  DISBURSEMENT: ["disbursement_number", "disbursementNumber"],
}

/** Prefer the human-facing business number over the internal UUID. */
function businessNumber(log: AuditLog): string {
  if (!log.entityType) return "—"
  for (const source of [log.after, log.before]) {
    if (!source) continue
    for (const key of NUMBER_KEYS[log.entityType]) {
      const value = source[key]
      if (value !== null && value !== undefined && value !== "") return String(value)
    }
  }
  return "—"
}

const ACTION_LABEL: Record<AuditAction, string> = {
  SUBMIT: "Proposal dikirim",
  CREATE: "Dibuat",
  UPDATE: "Diubah",
  DELETE: "Dihapus",
  STATUS_CHANGE: "Status diubah",
  APPROVE: "Disetujui",
  REJECT: "Ditolak",
  CANCEL: "Dibatalkan",
}

function Snapshot({
  title,
  values,
}: {
  title: string
  values?: Record<string, unknown>
}) {
  const entries = Object.entries(values ?? {}).sort(([a], [b]) => a.localeCompare(b))
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-stone-800">{title}</h3>
      {entries.length === 0 ? (
        <p className="text-sm text-stone-500">Tidak ada data.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-stone-200">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-stone-100">
              {entries.map(([key, value]) => (
                <tr key={key}>
                  <td className="px-3 py-2 font-medium text-stone-600">{key}</td>
                  <td className="px-3 py-2 text-stone-700">
                    {value === null || value === undefined || value === ""
                      ? "—"
                      : typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function AuditTrailPage() {
  const [entityType, setEntityType] = useState<ApprovalEntityType | "">("")
  const [action, setAction] = useState<AuditAction | "">("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [detail, setDetail] = useState<AuditLog | null>(null)

  const fetchLogs = useCallback(
    () =>
      getAuditLogs({
        entityType: entityType || undefined,
        action: action || undefined,
        from: from ? new Date(from).toISOString() : undefined,
        to: to ? new Date(to).toISOString() : undefined,
      }),
    [entityType, action, from, to],
  )
  const { data, loading, error, refetch } = useAsync<AuditLog[]>("audit-trail", fetchLogs)

  const columns = [
    {
      key: "occurredAt",
      header: "Waktu",
      render: (r: AuditLog) => formatDateTime(r.occurredAt),
    },
    {
      key: "actorEmail",
      header: "Actor",
      render: (r: AuditLog) => (
        <div className="text-xs">
          <span className="font-medium text-stone-700">{r.actorEmail ?? "system"}</span>
          {r.actorRole ? (
            <span className="ml-1 rounded bg-stone-100 px-1 py-0.5 text-[10px] text-stone-500">
              {r.actorRole}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      key: "action",
      header: "Aksi",
      render: (r: AuditLog) => (
        <StatusChip status={ACTION_LABEL[r.action] ?? r.action} />
      ),
    },
    {
      key: "entityType",
      header: "Data",
      render: (r: AuditLog) =>
        r.entityType ? (ENTITY_LABEL[r.entityType] ?? r.entityType) : "—",
    },
    {
      key: "entityId",
      header: "No. Bisnis",
      render: (r: AuditLog) => (
        <span className="font-mono text-xs text-stone-700">{businessNumber(r)}</span>
      ),
    },
    {
      key: "description",
      header: "Keterangan",
      render: (r: AuditLog) => (
        <span className="block max-w-[220px] truncate" title={r.description ?? ""}>
          {r.selfApprovalOverride ? "⚠ Override: " : ""}
          {r.description ?? "—"}
        </span>
      ),
    },
  ]

  return (
    <>
      <Card className="mb-4 p-3">
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs font-semibold text-stone-600">
            Jenis data
            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value as ApprovalEntityType | "")}
              className="mt-1 block rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800"
            >
              <option value="">Semua</option>
              {(Object.keys(ENTITY_LABEL) as ApprovalEntityType[]).map((key) => (
                <option key={key} value={key}>
                  {ENTITY_LABEL[key]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-stone-600">
            Aksi
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as AuditAction | "")}
              className="mt-1 block rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800"
            >
              <option value="">Semua</option>
              {(Object.keys(ACTION_LABEL) as AuditAction[]).map((key) => (
                <option key={key} value={key}>
                  {ACTION_LABEL[key]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-stone-600">
            Dari
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1 block rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800"
            />
          </label>
          <label className="text-xs font-semibold text-stone-600">
            Sampai
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 block rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800"
            />
          </label>
        </div>
      </Card>

      <DataTable<AuditLog>
        columns={columns}
        rows={data ?? []}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchKeys={["actorEmail", "actorRole", "description", "entityType"]}
        pageSize={12}
        emptyMessage="Belum ada aktivitas yang tercatat."
        title="Audit Trail"
        subtitle="Catatan siapa membuat, mengubah, dan menyetujui setiap perubahan"
        rowActions={(r) => (
          <button
            type="button"
            onClick={() => setDetail(r)}
            className="rounded-lg border border-stone-200 px-2 py-1 text-xs font-semibold text-stone-600 hover:bg-stone-50"
          >
            Detail
          </button>
        )}
      />

      {detail ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/40">
          <div className="h-full w-full max-w-2xl overflow-y-auto bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-stone-900">Detail Aktivitas</h2>
                <p className="text-sm text-stone-500">
                  {ACTION_LABEL[detail.action] ?? detail.action} · {formatDateTime(detail.occurredAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="rounded-lg p-1 text-stone-400 hover:bg-stone-100"
                aria-label="Tutup detail"
              >
                ✕
              </button>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-stone-400">Actor</dt>
                <dd>{detail.actorEmail ?? "system"}</dd>
              </div>
              <div>
                <dt className="text-xs text-stone-400">Role</dt>
                <dd>{detail.actorRole ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-stone-400">Entity</dt>
                <dd>{detail.entityType ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-stone-400">Request ID</dt>
                <dd className="font-mono text-xs">{detail.changeRequestId ?? "—"}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs text-stone-400">Keterangan</dt>
                <dd>{detail.description ?? "—"}</dd>
              </div>
            </dl>
            <div className="mt-5 space-y-5">
              <Snapshot title="Sebelum" values={detail.before} />
              <Snapshot title="Sesudah" values={detail.after} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
