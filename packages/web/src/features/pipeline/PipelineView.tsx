import { PageHeader } from '@/design-system/layouts/PageHeader'
import { StatusBadge } from '@/design-system/components/StatusBadge'
import { Badge } from '@/design-system/components/Badge'
import { usePipeline } from '@/hooks/usePipeline'
import { PipelineStage } from '@/types/common'
import { CLOSED_OPPORTUNITIES, STAGE_VELOCITY } from '@/data/mockData'
import type { PipelineOpportunity } from '@/types/pipeline'

const QUARTERLY_REVENUE_TARGET = 400_000

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toFixed(0)}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
}

const SOURCE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  instagram: { label: 'Instagram', color: '#A855F7', bg: 'rgba(168,85,247,0.15)' },
  website: { label: 'Website', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
  referral: { label: 'Referral', color: '#22C55E', bg: 'rgba(34,197,94,0.15)' },
  google_ads: { label: 'Google Ads', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
}

const ACTIVE_STAGES: PipelineStage[] = [
  PipelineStage.InitialContact,
  PipelineStage.Consultation,
  PipelineStage.ProposalSent,
  PipelineStage.Shortlisted,
]

const STAGE_COLORS: Record<PipelineStage, string> = {
  [PipelineStage.InitialContact]: '#8A8A8E',
  [PipelineStage.Consultation]: '#3B82F6',
  [PipelineStage.ProposalSent]: '#F59E0B',
  [PipelineStage.Shortlisted]: '#A855F7',
  [PipelineStage.Won]: '#22C55E',
  [PipelineStage.Lost]: '#EF4444',
}

const STAGE_VELOCITY_LABELS: Record<string, string> = {
  [PipelineStage.InitialContact]: 'Initial Contact',
  [PipelineStage.Consultation]: 'Consultation',
  [PipelineStage.ProposalSent]: 'Proposal Sent',
  [PipelineStage.Shortlisted]: 'Shortlisted',
}

function OpportunityCard({ opp }: { opp: PipelineOpportunity }) {
  const src = SOURCE_CONFIG[opp.source] ?? SOURCE_CONFIG['referral']
  const probColor = opp.probability >= 75 ? '#22C55E' : opp.probability >= 50 ? '#F59E0B' : '#EF4444'
  const avgDays = STAGE_VELOCITY[opp.stage] ?? 999
  const isStale = opp.daysInCurrentStage > avgDays

  return (
    <div className="rounded-card border border-border bg-bg p-4 hover:border-gold/30 transition-all cursor-pointer">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-semibold text-text-primary leading-tight flex-1 min-w-0 truncate">{opp.name}</h4>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <Badge color={src.color} bg={src.bg}>{src.label}</Badge>
          {opp.referredBy && (
            <span className="text-xs" style={{ color: '#5A5A60' }}>via {opp.referredBy}</span>
          )}
        </div>
      </div>
      <p className="text-xs text-text-muted mb-3">{opp.contactName}</p>
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-mono font-semibold text-text-primary">
          {formatCurrency(opp.estimatedValue)}
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: probColor }} />
          <span className="text-xs font-mono text-text-secondary">{opp.probability}%</span>
        </div>
      </div>

      {/* Stale indicator */}
      {isStale && (
        <div className="mb-2">
          <span
            className="text-xs px-2 py-0.5 rounded font-medium"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' }}
          >
            Stale — {opp.daysInCurrentStage} days (avg {avgDays}d)
          </span>
        </div>
      )}

      <div className="pt-2 border-t border-border">
        <div className="text-xs text-text-muted mb-0.5">Next: {formatDate(opp.nextActionDate)}</div>
        <div className="text-xs text-text-secondary truncate">{opp.nextAction}</div>
      </div>
    </div>
  )
}

