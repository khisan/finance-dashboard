import { apiGet } from "./http"
import type { User } from "@/types/user"

/** Users page: GET /api/users/email/{email} (hanya resource read-only yang tersedia). */
export async function getUserByEmail(email: string): Promise<User> {
  return apiGet<User>(`/users/email/${encodeURIComponent(email)}`)
}
