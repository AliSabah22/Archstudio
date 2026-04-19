import React from 'react'
import {
  LayoutDashboard,
  FolderKanban,
  TrendingUp,
  Users,
  FileText,
  Calculator,
  Calendar,
  Megaphone,
} from 'lucide-react'
import { SidebarItem } from '../components/SidebarItem'
import { Avatar } from '../components/Avatar'

interface AppShellProps {
  children: React.ReactNode
}

const NAV_ITEMS = [
  { to: '/', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
  { to: '/projects', icon: <FolderKanban className="w-4 h-4" />, label: 'Projects' },
  { to: '/pipeline', icon: <TrendingUp className="w-4 h-4" />, label: 'Pipeline' },
  { to: '/team', icon: <Users className="w-4 h-4" />, label: 'Team' },
  { to: '/invoices', icon: <FileText className="w-4 h-4" />, label: 'Invoices', badgeCount: 2 },
  { to: '/estimates', icon: <Calculator className="w-4 h-4" />, label: 'Estimates' },
  { to: '/calendar', icon: <Calendar className="w-4 h-4" />, label: 'Calendar' },
  { to: '/marketing', icon: <Megaphone className="w-4 h-4" />, label: 'Marketing' },
]

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {/* Sidebar */}
      <aside
        className="flex flex-col border-r border-border bg-bg shrink-0"
        style={{ width: '240px' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-button bg-gold/20 border border-gold/30 flex items-center justify-center">
            <span className="text-gold font-serif text-sm font-bold">A</span>
          </div>
          <div>
            <div className="text-gold font-serif text-base leading-none">ArchStudio</div>
            <div className="text-text-muted text-xs mt-0.5">Operations Portal</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              badgeCount={item.badgeCount}
            />
          ))}
        </nav>

        {/* User profile */}
        <div className="border-t border-border px-3 py-4">
          <div className="flex items-center gap-3 px-2 py-2 rounded-button hover:bg-surface transition-colors cursor-pointer">
            <Avatar initials="PD" size="sm" color="#C8A97E" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-text-primary truncate">Pamir Dogan</div>
              <div className="text-xs text-text-muted truncate">Principal Architect</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
