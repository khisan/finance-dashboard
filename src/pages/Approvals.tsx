import { useCallback, useState } from "react"
import { DataTable } from "@/components/DataTable"
import { Button, Card, StatusChip } from "@/components/ui"
import { useAsync } from "@/hooks/useApi"
import { useAuth } from "@/hooks/useAuth"
import { ENTITY_LABEL } from "@/lib/auditLabels"
import { formatDateTime } from "@/lib/format"
import {
  approveApproval,
  cancelApproval,
  getApprovals,
  rejectApproval,
} from "@/services/approvalService"
import { getErrorMessage } from "@/services/http"
import type {
  ApprovalEntityType,
  ApprovalOperation,
  ApprovalRequest,
  ApprovalStatus,
} from "@/types/approval"

const OPERATION_LABEL: Record<ApprovalOperation, string> = {
  CREATE: "Tambah",
  UPDATE: "Ubah",
  DELETE: "Hapus",
  STATUS_CHANGE: "Status",
}

const HIDDEN_DIFF_KEYS = new Set([
  "created_at",
  "updated_at",
  "deleted_at",
  "created_by",
  "updated_by",
  "approved_by",
  "id",
])

function displayValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—"
  if ((key.endsWith("_at") || key.endsWith("At") || key.endsWith("_date")) && typeof value === "string") {
    return formatDateTime(value)
  }
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

