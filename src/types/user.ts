export interface User {
  id?: string
  name: string
  email: string
  role: "user" | "admin" | "staff" | "finance"
  createdAt?: string
  updatedAt?: string
}
