/** Fired after any mutation that can create or resolve an approval proposal. */
export const APPROVAL_REFRESH_EVENT = "approval:refresh"

export function notifyApprovalChanged(): void {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(APPROVAL_REFRESH_EVENT))
}
