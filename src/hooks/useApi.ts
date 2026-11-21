import { useCallback, useEffect, useState } from "react"
import type { AxiosError } from "axios"
import { get, getErrorMessage } from "../services/http"

export function useAsync<T>(
  key: string,
  fn: () => Promise<T>,
  immediate = true
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState<string | null>(null)
  const [expired, setExpired] = useState<boolean>(false)

  const run = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fn()
      setData(result)
      setExpired(false)
      return result
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : getErrorMessage(err)
      setError(message)
      setExpired(
        err instanceof Error &&
          (err.message === "401 Unauthorized" || err.message === "403 Forbidden")
      )
      throw err
    } finally {
      setLoading(false)
    }
  }, [key, fn])

  useEffect(() => {
    if (immediate) void run()
    return () => {
      // disconnect abortController if supported
    }
  }, [run, immediate])

  const refetch = useCallback(() => {
    void run()
  }, [run])

  return { data, loading, error, expired, refetch }
}

export function useDebounce<T>(value: T, wait = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), wait)
    return () => clearTimeout(timer)
  }, [value, wait])
  return debounced
}
