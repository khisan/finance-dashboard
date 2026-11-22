import type { FormField } from "@/components/CreateModal"

function toDateTimeLocal(value: unknown): string {
  if (value == null || value === "") return ""
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 16)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** Map an API record into the string values used by CreateModal in edit mode. */
export function toFormValues(
  fields: FormField[],
  record: object | null | undefined,
): Record<string, string> {
  const source = record as Record<string, unknown> | null | undefined
  const values: Record<string, string> = {}
  for (const field of fields) {
    // Never prefill passwords — backend doesn't return them, and a blank value
    // keeps the create modal honest about what will be sent.
    if (field.type === "password") {
      values[field.name] = ""
      continue
    }
    const raw = source?.[field.name]
    if (raw == null) {
      values[field.name] = field.defaultValue == null ? "" : String(field.defaultValue)
    } else if (field.type === "date") {
      values[field.name] = String(raw).slice(0, 10)
    } else if (field.type === "datetime-local") {
      values[field.name] = toDateTimeLocal(raw)
    } else {
      values[field.name] = String(raw)
    }
  }
  return values
}
