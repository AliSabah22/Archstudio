import { useState } from 'react'
import { PageHeader } from '@/design-system/layouts/PageHeader'
import { StatusBadge } from '@/design-system/components/StatusBadge'
import { ProgressBar } from '@/design-system/components/ProgressBar'
import { AvatarStack } from '@/design-system/components/AvatarStack'
import { useProjects } from '@/hooks/useProjects'
import { ProjectPhase, ProjectStatus, ProjectType } from '@/types/common'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatCurrency(value: number): string {
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

export function ProjectsView() {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
  const [phaseFilter, setPhaseFilter] = useState<ProjectPhase | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<ProjectType | 'all'>('all')
  const { allProjects, projectsByPhase } = useProjects()

  const filtered = allProjects.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    if (phaseFilter !== 'all' && p.phase !== phaseFilter) return false
    if (typeFilter !== 'all' && p.type !== typeFilter) return false
    return true
  })

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
          return (
            <div
              key={project.id}
              className="rounded-card border border-border bg-surface p-5 hover:border-gold/30 transition-all cursor-pointer group"
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
                <StatusBadge status={project.status} />
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
              <div className="mb-4">
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

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <div className="text-xs text-text-muted">Due</div>
                  <div className="text-xs font-mono text-text-secondary">{formatDate(project.dueDate)}</div>
                </div>
                <AvatarStack members={project.members} size="sm" max={3} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
