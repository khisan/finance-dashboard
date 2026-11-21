import { apiGet } from "./http"
import type { Customer, CustomerListItem } from "@/types/customer"

export async function getCustomers(): Promise<CustomerListItem[]> {
  return apiGet<CustomerListItem[]>("/customers")
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const list = await apiGet<Customer[]>("/customers")
  return list.find((c) => c.id === id) ?? null
}
