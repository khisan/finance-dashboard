import { apiGet, apiPost } from "./http"
import type { User } from "@/types/user"

export interface UserCreateInput {
  name: string
  email: string
  password: string
  role: string
}

/** Users page: GET /api/users/email/{email} (hanya resource read-only yang tersedia). */
export async function getUserByEmail(email: string): Promise<User> {
  return apiGet<User>(`/users/email/${encodeURIComponent(email)}`)
}

export async function createUser(body: UserCreateInput): Promise<User> {
  return apiPost<User>("/users", body)
}
