import { useState } from 'react'
import { PageHeader } from '@/design-system/layouts/PageHeader'
import { StatCard } from '@/design-system/components/StatCard'
import { StatusBadge } from '@/design-system/components/StatusBadge'
import { useInvoices } from '@/hooks/useInvoices'
import { InvoiceStatus } from '@/types/common'
import { INVOICES } from '@/data/mockData'

const TODAY = new Date('2026-04-20')

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
}

function daysOverdue(dateStr: string): number {
  return Math.max(0, Math.ceil((TODAY.getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)))
}

function ageBucket(inv: { status: InvoiceStatus; dueDate: string; total: number }) {
  if (inv.status !== InvoiceStatus.Overdue) return null
  const days = daysOverdue(inv.dueDate)
  if (days <= 30) return '1-30'
  if (days <= 60) return '31-60'
  return '60+'
}

// Follow-up status for display
function followUpIcon(inv: { status: InvoiceStatus; notes?: string }): { icon: string; label: string; color: string } {
  if (inv.status === InvoiceStatus.Paid) return { icon: '✓', label: 'Paid', color: '#22C55E' }
  if (inv.status === InvoiceStatus.Overdue) {
    if (inv.notes?.toLowerCase().includes('reminder') || inv.notes?.toLowerCase().includes('notice')) {
      return { icon: '✉', label: 'Reminder sent', color: '#F59E0B' }
    }
    return { icon: '⏱', label: 'Awaiting payment', color: '#EF4444' }
  }
  if (inv.status === InvoiceStatus.Sent) return { icon: '⏱', label: 'Awaiting payment', color: '#8A8A8E' }
  return { icon: '—', label: 'Draft', color: '#5A5A60' }
}

const FILTER_TABS: Array<{ key: InvoiceStatus | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: InvoiceStatus.Draft, label: 'Draft' },
  { key: InvoiceStatus.Sent, label: 'Sent' },
  { key: InvoiceStatus.Paid, label: 'Paid' },
  { key: InvoiceStatus.Overdue, label: 'Overdue' },
]

