
import { PageHeader } from '@/design-system/layouts/PageHeader'
import { StatusBadge } from '@/design-system/components/StatusBadge'
import { Badge } from '@/design-system/components/Badge'
import { usePipeline } from '@/hooks/usePipeline'
import { PipelineStage } from '@/types/common'
import type { PipelineOpportunity } from '@/types/pipeline'

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

function OpportunityCard({ opp }: { opp: PipelineOpportunity }) {
  const src = SOURCE_CONFIG[opp.source] ?? SOURCE_CONFIG['referral']
  const probColor =
    opp.probability >= 75 ? '#22C55E' : opp.probability >= 50 ? '#F59E0B' : '#EF4444'

  return (
    <div className="rounded-card border border-border bg-bg p-4 hover:border-gold/30 transition-all cursor-pointer">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-semibold text-text-primary leading-tight">{opp.name}</h4>
        <Badge color={src.color} bg={src.bg}>{src.label}</Badge>
      </div>
      <p className="text-xs text-text-muted mb-3">{opp.contactName}</p>
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-mono font-semibold text-text-primary">
          {formatCurrency(opp.estimatedValue)}
        </span>
        <div className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: probColor }}
          />
          <span className="text-xs font-mono text-text-secondary">{opp.probability}%</span>
        </div>
      </div>
      <div className="pt-2 border-t border-border">
        <div className="text-xs text-text-muted mb-0.5">Next: {formatDate(opp.nextActionDate)}</div>
        <div className="text-xs text-text-secondary truncate">{opp.nextAction}</div>
      </div>
    </div>
  )
}

export function PipelineView() {
  const { opportunitiesByStage, weightedPipelineValue, totalPipelineValue, stageValue } = usePipeline()

  return (
    <div className="p-8 flex flex-col h-full">
      <PageHeader
        title="Pipeline"
        subtitle="Opportunity tracking — Q2 2024"
        actions={
          <button className="px-4 py-2 rounded-button bg-gold/20 border border-gold/30 text-gold text-sm font-medium hover:bg-gold/30 transition-colors">
            + Add Opportunity
          </button>
        }
      />

      {/* Kanban Board */}
      <div className="flex gap-4 flex-1 overflow-x-auto pb-4">
        {ACTIVE_STAGES.map((stage) => {
          const opps = opportunitiesByStage[stage]
          const stageColor = STAGE_COLORS[stage]
          const value = stageValue(stage)

          return (
            <div
              key={stage}
              className="flex flex-col rounded-card border border-border bg-surface min-w-[280px] flex-1"
            >
              {/* Column header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stageColor }} />
                  <StatusBadge status={stage} />
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-text-secondary">{formatCurrency(value)}</div>
                  <div className="text-xs text-text-muted">{opps.length} opp{opps.length !== 1 ? 's' : ''}</div>
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

      {/* Bottom summary bar */}
      <div className="mt-4 rounded-card border border-border bg-surface px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-xs text-text-muted">Total Pipeline</div>
            <div className="text-lg font-mono font-semibold text-text-primary">{formatCurrency(totalPipelineValue)}</div>
          </div>
          <div>
            <div className="text-xs text-text-muted">Weighted Value</div>
            <div className="text-lg font-mono font-semibold text-gold">{formatCurrency(weightedPipelineValue)}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-xs text-text-muted">Won</div>
            <div className="text-sm font-mono font-semibold text-status-green">
              {opportunitiesByStage[PipelineStage.Won].length}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-text-muted">Lost</div>
            <div className="text-sm font-mono font-semibold text-status-red">
              {opportunitiesByStage[PipelineStage.Lost].length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
