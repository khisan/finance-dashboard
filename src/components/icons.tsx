
import type { LucideProps } from "lucide-react"
import {
  LayoutDashboard,
  FileText,
  Wallet,
  ShieldCheck,
  Receipt,
  HandCoins,
  Users,
  Settings,
  LogOut,
  RefreshCw,
  User,
  Clock,
  Search,
  Menu,
  ChevronRight,
} from "lucide-react"

type IconProps = LucideProps

export const DashboardIcon = (props: IconProps) => <LayoutDashboard {...props} />
export const LoansIcon = (props: IconProps) => <FileText {...props} />
export const CollateralIcon = (props: IconProps) => <Wallet {...props} />
export const GuarantorIcon = (props: IconProps) => <ShieldCheck {...props} />
export const InvoicesIcon = (props: IconProps) => <Receipt {...props} />
export const DisbursementsIcon = (props: IconProps) => <HandCoins {...props} />
export const UsersIcon = (props: IconProps) => <Users {...props} />
export const SettingsIcon = (props: IconProps) => <Settings {...props} />
export const LogoutIcon = (props: IconProps) => <LogOut {...props} />
export const RefreshIcon = (props: IconProps) => <RefreshCw {...props} />
export const PersonIcon = (props: IconProps) => <User {...props} />
export const ClockIcon = (props: IconProps) => <Clock {...props} />
export const SearchIcon = (props: IconProps) => <Search {...props} />
export const MenuIcon = (props: IconProps) => <Menu {...props} />
export const ChevronRightIcon = (props: IconProps) => <ChevronRight {...props} />