export function InvoicesView() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { invoices, activeFilter, setActiveFilter, financialSummary, countByStatus } = useInvoices()

  // Aging bar data
  const overdueInvoices = INVOICES.filter((inv) => inv.status === InvoiceStatus.Overdue)
  const currentInvoices = INVOICES.filter(
    (inv) => inv.status === InvoiceStatus.Sent && new Date(inv.dueDate) >= TODAY
  )
  const aging = {
    current: currentInvoices.reduce((s, inv) => s + inv.total, 0),
    '1-30': overdueInvoices.filter((inv) => ageBucket(inv) === '1-30').reduce((s, inv) => s + inv.total, 0),
    '31-60': overdueInvoices.filter((inv) => ageBucket(inv) === '31-60').reduce((s, inv) => s + inv.total, 0),
    '60+': overdueInvoices.filter((inv) => ageBucket(inv) === '60+').reduce((s, inv) => s + inv.total, 0),
  }
  const agingTotal = aging.current + aging['1-30'] + aging['31-60'] + aging['60+']

  const agingSegments = [
    { label: 'Current', value: aging.current, color: '#3B82F6' },
    { label: '1–30 days', value: aging['1-30'], color: '#F59E0B' },
    { label: '31–60 days', value: aging['31-60'], color: '#FB923C' },
    { label: '60+ days', value: aging['60+'], color: '#EF4444' },
  ].filter((s) => s.value > 0)

  return (
    <div className="p-8">
      <PageHeader
        title="Invoices"
        subtitle="Billing & accounts receivable"
        actions={
          <button className="px-4 py-2 rounded-button bg-gold/20 border border-gold/30 text-gold text-sm font-medium hover:bg-gold/30 transition-colors">
            + New Invoice
          </button>
        }
      />

      {/* Summary StatCards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Outstanding"
          value={formatCurrency(financialSummary.outstanding)}
          subText="Sent + pending"
        />
        <StatCard
          label="Collected Q2"
          value={formatCurrency(financialSummary.collected)}
          subText="Paid invoices"
          trend={{ direction: 'up', percent: 7 }}
        />
        <StatCard
          label="Overdue"
          value={formatCurrency(financialSummary.overdue)}
          subText={`${countByStatus[InvoiceStatus.Overdue]} invoice${countByStatus[InvoiceStatus.Overdue] !== 1 ? 's' : ''} past due`}
        />
      </div>

      {/* Aging Bar */}
      {agingTotal > 0 && (
        <div className="rounded-card border border-border bg-surface p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-sm text-text-primary">Accounts Receivable Aging</h3>
            <span className="text-xs text-text-muted">Total outstanding: {formatCurrency(agingTotal)}</span>
          </div>

          {/* Stacked bar */}
          <div className="h-7 flex rounded-button overflow-hidden gap-0.5 mb-3">
            {agingSegments.map((seg) => (
              <div
                key={seg.label}
                className="flex items-center justify-center text-xs font-mono font-semibold transition-all"
                style={{
                  width: `${(seg.value / agingTotal) * 100}%`,
                  background: seg.color,
                  color: '#fff',
                  fontSize: 10,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  minWidth: seg.value / agingTotal > 0.06 ? undefined : 0,
                }}
                title={`${seg.label}: ${formatCurrency(seg.value)}`}
              >
                {seg.value / agingTotal > 0.08 ? formatCurrency(seg.value) : ''}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 flex-wrap">
            {agingSegments.map((seg) => (
              <div key={seg.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ background: seg.color }} />
                <span className="text-xs text-text-secondary">{seg.label}</span>
                <span className="text-xs font-mono text-text-primary">{formatCurrency(seg.value)}</span>
                <span className="text-xs text-text-muted">({Math.round((seg.value / agingTotal) * 100)}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-5 border-b border-border">
        {FILTER_TABS.map((tab) => {
          const count = tab.key === 'all' ? countByStatus.all : countByStatus[tab.key]
          const isActive = activeFilter === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
                isActive
                  ? 'border-gold text-gold'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
              <span className={`text-xs rounded-badge px-1.5 py-0.5 font-mono ${isActive ? 'bg-gold/20 text-gold' : 'bg-border text-text-muted'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Invoice Table */}
      <div className="rounded-card border border-border bg-surface overflow-hidden">
        {/* Header */}
        <div
          className="grid gap-4 px-5 py-3 border-b border-border"
          style={{ gridTemplateColumns: '120px 1fr 150px 100px 100px 110px 100px 90px' }}
        >
          {['Invoice #', 'Project', 'Client', 'Amount', 'Status', 'Issued', 'Due', 'Follow-up'].map((h) => (
            <div key={h} className="text-xs font-medium text-text-muted uppercase tracking-wider">
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {invoices.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-text-muted text-sm">
            No invoices found
          </div>
        ) : (
          invoices.map((inv) => {
            const dO = inv.status === InvoiceStatus.Overdue ? daysOverdue(inv.dueDate) : 0
            const followUp = followUpIcon(inv)
            const isExpanded = expandedId === inv.id
            return (
              <div key={inv.id}>
                <div
                  onClick={() => setExpandedId(isExpanded ? null : inv.id)}
                  className="grid gap-4 px-5 py-4 border-b border-border hover:bg-bg/50 transition-colors items-center cursor-pointer"
                  style={{
                    gridTemplateColumns: '120px 1fr 150px 100px 100px 110px 100px 90px',
                    borderLeft: inv.status === InvoiceStatus.Overdue ? '2px solid rgba(239,68,68,0.4)' : undefined,
                    background: isExpanded ? 'rgba(200,169,126,0.03)' : undefined,
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-text-muted" style={{ opacity: 0.5 }}>
                      {isExpanded ? '▾' : '▸'}
                    </span>
                    <span className="text-sm font-mono text-gold">{inv.number}</span>
                  </div>
                  <div className="text-sm text-text-primary truncate">{inv.projectName}</div>
                  <div className="text-sm text-text-secondary truncate">{inv.clientName}</div>
                  <div className="text-sm font-mono font-semibold text-text-primary">
                    {formatCurrency(inv.total)}
                  </div>
                  <div className="flex flex-col gap-1">
                    <StatusBadge status={inv.status} />
                    {dO > 0 && (
                      <span className="text-xs font-mono font-semibold" style={{ color: '#EF4444' }}>
                        {dO}d overdue
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-text-muted">{formatDate(inv.issueDate)}</div>
                  <div className={`text-xs font-mono ${inv.status === InvoiceStatus.Overdue ? 'font-semibold' : ''}`}
                    style={{ color: inv.status === InvoiceStatus.Overdue ? '#EF4444' : '#8A8A8E' }}>
                    {formatDate(inv.dueDate)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span style={{ color: followUp.color, fontSize: 13 }}>{followUp.icon}</span>
                    <span className="text-xs text-text-muted truncate" title={followUp.label}>{followUp.label}</span>
                  </div>
                </div>

                {/* Expanded line items */}
                {isExpanded && inv.lineItems.length > 0 && (
                  <div
                    className="border-b border-border px-8 py-3"
                    style={{ background: '#0A0A0B' }}
                  >
                    <div className="rounded-button overflow-hidden" style={{ border: '1px solid #1E1E20' }}>
                      {inv.lineItems.map((item, idx) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between px-4 py-2.5"
                          style={{
                            borderTop: idx > 0 ? '1px solid #1E1E20' : undefined,
                          }}
                        >
                          <span className="text-xs text-text-secondary">{item.description}</span>
                          <span className="text-xs font-mono text-text-primary shrink-0 ml-4">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      ))}
                      <div
                        className="flex items-center justify-between px-4 py-2.5"
                        style={{ borderTop: '1px solid #2A2A2E', background: '#111113' }}
                      >
                        <span className="text-xs font-medium text-text-muted">Subtotal</span>
                        <span className="text-xs font-mono text-text-secondary">{formatCurrency(inv.subtotal)}</span>
                      </div>
                      <div
                        className="flex items-center justify-between px-4 py-2.5"
                        style={{ background: '#111113' }}
                      >
                        <span className="text-xs font-medium text-text-muted">HST (13%)</span>
                        <span className="text-xs font-mono text-text-secondary">{formatCurrency(inv.tax)}</span>
                      </div>
                      <div
                        className="flex items-center justify-between px-4 py-2.5"
                        style={{ borderTop: '1px solid #2A2A2E', background: '#111113' }}
                      >
                        <span className="text-xs font-semibold text-text-primary">Total</span>
                        <span className="text-sm font-mono font-bold text-gold">{formatCurrency(inv.total)}</span>
                      </div>
                    </div>
                    {inv.notes && (
                      <p className="text-xs text-text-muted mt-2 px-1">{inv.notes}</p>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
