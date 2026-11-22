import { apiGet, apiPost } from "./http"
import type { Customer, CustomerListItem, CustomerForm } from "@/types/customer"

const nameCache = new Map<string, string>()

export async function getCustomers(): Promise<CustomerListItem[]> {
  return apiGet<CustomerListItem[]>("/customers")
}

/** GET /api/customers/{id} — dipakai untuk melengkapi nama di tabel pinjaman. */
export async function getCustomerById(id: string): Promise<Customer | null> {
  try {
    const customer = await apiGet<Customer>(`/customers/${encodeURIComponent(id)}`)
    if (customer?.fullName) nameCache.set(id, customer.fullName)
    return customer
  } catch {
    return null
  }
}

/**
 * Backend LoanResponse hanya mengembalikan customerId (bukan customerName).
 * Ambil nama dari endpoint customer sekali per ID, lalu cache supaya tidak
 * membanjiri API saat tabel di-refresh.
 */
export async function getCustomerNames(ids: string[]): Promise<Record<string, string>> {
  const unique = [...new Set(ids.filter(Boolean))]
  const missing = unique.filter((id) => !nameCache.has(id))
  await Promise.all(
    missing.map(async (id) => {
      try {
        const customer = await apiGet<Customer>(`/customers/${encodeURIComponent(id)}`)
        if (customer?.fullName) nameCache.set(id, customer.fullName)
      } catch {
        // Fallback ke ID di bawah — satu customer gagal tidak menggagalkan tabel.
      }
    }),
  )
  return Object.fromEntries(unique.map((id) => [id, nameCache.get(id) ?? id]))
}

export async function createCustomer(body: CustomerForm): Promise<Customer> {
  return apiPost<Customer>("/customers", body)
}
