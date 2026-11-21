import type { AxiosError, AxiosResponse } from "axios"
import api from "./api"

export type ApiPayload<T> = {
  success: boolean
  message: string
  data: T
}

/** Unwrap the backend envelope. Throws with the backend message on 401/403. */
export async function unwrap<T>(response: AxiosResponse<ApiPayload<T>>): Promise<T> {
  const payload = response.data as ApiPayload<T>
  if (payload.success === false) {
    const message = payload.message ?? "Request failed"
    const status = response.status ?? 0
    throw Object.assign(new Error(message), { status })
  }
  return payload.data
}

/** GET wrapper — the only data path used by the read-only dashboard. */
export async function apiGet<T>(path: string): Promise<T> {
  const response = await api.get<ApiPayload<T>>(path)
  return unwrap<T>(response)
}

/** Normalize axios/network errors into a short user-facing message. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError & {
      response?: { status?: number; data?: { message?: string } }
    }
    if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
      return "Session expired. Please log in again."
    }
    if (axiosError.response?.status >= 500) {
      return "Server error. Please try again later."
    }
    return axiosError.response?.data?.message ?? "Request failed"
  }
  if (error && typeof error === "object" && "request" in error) {
    return "No response from server. Check your connection."
  }
  return "Something went wrong"
}
