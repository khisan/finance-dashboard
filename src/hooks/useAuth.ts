import { useContext } from "react"
import { AuthContext } from "@/context/AuthContext"

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

/** Finance is a read-only approver: no create/update/delete on business data. */
export const useCanWrite = (): boolean => {
  const { user } = useAuth()
  return Boolean(user) && user?.role !== "finance"
}
