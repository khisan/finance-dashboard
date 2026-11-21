import type { UserRole } from "./enums"

export interface Customer {
  id: string
  fullName: string
  identityNumber: string
  email: string
  phoneNumber: string
  address: string
  createdAt?: string
  updatedAt?: string
}

export interface CustomerListItem {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  address: string
}

export interface CustomerForm extends Partial<Customer> {
  fullName: string
  identityNumber: string
  email: string
  phoneNumber: string
  address: string
}
