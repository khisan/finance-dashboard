import { useState } from "react"
import { Card, SearchInput, Skeleton, EmptyState, ErrorState } from "@/components/ui"
import { useAsync } from "@/hooks/useApi"
import { getUserByEmail } from "@/services/userService"
import type { User } from "@/types/user"

export default function UsersPage() {
  const [email, setEmail] = useState("")
  const { data, loading, error, refetch } = useAsync<User>(
    "users",
    () => getUserByEmail(email.trim()),
    false,
  )

  return (
    <Card className="overflow-hidden">
      <div className="px-4 py-3 border-b border-stone-200">
        <h1 className="text-lg font-semibold text-stone-900">Pengguna</h1>
        <p className="text-sm text-stone-500 mt-0.5">
          Cari pengguna berdasarkan email (read-only)
        </p>
      </div>
      <div className="p-4 space-y-3">
        <form
          className="flex flex-col gap-2 sm:flex-row sm:items-center"
          onSubmit={(e) => {
            e.preventDefault()
            setEmail(email.trim())
            refetch()
          }}
        >
          <SearchInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email pengguna"
            className="max-w-[280px]"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-lg bg-stone-800 text-white text-sm font-semibold hover:bg-stone-700 self-start"
          >
            Cari
          </button>
        </form>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-400 border-t-stone-800" />
            Memuat...
          </div>
        )}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {data && !loading && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Nama</span>
              <span className="font-medium text-stone-900">{data.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Email</span>
              <span className="font-medium text-stone-900">{data.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Role</span>
              <span className="font-medium text-stone-900 capitalize">{data.role}</span>
            </div>
          </div>
        )}
        {!loading && !data && !error && (
          <EmptyState title="Pengguna tidak ditemukan" description="Coba email lain." />
        )}
      </div>
    </Card>
  )
}
