
import type { SVGProps } from "react"

function svg(props: SVGProps<SVGSVGElement> = {}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={18}
      height={18}
      aria-hidden="true"
      {...props}
    />
  )
}

export const DashboardIcon = (p: SVGProps<SVGSVGElement>) => (
  <>
    {svg(p)}
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </>
)

export const LoansIcon = (p: SVGProps<SVGSVGElement>) => (
  <>
    {svg(p)}
    <rect x="5" y="4" width="14" height="16" rx="2" />
    <path d="M9 4V12h6V4" />
    <path d="M9 16h6M9 20h4" />
  </>
)

export const CollateralIcon = (p: SVGProps<SVGSVGElement>) => (
  <>
    {svg(p)}
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <circle cx="12" cy="12" r="3" />
  </>
)

export const GuarantorIcon = (p: SVGProps<SVGSVGElement>) => (
  <>
    {svg(p)}
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 5.5 8 8 8 8z" />
    <path d="M9 12l2 2 4-4" />
  </>
)

export const InvoicesIcon = (p: SVGProps<SVGSVGElement>) => (
  <>
    {svg(p)}
    <path d="M4 22h16" />
    <path d="M6 14h12" />
    <path d="M6 10h12" />
    <path d="M6 6h12" />
  </>
)

export const DisbursementsIcon = (p: SVGProps<SVGSVGElement>) => (
  <>
    {svg(p)}
    <path d="M12 2v7M12 15v7" />
    <path d="M2 12h6M16 12h6" />
  </>
)

export const UsersIcon = (p: SVGProps<SVGSVGElement>) => (
  <>
    {svg(p)}
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20c0-3.3 2-4.7 4-4.7s4 1.4 4 4.7" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M17 20c-2.5-1.5-5-2.5-7.5-2.5" />
  </>
)

export const SettingsIcon = (p: SVGProps<SVGSVGElement>) => (
  <>
    {svg(p)}
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
  </>
)

export const LogoutIcon = (p: SVGProps<SVGSVGElement>) => (
  <>
    {svg(p)}
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </>
)

export const RefreshIcon = (p: SVGProps<SVGSVGElement>) => (
  <>
    {svg(p)}
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </>
)

export const PersonIcon = (p: SVGProps<SVGSVGElement>) => (
  <>
    {svg(p)}
    <circle cx="12" cy="8" r="3" />
    <path d="M12 13s3 4 3 7" />
  </>
)

export const ClockIcon = (p: SVGProps<SVGSVGElement>) => (
  <>
    {svg(p)}
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>
)

export const SearchIcon = (p: SVGProps<SVGSVGElement>) => (
  <>
    {svg(p)}
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15 15l5 5" />
  </>
)

export const MenuIcon = (p: SVGProps<SVGSVGElement>) => (
  <>
    {svg(p)}
    <path d="M3 7l9-4 9 4M3 13l9 4 9-4" />
  </>
)

export const ChevronRightIcon = (p: SVGProps<SVGSVGElement>) => (
  <>
    {svg(p)}
    <path d="M9 6l6 6-6 6" />
  </>
)
