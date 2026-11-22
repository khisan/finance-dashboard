/**
 * Number-field helpers for the create/edit modal.
 *
 * Display format  : Indonesian (1.000,5)
 * Payload format  : number (1000.5)
 *
 * A trailing dot is treated as a decimal separator, and a dot followed by
 * 1–2 digits at the end (8.5) is also treated as decimal. Otherwise dots are
 * thousands separators, so 1.000 stays 1000.
 */
function normalize(raw: string): string {
  let value = raw.replace(/[^\d.,]/g, "")
  if (!value) return ""

  const hasComma = value.includes(",")
  const lastDot = value.lastIndexOf(".")
  const decimalLength = value.length - lastDot - 1

  if (!hasComma && lastDot >= 0 && decimalLength >= 1 && decimalLength <= 2) {
    value = `${value.slice(0, lastDot).replace(/\./g, "")},${value.slice(lastDot + 1)}`
  } else {
    value = value.replace(/\./g, "")
  }

  value = value.replace(/,/g, ".").replace(/^0+(?=\d)/, "")
  const firstDot = value.indexOf(".")
  if (firstDot >= 0) {
    value = value.slice(0, firstDot + 1) + value.slice(firstDot + 1).replace(/\./g, "")
  }
  return value
}

/** Parse a formatted display value into a finite number, or null when empty. */
export function parseNumberInput(raw: string | number | null | undefined): number | null {
  if (raw == null) return null
  const value = normalize(String(raw))
  if (!value || value === ".") return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

/** Format a raw value for display, e.g. 1000 -> "1.000", 1000.5 -> "1.000,5". */
export function formatNumberInput(raw: string | number | null | undefined): string {
  if (raw == null) return ""
  const source = String(raw)
  if (!source.trim()) return ""

  const trailingSeparator = /[.,]$/.test(source.trim())
  const value = normalize(source)
  if (!value || value === ".") return trailingSeparator ? "," : ""

  const [integer, decimal] = value.split(".")
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  const formatted = decimal !== undefined ? `${grouped},${decimal}` : grouped
  return trailingSeparator && decimal === undefined ? `${formatted},` : formatted
}
