import { useCallback, useEffect } from "react"
import { useAsync } from "@/hooks/useApi"
import { APPROVAL_REFRESH_EVENT } from "@/lib/approvalEvents"
import { getApprovals } from "@/services/approvalService"

/**
 * Number of proposals waiting for a decision, used as the sidebar badge.
 * Mutations refresh it through approvalEvents; the interval catches proposals
 * submitted from other sessions.
 */
export function usePendingApprovalCount(enabled: boolean): number {
  const fetchCount = useCallback(async () => {
    const approvals = await getApprovals({ status: "PENDING" })
    return approvals.length
  }, [])

  const { data, refetch } = useAsync<number>(
    "pending-approval-count",
    fetchCount,
    enabled,
  )

  useEffect(() => {
    if (!enabled) return
    const refresh = () => refetch()
    window.addEventListener("focus", refresh)
    window.addEventListener(APPROVAL_REFRESH_EVENT, refresh)
    const interval = window.setInterval(refresh, 15_000)
    return () => {
      window.removeEventListener("focus", refresh)
      window.removeEventListener(APPROVAL_REFRESH_EVENT, refresh)
      window.clearInterval(interval)
    }
  }, [enabled, refetch])

  return data ?? 0
}