export function PipelineView() {
  const { opportunitiesByStage, weightedPipelineValue, totalPipelineValue, stageValue } = usePipeline()

  // Coverage ratio
  const coverageRatio = weightedPipelineValue / QUARTERLY_REVENUE_TARGET
  const coverageColor = coverageRatio >= 2 ? '#22C55E' : coverageRatio >= 1 ? '#F59E0B' : '#EF4444'

  // Win/loss stats
  const won = CLOSED_OPPORTUNITIES.filter((o) => o.result === 'won')
  const lost = CLOSED_OPPORTUNITIES.filter((o) => o.result === 'lost')
  const winRate = Math.round((won.length / CLOSED_OPPORTUNITIES.length) * 100)
  const costOfLostProposals = lost.reduce((s, o) => s + o.proposalHours * 200, 0)

  // Top loss reason
  const lossReasonCounts: Record<string, number> = {}
  lost.forEach((o) => {
    if (o.lossReason) lossReasonCounts[o.lossReason] = (lossReasonCounts[o.lossReason] ?? 0) + 1
  })
  const topLossReason = Object.entries(lossReasonCounts).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="p-8 flex flex-col" style={{ minHeight: '100%' }}>
      <PageHeader
        title="Pipeline"
        subtitle="Opportunity tracking — Q2 2026"
        actions={
          <button className="px-4 py-2 rounded-button bg-gold/20 border border-gold/30 text-gold text-sm font-medium hover:bg-gold/30 transition-colors">
            + Add Opportunity
          </button>
        }
      />

      {/* Pipeline Metrics Bar */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="text-xs text-text-muted mb-1">Total Pipeline</div>
          <div className="text-xl font-mono font-bold text-text-primary">{formatCurrency(totalPipelineValue)}</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="text-xs text-text-muted mb-1">Weighted Value</div>
          <div className="text-xl font-mono font-bold text-gold">{formatCurrency(weightedPipelineValue)}</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="text-xs text-text-muted mb-1">Coverage Ratio</div>
          <div className="text-xl font-mono font-bold" style={{ color: coverageColor }}>
            {coverageRatio.toFixed(1)}x
          </div>
          <div className="text-xs mt-0.5" style={{ color: coverageColor }}>
            {coverageRatio >= 2 ? '✓ Healthy coverage' : coverageRatio >= 1 ? '⚠ Low coverage' : '✗ Below target'}
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="text-xs text-text-muted mb-1">Win Rate (12mo)</div>
          <div className="text-xl font-mono font-bold" style={{ color: winRate >= 60 ? '#22C55E' : winRate >= 40 ? '#F59E0B' : '#EF4444' }}>
            {winRate}%
          </div>
          <div className="text-xs text-text-muted mt-0.5">{won.length}W / {lost.length}L of {CLOSED_OPPORTUNITIES.length}</div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 mb-5" style={{ minHeight: 360 }}>
        {ACTIVE_STAGES.map((stage) => {
          const opps = opportunitiesByStage[stage]
          const stageColor = STAGE_COLORS[stage]
          const value = stageValue(stage)
          const avgDays = STAGE_VELOCITY[stage] ?? 0

          return (
            <div
              key={stage}
              className="flex flex-col rounded-card border border-border bg-surface flex-1"
              style={{ minWidth: 260 }}
            >
              {/* Column header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stageColor }} />
                  <StatusBadge status={stage} />
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-text-secondary">{formatCurrency(value)}</div>
                  <div className="text-xs text-text-muted">{opps.length} opp{opps.length !== 1 ? 's' : ''} · avg {avgDays}d</div>
                </div>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3 p-3 overflow-y-auto flex-1">
                {opps.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-xs text-text-muted">
                    No opportunities
                  </div>
                ) : (
                  opps.map((opp) => <OpportunityCard key={opp.id} opp={opp} />)
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Pipeline Velocity Table */}
      <div className="rounded-card border border-border bg-surface p-5 mb-4">
        <h3 className="font-serif text-sm text-text-primary mb-4">Stage Velocity</h3>
        <div className="grid grid-cols-4 gap-4">
          {ACTIVE_STAGES.map((stage) => {
            const avgDays = STAGE_VELOCITY[stage] ?? 0
            const opps = opportunitiesByStage[stage]
            const staleCount = opps.filter((o) => o.daysInCurrentStage > avgDays).length
            return (
              <div key={stage} className="flex flex-col gap-1 p-3 rounded-button" style={{ background: '#0A0A0B' }}>
                <div className="text-xs font-medium text-text-secondary">{STAGE_VELOCITY_LABELS[stage]}</div>
                <div className="text-xl font-mono font-bold text-text-primary">{avgDays}d</div>
                <div className="text-xs text-text-muted">avg days</div>
                {staleCount > 0 && (
                  <div className="text-xs mt-1" style={{ color: '#F59E0B' }}>
                    {staleCount} stale
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Win/Loss History + Cost of Lost Proposals */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-card border border-border bg-surface p-5">
          <h3 className="font-serif text-sm text-text-primary mb-4">Win / Loss History — Last 12 months</h3>
          <div className="flex items-center gap-6 mb-4">
            <div>
              <div className="text-xs text-text-muted mb-1">Won</div>
              <div className="text-2xl font-mono font-bold" style={{ color: '#22C55E' }}>{won.length}</div>
            </div>
            <div>
              <div className="text-xs text-text-muted mb-1">Lost</div>
              <div className="text-2xl font-mono font-bold" style={{ color: '#EF4444' }}>{lost.length}</div>
            </div>
            <div>
              <div className="text-xs text-text-muted mb-1">Win Rate</div>
              <div className="text-2xl font-mono font-bold" style={{ color: winRate >= 60 ? '#22C55E' : '#F59E0B' }}>{winRate}%</div>
            </div>
          </div>
          {topLossReason && (
            <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-button" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <span style={{ color: '#EF4444' }}>Top loss reason:</span>
              <span className="text-text-secondary font-medium">{topLossReason[0]}</span>
              <span className="text-text-muted">({topLossReason[1]} times)</span>
            </div>
          )}
          <div className="mt-4 flex flex-col gap-1.5">
            {CLOSED_OPPORTUNITIES.slice(0, 6).map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span style={{ color: o.result === 'won' ? '#22C55E' : '#EF4444', fontSize: 10 }}>
                    {o.result === 'won' ? '●' : '○'}
                  </span>
                  <span className="text-xs text-text-secondary truncate">{o.name}</span>
                </div>
                <span className="text-xs font-mono text-text-muted shrink-0">{formatCurrency(o.value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface p-5">
          <h3 className="font-serif text-sm text-text-primary mb-4">Proposal Economics</h3>
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-button" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <div className="text-xs text-text-muted mb-1">Cost of Lost Proposals</div>
              <div className="text-2xl font-mono font-bold" style={{ color: '#EF4444' }}>{formatCurrency(costOfLostProposals)}</div>
              <div className="text-xs text-text-muted mt-1">
                {lost.reduce((s, o) => s + o.proposalHours, 0)}h × $200/h across {lost.length} lost proposals
              </div>
            </div>
            <div className="p-4 rounded-button" style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.15)' }}>
              <div className="text-xs text-text-muted mb-1">Revenue Won</div>
              <div className="text-2xl font-mono font-bold" style={{ color: '#22C55E' }}>
                {formatCurrency(won.reduce((s, o) => s + o.value, 0))}
              </div>
              <div className="text-xs text-text-muted mt-1">
                Avg proposal effort: {Math.round(won.reduce((s, o) => s + o.proposalHours, 0) / Math.max(won.length, 1))}h per won deal
              </div>
            </div>
            <div className="p-3 rounded-button" style={{ background: '#0A0A0B' }}>
              <div className="text-xs text-text-muted mb-2">Loss Reasons</div>
              {Object.entries(lossReasonCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([reason, count]) => (
                  <div key={reason} className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-secondary">{reason}</span>
                    <span className="text-xs font-mono text-text-muted">{count}×</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
