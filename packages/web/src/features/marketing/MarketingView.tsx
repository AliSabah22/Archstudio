import React from 'react'
import { Instagram, Globe, Users, Search, TrendingUp, TrendingDown } from 'lucide-react'
import { PageHeader } from '@/design-system/layouts/PageHeader'
import { StatCard } from '@/design-system/components/StatCard'
import { ProgressBar } from '@/design-system/components/ProgressBar'
import { MARKETING_CHANNELS, MARKETING_SUMMARY, PROJECTS } from '@/data/mockData'
import { LeadChannel } from '@/types/common'
import type { MarketingChannel } from '@/data/mockData'

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toFixed(0)}`
}

const CHANNEL_ICONS: Record<LeadChannel, React.ReactNode> = {
  [LeadChannel.Instagram]: <Instagram className="w-5 h-5" />,
  [LeadChannel.Website]: <Globe className="w-5 h-5" />,
  [LeadChannel.Referral]: <Users className="w-5 h-5" />,
  [LeadChannel.GoogleAds]: <Search className="w-5 h-5" />,
}

const CHANNEL_COLORS: Record<LeadChannel, { color: string; bg: string }> = {
  [LeadChannel.Instagram]: { color: '#A855F7', bg: 'rgba(168,85,247,0.1)' },
  [LeadChannel.Website]: { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  [LeadChannel.Referral]: { color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  [LeadChannel.GoogleAds]: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
}

// Service revenue breakdown (demo data)
const SERVICE_BREAKDOWN = [
  { label: 'Core Design (SD–CD)', pct: 87, color: '#C8A97E' },
  { label: 'Construction Administration', pct: 8, color: '#3B82F6' },
  { label: 'Feasibility Studies', pct: 3, color: '#A855F7' },
  { label: 'Other Services', pct: 2, color: '#8A8A8E' },
]

// Herfindahl-Hirschman-like diversification score (0–100, higher = more diversified)
function diversificationScore(services: { pct: number }[]): number {
  const hhi = services.reduce((sum, s) => sum + (s.pct / 100) ** 2, 0)
  return Math.round((1 - hhi) * 100)
}

const divScore = diversificationScore(SERVICE_BREAKDOWN)
const divConfig =
  divScore >= 50
    ? { label: 'Diversified', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' }
    : divScore >= 30
    ? { label: 'Moderate Concentration', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' }
    : { label: 'High Concentration Risk', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' }

// Service attach rate: projects with any non-core service
const activeProjects = PROJECTS.filter((p) => p.status === 'active')
// For demo, half of active projects include additional services
const attachCount = Math.floor(activeProjects.length * 0.5)
const attachRate = Math.round((attachCount / activeProjects.length) * 100)

function ChannelCard({ channel }: { channel: MarketingChannel }) {
  const config = CHANNEL_COLORS[channel.channel]
  const leadDelta = channel.leadsThisMonth - channel.leadsLastMonth
  const isUp = leadDelta >= 0
  const maxLeads = Math.max(...MARKETING_CHANNELS.map((c) => c.leadsThisMonth))

  return (
    <div className="rounded-card border border-border bg-surface p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-button flex items-center justify-center"
          style={{ backgroundColor: config.bg, color: config.color }}
        >
          {CHANNEL_ICONS[channel.channel]}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-primary">{channel.label}</h3>
          <div className="flex items-center gap-1 text-xs">
            {isUp ? (
              <TrendingUp className="w-3 h-3 text-status-green" />
            ) : (
              <TrendingDown className="w-3 h-3 text-status-red" />
            )}
            <span className={isUp ? 'text-status-green' : 'text-status-red'}>
              {isUp ? '+' : ''}{leadDelta} leads vs last month
            </span>
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-text-muted mb-1">Leads This Month</div>
          <div className="text-2xl font-mono font-semibold text-text-primary">{channel.leadsThisMonth}</div>
        </div>
        <div>
          <div className="text-xs text-text-muted mb-1">Conversion Rate</div>
          <div className="text-2xl font-mono font-semibold" style={{ color: channel.conversionRate > 0 ? config.color : '#5A5A60' }}>
            {channel.conversionRate > 0 ? `${channel.conversionRate.toFixed(1)}%` : '0%'}
          </div>
        </div>
        <div>
          <div className="text-xs text-text-muted mb-1">Revenue Attributed</div>
          <div className="text-base font-mono font-semibold text-text-primary">
            {channel.revenueAttributed > 0 ? formatCurrency(channel.revenueAttributed) : '—'}
          </div>
        </div>
        <div>
          <div className="text-xs text-text-muted mb-1">CAC</div>
          <div className="text-base font-mono font-semibold text-text-secondary">
            {channel.cac === 0 ? 'Organic' : formatCurrency(channel.cac)}
          </div>
        </div>
      </div>

      {/* Lead volume bar */}
      <div>
        <div className="text-xs text-text-muted mb-1.5">Lead Volume</div>
        <ProgressBar
          value={(channel.leadsThisMonth / maxLeads) * 100}
          height={6}
          color={config.color}
        />
      </div>

      {/* Google Ads warning */}
      {channel.channel === LeadChannel.GoogleAds && channel.conversions === 0 && channel.costThisMonth > 0 && (
        <div className="mt-3 text-xs px-3 py-2 rounded-button" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', color: '#EF4444' }}>
          ⚠ 0 conversions this month — {formatCurrency(channel.costThisMonth)} spend with no return
        </div>
      )}
    </div>
  )
}

export function MarketingView() {
  const totalLeadDelta = MARKETING_SUMMARY.totalLeadsThisMonth - MARKETING_SUMMARY.totalLeadsLastMonth

  return (
    <div className="p-8">
      <PageHeader
        title="Marketing"
        subtitle="Channel analytics & lead attribution"
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Leads This Month"
          value={String(MARKETING_SUMMARY.totalLeadsThisMonth)}
          subText={`${totalLeadDelta > 0 ? '+' : ''}${totalLeadDelta} vs last month`}
          trend={{ direction: totalLeadDelta >= 0 ? 'up' : 'down', percent: Math.round(Math.abs(totalLeadDelta / MARKETING_SUMMARY.totalLeadsLastMonth) * 100) }}
        />
        <StatCard
          label="Overall Conversion Rate"
          value={`${MARKETING_SUMMARY.overallConversionRate}%`}
          subText="Leads converted to clients"
          trend={{ direction: 'up', percent: 3 }}
        />
        <StatCard
          label="Avg Customer Acquisition Cost"
          value={formatCurrency(MARKETING_SUMMARY.avgCAC)}
          subText="Across paid channels"
        />
      </div>

      {/* Channel Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {MARKETING_CHANNELS.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>

      {/* Revenue by Service */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2 rounded-card border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-base text-text-primary">Revenue by Service Type</h2>
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-button text-xs font-semibold"
              style={{ background: divConfig.bg, color: divConfig.color }}
            >
              Diversification Score: {divScore}/100 — {divConfig.label}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {SERVICE_BREAKDOWN.map((s) => (
              <div key={s.label} className="flex items-center gap-4">
                <div className="w-44 shrink-0">
                  <span className="text-xs text-text-secondary">{s.label}</span>
                </div>
                <div className="flex-1">
                  <ProgressBar value={s.pct} height={10} color={s.color} />
                </div>
                <div className="w-10 text-right shrink-0">
                  <span className="text-xs font-mono font-semibold text-text-primary">{s.pct}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Diversification explanation */}
          <div className="mt-4 pt-4 border-t border-border">
            <div
              className="flex items-start gap-3 text-xs px-3 py-2.5 rounded-button"
              style={{ background: divConfig.bg, border: `1px solid ${divConfig.color}22` }}
            >
              <span style={{ color: divConfig.color, flexShrink: 0 }}>⚠</span>
              <div style={{ color: '#8A8A8E' }}>
                87% of revenue is concentrated in Core Design services. High concentration increases business risk if demand for design work softens.
                Consider building out Construction Administration (currently 8%) and Feasibility Studies (3%) as recurring revenue streams.
              </div>
            </div>
          </div>
        </div>

        {/* Service Attach Rate + Channel Insight */}
        <div className="flex flex-col gap-4">
          <div className="rounded-card border border-border bg-surface p-5">
            <h3 className="font-serif text-sm text-text-primary mb-3">Service Attach Rate</h3>
            <div className="text-3xl font-mono font-bold text-gold mb-1">{attachRate}%</div>
            <div className="text-xs text-text-muted mb-3">
              {attachCount} of {activeProjects.length} active projects include additional services beyond core design
            </div>
            <ProgressBar value={attachRate} height={6} color="#C8A97E" />
          </div>

          <div className="rounded-card border border-border bg-surface p-5">
            <h3 className="font-serif text-sm text-text-primary mb-3">Channel Insight</h3>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-start gap-2 text-xs">
                <span style={{ color: '#22C55E', flexShrink: 0 }}>●</span>
                <span className="text-text-secondary">Referrals convert at <span className="font-semibold text-text-primary">57%</span> — highest of any channel</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <span style={{ color: '#EF4444', flexShrink: 0 }}>●</span>
                <span className="text-text-secondary">Google Ads: <span className="font-semibold text-text-primary">0% conversion</span> this month — $3,500 spend, 0 wins</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <span style={{ color: '#F59E0B', flexShrink: 0 }}>→</span>
                <span className="text-text-secondary">Recommendation: reallocate Google Ads budget to referral program incentives</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profitability by Project Type */}
      <div className="rounded-card border border-border bg-surface p-5 mb-4">
        <h2 className="font-serif text-base text-text-primary mb-4">Profitability by Project Type</h2>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {[
            { type: 'Residential', margin: 18.4, color: '#F59E0B' },
            { type: 'Commercial', margin: 22.2, color: '#22C55E' },
            { type: 'Hospitality', margin: 20.4, color: '#22C55E' },
            { type: 'Mixed-Use', margin: 28.8, color: '#22C55E' },
          ].map((item) => (
            <div key={item.type} className="rounded-button p-4" style={{ background: '#0A0A0B', border: '1px solid #1E1E20' }}>
              <div className="text-xs text-text-muted mb-2">{item.type}</div>
              <div className="text-2xl font-mono font-bold mb-1" style={{ color: item.color }}>
                {item.margin}%
              </div>
              <div className="text-xs" style={{ color: item.margin >= 20 ? '#22C55E' : '#F59E0B' }}>
                {item.margin >= 20 ? '✓ Above target' : '⚠ Below 20% target'}
              </div>
            </div>
          ))}
        </div>
        <div
          className="flex items-start gap-2 text-xs px-3 py-2.5 rounded-button"
          style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)' }}
        >
          <span style={{ color: '#F59E0B', flexShrink: 0 }}>→</span>
          <span style={{ color: '#8A8A8E' }}>
            Mixed-Use and Commercial projects are the most profitable. Residential projects run below the 20% target — driven by scope creep in design phases. Consider tighter scope boundaries on residential contracts.
          </span>
        </div>
      </div>

      {/* Revenue Attribution Summary */}
      <div className="rounded-card border border-border bg-surface p-5">
        <h2 className="font-serif text-base text-text-primary mb-4">Revenue Attribution Summary</h2>
        <div className="flex flex-col gap-3">
          {MARKETING_CHANNELS.sort((a, b) => b.revenueAttributed - a.revenueAttributed).map((channel) => {
            const config = CHANNEL_COLORS[channel.channel]
            const pct = MARKETING_SUMMARY.totalRevenueAttributed > 0
              ? Math.round((channel.revenueAttributed / MARKETING_SUMMARY.totalRevenueAttributed) * 100)
              : 0
            return (
              <div key={channel.id} className="flex items-center gap-4">
                <div className="w-24 text-xs text-text-secondary">{channel.label}</div>
                <div className="flex-1">
                  <ProgressBar value={pct} height={8} color={config.color} />
                </div>
                <div className="w-10 text-right">
                  <span className="text-xs font-mono text-text-secondary">{pct}%</span>
                </div>
                <div className="w-24 text-right">
                  <span className="text-xs font-mono text-text-primary">
                    {channel.revenueAttributed > 0 ? formatCurrency(channel.revenueAttributed) : '—'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
          <span className="text-xs text-text-muted">Total attributed pipeline value</span>
          <span className="text-base font-mono font-semibold text-gold">
            {formatCurrency(MARKETING_SUMMARY.totalRevenueAttributed)}
          </span>
        </div>
      </div>
    </div>
  )
}
