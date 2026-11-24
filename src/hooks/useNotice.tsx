import { useState } from "react"
import type { ApprovalRequest } from "@/types/approval"

/** Confirmation shown after a mutation is staged instead of applied immediately. */
export function proposalNotice(result: ApprovalRequest): string {
  const reference = result.businessNumber ?? result.id
  return `Proposal ${reference} dikirim. Perubahan diterapkan setelah disetujui finance/admin.`
}

export function useNotice() {
  const [notice, setNotice] = useState<string | null>(null)
  const node = notice ? (
    <p className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
      {notice}
    </p>
  ) : null
  return { notice, setNotice, node }
}
