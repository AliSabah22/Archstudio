import React from 'react'
import { NavLink } from 'react-router-dom'

interface SidebarItemProps {
  to: string
  icon: React.ReactNode
  label: string
  badgeCount?: number
}

export function SidebarItem({ to, icon, label, badgeCount }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-button transition-all duration-150 group ${
          isActive
            ? 'bg-gold/10 text-gold'
            : 'text-text-secondary hover:text-text-primary hover:bg-surface'
        }`
      }
    >
      <span className="w-4 h-4 shrink-0">{icon}</span>
      <span className="text-sm font-medium flex-1">{label}</span>
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-semibold rounded-badge bg-status-red/20 text-status-red">
          {badgeCount}
        </span>
      )}
    </NavLink>
  )
}
