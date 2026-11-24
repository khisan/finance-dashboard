import { apiGet, apiPost, apiPut } from "./http"
import type { Customer, CustomerListItem, CustomerForm } from "@/types/customer"
import type { ApprovalRequest } from "@/types/approval"

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

/** Mutation endpoints now stage a proposal; data changes after approval. */
export async function createCustomer(body: CustomerForm): Promise<ApprovalRequest> {
  return apiPost<ApprovalRequest>("/customers", body)
}

export async function updateCustomer(id: string, body: CustomerForm): Promise<ApprovalRequest> {
  return apiPut<ApprovalRequest>(`/customers/${encodeURIComponent(id)}`, body)
}
