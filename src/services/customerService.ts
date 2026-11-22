import { apiGet, apiPost, apiPut } from "./http"
import type { Customer, CustomerListItem, CustomerForm } from "@/types/customer"

export async function getCustomers(): Promise<CustomerListItem[]> {
  return apiGet<CustomerListItem[]>("/customers")
}

/** GET /api/customers/{id} — dipakai halaman detail dan loan detail. */
export async function getCustomerById(id: string): Promise<Customer | null> {
  try {
    return await apiGet<Customer>(`/customers/${encodeURIComponent(id)}`)
  } catch {
    return null
  }
}

export async function createCustomer(body: CustomerForm): Promise<Customer> {
  return apiPost<Customer>("/customers", body)
}

/** PUT /api/customers/{id}. Catatan: backend mengabaikan identityNumber saat update. */
export async function updateCustomer(id: string, body: CustomerForm): Promise<Customer> {
  return apiPut<Customer>(`/customers/${encodeURIComponent(id)}`, body)
}
