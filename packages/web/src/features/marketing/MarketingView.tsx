import React from 'react'
import { Instagram, Globe, Users, Search, TrendingUp, TrendingDown } from 'lucide-react'
import { PageHeader } from '@/design-system/layouts/PageHeader'
import { StatCard } from '@/design-system/components/StatCard'
import { ProgressBar } from '@/design-system/components/ProgressBar'
import { MARKETING_CHANNELS, MARKETING_SUMMARY } from '@/data/mockData'
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
          <div className="text-2xl font-mono font-semibold" style={{ color: config.color }}>
            {channel.conversionRate.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-xs text-text-muted mb-1">Revenue Attributed</div>
          <div className="text-base font-mono font-semibold text-text-primary">
            {formatCurrency(channel.revenueAttributed)}
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

      {/* Revenue Summary */}
      <div className="rounded-card border border-border bg-surface p-5">
        <h2 className="font-serif text-base text-text-primary mb-4">Revenue Attribution Summary</h2>
        <div className="flex flex-col gap-3">
          {MARKETING_CHANNELS.sort((a, b) => b.revenueAttributed - a.revenueAttributed).map((channel) => {
            const config = CHANNEL_COLORS[channel.channel]
            const pct = Math.round((channel.revenueAttributed / MARKETING_SUMMARY.totalRevenueAttributed) * 100)
            return (
              <div key={channel.id} className="flex items-center gap-4">
                <div className="w-24 text-xs text-text-secondary">{channel.label}</div>
                <div className="flex-1">
                  <ProgressBar value={pct} height={8} color={config.color} />
                </div>
                <div className="w-16 text-right">
                  <span className="text-xs font-mono text-text-secondary">{pct}%</span>
                </div>
                <div className="w-20 text-right">
                  <span className="text-xs font-mono text-text-primary">{formatCurrency(channel.revenueAttributed)}</span>
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
