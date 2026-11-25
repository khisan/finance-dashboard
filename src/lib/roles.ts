import type { User } from "@/types/user"

/** Roles allowed to decide on staged approval requests. */
export const APPROVER_ROLES = ["admin", "finance"] as const satisfies readonly User["role"][]

export function isApprover(role: User["role"] | null | undefined): boolean {
  return role === "admin" || role === "finance"
}

/** Finance is a read-only approver, so approvals become its entry point. */
export function isFinance(role: User["role"] | null | undefined): boolean {
  return role === "finance"
}