function DiffView({
  before,
  after,
}: {
  before?: Record<string, unknown>
  after?: Record<string, unknown>
}) {
  const keys = Array.from(
    new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]),
  )
    .filter((key) => !HIDDEN_DIFF_KEYS.has(key))
    .sort()

  if (keys.length === 0) {
    return <p className="text-sm text-stone-500">Tidak ada field yang bisa ditampilkan.</p>
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-stone-50 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
            <th className="px-3 py-2">Field</th>
            <th className="px-3 py-2">Sebelum</th>
            <th className="px-3 py-2">Sesudah</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {keys.map((key) => {
            const beforeText = displayValue(key, before?.[key])
            const afterText = displayValue(key, after?.[key])
            const changed = beforeText !== afterText
            return (
              <tr key={key} className={changed ? "bg-amber-50/60" : undefined}>
                <td className="px-3 py-2 font-medium text-stone-700">{key}</td>
                <td className="px-3 py-2 text-stone-500">{beforeText}</td>
                <td className={`px-3 py-2 ${changed ? "font-semibold text-amber-800" : "text-stone-600"}`}>
                  {afterText}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function ApprovalsPage() {
  const { user } = useAuth()
  const canDecide = user?.role === "admin" || user?.role === "finance"
  const [status, setStatus] = useState<ApprovalStatus | "">("PENDING")
  const [entityType, setEntityType] = useState<ApprovalEntityType | "">("")
  const [detail, setDetail] = useState<ApprovalRequest | null>(null)
  const [decision, setDecision] = useState<{
    id: string
    kind: "approve" | "reject"
  } | null>(null)
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const fetchApprovals = useCallback(
    () => getApprovals({
      status: status || undefined,
      entityType: entityType || undefined,
    }),
    [status, entityType],
  )
  const { data, loading, error, refetch } = useAsync<ApprovalRequest[]>(
    "approvals",
    fetchApprovals,
  )

  const openDecision = (item: ApprovalRequest, kind: "approve" | "reject") => {
    setDecision({ id: item.id, kind })
    setNote("")
    setActionError(null)
    setNotice(null)
  }

  const submitDecision = async () => {
    if (!decision) return
    if (decision.kind === "reject" && !note.trim()) {
      setActionError("Alasan penolakan wajib diisi.")
      return
    }
    setBusy(true)
    setActionError(null)
    try {
      if (decision.kind === "approve") {
        await approveApproval(decision.id, note.trim() || undefined)
        setNotice("Proposal disetujui dan perubahan diterapkan.")
      } else {
        await rejectApproval(decision.id, note.trim())
        setNotice("Proposal ditolak.")
      }
      setDecision(null)
      setDetail(null)
      refetch()
    } catch (err) {
      setActionError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const cancel = async (item: ApprovalRequest) => {
    setBusy(true)
    setActionError(null)
    try {
      await cancelApproval(item.id)
      setNotice("Proposal dibatalkan.")
      setDetail(null)
      refetch()
    } catch (err) {
      setActionError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const columns = [
    {
      key: "businessNumber",
      header: "No. Bisnis",
      render: (r: ApprovalRequest) => (
        <span className="font-mono text-xs text-stone-700">
          {r.businessNumber ?? "—"}
        </span>
      ),
    },
    {
      key: "entityType",
      header: "Data",
      render: (r: ApprovalRequest) => `${ENTITY_LABEL[r.entityType] ?? r.entityType} / ${OPERATION_LABEL[r.operation] ?? r.operation}`,
    },
    {
      key: "targetStatus",
      header: "Target Status",
      render: (r: ApprovalRequest) => r.targetStatus ?? "—",
    },
    {
      key: "status",
      header: "Status",
      render: (r: ApprovalRequest) => <StatusChip status={r.status} />,
    },
    {
      key: "requestedByEmail",
      header: "Peminta",
      render: (r: ApprovalRequest) => r.requestedByEmail ?? "—",
    },
    {
      key: "requestedAt",
      header: "Waktu",
      render: (r: ApprovalRequest) => formatDateTime(r.requestedAt),
    },
    {
      key: "decisionNote",
      header: "Catatan",
      render: (r: ApprovalRequest) => (
        <span className="max-w-[200px] block truncate" title={r.decisionNote ?? ""}>
          {r.selfApprovalOverride ? "Override: " : ""}
          {r.decisionNote ?? r.reason ?? "—"}
        </span>
      ),
    },
  ]

  return (
    <>
      {notice ? (
        <p className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {notice}
        </p>
      ) : null}
      {actionError ? (
        <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {actionError}
        </p>
      ) : null}

      <Card className="mb-4 p-3">
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs font-semibold text-stone-600">
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ApprovalStatus | "")}
              className="mt-1 block rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800"
            >
              <option value="PENDING">Menunggu</option>
              <option value="APPROVED">Disetujui</option>
              <option value="REJECTED">Ditolak</option>
              <option value="CANCELLED">Dibatalkan</option>
              <option value="">Semua</option>
            </select>
          </label>
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
        </div>
      </Card>

      <DataTable<ApprovalRequest>
        columns={columns}
        rows={data ?? []}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchKeys={["businessNumber", "requestedByEmail", "entityType", "operation"]}
        pageSize={10}
        emptyMessage="Tidak ada proposal sesuai filter."
        title="Persetujuan"
        subtitle="Perubahan data & status menunggu keputusan finance/admin"
        rowActions={(r) => (
          <>
            <button
              type="button"
              onClick={() => setDetail(r)}
              className="cursor-pointer rounded-lg border border-stone-200 px-2 py-1 text-xs font-semibold text-stone-600 hover:bg-stone-50"
            >
              Detail
            </button>
            {canDecide && r.status === "PENDING" ? (
              <>
                <button
                  type="button"
                  onClick={() => openDecision(r, "approve")}
                  className="cursor-pointer rounded-lg bg-emerald-600 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Setujui
                </button>
                <button
                  type="button"
                  onClick={() => openDecision(r, "reject")}
                  className="cursor-pointer rounded-lg bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700"
                >
                  Tolak
                </button>
              </>
            ) : null}
            {r.status === "PENDING" &&
            (user?.role === "admin" || user?.id === r.requestedById) ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => void cancel(r)}
                className="cursor-pointer rounded-lg border border-stone-200 px-2 py-1 text-xs font-semibold text-stone-600 hover:bg-stone-50 disabled:opacity-50"
              >
                Batalkan
              </button>
            ) : null}
          </>
        )}
      />

      {decision ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4">
          <Card className="w-full max-w-md p-5">
            <h2 className="text-lg font-semibold text-stone-900">
              {decision.kind === "approve" ? "Setujui proposal" : "Tolak proposal"}
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              {decision.kind === "reject"
                ? "Alasan penolakan wajib diisi dan akan tercatat di audit trail."
                : "Catatan opsional. Wajib diisi jika admin menyetujui proposalnya sendiri."}
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="mt-3 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800"
              placeholder={decision.kind === "reject" ? "Alasan penolakan..." : "Catatan (opsional)"}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDecision(null)}
                disabled={busy}
                className="cursor-pointer rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-600 disabled:opacity-50"
              >
                Batal
              </button>
              <Button onClick={() => void submitDecision()} disabled={busy}>
                {busy ? "Memproses..." : decision.kind === "approve" ? "Setujui" : "Tolak"}
              </Button>
            </div>
          </Card>
        </div>
      ) : null}

      {detail ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/40">
          <div className="h-full w-full max-w-2xl overflow-y-auto bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-stone-900">Detail Proposal</h2>
                <p className="text-sm text-stone-500">
                  {detail.businessNumber ?? detail.id} · {ENTITY_LABEL[detail.entityType]} · {OPERATION_LABEL[detail.operation]}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="cursor-pointer rounded-lg p-1 text-stone-400 hover:bg-stone-100"
                aria-label="Tutup detail"
              >
                ✕
              </button>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs text-stone-400">Status</dt><dd><StatusChip status={detail.status} /></dd></div>
              <div><dt className="text-xs text-stone-400">Diajukan</dt><dd>{formatDateTime(detail.requestedAt)}</dd></div>
              <div><dt className="text-xs text-stone-400">Peminta</dt><dd>{detail.requestedByEmail ?? "—"}</dd></div>
              <div><dt className="text-xs text-stone-400">Target status</dt><dd>{detail.targetStatus ?? "—"}</dd></div>
              <div className="col-span-2"><dt className="text-xs text-stone-400">Alasan</dt><dd>{detail.reason ?? "—"}</dd></div>
              {detail.decisionNote ? (
                <div className="col-span-2">
                  <dt className="text-xs text-stone-400">Catatan keputusan</dt>
                  <dd>{detail.decisionNote}</dd>
                </div>
              ) : null}
            </dl>
            <h3 className="mt-5 mb-2 text-sm font-semibold text-stone-800">Perubahan nilai</h3>
            <DiffView before={detail.before} after={detail.payload} />
          </div>
        </div>
      ) : null}
    </>
  )
}
