import { useEffect, useMemo, useRef, useState } from "react"
import { Loader2, X } from "lucide-react"
import { getErrorMessage } from "@/services/http"
import { formatNumberInput, parseNumberInput } from "@/lib/numberFormat"

export interface SelectOption {
  value: string
  label: string
}

export type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "date"
  | "datetime-local"
  | "select"
  | "textarea"

export interface FormField {
  name: string
  label: string
  type?: FieldType
  required?: boolean
  placeholder?: string
  hint?: string
  defaultValue?: string | number
  min?: string | number
  max?: string | number
  step?: string | number
  options?: SelectOption[] | (() => Promise<SelectOption[]>)
  /** Full-width field (textarea, long addresses, ...). */
  wide?: boolean
}

export interface CreateModalProps<T, P> {
  title: string
  subtitle?: string
  fields: FormField[]
  onClose: () => void
  onSubmit: (payload: P) => Promise<T>
  onSuccess?: (result: T) => void
  /** Isi awal untuk mode edit ( meng-override defaultValue ). */
  initialValues?: Record<string, string | number | null | undefined>
  submitLabel?: string
}

const inputClass =
  "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 disabled:bg-stone-50 disabled:text-stone-400"

/** Convert raw form strings into the JSON shape expected by the backend. */
function toPayload(fields: FormField[], values: Record<string, string>): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  for (const field of fields) {
    const raw = values[field.name] ?? ""
    const value = raw.trim()
    if (!value && !field.required) continue
    if (field.type === "number") {
      const num = parseNumberInput(value)
      payload[field.name] = num ?? value
    } else if (field.type === "date" || field.type === "datetime-local") {
      const parsed = new Date(value)
      payload[field.name] = Number.isNaN(parsed.getTime()) ? value : parsed.toISOString()
    } else {
      payload[field.name] = value
    }
  }
  return payload
}

/**
 * Generic create dialog. Field definitions are declarative so every resource
 * page can reuse the same UX while sending its own backend DTO.
 */
