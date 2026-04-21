import { useState } from 'react'
import { PageHeader } from '@/design-system/layouts/PageHeader'
import { CAPACITY_FORECAST } from '@/data/mockData'
import type { CapacityWeek } from '@/data/mockData'

function formatWeekLabel(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
}

function utilizationColor(u: number): { bg: string; text: string; label: string } {
  if (u > 100) return { bg: 'rgba(239,68,68,0.35)', text: '#EF4444', label: 'Overloaded' }
  if (u >= 91) return { bg: 'rgba(245,158,11,0.3)', text: '#F59E0B', label: 'Elevated' }
  if (u >= 75) return { bg: 'rgba(34,197,94,0.25)', text: '#22C55E', label: 'Healthy' }
  if (u >= 60) return { bg: 'rgba(245,158,11,0.2)', text: '#F59E0B', label: 'Low' }
  return { bg: 'rgba(239,68,68,0.15)', text: '#EF4444', label: 'Underutilized' }
}

const PROJECT_DEADLINES = [
  { project: 'Lakeside Penthouse', date: '2026-04-30', weekStart: '2026-04-28' },
  { project: 'Chen Commercial Complex', date: '2026-06-15', weekStart: '2026-06-09' },
  { project: 'Forest Hill Mixed-Use', date: '2026-06-01', weekStart: '2026-05-26' },
]

