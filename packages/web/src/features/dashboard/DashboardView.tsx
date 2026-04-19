
import { AlertTriangle, Clock, FolderOpen, TrendingUp, DollarSign, Users } from 'lucide-react'
import { PageHeader } from '@/design-system/layouts/PageHeader'
import { StatCard } from '@/design-system/components/StatCard'
import { ProgressBar } from '@/design-system/components/ProgressBar'
import { StatusBadge } from '@/design-system/components/StatusBadge'
import { AvatarStack } from '@/design-system/components/AvatarStack'
import { useProjects } from '@/hooks/useProjects'
import { useTeam } from '@/hooks/useTeam'
import { useInvoices } from '@/hooks/useInvoices'
import { InvoiceStatus } from '@/types/common'
import { PROJECTS } from '@/data/mockData'

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toFixed(0)}`
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
}

function daysUntil(dateStr: string): number {
  const due = new Date(dateStr).getTime()
  const now = new Date().getTime()
  return Math.ceil((due - now) / (1000 * 60 * 60 * 24))
}

const PHASE_COLORS: Record<string, string> = {
  pre_design: '#8A8A8E',
  schematic_design: '#3B82F6',
  design_development: '#A855F7',
  construction_documents: '#F59E0B',
  bidding: '#C8A97E',
  construction_administration: '#22C55E',
}

export function DashboardView() {
  const { allProjects } = useProjects()
  const { members, avgUtilization, totalBillableHours } = useTeam()
  const { financialSummary, allInvoices } = useInvoices()

  const activeProjects = allProjects.filter((p) => p.status === 'active')
  const overdueInvoices = allInvoices.filter((inv) => inv.status === InvoiceStatus.Overdue)

  const upcomingDeadlines = [...PROJECTS]
    .filter((p) => p.status === 'active')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4)

  const pipelineValue = 2_800_000

  return (
    <div className="p-8">
      <PageHeader
        title="Command Center"
        subtitle="ArchStudio Operations — Q2 2024"
      />

      {/* Top stat row */}
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
          label="Quarterly Revenue"
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
            {activeProjects.slice(0, 4).map((project) => {
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

        {/* Right column — Alerts + Deadlines */}
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
                {overdueInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-text-primary">{inv.number}</div>
                      <div className="text-xs text-text-muted">{inv.clientName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-semibold text-status-red">
                        ${inv.total.toLocaleString('en-CA', { maximumFractionDigits: 0 })}
                      </div>
                      <div className="text-xs text-text-muted">Due {formatDate(inv.dueDate)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Deadlines */}
          <div className="rounded-card border border-border bg-surface p-5 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-text-muted" />
              <h3 className="text-sm font-medium text-text-primary">Upcoming Deadlines</h3>
            </div>
            <div className="flex flex-col gap-3">
              {upcomingDeadlines.map((project) => {
                const days = daysUntil(project.dueDate)
                const urgentColor = days <= 14 ? 'text-status-amber' : days <= 0 ? 'text-status-red' : 'text-text-muted'
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
      <div className="rounded-card border border-border bg-surface p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-base text-text-primary">Team Capacity</h2>
          <a href="/team" className="text-xs text-gold hover:underline">Full report</a>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {members.slice(0, 8).map((member) => {
            const color =
              member.utilization >= 90
                ? '#EF4444'
                : member.utilization >= 75
                ? '#22C55E'
                : '#F59E0B'
            return (
              <div key={member.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary truncate">{member.name.split(' ')[0]}</span>
                  <span className="text-xs font-mono font-medium" style={{ color }}>
                    {member.utilization}%
                  </span>
                </div>
                <ProgressBar value={member.utilization} height={4} color={color} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
