import { useState } from 'react'
import { AlertTriangle, Clock, FolderOpen, TrendingUp, DollarSign, Users, ChevronDown, ChevronUp } from 'lucide-react'
import { StatCard } from '@/design-system/components/StatCard'
import { ProgressBar } from '@/design-system/components/ProgressBar'
import { StatusBadge } from '@/design-system/components/StatusBadge'
import { AvatarStack } from '@/design-system/components/AvatarStack'
import { useProjects } from '@/hooks/useProjects'
import { useTeam } from '@/hooks/useTeam'
import { useInvoices } from '@/hooks/useInvoices'
import { InvoiceStatus } from '@/types/common'
import { PROJECTS, TEAM_MEMBERS, INVOICES, TIME_ENTRIES, CLIENTS, PIPELINE_OPPORTUNITIES, STAGE_VELOCITY, CLOSED_OPPORTUNITIES, MEETINGS, RFIS, APPROVALS, CAPACITY_FORECAST } from '@/data/mockData'

const TODAY = new Date('2026-04-20')

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toFixed(0)}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
}

function daysUntil(dateStr: string): number {
  const due = new Date(dateStr).getTime()
  return Math.ceil((due - TODAY.getTime()) / (1000 * 60 * 60 * 24))
}

function daysOverdue(dateStr: string): number {
  return Math.max(0, Math.ceil((TODAY.getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)))
}

function ltvFor(clientId: string): number {
  const c = CLIENTS.find((cl) => cl.id === clientId)
  if (!c) return 0
  return c.totalRevenue + c.referrals.reduce((s, r) => s + r.value, 0)
}

const PHASE_COLORS: Record<string, string> = {
  pre_design: '#8A8A8E',
  schematic_design: '#3B82F6',
  design_development: '#A855F7',
  construction_documents: '#F59E0B',
  bidding: '#C8A97E',
  construction_administration: '#22C55E',
}

// Current week: Apr 14–20, 2026
const CURRENT_WEEK_START = '2026-04-14'
const CURRENT_WEEK_END = '2026-04-20'

function weeklyHours(memberId: string): number {
  return TIME_ENTRIES.filter(
    (e) => e.userId === memberId && e.date >= CURRENT_WEEK_START && e.date <= CURRENT_WEEK_END
  ).reduce((s, e) => s + e.hours, 0)
}

// Budget burn alerts: any phase ≥ 80%
function budgetAlerts() {
  const alerts: { projectName: string; phase: string; pct: number; over: number }[] = []
  for (const p of PROJECTS) {
    if (!p.projectBudget) continue
    for (const ph of p.projectBudget.phases) {
      if (ph.estimatedHours === 0 || ph.actualHours === 0) continue
      const pct = Math.round((ph.actualHours / ph.estimatedHours) * 100)
      if (pct >= 80) {
        alerts.push({ projectName: p.name, phase: ph.phase, pct, over: ph.actualHours - ph.estimatedHours })
      }
    }
  }
  return alerts.sort((a, b) => b.pct - a.pct)
}

// Total pending pass-through
function totalPendingPassThrough(): number {
  return PROJECTS.flatMap((p) => p.consultants ?? []).reduce((s, c) => s + c.pendingPassThrough, 0)
}

// Cash flow forecast
function cashFlowForecast() {
  const in30Days = new Date(TODAY.getTime() + 30 * 86_400_000)
  const in60Days = new Date(TODAY.getTime() + 60 * 86_400_000)
  const dueSoon30 = INVOICES.filter(
    (inv) => (inv.status === InvoiceStatus.Sent) && new Date(inv.dueDate) <= in30Days
  ).reduce((s, inv) => s + inv.total, 0)
  const dueSoon60 = INVOICES.filter(
    (inv) => (inv.status === InvoiceStatus.Sent) && new Date(inv.dueDate) <= in60Days
  ).reduce((s, inv) => s + inv.total, 0)
  const overdueAdj = INVOICES.filter(
    (inv) => inv.status === InvoiceStatus.Overdue
  ).reduce((s, inv) => s + inv.total, 0) * 0.7
  return { next30: dueSoon30, next60: dueSoon60 + overdueAdj }
}

