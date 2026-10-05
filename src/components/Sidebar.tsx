import { NavLink } from 'react-router-dom'
import { LayoutGrid, ClipboardList, Home, CircleDollarSign, CheckSquare, Settings, Layers } from 'lucide-react'

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { name: 'Loans', path: '/loans', icon: ClipboardList },
    { name: 'Collaterals', path: '/collaterals', icon: Home },
    { name: 'Disbursements', path: '/disbursements', icon: CircleDollarSign },
    { name: 'Settlements', path: '/settlements', icon: CheckSquare },
    { name: 'Settings', path: '/settings', icon: Settings },
]

export default function Sidebar() {
    return (
        <aside className="w-64 h-screen bg-[#0B0E14] text-slate-300 flex flex-col justify-between p-4 border-r border-slate-800/60">

            {/* 1. BRANDING / LOGO */}
            <div>
                <div className="flex items-center gap-3 px-2 py-3 mb-6">
                    <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                        <Layers className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-bold text-white text-base leading-none">LoanCore</h1>
                        <span className="text-[10px] tracking-widest text-slate-500 font-semibold uppercase">Enterprise</span>
                    </div>
                </div>

                {/* 2. MAIN MENU */}
                <div className="space-y-1">
                    <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase mb-2">Main Menu</p>

                    {navItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-[#162032] text-blue-400 font-semibold shadow-sm'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                                    }`
                                }
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </NavLink>
                        )
                    })}
                </div>
            </div>

            {/* 3. USER PROFILE (BOTTOM) */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3 px-2">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    AW
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">Amanda Walsh</p>
                    <p className="text-xs text-slate-500 truncate">Senior Credit Officer</p>
                </div>
            </div>

        </aside>
    )
}