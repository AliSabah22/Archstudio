import { PageHeader } from '@/design-system/layouts/PageHeader'
import { StatCard } from '@/design-system/components/StatCard'
import { ProgressBar } from '@/design-system/components/ProgressBar'

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toFixed(0)}`
}

const MARGIN_MONTHS = [
  { month: 'May 25', revenue: 98000, cost: 79000, margin: 19.4 },
  { month: 'Jun 25', revenue: 112000, cost: 89000, margin: 20.5 },
  { month: 'Jul 25', revenue: 125000, cost: 98000, margin: 21.6 },
  { month: 'Aug 25', revenue: 118000, cost: 93000, margin: 21.2 },
  { month: 'Sep 25', revenue: 134000, cost: 105000, margin: 21.6 },
  { month: 'Oct 25', revenue: 148000, cost: 116000, margin: 21.6 },
  { month: 'Nov 25', revenue: 156000, cost: 123000, margin: 21.2 },
  { month: 'Dec 25', revenue: 142000, cost: 114000, margin: 19.7 },
  { month: 'Jan 26', revenue: 138000, cost: 112000, margin: 18.8 },
  { month: 'Feb 26', revenue: 147000, cost: 119000, margin: 19.0 },
  { month: 'Mar 26', revenue: 162000, cost: 128000, margin: 21.0 },
  { month: 'Apr 26', revenue: 165000, cost: 132500, margin: 19.7 },
]

const PROJECT_FINANCIALS = [
  { id: 'proj_004', name: 'Lakeside Penthouse', client: 'Ramirez & Associates', phase: 'CA', contract: 195000, marginPct: 31.1 },
  { id: 'proj_002', name: 'Chen Commercial Complex', client: 'Chen Commercial Group', phase: 'CD', contract: 1200000, marginPct: 26.0 },
  { id: 'proj_006', name: 'Harbourfront Bistro', client: 'Bellani Restaurant Group', phase: 'Bidding', contract: 320000, marginPct: 32.5 },
  { id: 'proj_001', name: 'Mehta Residence', client: 'Mehta Family', phase: 'DD', contract: 285000, marginPct: 23.5 },
  { id: 'proj_003', name: 'Thornton Community Library', client: 'City of Toronto', phase: 'SD', contract: 850000, marginPct: 18.7 },
  { id: 'proj_005', name: 'Forest Hill Mixed-Use', client: 'Greenleaf Developments', phase: 'Pre-Design', contract: 2400000, marginPct: 17.9 },
].sort((a, b) => b.marginPct - a.marginPct)

const REVENUE_BY_TYPE = [
  { label: 'Commercial', pct: 55, color: '#22C55E' },
  { label: 'Residential', pct: 18, color: '#C8A97E' },
  { label: 'Hospitality', pct: 14, color: '#A855F7' },
  { label: 'Mixed-Use / Inst.', pct: 13, color: '#3B82F6' },
]

const REVENUE_BY_SERVICE = [
  { label: 'Core Design (SD–CD)', pct: 87, color: '#C8A97E' },
  { label: 'Construction Admin', pct: 8, color: '#3B82F6' },
  { label: 'Feasibility Studies', pct: 3, color: '#A855F7' },
  { label: 'Other', pct: 2, color: '#8A8A8E' },
]

const TOP_CLIENTS = [
  { name: 'Greenleaf Developments', pct: 34, color: '#22C55E' },
  { name: 'Chen Commercial Group', pct: 22, color: '#3B82F6' },
  { name: 'City of Toronto', pct: 14, color: '#A855F7' },
  { name: 'Bellani Restaurant Group', pct: 9, color: '#C8A97E' },
  { name: 'Others', pct: 21, color: '#5A5A60' },
]

const maxRevenue = Math.max(...MARGIN_MONTHS.map((m) => m.revenue))

export function FinancialsView() {
  const ytdRevenue = MARGIN_MONTHS.slice(6).reduce((s, m) => s + m.revenue, 0)
  const currentMonth = MARGIN_MONTHS[MARGIN_MONTHS.length - 1]
  const prevMonth = MARGIN_MONTHS[MARGIN_MONTHS.length - 2]
  const momChange = Math.round(((currentMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100)

  return (
    <div className="p-8">
      <PageHeader
        title="Financials"
        subtitle="Firm-wide profitability & revenue analytics"
        actions={
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-button text-xs font-medium transition-colors" style={{ background: 'rgba(200,169,126,0.12)', border: '1px solid rgba(200,169,126,0.25)', color: '#C8A97E' }}>
              Export CSV
            </button>
            <button className="px-3 py-1.5 rounded-button text-xs font-medium transition-colors" style={{ background: 'rgba(200,169,126,0.15)', border: '1px solid rgba(200,169,126,0.3)', color: '#C8A97E' }}>
              Export PDF
            </button>
          </div>
        }
      />

      {/* Section 1 — P&L Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Revenue (April 2026)"
          value={formatCurrency(currentMonth.revenue)}
          subText={`${momChange > 0 ? '+' : ''}${momChange}% vs last month`}
          trend={{ direction: momChange >= 0 ? 'up' : 'down', percent: Math.abs(momChange) }}
        />
        <StatCard
          label="Gross Margin"
          value={`${currentMonth.margin}%`}
          subText={`${formatCurrency(currentMonth.revenue - currentMonth.cost)} gross profit`}
          trend={{ direction: currentMonth.margin >= 20 ? 'up' : 'down', percent: Math.abs(currentMonth.margin - 20) }}
        />
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="text-xs text-text-muted mb-1">YTD Revenue</div>
          <div className="text-2xl font-mono font-semibold text-gold mb-1">{formatCurrency(ytdRevenue)}</div>
          <div className="mb-2">
            <ProgressBar value={Math.round((ytdRevenue / 775000) * 100)} height={5} color="#C8A97E" />
          </div>
          <div className="text-xs text-text-muted">{Math.round((ytdRevenue / 775000) * 100)}% of $775K annual target</div>
        </div>
      </div>

      {/* Section 2 — Projects by Margin */}
      <div className="rounded-card border border-border bg-surface mb-6">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-serif text-base text-text-primary">Projects Ranked by Margin</h2>
        </div>
        <div className="grid gap-0" style={{ gridTemplateColumns: '1fr 1fr 80px 120px 80px 120px' }}>
          <div className="px-5 py-2 border-b border-border"><span className="text-xs font-medium text-text-muted uppercase tracking-wider">Project</span></div>
          <div className="px-5 py-2 border-b border-border"><span className="text-xs font-medium text-text-muted uppercase tracking-wider">Client</span></div>
          <div className="px-5 py-2 border-b border-border"><span className="text-xs font-medium text-text-muted uppercase tracking-wider">Phase</span></div>
          <div className="px-5 py-2 border-b border-border text-right"><span className="text-xs font-medium text-text-muted uppercase tracking-wider">Contract</span></div>
          <div className="px-5 py-2 border-b border-border text-right"><span className="text-xs font-medium text-text-muted uppercase tracking-wider">Margin</span></div>
          <div className="px-5 py-2 border-b border-border text-right"><span className="text-xs font-medium text-text-muted uppercase tracking-wider">Status</span></div>

          {PROJECT_FINANCIALS.map((p) => {
            const marginColor = p.marginPct >= 20 ? '#22C55E' : p.marginPct >= 10 ? '#F59E0B' : '#EF4444'
            const statusLabel = p.marginPct >= 20 ? '✓ Healthy' : '⚠ Watch'
            const statusColor = p.marginPct >= 20 ? '#22C55E' : '#F59E0B'
            return (
              <>
                <div key={`${p.id}-name`} className="px-5 py-3 border-b border-border flex items-center">
                  <span className="text-sm text-text-primary font-medium">{p.name}</span>
                </div>
                <div className="px-5 py-3 border-b border-border flex items-center">
                  <span className="text-xs text-text-muted">{p.client}</span>
                </div>
                <div className="px-5 py-3 border-b border-border flex items-center">
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#1E1E20', color: '#8A8A8E' }}>{p.phase}</span>
                </div>
                <div className="px-5 py-3 border-b border-border flex items-center justify-end">
                  <span className="text-sm font-mono text-text-primary">{formatCurrency(p.contract)}</span>
                </div>
                <div className="px-5 py-3 border-b border-border flex items-center justify-end">
                  <span className="text-sm font-mono font-semibold" style={{ color: marginColor }}>{p.marginPct}%</span>
                </div>
                <div className="px-5 py-3 border-b border-border flex items-center justify-end">
                  <span className="text-xs font-medium" style={{ color: statusColor }}>{statusLabel}</span>
                </div>
              </>
            )
          })}
        </div>
      </div>

      {/* Section 3 — Key Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Firm Utilization', value: '79%', sub: 'Target: 75–85%', good: true },
          { label: 'Realization Rate', value: '87%', sub: 'Billable hrs → collected', good: true },
          { label: 'Revenue Multiplier', value: '2.8×', sub: 'Revenue ÷ labor cost (target 3.0×)', good: false },
          { label: 'Avg Collection Days', value: '42 days', sub: 'Industry avg: 74 days ✓ Strength', good: true },
        ].map((m) => (
          <div key={m.label} className="rounded-card border border-border bg-surface p-4">
            <div className="text-xs text-text-muted mb-1">{m.label}</div>
            <div className="text-2xl font-mono font-semibold mb-1" style={{ color: m.good ? '#22C55E' : '#F59E0B' }}>{m.value}</div>
            <div className="text-xs text-text-muted">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Section 4 — Revenue breakdown */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { title: 'Revenue by Project Type', data: REVENUE_BY_TYPE.map((d) => ({ label: d.label, pct: d.pct, color: d.color })) },
          { title: 'Revenue by Service Type', data: REVENUE_BY_SERVICE.map((d) => ({ label: d.label, pct: d.pct, color: d.color })) },
          { title: 'Revenue by Client (Top 5)', data: TOP_CLIENTS.map((d) => ({ label: d.name, pct: d.pct, color: d.color })) },
        ].map((section) => (
          <div key={section.title} className="rounded-card border border-border bg-surface p-5">
            <h3 className="font-serif text-sm text-text-primary mb-4">{section.title}</h3>
            <div className="flex flex-col gap-2.5">
              {section.data.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-text-secondary truncate">{item.label}</span>
                      <span className="text-xs font-mono text-text-primary shrink-0 ml-1">{item.pct}%</span>
                    </div>
                    <ProgressBar value={item.pct} height={4} color={item.color} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Section 5 — Monthly Trend */}
      <div className="rounded-card border border-border bg-surface p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-base text-text-primary">12-Month Revenue Trend</h2>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded" style={{ background: '#C8A97E' }} /><span className="text-text-muted">Revenue</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded" style={{ background: '#EF4444' }} /><span className="text-text-muted">Cost</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded" style={{ background: '#22C55E' }} /><span className="text-text-muted">Margin</span></div>
          </div>
        </div>

        {/* Chart */}
        <div className="flex items-end gap-1.5" style={{ height: 120 }}>
          {MARGIN_MONTHS.map((m) => {
            const revH = Math.round((m.revenue / maxRevenue) * 110)
            const costH = Math.round((m.cost / maxRevenue) * 110)
            const isCurrentMonth = m.month === 'Apr 26'
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5 group" title={`${m.month}: Revenue ${formatCurrency(m.revenue)} · Cost ${formatCurrency(m.cost)} · Margin ${m.margin}%`}>
                <div className="flex items-end gap-0.5 w-full">
                  <div
                    className="flex-1 rounded-t-sm transition-all"
                    style={{ height: revH, background: isCurrentMonth ? '#C8A97E' : 'rgba(200,169,126,0.5)' }}
                  />
                  <div
                    className="flex-1 rounded-t-sm"
                    style={{ height: costH, background: isCurrentMonth ? 'rgba(239,68,68,0.7)' : 'rgba(239,68,68,0.3)' }}
                  />
                </div>
                <span className="text-xs text-text-muted" style={{ fontSize: 9 }}>{m.month}</span>
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
          <div className="text-xs text-text-muted">Current month margin: <span className="font-semibold" style={{ color: currentMonth.margin >= 20 ? '#22C55E' : '#F59E0B' }}>{currentMonth.margin}%</span></div>
          <div className="text-xs text-text-muted">Forest Hill Mixed-Use (proj_005) margin at 17.9% — below 20% target. Scope control needed in upcoming SD phase.</div>
        </div>
      </div>
    </div>
  )
}
