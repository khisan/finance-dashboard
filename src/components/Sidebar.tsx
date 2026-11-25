import type { ComponentType } from "react"
import { NavLink } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { usePendingApprovalCount } from "@/hooks/usePendingApprovalCount"
import { isApprover, isFinance } from "@/lib/roles"
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
  ApprovalIcon,
  AuditIcon,
} from "./icons"

type NavItem = {
  name: string
  path: string
  icon: ComponentType<{ className?: string }>
  badge?: number
}

type NavGroup = {
  label: string
  items: NavItem[]
}

// Menu berdasarkan resource controller loan-system:
// Dashboard, Customers, Users, Loans, Collaterals, Guarantors, Invoices, Disbursements, Settings
function navGroups(
  canApprove: boolean,
  financeFocus: boolean,
  pendingCount: number,
): NavGroup[] {
  return [
    // Finance lands on approvals first: its only write action is deciding proposals.
    ...(financeFocus
      ? [
          {
            label: "Persetujuan",
            items: [
              {
                name: "Persetujuan",
                path: "/approvals",
                icon: ApprovalIcon,
                badge: pendingCount,
              },
            ],
          },
        ]
      : []),
    {
      label: "Ringkasan",
      items: [{ name: "Dashboard", path: "/dashboard", icon: DashboardIcon }],
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
        {
          name: "Disbursements",
          path: "/disbursements",
          icon: DisbursementsIcon,
        },
      ],
    },
    {
      label: "Kontrol",
      items: [
        ...(canApprove && !financeFocus
          ? [
              {
                name: "Persetujuan",
                path: "/approvals",
                icon: ApprovalIcon,
                badge: pendingCount,
              },
            ]
          : []),
        { name: "Audit Trail", path: "/audit-trail", icon: AuditIcon },
      ],
    },
    {
      label: "Settings",
      items: [{ name: "Settings", path: "/settings", icon: SettingsIcon }],
    },
  ]
}

export default function Sidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}) {
  const { user } = useAuth()
  const canApprove = isApprover(user?.role)
  const financeFocus = isFinance(user?.role)
  const pendingCount = usePendingApprovalCount(canApprove)

  return (
    <aside className="flex h-full flex-col border-r border-stone-200 bg-white">
      <div className="flex items-center gap-3 px-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
          <DashboardIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-stone-900">
            LoanHub
          </p>
          <p className="text-[10px] font-medium uppercase tracking-widest text-stone-400">
            Finance Data
          </p>
        </div>
        <button
          className="cursor-pointer ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-600 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Buka menu"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="px-3 pb-2">
        {navGroups(canApprove, financeFocus, pendingCount).map((group) => (
          <div key={group.label}>
            <p className="mb-1 px-3 pt-3 text-[10px] font-semibold uppercase tracking-widest text-stone-400">
              {group.label}
            </p>
            <div className="flex flex-col space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = window.location.pathname === item.path
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "rounded-4xl bg-[#E8DEF8] text-[#1D192B] font-semibold"
                        : "rounded-4xl text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                    }`}
                    title={isActive ? "Halaman aktif" : undefined}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    {item.badge && item.badge > 0 ? (
                      <span
                        aria-label={`${item.badge} persetujuan menunggu`}
                        className="ml-auto inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white"
                      >
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    ) : null}
                    {isActive ? (
                      <ChevronRightIcon
                        className={`h-4 w-4 ${
                          item.badge && item.badge > 0 ? "ml-1" : "ml-auto"
                        }`}
                      />
                    ) : null}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