export function DashboardView() {
  const { allProjects } = useProjects()
  const { members, avgUtilization, totalBillableHours } = useTeam()
  const { financialSummary, allInvoices } = useInvoices()
  const [expandTeam, setExpandTeam] = useState(false)
  const [expandDeadlines, setExpandDeadlines] = useState(false)
  const [expandTimesheets, setExpandTimesheets] = useState(false)
  const [expandCashflow, setExpandCashflow] = useState(false)

  const activeProjects = allProjects.filter((p) => p.status === 'active')
  const overdueInvoices = allInvoices.filter((inv) => inv.status === InvoiceStatus.Overdue)

  const upcomingDeadlines = [...PROJECTS]
    .filter((p) => p.status === 'active')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  const pipelineValue = 4_210_000
  const alerts = budgetAlerts()
  const pendingPassThrough = totalPendingPassThrough()
  const cf = cashFlowForecast()

  const topClients = [...CLIENTS].sort((a, b) => ltvFor(b.id) - ltvFor(a.id)).slice(0, 3)

  const activeOpps = PIPELINE_OPPORTUNITIES
  const weightedValue = activeOpps.reduce((s, o) => s + o.estimatedValue * o.probability / 100, 0)
  const coverageRatio = weightedValue / 400_000
  const staleCount = activeOpps.filter((o) => o.daysInCurrentStage > (STAGE_VELOCITY[o.stage] ?? 999)).length
  const wonOpps = CLOSED_OPPORTUNITIES.filter((o) => o.result === 'won')
  const pipelineWinRate = Math.round((wonOpps.length / Math.max(CLOSED_OPPORTUNITIES.length, 1)) * 100)
  const coverageColor = coverageRatio >= 2 ? '#22C55E' : coverageRatio >= 1 ? '#F59E0B' : '#EF4444'

  // ── Urgent item computation ───────────────────────────────────────────────
  const burnoutMembers = members.filter((m) => m.trailingUtilization > 90)
  const criticalAlerts = alerts.filter((a) => a.pct >= 100)
  const overdueRFIs = RFIS.filter((r) => r.status === 'overdue')
  const pendingApprovals = APPROVALS.filter((a) => a.status === 'pending')
  const overdueActions = MEETINGS.flatMap((m) =>
    m.actionItems.filter((a) => a.status !== 'completed' && a.dueDate < '2026-04-20').map((a) => ({ ...a, projectName: m.projectName }))
  )

  type UrgentItem = { level: 'red' | 'orange'; text: string; sub?: string; href: string }
  const urgentItems: UrgentItem[] = [
    ...overdueInvoices.map((inv) => ({
      level: 'red' as const,
      text: `Overdue invoice — ${inv.clientName}`,
      sub: `${inv.number} · ${formatCurrency(inv.total)} · ${daysOverdue(inv.dueDate)}d past due`,
      href: '/invoices',
    })),
    ...criticalAlerts.map((a) => ({
      level: 'red' as const,
      text: `Budget overrun — ${a.projectName}`,
      sub: `${a.phase} phase at ${a.pct}% (+${a.over}h over budget)`,
      href: '/projects',
    })),
    ...burnoutMembers.map((m) => ({
      level: 'orange' as const,
      text: `Burnout risk — ${m.name}`,
      sub: `${m.trailingUtilization}% trailing utilization for 6+ consecutive weeks`,
      href: '/team',
    })),
    ...overdueRFIs.map((r) => ({
      level: 'red' as const,
      text: `Overdue RFI — ${r.sentTo}`,
      sub: `${r.subject} · ${r.projectName}`,
      href: '/projects',
    })),
    ...pendingApprovals.map((a) => ({
      level: 'orange' as const,
      text: `Approval awaiting — ${a.projectName}`,
      sub: a.title,
      href: '/projects',
    })),
    ...overdueActions.map((a) => ({
      level: 'orange' as const,
      text: `Action item overdue — ${a.owner}`,
      sub: `${a.task} · ${a.projectName}`,
      href: '/projects',
    })),
  ]

  const urgentCount = urgentItems.length
  const hour = new Date().getHours()
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  const greeting = urgentCount === 0
    ? `Good ${timeOfDay}, Pamir. All systems green.`
    : `Good ${timeOfDay}, Pamir. ${urgentCount} thing${urgentCount > 1 ? 's' : ''} need${urgentCount === 1 ? 's' : ''} your attention.`

  return (
    <div className="p-8">

      {/* TIER 1 — Greeting + urgent items */}
      <div className="mb-7">
        <div className="flex items-baseline gap-3 mb-4">
          <h1 className="font-serif text-xl text-text-primary">{greeting}</h1>
          <span className="text-xs text-text-muted">Mon, Apr 20, 2026</span>
        </div>

        {urgentItems.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {urgentItems.map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="flex items-start gap-3 px-4 py-2.5 rounded-button transition-opacity hover:opacity-80"
                style={{
                  background: item.level === 'red' ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)',
                  border: `1px solid ${item.level === 'red' ? 'rgba(239,68,68,0.22)' : 'rgba(245,158,11,0.22)'}`,
                  borderLeft: `3px solid ${item.level === 'red' ? '#EF4444' : '#F59E0B'}`,
                }}
              >
                <span style={{ color: item.level === 'red' ? '#EF4444' : '#F59E0B', fontSize: 9, marginTop: 3, flexShrink: 0 }}>●</span>
                <div className="flex-1 min-w-0 flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-medium" style={{ color: item.level === 'red' ? '#F87171' : '#FCD34D' }}>
                    {item.text}
                  </span>
                  {item.sub && (
                    <span className="text-xs text-text-muted">{item.sub}</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-button"
            style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.18)' }}
          >
            <span style={{ color: '#22C55E', fontSize: 12 }}>✓</span>
            <span className="text-sm" style={{ color: '#4ADE80' }}>All clear — no items require immediate attention.</span>
          </div>
        )}
      </div>

      {/* TIER 2 — Key Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Active Projects"
          value={String(activeProjects.length)}
          subText="2 high priority"
          icon={<FolderOpen className="w-4 h-4" />}
          trend={{ direction: 'up', percent: 20 }}
        />
        <StatCard
          label="Pipeline Value"
          value={formatCurrency(pipelineValue)}
          subText="5 active opportunities"
          icon={<TrendingUp className="w-4 h-4" />}
          trend={{ direction: 'up', percent: 12 }}
        />
        <StatCard
          label="Q2 Revenue"
          value={formatCurrency(financialSummary.collected)}
          subText="vs $380K last quarter"
          icon={<DollarSign className="w-4 h-4" />}
          trend={{ direction: 'up', percent: 6.6 }}
        />
        <StatCard
          label="Team Utilization"
          value={`${avgUtilization}%`}
          subText={`${totalBillableHours}h billable this month`}
          icon={<Users className="w-4 h-4" />}
          trend={{ direction: 'up', percent: 3 }}
        />
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Active Projects Widget */}
        <div className="col-span-2 rounded-card border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-base text-text-primary">Active Projects</h2>
            <a href="/projects" className="text-xs text-gold hover:underline">View all</a>
          </div>
          <div className="flex flex-col gap-3">
            {activeProjects.slice(0, 5).map((project) => {
              const phaseColor = PHASE_COLORS[project.phase] ?? '#C8A97E'
              return (
                <div
                  key={project.id}
                  className="flex items-center gap-4 p-3 rounded-button bg-bg hover:bg-border/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-text-primary truncate">{project.name}</span>
                      <StatusBadge status={project.type} />
                    </div>
                    <div className="text-xs text-text-muted mb-2">{project.clientName}</div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <ProgressBar value={project.progress} height={4} color={phaseColor} />
                      </div>
                      <span className="text-xs font-mono text-text-secondary shrink-0">{project.progress}%</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <StatusBadge status={project.phase} />
                    <AvatarStack members={project.members} size="sm" max={3} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Overdue Invoices Alert */}
          <div className="rounded-card border border-status-red/30 bg-status-red/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-status-red" />
              <h3 className="text-sm font-medium text-status-red">Overdue Invoices</h3>
            </div>
            {overdueInvoices.length === 0 ? (
              <p className="text-xs text-text-muted">No overdue invoices.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {overdueInvoices.map((inv) => {
                  const dO = daysOverdue(inv.dueDate)
                  return (
                    <div key={inv.id} className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-text-primary">{inv.clientName}</div>
                        <div className="text-xs text-text-muted">{inv.number}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-semibold text-status-red">
                          ${inv.total.toLocaleString('en-CA', { maximumFractionDigits: 0 })}
                        </div>
                        <div className="text-xs" style={{ color: '#F87171' }}>{dO}d overdue</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Upcoming Deadlines */}
          <div className="rounded-card border border-border bg-surface p-5 flex-1">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-text-muted" />
                <h3 className="text-sm font-medium text-text-primary">Deadlines</h3>
              </div>
              <button onClick={() => setExpandDeadlines((v) => !v)} className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors">
                {expandDeadlines ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {(expandDeadlines ? upcomingDeadlines : upcomingDeadlines.slice(0, 3)).map((project) => {
                const days = daysUntil(project.dueDate)
                const urgentColor = days <= 0 ? 'text-status-red' : days <= 14 ? 'text-status-amber' : 'text-text-muted'
                return (
                  <div key={project.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-text-primary truncate">{project.name}</div>
                      <div className="text-xs text-text-muted">{formatDate(project.dueDate)}</div>
                    </div>
                    <span className={`text-xs font-mono font-medium shrink-0 ${urgentColor}`}>
                      {days > 0 ? `${days}d` : 'Overdue'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Team Capacity Widget */}
      <div className="rounded-card border border-border bg-surface p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif text-base text-text-primary">Team Capacity</h2>
            <span className="text-xs text-text-muted">{avgUtilization}% avg utilization · {totalBillableHours}h billable</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/capacity" className="text-xs text-gold hover:underline">Heatmap</a>
            <button
              onClick={() => setExpandTeam((v) => !v)}
              className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              {expandTeam ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {expandTeam ? 'Less' : 'More'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {members.slice(0, expandTeam ? 8 : 4).map((member) => {
            const isRed = member.utilization >= 90
            const isGreen = member.utilization >= 75 && member.utilization < 90
            const color = isRed ? '#EF4444' : isGreen ? '#22C55E' : '#F59E0B'
            return (
              <div key={member.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-text-secondary truncate">{member.name.split(' ')[0]}</span>
                    {isRed && <span title="Burnout risk" className="text-xs leading-none" style={{ color: '#EF4444' }}>⚠</span>}
                  </div>
                  <span className="text-xs font-mono font-medium" style={{ color }}>
                    {member.utilization}%
                  </span>
                </div>
                <ProgressBar value={member.utilization} height={4} color={color} />
              </div>
            )
          })}
        </div>
        {!expandTeam && members.length > 4 && (
          <button
            onClick={() => setExpandTeam(true)}
            className="mt-3 text-xs text-text-muted hover:text-text-secondary transition-colors w-full text-center"
          >
            +{members.length - 4} more team members
          </button>
        )}
      </div>

      {/* Row 3 — New Widgets */}
      <div className="grid grid-cols-3 gap-4 mb-4">

        {/* Budget Alerts */}
        <div className="rounded-card border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-primary">Budget Alerts</h3>
            <a href="/projects" className="text-xs text-gold hover:underline">View projects</a>
          </div>
          {alerts.length === 0 ? (
            <p className="text-xs text-text-muted">All phases within budget.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {alerts.slice(0, 4).map((alert, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-xs mt-0.5 shrink-0" style={{ color: alert.pct >= 100 ? '#EF4444' : '#F59E0B' }}>⚠</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-text-primary truncate">{alert.projectName}</div>
                    <div className="text-xs text-text-muted">{alert.phase}</div>
                  </div>
                  <span
                    className="text-xs font-mono font-semibold shrink-0"
                    style={{ color: alert.pct >= 100 ? '#EF4444' : '#F59E0B' }}
                  >
                    {alert.pct}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cash Flow Forecast */}
        <div className="rounded-card border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-primary">Cash Flow Forecast</h3>
            <div className="flex items-center gap-3">
              <a href="/invoices" className="text-xs text-gold hover:underline">View invoices</a>
              <button onClick={() => setExpandCashflow((v) => !v)} className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors">
                {expandCashflow ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-muted">Next 30 days</span>
              <span className="text-xl font-mono font-bold" style={{ color: '#22C55E' }}>{formatCurrency(cf.next30)}</span>
            </div>
            {expandCashflow && (
              <>
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
                  <span className="text-xs text-text-muted">Next 60 days (incl. overdue × 70%)</span>
                  <span className="text-base font-mono font-semibold" style={{ color: '#60A5FA' }}>{formatCurrency(cf.next60)}</span>
                </div>
                <div className="text-xs text-text-muted">
                  {overdueInvoices.length} invoice{overdueInvoices.length !== 1 ? 's' : ''} overdue — {formatCurrency(
                    overdueInvoices.reduce((s, inv) => s + inv.total, 0)
                  )} outstanding
                </div>
              </>
            )}
          </div>
        </div>

        {/* Timesheet Compliance */}
        <div className="rounded-card border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Timesheets</h3>
              <span className="text-xs text-text-muted">Apr 14–20</span>
            </div>
            <button onClick={() => setExpandTimesheets((v) => !v)} className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors">
              {expandTimesheets ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {expandTimesheets ? 'Less' : 'All'}
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {(expandTimesheets ? TEAM_MEMBERS : TEAM_MEMBERS.slice(0, 4)).map((m) => {
              const hrs = weeklyHours(m.id)
              const color = hrs >= 32 ? '#22C55E' : hrs >= 24 ? '#F59E0B' : '#EF4444'
              return (
                <div key={m.id} className="flex items-center gap-3">
                  <span className="text-xs text-text-secondary w-16 truncate">{m.name.split(' ')[0]}</span>
                  <div className="flex-1">
                    <ProgressBar value={Math.min((hrs / 40) * 100, 100)} height={4} color={color} />
                  </div>
                  <span className="text-xs font-mono shrink-0 w-12 text-right" style={{ color }}>
                    {hrs.toFixed(1)}h
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Row 4 — V3 Operational Alerts */}
      <div className="grid grid-cols-4 gap-4 mb-4">

        {/* Action Items Due */}
        {(() => {
          const allActions = MEETINGS.flatMap((m) =>
            m.actionItems
              .filter((a) => a.status !== 'completed')
              .map((a) => ({ ...a, projectName: m.projectName, meetingDate: m.date }))
          ).sort((x, y) => x.dueDate.localeCompare(y.dueDate))
          const overdueActions = allActions.filter((a) => a.dueDate < '2026-04-20')
          return (
            <div className="rounded-card border bg-surface p-4" style={{ borderColor: overdueActions.length > 0 ? 'rgba(239,68,68,0.3)' : '#1E1E20' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text-primary">Action Items Due</h3>
                <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: overdueActions.length > 0 ? 'rgba(239,68,68,0.15)' : '#1E1E20', color: overdueActions.length > 0 ? '#EF4444' : '#8A8A8E' }}>{allActions.length}</span>
              </div>
              {allActions.slice(0, 4).map((a, i) => {
                const isOverdue = a.dueDate < '2026-04-20'
                const isSoon = !isOverdue && a.dueDate <= '2026-04-23'
                return (
                  <div key={i} className="mb-2 last:mb-0">
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-xs text-text-secondary leading-tight truncate">{a.task}</span>
                      <span className="text-xs font-medium shrink-0 ml-1" style={{ color: isOverdue ? '#EF4444' : isSoon ? '#F59E0B' : '#8A8A8E' }}>
                        {isOverdue ? 'Overdue' : new Date(a.dueDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="text-xs text-text-muted">{a.owner} · {a.projectName}</div>
                  </div>
                )
              })}
              {allActions.length === 0 && <p className="text-xs text-text-muted">No pending action items.</p>}
            </div>
          )
        })()}

        {/* RFIs Overdue */}
        {(() => {
          const overdueRFIs = RFIS.filter((r) => r.status === 'overdue')
          const awaitingRFIs = RFIS.filter((r) => r.status === 'awaiting_response')
          return (
            <div className="rounded-card border bg-surface p-4" style={{ borderColor: overdueRFIs.length > 0 ? 'rgba(239,68,68,0.3)' : '#1E1E20' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text-primary">RFIs</h3>
                {overdueRFIs.length > 0 && <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>{overdueRFIs.length} overdue</span>}
              </div>
              {overdueRFIs.map((r) => (
                <div key={r.id} className="mb-2 last:mb-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span style={{ color: '#EF4444', fontSize: 10 }}>⚠</span>
                    <span className="text-xs font-medium text-text-primary truncate">{r.sentTo}</span>
                  </div>
                  <div className="text-xs text-text-muted truncate">{r.subject}</div>
                </div>
              ))}
              {awaitingRFIs.slice(0, 2).map((r) => (
                <div key={r.id} className="mb-2 last:mb-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span style={{ color: '#F59E0B', fontSize: 10 }}>⏳</span>
                    <span className="text-xs text-text-secondary truncate">{r.sentTo}</span>
                  </div>
                  <div className="text-xs text-text-muted">Due {new Date(r.expectedResponseDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</div>
                </div>
              ))}
              {overdueRFIs.length === 0 && awaitingRFIs.length === 0 && <p className="text-xs text-text-muted">All RFIs responded.</p>}
            </div>
          )
        })()}

        {/* Approvals Pending */}
        {(() => {
          const pending = APPROVALS.filter((a) => a.status === 'pending')
          return (
            <div className="rounded-card border bg-surface p-4" style={{ borderColor: pending.length > 0 ? 'rgba(245,158,11,0.3)' : '#1E1E20' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text-primary">Approvals Pending</h3>
                <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: pending.length > 0 ? 'rgba(245,158,11,0.15)' : '#1E1E20', color: pending.length > 0 ? '#F59E0B' : '#8A8A8E' }}>{pending.length}</span>
              </div>
              {pending.map((a) => (
                <div key={a.id} className="mb-2 last:mb-0">
                  <div className="text-xs font-medium text-text-primary leading-tight mb-0.5">{a.title}</div>
                  <div className="text-xs text-text-muted">{a.projectName} · {new Date(a.requestedDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</div>
                </div>
              ))}
              {pending.length === 0 && <p className="text-xs text-text-muted">No approvals awaiting response.</p>}
            </div>
          )
        })()}

        {/* Capacity Alert */}
        {(() => {
          const overloaded = CAPACITY_FORECAST.filter((m) => m.weeks.slice(0, 3).some((w) => w.utilization > 100))
          const underutil = CAPACITY_FORECAST.filter((m) => m.weeks.every((w) => w.utilization < 65))
          return (
            <div className="rounded-card border bg-surface p-4" style={{ borderColor: overloaded.length > 0 ? 'rgba(239,68,68,0.3)' : '#1E1E20' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text-primary">Capacity Forecast</h3>
                <a href="/capacity" className="text-xs text-gold hover:underline">Heatmap</a>
              </div>
              {overloaded.map((m) => (
                <div key={m.userId} className="mb-2 last:mb-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span style={{ color: '#EF4444', fontSize: 10 }}>⚠</span>
                    <span className="text-xs font-medium text-text-primary">{m.userName.split(' ')[0]} overloaded</span>
                  </div>
                  <div className="text-xs text-text-muted">Next 3 weeks — peak {Math.max(...m.weeks.slice(0, 3).map((w) => w.utilization))}%</div>
                </div>
              ))}
              {underutil.slice(0, 1).map((m) => (
                <div key={m.userId} className="mb-2 last:mb-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span style={{ color: '#3B82F6', fontSize: 10 }}>ℹ</span>
                    <span className="text-xs text-text-secondary">{m.userName.split(' ')[0]} has capacity</span>
                  </div>
                  <div className="text-xs text-text-muted">Consistently under 65% — assign new work</div>
                </div>
              ))}
              {overloaded.length === 0 && <p className="text-xs" style={{ color: '#22C55E' }}>✓ Team capacity looks healthy</p>}
            </div>
          )
        })()}
      </div>

      {/* Row 5 — Top Clients + Pipeline Health */}
      <div className="grid grid-cols-2 gap-4">

        {/* Top Clients by LTV */}
        <div className="rounded-card border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-primary">Top Clients by Lifetime Value</h3>
            <a href="/clients" className="text-xs text-gold hover:underline">View all</a>
          </div>
          <div className="flex flex-col gap-3">
            {topClients.map((client, rank) => {
              const ltv = ltvFor(client.id)
              const referralTotal = client.referrals.reduce((s, r) => s + r.value, 0)
              const statusConfig = { active: '#22C55E', recent: '#F59E0B', dormant: '#EF4444' }
              const statusColor = statusConfig[client.status]
              return (
                <div key={client.id} className="flex items-center gap-4 p-3 rounded-button bg-bg">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: rank === 0 ? 'rgba(200,169,126,0.2)' : '#1E1E20', color: rank === 0 ? '#C8A97E' : '#5A5A60' }}
                  >
                    {rank + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-text-primary truncate">{client.name}</span>
                      <span className="text-xs" style={{ color: statusColor }}>●</span>
                      {client.status === 'dormant' && (
                        <span className="text-xs" style={{ color: '#EF4444' }}>⚠</span>
                      )}
                    </div>
                    <div className="text-xs text-text-muted">{client.type}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-base font-mono font-semibold text-gold">{formatCurrency(ltv)}</div>
                    {referralTotal > 0 && (
                      <div className="text-xs font-mono" style={{ color: '#22C55E' }}>
                        +{formatCurrency(referralTotal)} referrals
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pipeline Health Summary */}
        <div className="rounded-card border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-primary">Pipeline Health</h3>
            <a href="/pipeline" className="text-xs text-gold hover:underline">Full view</a>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-button p-3" style={{ background: '#0A0A0B' }}>
              <div className="text-xs text-text-muted mb-1">Coverage</div>
              <div className="text-lg font-mono font-bold" style={{ color: coverageColor }}>
                {coverageRatio.toFixed(1)}x
              </div>
              <div className="text-xs" style={{ color: coverageColor }}>
                {coverageRatio >= 2 ? '✓ Healthy' : coverageRatio >= 1 ? '⚠ Low' : '✗ Critical'}
              </div>
            </div>
            <div className="rounded-button p-3" style={{ background: '#0A0A0B' }}>
              <div className="text-xs text-text-muted mb-1">Stale Opps</div>
              <div className="text-lg font-mono font-bold" style={{ color: staleCount > 0 ? '#F59E0B' : '#22C55E' }}>
                {staleCount}
              </div>
              <div className="text-xs text-text-muted">past avg stage</div>
            </div>
            <div className="rounded-button p-3" style={{ background: '#0A0A0B' }}>
              <div className="text-xs text-text-muted mb-1">Win Rate</div>
              <div className="text-lg font-mono font-bold" style={{ color: pipelineWinRate >= 60 ? '#22C55E' : pipelineWinRate >= 40 ? '#F59E0B' : '#EF4444' }}>
                {pipelineWinRate}%
              </div>
              <div className="text-xs text-text-muted">12 months</div>
            </div>
          </div>
          {staleCount > 0 && (
            <div
              className="flex items-start gap-2 text-xs px-3 py-2 rounded-button"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
            >
              <span style={{ color: '#F59E0B', flexShrink: 0 }}>⚠</span>
              <span style={{ color: '#8A8A8E' }}>
                {staleCount} opportunit{staleCount === 1 ? 'y' : 'ies'} past average stage duration — follow-up needed
              </span>
            </div>
          )}
          {pendingPassThrough > 0 && (
            <div
              className="flex items-center justify-between text-xs px-3 py-2 rounded-button mt-2"
              style={{ background: 'rgba(200,169,126,0.06)', border: '1px solid rgba(200,169,126,0.15)' }}
            >
              <span className="text-text-muted">💰 Pending pass-throughs</span>
              <span className="font-mono font-semibold text-gold">{formatCurrency(pendingPassThrough)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
