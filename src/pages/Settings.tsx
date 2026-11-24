import { Card } from "@/components/ui"
import { useContext } from "react"
import { AuthContext } from "@/context/AuthContext"

export default function SettingsPage() {
  const { user, token, isLoading, logout } = useContext(AuthContext)

  return (
    <Card className="overflow-hidden">
      <div className="px-4 py-3 border-b border-stone-200">
        <h1 className="text-lg font-semibold text-stone-900">Pengaturan</h1>
        <p className="text-sm text-stone-500 mt-0.5">
          Profil pengguna &amp; konfigurasi aplikasi (read-only)
        </p>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <span className="text-sm font-medium text-stone-600">Status login</span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isLoading
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : token
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-stone-100 text-stone-500 border border-stone-200"
            }`}
          >
            {isLoading ? "Memeriksa..." : token ? "Login" : "Logout"}
          </span>
        </div>
        {user ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Nama</span>
              <span className="font-medium text-stone-900">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Email</span>
              <span className="font-medium text-stone-900">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Role</span>
              <span className="font-medium text-stone-900 capitalize">{user.role}</span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-stone-500">Belum login.</div>
        )}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <span className="text-sm font-medium text-stone-600">API base URL</span>
          <span className="font-mono text-xs text-stone-700">
            {import.meta.env.VITE_API_BASE_URL ??
              "http://localhost:8080/api"}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <span className="text-sm font-medium text-stone-600">Token auth</span>
          <span
            className={`text-xs font-mono ${token ? "text-emerald-700" : "text-stone-500"}`}
          >
            {token ? "Terpasang" : "Tidak ada"}
          </span>
        </div>
        {user && (
          <button
            type="button"
            onClick={logout}
            className="cursor-pointer w-full px-4 py-2 rounded-lg bg-red-50 text-red-600 font-semibold text-sm border border-red-200 hover:bg-red-100 transition"
          >
            Keluar
          </button>
        )}
      </div>
    </Card>
  )
}
