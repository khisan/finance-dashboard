import type { ReactNode } from "react"
import type { DetailField } from "@/components/DetailView"
import { formatDate, formatIDR } from "@/lib/format"
import type { CollateralType } from "@/types/enums"

/** Small display helpers shared by the generic and the loan detail pages. */
export const str = (value: unknown): string =>
  value == null || value === "" ? "—" : String(value)

export const money = (value: unknown): ReactNode =>
  typeof value === "number" || typeof value === "string"
    ? formatIDR(value as number | string)
    : "—"

export const date = (value: unknown): ReactNode => formatDate(value as string | null)

export const f = (label: string, value: ReactNode, wide = false): DetailField => ({
  label,
  value,
  wide,
})

export const TYPE_LABEL: Record<CollateralType, string> = {
  REAL_ESTATE: "Tanah/Bangunan",
  VEHICLE: "Kendaraan",
  DEPOSIT: "Deposit",
  GOLD: "Emas",
  OTHER: "Lainnya",
}
