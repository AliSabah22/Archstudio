
import { PageHeader } from '@/design-system/layouts/PageHeader'
import { Badge } from '@/design-system/components/Badge'
import { ESTIMATES } from '@/data/mockData'
import { FeeStructure } from '@/types/common'
import type { Estimate } from '@/types/estimate'

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toFixed(0)}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
}

const FEE_STRUCTURE_LABELS: Record<FeeStructure, string> = {
  [FeeStructure.PercentageOfConstruction]: '% of Construction',
  [FeeStructure.HourlyRate]: 'Hourly Rate',
  [FeeStructure.FixedFee]: 'Fixed Fee',
  [FeeStructure.Stipulated]: 'Stipulated Sum',
}

const ESTIMATE_STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  draft: { color: '#8A8A8E', bg: '#1E1E20', label: 'Draft' },
  sent: { color: '#3B82F6', bg: 'rgba(59,130,246,0.15)', label: 'Sent' },
  accepted: { color: '#22C55E', bg: 'rgba(34,197,94,0.15)', label: 'Accepted' },
  rejected: { color: '#EF4444', bg: 'rgba(239,68,68,0.15)', label: 'Rejected' },
}

function EstimateCard({ estimate }: { estimate: Estimate }) {
  const statusConf = ESTIMATE_STATUS_CONFIG[estimate.status]
  const totalHours = estimate.hourBreakdown.reduce((sum, row) => sum + row.hours, 0)

  return (
    <div className="rounded-card border border-border bg-surface p-5 hover:border-gold/30 transition-all cursor-pointer">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-text-primary leading-tight">{estimate.name}</h3>
        <Badge color={statusConf.color} bg={statusConf.bg}>{statusConf.label}</Badge>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-text-muted">{estimate.clientName}</span>
        <span className="text-text-muted">·</span>
        <Badge color="#C8A97E" bg="rgba(200,169,126,0.15)">
          {FEE_STRUCTURE_LABELS[estimate.feeStructure]}
        </Badge>
      </div>

      {/* Fee */}
      <div className="flex items-end justify-between mb-4 pb-4 border-b border-border">
        <div>
          <div className="text-xs text-text-muted mb-1">Estimated Fee</div>
          <div className="text-2xl font-mono font-semibold text-text-primary">
            {formatCurrency(estimate.estimatedFee)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-text-muted mb-1">Total Hours</div>
          <div className="text-lg font-mono font-semibold text-text-secondary">{totalHours}h</div>
        </div>
      </div>

      {/* Phase breakdown (condensed) */}
      <div className="flex flex-col gap-1.5 mb-4">
        {estimate.hourBreakdown.map((row) => (
          <div key={row.phase} className="flex items-center justify-between">
            <span className="text-xs text-text-muted">{row.phase}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-text-secondary">{row.hours}h</span>
              <span className="text-xs font-mono text-text-secondary w-16 text-right">
                ${row.amount.toLocaleString('en-CA', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-border">
        <span>Created {formatDate(estimate.createdAt)}</span>
        <span>Expires {formatDate(estimate.expiresAt)}</span>
      </div>
    </div>
  )
}

export function EstimatesView() {
  return (
    <div className="p-8">
      <PageHeader
        title="Estimates"
        subtitle="Fee proposals & hour breakdowns"
        actions={
          <button className="px-4 py-2 rounded-button bg-gold/20 border border-gold/30 text-gold text-sm font-medium hover:bg-gold/30 transition-colors">
            + New Estimate
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4">
        {ESTIMATES.map((estimate) => (
          <EstimateCard key={estimate.id} estimate={estimate} />
        ))}
      </div>
    </div>
  )
}
