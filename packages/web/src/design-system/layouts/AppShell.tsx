import React, { useEffect, useRef, useState } from 'react'
import {
  LayoutDashboard,
  FolderKanban,
  TrendingUp,
  Users,
  FileText,
  Calculator,
  Calendar,
  Megaphone,
  UserCircle2,
  Timer,
  X,
  BarChart3,
  Settings,
  Activity,
} from 'lucide-react'
import { SidebarItem } from '../components/SidebarItem'
import { Avatar } from '../components/Avatar'
import { useAppStore } from '@/stores/appStore'

interface AppShellProps {
  children: React.ReactNode
}

const NAV_ITEMS = [
  { to: '/', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
  { to: '/projects', icon: <FolderKanban className="w-4 h-4" />, label: 'Projects' },
  { to: '/clients', icon: <UserCircle2 className="w-4 h-4" />, label: 'Clients' },
  { to: '/pipeline', icon: <TrendingUp className="w-4 h-4" />, label: 'Pipeline' },
  { to: '/team', icon: <Users className="w-4 h-4" />, label: 'Team' },
  { to: '/capacity', icon: <Activity className="w-4 h-4" />, label: 'Capacity' },
  { to: '/invoices', icon: <FileText className="w-4 h-4" />, label: 'Invoices', badgeCount: 3 },
  { to: '/financials', icon: <BarChart3 className="w-4 h-4" />, label: 'Financials' },
  { to: '/estimates', icon: <Calculator className="w-4 h-4" />, label: 'Estimates' },
  { to: '/calendar', icon: <Calendar className="w-4 h-4" />, label: 'Calendar' },
  { to: '/marketing', icon: <Megaphone className="w-4 h-4" />, label: 'Marketing' },
  { to: '/settings', icon: <Settings className="w-4 h-4" />, label: 'Settings' },
]

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
}

function TimerPill() {
  const { timer, stopTimer, discardTimer, showToast } = useAppStore()
  const [elapsed, setElapsed] = useState(0)
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (timer.isRunning && timer.startTime) {
      setElapsed(Date.now() - timer.startTime.getTime())
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - timer.startTime!.getTime())
      }, 1000)
    } else {
      setElapsed(0)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [timer.isRunning, timer.startTime])

  if (!timer.isRunning) return null

  const handleStop = () => {
    const entry = stopTimer()
    if (entry) {
      const hrs = entry.hours
      const hStr = hrs >= 1 ? `${Math.floor(hrs)}h ` : ''
      const mStr = `${Math.round((hrs % 1) * 60)}m`
      showToast(`${hStr}${mStr} logged to ${timer.projectName}`)
    }
  }

  const handleDiscard = () => {
    if (confirmDiscard) {
      discardTimer()
      setConfirmDiscard(false)
    } else {
      setConfirmDiscard(true)
      setTimeout(() => setConfirmDiscard(false), 3000)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: '#141415',
        border: '1px solid #2A2A2D',
        borderRadius: '40px',
        padding: '10px 20px',
        boxShadow: '0 0 20px rgba(200,169,126,0.15), 0 4px 24px rgba(0,0,0,0.5)',
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      {/* Pulsing red dot */}
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#EF4444',
          animation: 'pulse 1.4s ease-in-out infinite',
          flexShrink: 0,
        }}
      />
      <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}`}</style>

      <Timer className="w-3.5 h-3.5" style={{ color: '#C8A97E', flexShrink: 0 }} />

      <span style={{ color: '#E8E8EA', fontSize: '13px', fontWeight: 500, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {timer.projectName}
      </span>

      <span style={{ color: '#C8A97E', fontSize: '13px', fontFamily: '"JetBrains Mono", monospace', fontWeight: 600, letterSpacing: '0.05em' }}>
        {formatElapsed(elapsed)}
      </span>

      <button
        onClick={handleStop}
        style={{
          background: 'rgba(200,169,126,0.15)',
          border: '1px solid rgba(200,169,126,0.3)',
          borderRadius: '20px',
          color: '#C8A97E',
          fontSize: '11px',
          fontWeight: 600,
          padding: '3px 10px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Stop & Log
      </button>

      <button
        onClick={handleDiscard}
        title={confirmDiscard ? 'Click again to confirm discard' : 'Discard timer'}
        style={{
          background: confirmDiscard ? 'rgba(239,68,68,0.2)' : 'transparent',
          border: 'none',
          borderRadius: '50%',
          color: confirmDiscard ? '#EF4444' : '#5A5A60',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          transition: 'color 0.2s',
        }}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

function Toast() {
  const { toastMessage, clearToast } = useAppStore()
  if (!toastMessage) return null
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        background: '#1E1E20',
        border: '1px solid rgba(34,197,94,0.3)',
        borderRadius: '10px',
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
      <span style={{ color: '#22C55E', fontSize: '13px' }}>✓</span>
      <span style={{ color: '#E8E8EA', fontSize: '13px' }}>{toastMessage}</span>
      <button onClick={clearToast} style={{ background: 'none', border: 'none', color: '#5A5A60', cursor: 'pointer', marginLeft: 4, padding: 0 }}>
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}

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

      {/* Global overlays */}
      <TimerPill />
      <Toast />
    </div>
  )
}
