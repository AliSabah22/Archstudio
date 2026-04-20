import { useState } from 'react'
import { PageHeader } from '@/design-system/layouts/PageHeader'
import { StatusBadge } from '@/design-system/components/StatusBadge'
import { ProgressBar } from '@/design-system/components/ProgressBar'
import { AvatarStack } from '@/design-system/components/AvatarStack'
import { Badge } from '@/design-system/components/Badge'
import { useProjects } from '@/hooks/useProjects'
import { useAppStore } from '@/stores/appStore'
import { ProjectPhase, ProjectStatus, ProjectType } from '@/types/common'
import type { Project, BudgetPhase } from '@/types/project'

const TODAY = '2026-04-20'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toLocaleString('en-CA', { maximumFractionDigits: 0 })}`
}

const PHASES_ORDERED: ProjectPhase[] = [
  ProjectPhase.PreDesign,
  ProjectPhase.SchematicDesign,
  ProjectPhase.DesignDevelopment,
  ProjectPhase.ConstructionDocuments,
  ProjectPhase.Bidding,
  ProjectPhase.ConstructionAdministration,
]

const PHASE_LABELS: Record<ProjectPhase, string> = {
  [ProjectPhase.PreDesign]: 'Pre-Design',
  [ProjectPhase.SchematicDesign]: 'SD',
  [ProjectPhase.DesignDevelopment]: 'DD',
  [ProjectPhase.ConstructionDocuments]: 'CD',
  [ProjectPhase.Bidding]: 'Bidding',
  [ProjectPhase.ConstructionAdministration]: 'CA',
}

const PRIORITY_COLORS: Record<string, string> = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#22C55E',
}

function healthScore(p: Project): { label: 'Healthy' | 'Watch' | 'At Risk'; color: string; bg: string } {
  const margin = p.financials?.marginPercent ?? 100
  const isOverdue = new Date(p.dueDate) < new Date(TODAY)
  const maxPhasePct = (p.projectBudget?.phases ?? [])
    .filter((ph) => ph.estimatedHours > 0 && ph.actualHours > 0)
    .reduce((max, ph) => Math.max(max, ph.actualHours / ph.estimatedHours), 0) * 100

  if (margin < 10 || maxPhasePct > 100 || isOverdue) {
    return { label: 'At Risk', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' }
  }
  if (margin < 20 || maxPhasePct >= 80) {
    return { label: 'Watch', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' }
  }
  return { label: 'Healthy', color: '#22C55E', bg: 'rgba(34,197,94,0.12)' }
}

function PhaseBar({ phase }: { phase: BudgetPhase }) {
  if (phase.estimatedHours === 0) return null
  const pct = phase.actualHours === 0 ? 0 : Math.round((phase.actualHours / phase.estimatedHours) * 100)
  const color = pct >= 100 ? '#EF4444' : pct >= 80 ? '#F59E0B' : '#22C55E'
  const isOver = pct >= 100
  const isWarn = pct >= 80 && pct < 100
  const notStarted = phase.actualHours === 0

  return (
    <div className="flex items-center gap-3">
      <div className="w-28 shrink-0">
        <span className="text-xs text-text-secondary">{phase.phase}</span>
      </div>
      <div className="flex-1">
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: '#1E1E20' }}
        >
          {!notStarted && (
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${Math.min(pct, 100)}%`, background: color }}
            />
          )}
        </div>
      </div>
      <div className="w-28 flex items-center justify-end gap-2 shrink-0">
        <span className="text-xs font-mono text-text-muted">
          {notStarted ? '—' : `${phase.actualHours} / ${phase.estimatedHours}h`}
        </span>
        {isOver && (
          <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>
            Over
          </span>
        )}
        {isWarn && (
          <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>
            {pct}%
          </span>
        )}
        {!isOver && !isWarn && !notStarted && (
          <span className="text-xs font-mono" style={{ color }}>{pct}%</span>
        )}
      </div>
    </div>
  )
}

function ProjectDetailPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  const [showAssumptions, setShowAssumptions] = useState(false)
  const [addingTime, setAddingTime] = useState(false)
  const [quickHours, setQuickHours] = useState('1')
  const [showDetails, setShowDetails] = useState(false)
  const [activity, setActivity] = useState('')
  const { startTimer, addTimeEntry, showToast } = useAppStore()

  const budget = project.projectBudget
  const fin = project.financials
  const consultants = project.consultants ?? []

  const phaseName = PHASE_LABELS[project.phase] ?? project.phase

  const handleSaveTime = () => {
    const hrs = parseFloat(quickHours)
    if (isNaN(hrs) || hrs <= 0) return
    addTimeEntry({
      userId: 'tm_001',
      projectId: project.id,
      phase: project.phase,
      hours: hrs,
      date: TODAY,
      activity: activity || 'Manual Entry',
      note: '',
      billable: true,
    })
    showToast(`${hrs}h logged to ${project.name}`)
    setAddingTime(false)
    setQuickHours('1')
    setActivity('')
    setShowDetails(false)
  }

  const co_config = {
    approved: { color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
    pending: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
    rejected: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  }

  const health = healthScore(project)

  return (
    <div
      className="rounded-card border border-border bg-surface mt-2 overflow-hidden"
      style={{ borderColor: 'rgba(200,169,126,0.2)' }}
    >
      {/* Detail header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border" style={{ background: 'rgba(200,169,126,0.04)' }}>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-text-muted hover:text-gold transition-colors text-sm">← Back</button>
          <span className="text-text-muted text-sm">/</span>
          <h2 className="font-serif text-base text-text-primary">{project.name}</h2>
          <StatusBadge status={project.phase} />
          <span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ background: health.bg, color: health.color }}>
            {health.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!addingTime ? (
            <button
              onClick={() => setAddingTime(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-button text-xs font-medium transition-all"
              style={{ background: 'rgba(200,169,126,0.15)', border: '1px solid rgba(200,169,126,0.3)', color: '#C8A97E' }}
            >
              + Add Time
            </button>
          ) : null}
          <button
            onClick={() => startTimer(project.id, project.name, phaseName)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-button text-xs font-medium transition-all"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444' }}
          >
            ▶ Start Timer
          </button>
        </div>
      </div>

      {/* Quick Add Time */}
      {addingTime && (
        <div className="px-6 py-3 border-b border-border flex items-center gap-3 flex-wrap" style={{ background: 'rgba(200,169,126,0.03)' }}>
          <span className="text-xs text-text-muted">Log time:</span>
          <input
            type="number"
            min="0.25"
            step="0.25"
            value={quickHours}
            onChange={(e) => setQuickHours(e.target.value)}
            className="w-16 px-2 py-1 rounded text-xs font-mono text-text-primary bg-bg border border-border focus:outline-none focus:border-gold/50"
          />
          <span className="text-xs text-text-muted">hours on {TODAY}</span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-text-muted hover:text-gold transition-colors"
          >
            {showDetails ? '▲ Hide details' : '▼ Add details'}
          </button>
          {showDetails && (
            <input
              type="text"
              placeholder="Activity (optional)"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="px-2 py-1 rounded text-xs text-text-primary bg-bg border border-border focus:outline-none focus:border-gold/50 w-40"
            />
          )}
          <button
            onClick={handleSaveTime}
            className="px-3 py-1 rounded-button text-xs font-semibold transition-all"
            style={{ background: 'rgba(200,169,126,0.2)', color: '#C8A97E' }}
          >
            Save
          </button>
          <button
            onClick={() => setAddingTime(false)}
            className="text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-0 divide-x divide-border">

        {/* Budget Burn */}
        <div className="p-6">
          <h3 className="font-serif text-sm text-text-primary mb-4">Phase Budget</h3>
          {budget ? (
            <>
              <div className="flex flex-col gap-3 mb-4">
                {budget.phases.map((ph) => (
                  <PhaseBar key={ph.phase} phase={ph} />
                ))}
              </div>

              {/* Assumptions / Exclusions */}
              <button
                onClick={() => setShowAssumptions(!showAssumptions)}
                className="text-xs text-text-muted hover:text-gold transition-colors mb-2"
              >
                {showAssumptions ? '▲' : '▼'} Scope boundary
              </button>
              {showAssumptions && (
                <div className="text-xs text-text-secondary space-y-2 p-3 rounded-button" style={{ background: '#0A0A0B' }}>
                  <div><span className="text-text-muted font-medium">Includes: </span>{budget.assumptions}</div>
                  <div><span className="text-text-muted font-medium">Excludes: </span>{budget.exclusions}</div>
                </div>
              )}

              {/* Change Orders */}
              {budget.changeOrders.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Change Orders</div>
                  <div className="flex flex-col gap-2">
                    {budget.changeOrders.map((co) => {
                      const cfg = co_config[co.status]
                      return (
                        <div key={co.id} className="flex items-start gap-2">
                          <Badge color={cfg.color} bg={cfg.bg} className="shrink-0 mt-0.5">
                            {co.status.charAt(0).toUpperCase() + co.status.slice(1)}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-text-secondary leading-tight">{co.description}</div>
                            <div className="text-xs text-text-muted">{co.hours}h · {formatCurrency(co.cost)}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-xs text-text-muted">No budget data available.</p>
          )}
        </div>

        {/* P&L Summary */}
        <div className="p-6">
          <h3 className="font-serif text-sm text-text-primary mb-4">Financials</h3>
          {fin ? (
            <>
              <div className="flex flex-col gap-3 mb-5">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-xs text-text-muted">Invoiced</span>
                  <span className="text-xs font-mono text-text-primary">{formatCurrency(fin.invoiced)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-xs text-text-muted">Collected</span>
                  <span className="text-xs font-mono" style={{ color: '#22C55E' }}>{formatCurrency(fin.collected)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-xs text-text-muted">Outstanding</span>
                  <span className="text-xs font-mono" style={{ color: fin.outstanding > 0 ? '#F59E0B' : '#5A5A60' }}>{formatCurrency(fin.outstanding)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-xs text-text-muted">Direct Labor</span>
                  <span className="text-xs font-mono text-text-secondary">{formatCurrency(fin.directLabor)}</span>
                </div>
                {fin.consultantCosts > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-xs text-text-muted">Consultant Costs</span>
                    <span className="text-xs font-mono text-text-secondary">{formatCurrency(fin.consultantCosts)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-xs text-text-muted">Expenses</span>
                  <span className="text-xs font-mono text-text-secondary">{formatCurrency(fin.expenses)}</span>
                </div>
              </div>

              {/* Margin highlight */}
              <div
                className="rounded-button p-4"
                style={{
                  background: fin.marginPercent >= 20 ? 'rgba(34,197,94,0.08)' : fin.marginPercent >= 10 ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)',
                  border: `1px solid ${fin.marginPercent >= 20 ? 'rgba(34,197,94,0.2)' : fin.marginPercent >= 10 ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'}`,
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-text-secondary">Gross Margin</span>
                  <span
                    className="text-sm font-mono font-bold"
                    style={{ color: fin.marginPercent >= 20 ? '#22C55E' : fin.marginPercent >= 10 ? '#F59E0B' : '#EF4444' }}
                  >
                    {fin.marginPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="text-lg font-mono font-semibold text-text-primary">{formatCurrency(fin.grossMargin)}</div>
                <div className="text-xs text-text-muted mt-1">
                  {fin.marginPercent >= 20 ? '✓ Above 20% target' : fin.marginPercent >= 10 ? '⚠ Below 20% target' : '✗ Below 10% — at risk'}
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-text-muted">No financial data available.</p>
          )}
        </div>

        {/* Consultants */}
        <div className="p-6">
          <h3 className="font-serif text-sm text-text-primary mb-4">Consultants</h3>
          {consultants.length === 0 ? (
            <p className="text-xs text-text-muted">No consultants on this project.</p>
          ) : (
            <div className="flex flex-col gap-5">
              {consultants.map((c, i) => {
                const spentPct = c.budgeted > 0 ? Math.round((c.spent / c.budgeted) * 100) : 0
                const barColor = spentPct >= 100 ? '#EF4444' : spentPct >= 80 ? '#F59E0B' : '#22C55E'
                return (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-text-primary">{c.name}</span>
                      <Badge color="#8A8A8E" bg="#1E1E20">{c.specialty}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <ProgressBar value={Math.min(spentPct, 100)} height={5} color={barColor} />
                      </div>
                      <span className="text-xs font-mono text-text-muted shrink-0">{spentPct}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span>{formatCurrency(c.spent)} / {formatCurrency(c.budgeted)}</span>
                      <span>+{c.markup}% markup</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted">Passed through</span>
                      <span style={{ color: '#22C55E' }}>{formatCurrency(c.passedThrough)}</span>
                    </div>
                    {c.pendingPassThrough > 0 && (
                      <div
                        className="flex items-center justify-between text-xs px-2.5 py-2 rounded"
                        style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
                      >
                        <span style={{ color: '#F59E0B' }}>⚠ Pending pass-through</span>
                        <span className="font-mono font-semibold" style={{ color: '#F59E0B' }}>{formatCurrency(c.pendingPassThrough)}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Project description */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">About</div>
            <p className="text-xs text-text-secondary leading-relaxed">{project.description}</p>
            <div className="flex flex-col gap-1 mt-3">
              <div className="text-xs text-text-muted">{project.address}</div>
              <div className="text-xs text-text-muted">
                {formatDate(project.startDate)} → {formatDate(project.dueDate)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProjectsView() {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
  const [phaseFilter, setPhaseFilter] = useState<ProjectPhase | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<ProjectType | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { allProjects, projectsByPhase } = useProjects()
  const { startTimer } = useAppStore()

  const filtered = allProjects.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    if (phaseFilter !== 'all' && p.phase !== phaseFilter) return false
    if (typeFilter !== 'all' && p.type !== typeFilter) return false
    return true
  })

  const selectedProject = allProjects.find((p) => p.id === selectedId) ?? null

  const handleCardClick = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Projects"
        subtitle={`${allProjects.length} total · ${allProjects.filter((p) => p.status === 'active').length} active`}
        actions={
          <button className="px-4 py-2 rounded-button bg-gold/20 border border-gold/30 text-gold text-sm font-medium hover:bg-gold/30 transition-colors">
            + New Project
          </button>
        }
      />

      {/* Phase Pipeline Bar */}
      <div className="rounded-card border border-border bg-surface p-4 mb-6">
        <div className="text-xs text-text-muted mb-3 uppercase tracking-wider">Projects by AIA Phase</div>
        <div className="flex gap-2">
          {PHASES_ORDERED.map((phase) => {
            const count = projectsByPhase[phase].length
            return (
              <button
                key={phase}
                onClick={() => setPhaseFilter(phaseFilter === phase ? 'all' : phase)}
                className={`flex-1 flex flex-col items-center gap-1.5 p-2 rounded-button transition-all ${
                  phaseFilter === phase ? 'bg-gold/15 border border-gold/30' : 'hover:bg-border/40'
                }`}
              >
                <span className="text-lg font-mono font-semibold text-text-primary">{count}</span>
                <span className="text-xs text-text-secondary text-center leading-tight">{PHASE_LABELS[phase]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 mb-5">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
          className="px-3 py-1.5 rounded-button bg-surface border border-border text-text-secondary text-sm focus:outline-none focus:border-gold/50"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="on_hold">On Hold</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as ProjectType | 'all')}
          className="px-3 py-1.5 rounded-button bg-surface border border-border text-text-secondary text-sm focus:outline-none focus:border-gold/50"
        >
          <option value="all">All Types</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="institutional">Institutional</option>
          <option value="interior">Interior</option>
          <option value="mixed_use">Mixed Use</option>
        </select>
        <div className="ml-auto text-xs text-text-muted">
          {filtered.length} of {allProjects.length} projects
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((project) => {
          const budgetPct = Math.round((project.spent / project.budget) * 100)
          const priorityColor = PRIORITY_COLORS[project.priority]
          const health = healthScore(project)
          const isSelected = selectedId === project.id
          const phaseName = PHASE_LABELS[project.phase] ?? project.phase

          return (
            <div
              key={project.id}
              onClick={() => handleCardClick(project.id)}
              className="rounded-card border bg-surface p-5 hover:border-gold/30 transition-all cursor-pointer group relative"
              style={{ borderColor: isSelected ? 'rgba(200,169,126,0.4)' : '#1E1E20' }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: priorityColor }}
                      title={`${project.priority} priority`}
                    />
                    <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-gold transition-colors">
                      {project.name}
                    </h3>
                  </div>
                  <p className="text-xs text-text-muted truncate">{project.clientName}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={project.status} />
                  <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ background: health.bg, color: health.color }}>
                    {health.label}
                  </span>
                </div>
              </div>

              {/* Type + Phase */}
              <div className="flex items-center gap-2 mb-4">
                <StatusBadge status={project.type} />
                <StatusBadge status={project.phase} />
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text-muted">Progress</span>
                  <span className="text-xs font-mono text-text-secondary">{project.progress}%</span>
                </div>
                <ProgressBar value={project.progress} height={5} color="#C8A97E" />
              </div>

              {/* Budget */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text-muted">Budget</span>
                  <span className={`text-xs font-mono ${budgetPct > 90 ? 'text-status-red' : budgetPct > 75 ? 'text-status-amber' : 'text-text-secondary'}`}>
                    {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
                  </span>
                </div>
                <ProgressBar
                  value={budgetPct}
                  height={4}
                  color={budgetPct > 90 ? '#EF4444' : budgetPct > 75 ? '#F59E0B' : '#22C55E'}
                />
              </div>

              {/* P&L quick stat */}
              {project.financials && (
                <div className="mb-3 flex items-center justify-between py-2 px-2.5 rounded" style={{ background: '#0A0A0B' }}>
                  <span className="text-xs text-text-muted">Margin</span>
                  <span
                    className="text-xs font-mono font-semibold"
                    style={{ color: project.financials.marginPercent >= 20 ? '#22C55E' : project.financials.marginPercent >= 10 ? '#F59E0B' : '#EF4444' }}
                  >
                    {project.financials.marginPercent.toFixed(1)}%
                  </span>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <div className="text-xs text-text-muted">Due</div>
                  <div className="text-xs font-mono text-text-secondary">{formatDate(project.dueDate)}</div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Start timer button — visible on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      startTimer(project.id, project.name, phaseName)
                    }}
                    title="Start timer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-6 h-6 rounded-full text-xs"
                    style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' }}
                  >
                    ▶
                  </button>
                  <AvatarStack members={project.members} size="sm" max={3} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Detail Panel */}
      {selectedProject && (
        <ProjectDetailPanel
          project={selectedProject}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  )
}