export function CreateModal<T, P = Record<string, unknown>>({
  title,
  subtitle,
  fields,
  onClose,
  onSubmit,
  onSuccess,
  initialValues,
  submitLabel = "Simpan",
}: CreateModalProps<T, P>) {
  const initial = useMemo(() => {
    const values: Record<string, string> = {}
    for (const field of fields) {
      const fromRecord = initialValues?.[field.name]
      const raw = fromRecord !== undefined ? fromRecord : field.defaultValue
      const text = raw == null ? "" : String(raw)
      values[field.name] = field.type === "number" ? formatNumberInput(text) : text
    }
    return values
  }, [fields, initialValues])

  const [values, setValues] = useState<Record<string, string>>(initial)
  const [options, setOptions] = useState<Record<string, SelectOption[]>>({})
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const firstInput = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>(null)

  useEffect(() => {
    let alive = true
    const asyncFields = fields.filter((f) => typeof f.options === "function")
    if (asyncFields.length === 0) return

    setLoadingOptions(true)
    void Promise.all(
      asyncFields.map(async (field) => {
        try {
          const provider = field.options as () => Promise<SelectOption[]>
          const list = await provider()
          return [field.name, list] as const
        } catch (err) {
          setError(`Gagal memuat daftar ${field.label}: ${getErrorMessage(err)}`)
          return [field.name, [] as SelectOption[]] as const
        }
      }),
    ).then((entries) => {
      if (!alive) return
      setOptions(Object.fromEntries(entries))
      setLoadingOptions(false)
    })
    return () => {
      alive = false
    }
  }, [fields])

  useEffect(() => {
    firstInput.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, submitting])

  const setValue = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    if (error) setError(null)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const missing = fields.filter((f) => f.required && !String(values[f.name] ?? "").trim())
    if (missing.length > 0) {
      setError(`Lengkapi: ${missing.map((f) => f.label).join(", ")}`)
      return
    }
    const invalid = fields.find((f) => {
      if (f.type !== "number") return false
      const raw = String(values[f.name] ?? "").trim()
      if (!raw) return false
      const num = parseNumberInput(raw)
      if (num === null) return true
      if (f.min !== undefined && num < Number(f.min)) return true
      if (f.max !== undefined && num > Number(f.max)) return true
      return false
    })
    if (invalid) {
      const range = [
        invalid.min !== undefined ? `minimal ${invalid.min}` : "",
        invalid.max !== undefined ? `maksimal ${invalid.max}` : "",
      ].filter(Boolean).join(", ")
      setError(`${invalid.label} tidak valid${range ? ` (${range})` : ""}`)
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const result = await onSubmit(toPayload(fields, values) as P)
      onSuccess?.(result)
      onClose()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-stone-900/40 p-4 py-10"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-2xl rounded-2xl border border-stone-200 bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-stone-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
            {subtitle ? <p className="mt-0.5 text-sm text-stone-500">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Tutup"
            className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} noValidate>
          <div className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2">
            {fields.map((field, index) => {
              const id = `create-${field.name}`
              const common = {
                id,
                name: field.name,
                required: field.required,
                disabled: submitting || (loadingOptions && typeof field.options === "function"),
                value: values[field.name] ?? "",
                onChange: (
                  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
                ) => {
                  const target = e.target
                  if (field.type !== "number") {
                    setValue(field.name, target.value)
                    return
                  }
                  const caret =
                    field.type === "number"
                      ? (target as HTMLInputElement).selectionStart ?? target.value.length
                      : target.value.length
                  const atEnd = caret >= target.value.length
                  const digitsBefore = target.value.slice(0, caret).replace(/\D/g, "").length
                  const formatted = formatNumberInput(target.value)
                  setValue(field.name, formatted)
                  window.requestAnimationFrame(() => {
                    const input = document.getElementById(id) as HTMLInputElement | null
                    if (!input) return
                    let pos = formatted.length
                    if (!atEnd) {
                      let seen = 0
                      pos = 0
                      while (pos < formatted.length && seen < digitsBefore) {
                        if (/\d/.test(formatted[pos])) seen += 1
                        pos += 1
                      }
                    }
                    input.setSelectionRange(pos, pos)
                  })
                },
                placeholder: field.placeholder,
                className: inputClass,
              }
              const ref = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null) => {
                if (index === 0) firstInput.current = el
              }
              const label = (
                <label htmlFor={common.id} className="block text-xs font-semibold text-stone-600">
                  {field.label}
                  {field.required ? <span className="ml-0.5 text-red-500">*</span> : null}
                </label>
              )

              return (
                <div key={field.name} className={field.wide ? "sm:col-span-2" : ""}>
                  {label}
                  <div className="mt-1.5">
                    {field.type === "select" ? (
                      <select ref={ref} {...common}>
                        <option value="">
                          {loadingOptions && typeof field.options === "function"
                            ? "Memuat..."
                            : "— Pilih —"}
                        </option>
                        {(typeof field.options === "function"
                          ? options[field.name] ?? []
                          : field.options ?? []
                        ).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea ref={ref} {...common} rows={3} />
                    ) : (
                      <input
                        ref={ref}
                        {...common}
                        type={field.type === "number" ? "text" : field.type ?? "text"}
                        inputMode={field.type === "number" ? "decimal" : undefined}
                        min={field.type === "number" ? undefined : field.min}
                        max={field.type === "number" ? undefined : field.max}
                        step={field.type === "number" ? undefined : field.step}
                      />
                    )}
                  </div>
                  {field.hint ? <p className="mt-1 text-xs text-stone-400">{field.hint}</p> : null}
                </div>
              )
            })}
          </div>

          {error ? (
            <p className="mx-5 mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-2 border-t border-stone-200 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting || loadingOptions}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {submitting ? "Menyimpan..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
