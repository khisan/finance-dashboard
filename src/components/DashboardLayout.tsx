import { useState } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import Sidebar from "./Sidebar"
import {
  MenuIcon,
  SearchIcon,
  RefreshIcon,
  LogoutIcon,
  PersonIcon,
  ChevronRightIcon,
} from "./icons"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/loans": "Pinjaman",
  "/customers": "Nasabah",
  "/collaterals": "Agunan",
  "/guarantors": "Penjamin",
  "/invoices": "Faktur",
  "/disbursements": "Pencairan",
  "/users": "Pengguna",
  "/settings": "Pengaturan",
}

const pageSubtitles: Record<string, string> = {
  "/dashboard": "Ringkasan aktivitas kredit & keuangan",
  "/loans": "Data peminjaman nasabah",
  "/customers": "Data nasabah / borrower",
  "/collaterals": "Data agunan (collateral)",
  "/guarantors": "Data penjamin (guarantor)",
  "/invoices": "Data faktur tagihan",
  "/disbursements": "Data pencairan pinjaman",
  "/users": "Data pengguna aplikasi",
  "/settings": "Pengaturan aplikasi",
}

export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const title = pageTitles[location.pathname] ?? "Dashboard"
  const subtitle = pageSubtitles[location.pathname] ?? ""

  return (
    <div className="flex min-h-screen bg-stone-100">
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <aside className="sticky top-0 flex w-60 flex-col border-r border-stone-200 bg-white">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-stone-200 bg-white/80 px-4 sm:px-6 backdrop-blur-md">
          <button
            className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-700 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Buka menu"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <div className="flex-1 text-sm font-medium text-stone-900">
            {title}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50"
              onClick={() => window.location.reload()}
            >
              <RefreshIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button className="flex items-center gap-2 rounded-lg p-1.5 text-stone-500 hover:bg-stone-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <PersonIcon className="h-4 w-4" />
              </div>
              <span className="hidden text-sm text-stone-700 sm:inline">Admin</span>
            </button>

            <button
              className="flex items-center gap-2 rounded-lg p-1.5 text-stone-500 hover:bg-stone-100"
              onClick={() => {
                localStorage.removeItem("user")
                localStorage.removeItem("authToken")
                navigate("/login")
              }}
            >
              <LogoutIcon className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full p-4 sm:p-6 lg:p-8">
          <div className="mb-4">
            <h1 className="text-lg font-semibold text-stone-900">{title}</h1>
            <p className="text-sm text-stone-500">{subtitle}</p>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
