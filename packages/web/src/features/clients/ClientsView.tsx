import { useState } from 'react'
import { PageHeader } from '@/design-system/layouts/PageHeader'
import { Badge } from '@/design-system/components/Badge'
import { CLIENTS, PROJECTS } from '@/data/mockData'
import type { ClientRecord } from '@/types/client'

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value}`
}

function monthsSince(dateStr: string): number {
  const then = new Date(dateStr).getTime()
  const now = new Date('2026-04-20').getTime()
  return Math.floor((now - then) / (1000 * 60 * 60 * 24 * 30))
}

function ltvFor(client: ClientRecord): number {
  const referralTotal = client.referrals.reduce((s, r) => s + r.value, 0)
  return client.totalRevenue + referralTotal
}

const STATUS_CONFIG = {
  active: { color: '#22C55E', bg: 'rgba(34,197,94,0.12)', label: 'Active' },
  recent: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'Recent' },
  dormant: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)', label: 'Dormant' },
}

const TYPE_CONFIG: Record<string, { color: string; bg: string }> = {
  Residential: { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  Commercial: { color: '#C8A97E', bg: 'rgba(200,169,126,0.12)' },
  Hospitality: { color: '#A855F7', bg: 'rgba(168,85,247,0.12)' },
}

function ClientCard({ client }: { client: ClientRecord }) {
  const [expanded, setExpanded] = useState(false)
  const status = STATUS_CONFIG[client.status]
  const typeConfig = TYPE_CONFIG[client.type] ?? TYPE_CONFIG.Commercial
  const ltv = ltvFor(client)
  const referralTotal = client.referrals.reduce((s, r) => s + r.value, 0)
  const months = monthsSince(client.lastInteraction)

  const projectNames = client.projects
    .map((pid) => PROJECTS.find((p) => p.id === pid)?.name)
    .filter(Boolean)

  return (
    <div
      className="rounded-card border bg-surface transition-all"
      style={{ borderColor: client.status === 'dormant' ? 'rgba(239,68,68,0.25)' : '#1E1E20' }}
    >
      {/* Dormant banner */}
      {client.status === 'dormant' && (
        <div className="flex items-center gap-2 px-5 py-2 rounded-t-card" style={{ background: 'rgba(239,68,68,0.08)', borderBottom: '1px solid rgba(239,68,68,0.15)' }}>
          <span style={{ color: '#EF4444', fontSize: 12 }}>⚠</span>
          <span style={{ color: '#EF4444', fontSize: 12, fontWeight: 500 }}>
            No contact in {months} months — client re-engagement recommended
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-text-primary truncate">{client.name}</h3>
              <Badge color={status.color} bg={status.bg}>{status.label}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge color={typeConfig.color} bg={typeConfig.bg}>{client.type}</Badge>
              <span className="text-xs text-text-muted">{client.projects.length} project{client.projects.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* LTV */}
          <div className="text-right shrink-0">
            <div className="text-xs text-text-muted mb-0.5">Lifetime Value</div>
            <div className="text-xl font-mono font-semibold text-gold">{formatCurrency(ltv)}</div>
            {referralTotal > 0 && (
              <div className="text-xs font-mono" style={{ color: '#8A8A8E' }}>
                incl. <span style={{ color: '#22C55E' }}>{formatCurrency(referralTotal)}</span> referrals
              </div>
            )}
          </div>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-5 gap-4 mb-4 py-3 border-t border-b border-border">
          <div>
            <div className="text-xs text-text-muted mb-1">Own Revenue</div>
            <div className="text-sm font-mono font-medium text-text-primary">{formatCurrency(client.totalRevenue)}</div>
          </div>
          <div>
            <div className="text-xs text-text-muted mb-1">Referral Revenue</div>
            <div className="text-sm font-mono font-medium" style={{ color: referralTotal > 0 ? '#22C55E' : '#5A5A60' }}>
              {referralTotal > 0 ? formatCurrency(referralTotal) : '—'}
            </div>
          </div>
          <div>
            <div className="text-xs text-text-muted mb-1">Lifetime Value</div>
            <div className="text-base font-mono font-bold text-gold">{formatCurrency(ltv)}</div>
          </div>
          <div>
            <div className="text-xs text-text-muted mb-1">Projects</div>
            <div className="text-sm font-mono font-medium text-text-primary">{client.projects.length}</div>
          </div>
          <div>
            <div className="text-xs text-text-muted mb-1">Last Contact</div>
            <div className="text-sm font-mono font-medium" style={{ color: months > 12 ? '#EF4444' : months > 6 ? '#F59E0B' : '#E8E8EA' }}>
              {months}mo ago
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="mb-3">
          <div className="text-xs text-text-muted mb-2">Projects</div>
          <div className="flex flex-wrap gap-2">
            {projectNames.map((name) => (
              <span key={name} className="text-xs px-2 py-1 rounded-badge" style={{ background: 'rgba(200,169,126,0.1)', color: '#C8A97E', border: '1px solid rgba(200,169,126,0.2)' }}>
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Referral detail */}
        {client.referrals.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-text-muted mb-2">Referrals Generated</div>
            {client.referrals.map((ref, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-t border-border first:border-t-0">
                <span className="text-xs text-text-secondary">{ref.name}</span>
                <span className="text-xs font-mono font-medium" style={{ color: '#22C55E' }}>{formatCurrency(ref.value)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Dormant suggestions */}
        {client.status === 'dormant' && (
          <div
            className="rounded-button p-3 mt-2"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}
          >
            <div className="text-xs font-medium mb-1" style={{ color: '#EF4444' }}>Suggested re-engagement actions</div>
            <div className="text-xs" style={{ color: '#8A8A8E' }}>
              — Schedule a maintenance consultation call<br />
              — Explore addition/expansion opportunities<br />
              — Invite to refer friends &amp; family (referral program)
            </div>
          </div>
        )}

        {/* Expand for detail toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-3 text-xs text-text-muted hover:text-gold transition-colors text-center"
        >
          {expanded ? 'Show less ▲' : 'Show more ▼'}
        </button>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-button p-3" style={{ background: '#0A0A0B' }}>
                <div className="text-xs text-text-muted mb-1">Own Revenue</div>
                <div className="text-base font-mono font-semibold text-text-primary">{formatCurrency(client.totalRevenue)}</div>
              </div>
              <div className="rounded-button p-3" style={{ background: '#0A0A0B' }}>
                <div className="text-xs text-text-muted mb-1">Referral Revenue</div>
                <div className="text-base font-mono font-semibold" style={{ color: referralTotal > 0 ? '#22C55E' : '#5A5A60' }}>
                  {formatCurrency(referralTotal)}
                </div>
              </div>
              <div className="col-span-2 rounded-button p-3" style={{ background: '#0A0A0B', border: '1px solid rgba(200,169,126,0.2)' }}>
                <div className="text-xs text-text-muted mb-1">Total Lifetime Value</div>
                <div className="text-xl font-mono font-bold text-gold">{formatCurrency(ltv)}</div>
                <div className="text-xs text-text-muted mt-1">
                  {client.referrals.length > 0 && `${client.referrals.length} referral${client.referrals.length > 1 ? 's' : ''} generated`}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function ClientsView() {
  const [filter, setFilter] = useState<'all' | 'active' | 'dormant'>('all')

  const sorted = [...CLIENTS]
    .sort((a, b) => ltvFor(b) - ltvFor(a))
    .filter((c) => filter === 'all' || c.status === filter)

  const totalLTV = CLIENTS.reduce((s, c) => s + ltvFor(c), 0)
  const dormantCount = CLIENTS.filter((c) => c.status === 'dormant').length
  const dormantLTV = CLIENTS.filter((c) => c.status === 'dormant').reduce((s, c) => s + ltvFor(c), 0)

  return (
    <div className="p-8">
      <PageHeader
        title="Clients"
        subtitle={`${CLIENTS.length} clients · ${formatCurrency(totalLTV)} total lifetime value`}
        actions={
          <button className="px-4 py-2 rounded-button bg-gold/20 border border-gold/30 text-gold text-sm font-medium hover:bg-gold/30 transition-colors">
            + Add Client
          </button>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="text-xs text-text-muted mb-1">Total Clients</div>
          <div className="text-2xl font-mono font-bold text-text-primary">{CLIENTS.length}</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="text-xs text-text-muted mb-1">Total LTV</div>
          <div className="text-2xl font-mono font-bold text-gold">{formatCurrency(totalLTV)}</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="text-xs text-text-muted mb-1">Active Clients</div>
          <div className="text-2xl font-mono font-bold" style={{ color: '#22C55E' }}>
            {CLIENTS.filter((c) => c.status === 'active').length}
          </div>
        </div>
        <div
          className="rounded-card border p-4"
          style={{ borderColor: dormantCount > 0 ? 'rgba(239,68,68,0.3)' : '#1E1E20', background: dormantCount > 0 ? 'rgba(239,68,68,0.05)' : '#141415' }}
        >
          <div className="text-xs text-text-muted mb-1">Dormant Clients</div>
          <div className="text-2xl font-mono font-bold" style={{ color: dormantCount > 0 ? '#EF4444' : '#5A5A60' }}>
            {dormantCount}
          </div>
          {dormantCount > 0 && (
            <div className="text-xs mt-0.5" style={{ color: '#EF4444' }}>{formatCurrency(dormantLTV)} at risk</div>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-5 border-b border-border">
        {(['all', 'active', 'dormant'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px capitalize ${
              filter === f ? 'border-gold text-gold' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {f}
            <span className={`ml-1.5 text-xs rounded-badge px-1.5 py-0.5 font-mono ${filter === f ? 'bg-gold/20 text-gold' : 'bg-border text-text-muted'}`}>
              {f === 'all' ? CLIENTS.length : CLIENTS.filter((c) => c.status === f).length}
            </span>
          </button>
        ))}
        <div className="ml-auto text-xs text-text-muted">Sorted by lifetime value</div>
      </div>

      {/* Client List */}
      <div className="flex flex-col gap-4">
        {sorted.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  )
}
