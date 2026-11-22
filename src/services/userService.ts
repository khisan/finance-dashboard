import { apiGet, apiPost, apiPut } from "./http"
import type { User } from "@/types/user"

export interface UserCreateInput {
  name: string
  email: string
  password: string
  role: string
}

/** GET /api/users — daftar semua pengguna. */
export async function getUsers(): Promise<User[]> {
  return apiGet<User[]>("/users")
}

/** GET /api/users/email/{email} — dipakai halaman cari & detail user. */
export async function getUserByEmail(email: string): Promise<User> {
  return apiGet<User>(`/users/email/${encodeURIComponent(email)}`)
}

export async function createUser(body: UserCreateInput): Promise<User> {
  return apiPost<User>("/users", body)
}

/** PUT /api/users/{id} — password boleh kosong (kunci lama tetap dipakai). */
export async function updateUser(
  id: string,
  body: Partial<UserCreateInput>,
): Promise<User> {
  return apiPut<User>(`/users/${encodeURIComponent(id)}`, body)
}