export function CapacityView() {
  const [filter, setFilter] = useState<'all' | 'overloaded' | 'underutilized'>('all')
  const [tooltip, setTooltip] = useState<{ member: string; week: CapacityWeek } | null>(null)
  const [simOpen, setSimOpen] = useState(false)
  const [simName, setSimName] = useState('')
  const [simHours, setSimHours] = useState('400')
  const [simStart, setSimStart] = useState('2026-05-05')
  const [simEnd, setSimEnd] = useState('2026-06-30')
  const [simPreviewed, setSimPreviewed] = useState(false)

  const weeks = CAPACITY_FORECAST[0]?.weeks ?? []

  const filteredMembers = CAPACITY_FORECAST.filter((m) => {
    if (filter === 'all') return true
    if (filter === 'overloaded') return m.weeks.some((w) => w.utilization > 100)
    if (filter === 'underutilized') return m.weeks.some((w) => w.utilization < 65)
    return true
  })

  const overloadedMembers = CAPACITY_FORECAST.filter((m) => m.weeks.slice(0, 3).some((w) => w.utilization > 100))

  return (
    <div className="p-8">
      <PageHeader
        title="Capacity"
        subtitle="Team capacity forecast — next 10 weeks"
        actions={
          <button
            onClick={() => { setSimOpen(!simOpen); setSimPreviewed(false) }}
            className="px-4 py-2 rounded-button text-sm font-medium transition-colors"
            style={{ background: 'rgba(200,169,126,0.15)', border: '1px solid rgba(200,169,126,0.3)', color: '#C8A97E' }}
          >
            Simulate New Project
          </button>
        }
      />

      {/* Capacity alert banner */}
      {overloadedMembers.length > 0 && (
        <div className="flex items-center gap-3 mb-4 px-5 py-3 rounded-card" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444' }}>
          <span style={{ color: '#EF4444', fontSize: 14 }}>⚠</span>
          <span className="text-sm font-medium" style={{ color: '#EF4444' }}>
            {overloadedMembers.map((m) => m.userName).join(', ')} {overloadedMembers.length === 1 ? 'is' : 'are'} overloaded in the next 3 weeks — review workload allocation
          </span>
        </div>
      )}

      {/* Simulate panel */}
      {simOpen && (
        <div className="mb-6 p-5 rounded-card border" style={{ border: '1px solid rgba(200,169,126,0.2)', background: 'rgba(200,169,126,0.03)' }}>
          <h3 className="font-serif text-sm text-text-primary mb-4">Simulate New Project</h3>
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div>
              <label className="text-xs text-text-muted mb-1 block">Project Name</label>
              <input value={simName} onChange={(e) => setSimName(e.target.value)} placeholder="New project..." className="w-full px-3 py-1.5 rounded text-xs bg-bg border border-border text-text-primary focus:outline-none focus:border-gold/50" />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">Total Hours</label>
              <input value={simHours} onChange={(e) => setSimHours(e.target.value)} type="number" className="w-full px-3 py-1.5 rounded text-xs bg-bg border border-border text-text-primary focus:outline-none focus:border-gold/50" />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">Start Date</label>
              <input value={simStart} onChange={(e) => setSimStart(e.target.value)} type="date" className="w-full px-3 py-1.5 rounded text-xs bg-bg border border-border text-text-primary focus:outline-none focus:border-gold/50" />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">End Date</label>
              <input value={simEnd} onChange={(e) => setSimEnd(e.target.value)} type="date" className="w-full px-3 py-1.5 rounded text-xs bg-bg border border-border text-text-primary focus:outline-none focus:border-gold/50" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSimPreviewed(true)}
              className="px-4 py-1.5 rounded-button text-xs font-semibold transition-colors"
              style={{ background: 'rgba(200,169,126,0.2)', border: '1px solid rgba(200,169,126,0.3)', color: '#C8A97E' }}
            >
              Preview Impact
            </button>
            <button onClick={() => setSimOpen(false)} className="text-xs text-text-muted hover:text-text-primary transition-colors">Cancel</button>
          </div>
          {simPreviewed && (
            <div className="mt-4 p-3 rounded-button" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div className="text-xs font-medium mb-1" style={{ color: '#F59E0B' }}>Impact Preview</div>
              <div className="text-xs text-text-secondary">
                If <strong className="text-text-primary">{simName || 'this project'}</strong> starts {simStart}: Sara Levi would be overloaded weeks of May 5–19.
                Priya Sharma reaches healthy utilization range (75%+) with this addition.
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button className="text-xs px-3 py-1 rounded-button" style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)', color: '#22C55E' }}>Add to Pipeline</button>
                <button onClick={() => { setSimPreviewed(false); setSimOpen(false) }} className="text-xs text-text-muted hover:text-text-primary">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter + legend */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          {(['all', 'overloaded', 'underutilized'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 text-xs rounded-button capitalize transition-all"
              style={{
                background: filter === f ? 'rgba(200,169,126,0.15)' : 'transparent',
                border: filter === f ? '1px solid rgba(200,169,126,0.3)' : '1px solid transparent',
                color: filter === f ? '#C8A97E' : '#8A8A8E',
              }}
            >
              {f === 'all' ? 'All Members' : f === 'overloaded' ? '🔴 Overloaded' : '🟡 Underutilized'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs">
          {[
            { label: '>100% Overloaded', bg: 'rgba(239,68,68,0.35)', color: '#EF4444' },
            { label: '91-100% Elevated', bg: 'rgba(245,158,11,0.3)', color: '#F59E0B' },
            { label: '75-90% Healthy', bg: 'rgba(34,197,94,0.25)', color: '#22C55E' },
            { label: '<65% Underutilized', bg: 'rgba(239,68,68,0.15)', color: '#EF4444' },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: l.bg }} />
              <span style={{ color: l.color }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <div className="rounded-card border border-border bg-surface overflow-hidden mb-6">
        {/* Header row */}
        <div className="flex border-b border-border">
          <div className="shrink-0 px-4 py-3 border-r border-border" style={{ width: 140 }}>
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Member</span>
          </div>
          {weeks.map((w) => (
            <div key={w.weekStart} className="flex-1 px-1 py-3 text-center border-r border-border last:border-r-0">
              <span className="text-xs text-text-muted">{formatWeekLabel(w.weekStart)}</span>
            </div>
          ))}
        </div>

        {/* Member rows */}
        {filteredMembers.map((member) => (
          <div key={member.userId} className="flex border-b border-border last:border-b-0">
            <div className="shrink-0 px-4 py-3 border-r border-border flex items-center" style={{ width: 140 }}>
              <div>
                <div className="text-xs font-medium text-text-primary">{member.initials}</div>
                <div className="text-xs text-text-muted truncate" style={{ maxWidth: 108 }}>{member.userName.split(' ')[0]}</div>
              </div>
            </div>
            {member.weeks.map((week) => {
              const uc = utilizationColor(week.utilization)
              const isSimImpacted = simPreviewed && week.weekStart >= simStart && week.weekStart <= simEnd
              return (
                <div
                  key={week.weekStart}
                  className="flex-1 border-r border-border last:border-r-0 relative cursor-pointer"
                  style={{ background: uc.bg, minHeight: 48 }}
                  onMouseEnter={() => setTooltip({ member: member.userName, week })}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <div className="flex flex-col items-center justify-center h-full py-2" style={{ minHeight: 48 }}>
                    <span className="text-xs font-mono font-bold" style={{ color: uc.text }}>{week.utilization}%</span>
                    {isSimImpacted && (
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full" style={{ background: '#F59E0B', margin: 3 }} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none p-3 rounded-card border"
          style={{ background: '#1E1E20', border: '1px solid #2A2A2D', top: 80, right: 40, minWidth: 200 }}
        >
          <div className="text-xs font-semibold text-text-primary mb-1">{tooltip.member}</div>
          <div className="text-xs text-text-muted mb-2">{formatWeekLabel(tooltip.week.weekStart)}</div>
          <div className="text-sm font-mono font-bold mb-2" style={{ color: utilizationColor(tooltip.week.utilization).text }}>
            {tooltip.week.utilization}% — {utilizationColor(tooltip.week.utilization).label}
          </div>
          <div className="text-xs text-text-muted">{tooltip.week.plannedHours}h / {tooltip.week.capacityHours}h capacity</div>
          {tooltip.week.projects.length > 0 && (
            <div className="mt-2">
              {tooltip.week.projects.map((p) => (
                <div key={p} className="text-xs text-text-secondary">• {p}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Deadline overlay */}
      <div className="rounded-card border border-border bg-surface p-5">
        <h3 className="font-serif text-sm text-text-primary mb-4">Project Deadline Timeline</h3>
        <div className="relative">
          {/* Timeline bar */}
          <div className="h-0.5 bg-border rounded mb-6 mt-2" />

          {/* Deadline markers */}
          <div className="flex gap-4 flex-wrap">
            {PROJECT_DEADLINES.map((dl) => (
              <div key={dl.project} className="flex flex-col items-start gap-1">
                <div className="w-2.5 h-2.5 rounded-full border-2" style={{ background: '#C8A97E', borderColor: '#C8A97E' }} />
                <div className="text-xs font-medium text-text-primary">{dl.project}</div>
                <div className="text-xs text-text-muted">{new Date(dl.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-button" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <span className="text-xs text-text-muted">
              <span style={{ color: '#F59E0B' }}>→</span> Two deadlines cluster in late April (Lakeside Penthouse Apr 30). Ensure Marcus Osei has capacity for final CA deliverables.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
