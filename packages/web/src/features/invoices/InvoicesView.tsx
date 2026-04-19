
import { PageHeader } from '@/design-system/layouts/PageHeader'
import { StatCard } from '@/design-system/components/StatCard'
import { StatusBadge } from '@/design-system/components/StatusBadge'
import { useInvoices } from '@/hooks/useInvoices'
import { InvoiceStatus } from '@/types/common'

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
}

const FILTER_TABS: Array<{ key: InvoiceStatus | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: InvoiceStatus.Draft, label: 'Draft' },
  { key: InvoiceStatus.Sent, label: 'Sent' },
  { key: InvoiceStatus.Paid, label: 'Paid' },
  { key: InvoiceStatus.Overdue, label: 'Overdue' },
]

export function InvoicesView() {
  const { invoices, activeFilter, setActiveFilter, financialSummary, countByStatus } = useInvoices()

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
        <div className="grid grid-cols-[120px_1fr_140px_100px_90px_100px_100px_80px] gap-4 px-5 py-3 border-b border-border">
          {['Invoice #', 'Project', 'Client', 'Amount', 'Status', 'Issued', 'Due', 'Actions'].map((h) => (
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
          invoices.map((inv) => (
            <div
              key={inv.id}
              className="grid grid-cols-[120px_1fr_140px_100px_90px_100px_100px_80px] gap-4 px-5 py-4 border-b border-border hover:bg-bg/50 transition-colors items-center last:border-0"
            >
              <div className="text-sm font-mono text-gold">{inv.number}</div>
              <div className="text-sm text-text-primary truncate">{inv.projectName}</div>
              <div className="text-sm text-text-secondary truncate">{inv.clientName}</div>
              <div className="text-sm font-mono font-semibold text-text-primary">
                {formatCurrency(inv.total)}
              </div>
              <div>
                <StatusBadge status={inv.status} />
              </div>
              <div className="text-xs font-mono text-text-muted">{formatDate(inv.issueDate)}</div>
              <div className={`text-xs font-mono ${inv.status === InvoiceStatus.Overdue ? 'text-status-red font-semibold' : 'text-text-muted'}`}>
                {formatDate(inv.dueDate)}
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs text-text-secondary hover:text-gold transition-colors">View</button>
                <button className="text-xs text-text-secondary hover:text-gold transition-colors">Edit</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
