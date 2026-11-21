import { NavLink } from "react-router-dom"
import {
  DashboardIcon,
  LoansIcon,
  CollateralIcon,
  GuarantorIcon,
  InvoicesIcon,
  DisbursementsIcon,
  UsersIcon,
  SettingsIcon,
  MenuIcon,
  PersonIcon,
  ChevronRightIcon,
} from "./icons"

// Menu berdasarkan resource controller loan-system:
// Dashboard, Customers, Users, Loans, Collaterals, Guarantors, Invoices, Disbursements, Settings
const navGroups = [
  {
    label: "Ringkasan",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: DashboardIcon },
    ],
  },
  {
    label: "Master Data",
    items: [
      { name: "Customers", path: "/customers", icon: UsersIcon },
      { name: "Users", path: "/users", icon: PersonIcon },
    ],
  },
  {
    label: "Kredit",
    items: [
      { name: "Loans", path: "/loans", icon: LoansIcon },
      { name: "Collaterals", path: "/collaterals", icon: CollateralIcon },
      { name: "Guarantors", path: "/guarantors", icon: GuarantorIcon },
    ],
  },
  {
    label: "Keuangan",
    items: [
      { name: "Invoices", path: "/invoices", icon: InvoicesIcon },
      { name: "Disbursements", path: "/disbursements", icon: DisbursementsIcon },
    ],
  },
  {
    label: "Settings",
    items: [
      { name: "Settings", path: "/settings", icon: SettingsIcon },
    ],
  },
]

export default function Sidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}) {
  return (
    <aside className="flex h-full flex-col border-r border-stone-200 bg-white">
      <div className="flex items-center gap-3 px-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
          <DashboardIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-stone-900">LoanHub</p>
          <p className="text-[10px] font-medium uppercase tracking-widest text-stone-400">Finance Data</p>
        </div>
        <button
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-600 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Buka menu"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="px-3 pb-2">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-stone-400">{group.label}</p>
            <div className="flex flex-col space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = window.location.pathname === item.path
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all duration-150 ${
                      isActive ? "bg-[#E8DEF8] text-[#1D192B] font-semibold" : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                    }`}
                    title={isActive ? "Halaman aktif" : undefined}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    {isActive ? <ChevronRightIcon className="ml-auto h-4 w-4" /> : null}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto px-4 py-4 text-[10px] text-stone-400">GET-only · v1.0</div>
    </aside>
  )
}
