import { useState } from 'react'
import { PageHeader } from '@/design-system/layouts/PageHeader'
import { StatusBadge } from '@/design-system/components/StatusBadge'
import { ProgressBar } from '@/design-system/components/ProgressBar'
import { AvatarStack } from '@/design-system/components/AvatarStack'
import { Badge } from '@/design-system/components/Badge'
import { useProjects } from '@/hooks/useProjects'
import { useAppStore } from '@/stores/appStore'
import { ProjectPhase, ProjectStatus, ProjectType } from '@/types/common'
import type { Project, BudgetPhase } from '@/types/project'
import { MEETINGS, RFIS, SUBMITTALS, DOCUMENTS, APPROVALS, BILLING_SCHEDULES } from '@/data/mockData'
import type { Meeting, ProjectDocument } from '@/data/mockData'

const TODAY = '2026-04-20'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toLocaleString('en-CA', { maximumFractionDigits: 0 })}`
}

const PHASES_ORDERED: ProjectPhase[] = [
  ProjectPhase.PreDesign,
  ProjectPhase.SchematicDesign,
  ProjectPhase.DesignDevelopment,
  ProjectPhase.ConstructionDocuments,
  ProjectPhase.Bidding,
  ProjectPhase.ConstructionAdministration,
]

const PHASE_LABELS: Record<ProjectPhase, string> = {
  [ProjectPhase.PreDesign]: 'Pre-Design',
  [ProjectPhase.SchematicDesign]: 'SD',
  [ProjectPhase.DesignDevelopment]: 'DD',
  [ProjectPhase.ConstructionDocuments]: 'CD',
  [ProjectPhase.Bidding]: 'Bidding',
  [ProjectPhase.ConstructionAdministration]: 'CA',
}

const PRIORITY_COLORS: Record<string, string> = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#22C55E',
}

function healthScore(p: Project): { label: 'Healthy' | 'Watch' | 'At Risk'; color: string; bg: string } {
  const margin = p.financials?.marginPercent ?? 100
  const isOverdue = new Date(p.dueDate) < new Date(TODAY)
  const maxPhasePct = (p.projectBudget?.phases ?? [])
    .filter((ph) => ph.estimatedHours > 0 && ph.actualHours > 0)
    .reduce((max, ph) => Math.max(max, ph.actualHours / ph.estimatedHours), 0) * 100

  if (margin < 10 || maxPhasePct > 100 || isOverdue) {
    return { label: 'At Risk', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' }
  }
  if (margin < 20 || maxPhasePct >= 80) {
    return { label: 'Watch', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' }
  }
  return { label: 'Healthy', color: '#22C55E', bg: 'rgba(34,197,94,0.12)' }
}

function PhaseBar({ phase }: { phase: BudgetPhase }) {
  if (phase.estimatedHours === 0) return null
  const pct = phase.actualHours === 0 ? 0 : Math.round((phase.actualHours / phase.estimatedHours) * 100)
  const color = pct >= 100 ? '#EF4444' : pct >= 80 ? '#F59E0B' : '#22C55E'
  const isOver = pct >= 100
  const isWarn = pct >= 80 && pct < 100
  const notStarted = phase.actualHours === 0

  return (
    <div className="flex items-center gap-3">
      <div className="w-28 shrink-0">
        <span className="text-xs text-text-secondary">{phase.phase}</span>
      </div>
      <div className="flex-1">
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: '#1E1E20' }}
        >
          {!notStarted && (
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${Math.min(pct, 100)}%`, background: color }}
            />
          )}
        </div>
      </div>
      <div className="w-28 flex items-center justify-end gap-2 shrink-0">
        <span className="text-xs font-mono text-text-muted">
          {notStarted ? '—' : `${phase.actualHours} / ${phase.estimatedHours}h`}
        </span>
        {isOver && (
          <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>
            Over
          </span>
        )}
        {isWarn && (
          <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>
            {pct}%
          </span>
        )}
        {!isOver && !isWarn && !notStarted && (
          <span className="text-xs font-mono" style={{ color }}>{pct}%</span>
        )}
      </div>
    </div>
  )
}

type DetailTab = 'budget' | 'financials' | 'consultants' | 'meetings' | 'billing' | 'documents' | 'rfis' | 'approvals'

const MEETING_TYPE_CONFIG = {
  'Client Review': { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  'Internal Team': { color: '#C8A97E', bg: 'rgba(200,169,126,0.12)' },
  'Consultant Coordination': { color: '#A855F7', bg: 'rgba(168,85,247,0.12)' },
  'Site Visit': { color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
}

const ACTION_STATUS_CONFIG = {
  pending: { color: '#F59E0B', label: 'Pending' },
  in_progress: { color: '#3B82F6', label: 'In Progress' },
  completed: { color: '#22C55E', label: 'Done' },
}

const RFI_STATUS_CONFIG = {
  awaiting_response: { color: '#F59E0B', label: 'Awaiting' },
  answered: { color: '#3B82F6', label: 'Answered' },
  resolved: { color: '#22C55E', label: 'Resolved' },
  overdue: { color: '#EF4444', label: 'Overdue' },
}

const SUBMITTAL_STATUS_CONFIG = {
  pending: { color: '#F59E0B', label: 'Pending' },
  approved: { color: '#22C55E', label: 'Approved' },
  rejected: { color: '#EF4444', label: 'Rejected' },
  revise_and_resubmit: { color: '#A855F7', label: 'Revise & Resubmit' },
}

const APPROVAL_STATUS_CONFIG = {
  pending: { color: '#F59E0B', label: 'Awaiting Response' },
  approved: { color: '#22C55E', label: 'Approved' },
  changes_requested: { color: '#EF4444', label: 'Changes Requested' },
  approved_with_conditions: { color: '#3B82F6', label: 'Approved w/ Conditions' },
}

function MeetingsTab({ meetings, projectId }: { meetings: Meeting[]; projectId: string }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchMode, setSearchMode] = useState(false)
  const projectMeetings = meetings.filter((m) => m.projectId === projectId)
  const allDecisions = projectMeetings.flatMap((m) => m.decisions.map((d) => ({ ...d, meetingDate: m.date, meetingType: m.type })))
  const pendingActions = projectMeetings.flatMap((m) => m.actionItems).filter((a) => a.status !== 'completed')

  if (searchMode) {
    const filtered = allDecisions.filter(
      (d) => d.text.toLowerCase().includes(searchTerm.toLowerCase()) || d.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-sm text-text-primary">Search Decisions</h3>
          <button onClick={() => setSearchMode(false)} className="text-xs text-gold hover:text-gold/80 transition-colors">← Back to meetings</button>
        </div>
        <input
          type="text"
          placeholder="Search decisions, categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 rounded-button text-sm bg-bg border border-border text-text-primary focus:outline-none focus:border-gold/50 mb-4"
          autoFocus
        />
        {filtered.length === 0 ? (
          <p className="text-xs text-text-muted">No decisions match your search.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((d, i) => (
              <div key={i} className="p-3 rounded-button" style={{ background: '#0A0A0B', border: '1px solid #1E1E20' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(200,169,126,0.12)', color: '#C8A97E' }}>{d.category}</span>
                  <span className="text-xs text-text-muted">{new Date(d.meetingDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })} · {d.meetingType}</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{d.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-text-muted">
          {projectMeetings.length} meetings · {allDecisions.length} decisions · {pendingActions.length} action items pending
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchMode(true)}
            className="px-3 py-1 rounded-button text-xs transition-colors"
            style={{ background: 'rgba(200,169,126,0.1)', border: '1px solid rgba(200,169,126,0.2)', color: '#C8A97E' }}
          >
            Search Decisions
          </button>
          <button className="px-3 py-1 rounded-button text-xs transition-colors" style={{ background: 'rgba(200,169,126,0.1)', border: '1px solid rgba(200,169,126,0.2)', color: '#C8A97E' }}>
            + New Meeting
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {projectMeetings.sort((a, b) => b.date.localeCompare(a.date)).map((meeting) => {
          const typeConfig = MEETING_TYPE_CONFIG[meeting.type]
          const pendingCount = meeting.actionItems.filter((a) => a.status !== 'completed').length
          return (
            <div key={meeting.id} className="rounded-card border border-border bg-bg p-5" style={{ borderColor: '#1E1E20' }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-text-primary">
                      {new Date(meeting.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })} · {meeting.time}
                    </span>
                    <span className="text-xs text-text-muted">· {meeting.durationMinutes >= 60 ? `${Math.floor(meeting.durationMinutes / 60)}h${meeting.durationMinutes % 60 ? ` ${meeting.durationMinutes % 60}m` : ''}` : `${meeting.durationMinutes}m`}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <span>Internal: {meeting.attendees.internal.join(', ')}</span>
                    {meeting.attendees.external.length > 0 && <><span>·</span><span>{meeting.attendees.external.join(', ')}</span></>}
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded font-medium shrink-0" style={{ background: typeConfig.bg, color: typeConfig.color }}>
                  {meeting.type}
                </span>
              </div>

              <div className="mb-3">
                <div className="text-xs font-medium text-text-muted mb-1.5">Topics discussed</div>
                {meeting.topics.map((t, i) => (
                  <div key={i} className="text-xs text-text-secondary flex items-start gap-1.5 mb-0.5">
                    <span className="mt-0.5 shrink-0">•</span><span>{t}</span>
                  </div>
                ))}
              </div>

              {meeting.decisions.length > 0 && (
                <div className="mb-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span style={{ color: '#C8A97E' }}>◆</span>
                    <span className="text-xs font-medium text-text-muted">Decisions ({meeting.decisions.length})</span>
                  </div>
                  {meeting.decisions.map((d) => (
                    <div key={d.id} className="flex items-start gap-2 mb-2">
                      <span className="text-xs shrink-0 mt-0.5" style={{ color: '#22C55E' }}>✓</span>
                      <div className="flex-1">
                        <span className="text-xs text-text-secondary leading-relaxed">{d.text}</span>
                        <span className="ml-1.5 text-xs px-1 py-0.5 rounded" style={{ background: 'rgba(200,169,126,0.1)', color: '#C8A97E' }}>{d.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {meeting.actionItems.length > 0 && (
                <div className="mb-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span style={{ color: '#3B82F6' }}>→</span>
                    <span className="text-xs font-medium text-text-muted">Action Items ({meeting.actionItems.length}{pendingCount > 0 ? `, ${pendingCount} pending` : ''})</span>
                  </div>
                  {meeting.actionItems.map((a) => {
                    const asc = ACTION_STATUS_CONFIG[a.status]
                    return (
                      <div key={a.id} className="flex items-start gap-2 mb-2">
                        <span className="text-xs shrink-0 mt-0.5">{a.status === 'completed' ? '✓' : '⏳'}</span>
                        <div className="flex-1">
                          <span className="text-xs text-text-secondary">{a.owner} — {a.task}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs text-text-muted">Due {new Date(a.dueDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</span>
                            <span className="text-xs px-1 py-0.5 rounded" style={{ background: `${asc.color}20`, color: asc.color }}>{asc.label}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {meeting.notes && (
                <div className="pt-3 border-t border-border">
                  <span className="text-xs text-text-muted italic leading-relaxed">{meeting.notes}</span>
                </div>
              )}
            </div>
          )
        })}
        {projectMeetings.length === 0 && (
          <p className="text-xs text-text-muted py-4">No meetings logged for this project yet.</p>
        )}
      </div>
    </div>
  )
}

function BillingTab({ projectId }: { projectId: string }) {
  const schedule = BILLING_SCHEDULES.find((s) => s.projectId === projectId)
  if (!schedule) return <p className="text-xs text-text-muted py-4">No billing schedule configured.</p>

  const billedPct = Math.round((schedule.billedToDate / schedule.totalFee) * 100)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-sm text-text-primary">Billing Schedule</h3>
        <span className="text-xs px-2 py-1 rounded" style={{ background: schedule.autoDraftEnabled ? 'rgba(34,197,94,0.1)' : 'rgba(90,90,96,0.1)', color: schedule.autoDraftEnabled ? '#22C55E' : '#5A5A60' }}>
          {schedule.autoDraftEnabled ? `Auto-draft at ${schedule.triggerThreshold}%` : 'Auto-draft off'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-button p-3" style={{ background: '#0A0A0B', border: '1px solid #1E1E20' }}>
          <div className="text-xs text-text-muted mb-0.5">Total Fee</div>
          <div className="text-base font-mono font-semibold text-text-primary">{formatCurrency(schedule.totalFee)}</div>
        </div>
        <div className="rounded-button p-3" style={{ background: '#0A0A0B', border: '1px solid #1E1E20' }}>
          <div className="text-xs text-text-muted mb-0.5">Billed</div>
          <div className="text-base font-mono font-semibold" style={{ color: '#22C55E' }}>{formatCurrency(schedule.billedToDate)} ({billedPct}%)</div>
        </div>
        <div className="rounded-button p-3" style={{ background: '#0A0A0B', border: '1px solid #1E1E20' }}>
          <div className="text-xs text-text-muted mb-0.5">Remaining</div>
          <div className="text-base font-mono font-semibold" style={{ color: '#F59E0B' }}>{formatCurrency(schedule.remainingToBill)}</div>
        </div>
      </div>

      <div className="mb-4">
        <ProgressBar value={billedPct} height={8} color="#C8A97E" />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-text-muted">0%</span>
          <span className="text-xs text-text-muted">Billed {billedPct}%</span>
          <span className="text-xs text-text-muted">100%</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {schedule.phaseFees.map((pf, i) => {
          const statusColor = pf.status === 'invoiced' ? '#22C55E' : pf.status === 'partial' ? '#3B82F6' : pf.status === 'draft' ? '#C8A97E' : '#5A5A60'
          const statusLabel = pf.status === 'invoiced' ? '✓ Invoiced' : pf.status === 'partial' ? `◐ Partial (${formatCurrency(pf.billedToDate ?? 0)} billed)` : pf.status === 'draft' ? '📝 Draft' : '○ Upcoming'
          return (
            <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-button" style={{ background: i % 2 === 0 ? '#0A0A0B' : 'transparent', border: '1px solid #1E1E20' }}>
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-secondary w-48">{pf.phase} ({pf.percentage}%)</span>
                <span className="text-xs font-mono text-text-primary">{formatCurrency(pf.fee)}</span>
              </div>
              <span className="text-xs font-medium" style={{ color: statusColor }}>{statusLabel}</span>
            </div>
          )
        })}
      </div>

      {schedule.phaseFees.some((pf) => pf.status === 'partial') && (
        <div className="mt-3 p-3 rounded-button" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <span className="text-xs" style={{ color: '#3B82F6' }}>Auto-draft will trigger when DD phase reaches {schedule.triggerThreshold}% completion</span>
        </div>
      )}
    </div>
  )
}

function RFIsTab({ projectId }: { projectId: string }) {
  const projectRFIs = RFIS.filter((r) => r.projectId === projectId)
  const projectSubmittals = SUBMITTALS.filter((s) => s.projectId === projectId)
  const [expandedRFI, setExpandedRFI] = useState<number | null>(null)

  return (
    <div>
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider">RFIs ({projectRFIs.length})</h3>
          <button className="text-xs px-2.5 py-1 rounded-button transition-colors" style={{ background: 'rgba(200,169,126,0.1)', border: '1px solid rgba(200,169,126,0.2)', color: '#C8A97E' }}>+ New RFI</button>
        </div>
        <div className="flex flex-col gap-2">
          {projectRFIs.map((rfi) => {
            const sc = RFI_STATUS_CONFIG[rfi.status]
            const isExpanded = expandedRFI === rfi.id
            return (
              <div key={rfi.id} className="rounded-button border" style={{ border: `1px solid ${rfi.status === 'overdue' ? 'rgba(239,68,68,0.3)' : '#1E1E20'}`, background: rfi.status === 'overdue' ? 'rgba(239,68,68,0.04)' : '#0A0A0B' }}>
                <button className="w-full flex items-center justify-between p-3 text-left" onClick={() => setExpandedRFI(isExpanded ? null : rfi.id)}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs px-1.5 py-0.5 rounded font-medium shrink-0" style={{ background: `${sc.color}20`, color: sc.color }}>{sc.label}</span>
                    <span className="text-xs text-text-primary truncate">{rfi.subject}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-xs text-text-muted">{rfi.sentTo}</span>
                    <span className="text-xs text-text-muted">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-border pt-3">
                    <div className="flex items-center gap-4 mb-3 text-xs text-text-muted">
                      <span>Sent: {new Date(rfi.sentDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</span>
                      <span>Expected: {new Date(rfi.expectedResponseDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</span>
                      <span>By: {rfi.sentBy}</span>
                      <span className="text-xs px-1 py-0.5 rounded" style={{ background: rfi.priority === 'high' ? 'rgba(239,68,68,0.1)' : rfi.priority === 'medium' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)', color: rfi.priority === 'high' ? '#EF4444' : rfi.priority === 'medium' ? '#F59E0B' : '#22C55E' }}>
                        {rfi.priority}
                      </span>
                    </div>
                    {rfi.thread.map((msg, i) => (
                      <div key={i} className="mb-2 p-2 rounded" style={{ background: '#141415' }}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-text-primary">{msg.author}</span>
                          <span className="text-xs text-text-muted">{new Date(msg.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          {projectRFIs.length === 0 && <p className="text-xs text-text-muted">No RFIs on this project.</p>}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider">Submittals ({projectSubmittals.length})</h3>
          <button className="text-xs px-2.5 py-1 rounded-button transition-colors" style={{ background: 'rgba(200,169,126,0.1)', border: '1px solid rgba(200,169,126,0.2)', color: '#C8A97E' }}>+ Log Submittal</button>
        </div>
        <div className="flex flex-col gap-2">
          {projectSubmittals.map((s) => {
            const sc = SUBMITTAL_STATUS_CONFIG[s.status]
            return (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-button" style={{ background: '#0A0A0B', border: '1px solid #1E1E20' }}>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-text-primary truncate">{s.item}</div>
                  <div className="text-xs text-text-muted mt-0.5">
                    {s.submittedBy} · {new Date(s.submittedDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                    {s.comments && <span className="ml-2 italic">{s.comments}</span>}
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded font-medium shrink-0 ml-2" style={{ background: `${sc.color}20`, color: sc.color }}>{sc.label}</span>
              </div>
            )
          })}
          {projectSubmittals.length === 0 && <p className="text-xs text-text-muted">No submittals on this project.</p>}
        </div>
      </div>
    </div>
  )
}

function DocumentsTab({ projectId }: { projectId: string }) {
  const projectDocs = DOCUMENTS.filter((d) => d.projectId === projectId)
  const [selectedDoc, setSelectedDoc] = useState<ProjectDocument | null>(null)

  if (selectedDoc) {
    const currentRev = selectedDoc.revisions.find((r) => r.current)
    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setSelectedDoc(null)} className="text-xs text-text-muted hover:text-gold transition-colors">← Back</button>
          <span className="text-text-muted text-xs">/</span>
          <span className="text-xs text-text-primary">{selectedDoc.title}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(200,169,126,0.1)', color: '#C8A97E' }}>{selectedDoc.type}</span>
            {selectedDoc.sharedWithClient && <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E' }}>Shared with client</span>}
          </div>
          <button className="text-xs px-3 py-1 rounded-button" style={{ background: 'rgba(200,169,126,0.15)', border: '1px solid rgba(200,169,126,0.3)', color: '#C8A97E' }}>+ Upload Revision</button>
        </div>
        <div className="rounded-button mb-4 flex items-center justify-center" style={{ background: '#0A0A0B', border: '1px solid #1E1E20', minHeight: 180 }}>
          <div className="text-center">
            <div className="text-3xl mb-2">📄</div>
            <div className="text-sm text-text-muted">{currentRev?.fileName}</div>
            <div className="text-xs text-text-muted mt-1">PDF viewer renders here in production</div>
          </div>
        </div>
        <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Version History</div>
        <div className="flex flex-col gap-2">
          {[...selectedDoc.revisions].reverse().map((rev) => (
            <div key={rev.version} className="flex items-start gap-3 p-3 rounded-button" style={{ background: rev.current ? 'rgba(200,169,126,0.06)' : '#0A0A0B', border: `1px solid ${rev.current ? 'rgba(200,169,126,0.2)' : '#1E1E20'}` }}>
              <span className="text-xs font-mono font-bold shrink-0 mt-0.5" style={{ color: rev.current ? '#C8A97E' : '#5A5A60' }}>v{rev.version}</span>
              <div className="flex-1">
                <div className="text-xs text-text-primary">{rev.note}</div>
                <div className="text-xs text-text-muted mt-0.5">{rev.uploadedBy} · {new Date(rev.uploadedDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
              {rev.current ? <span className="text-xs px-1.5 py-0.5 rounded shrink-0" style={{ background: 'rgba(200,169,126,0.15)', color: '#C8A97E' }}>Current</span> : <span className="text-xs text-text-muted shrink-0">Superseded</span>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const grouped = projectDocs.reduce<Record<string, ProjectDocument[]>>((acc, d) => {
    if (!acc[d.type]) acc[d.type] = []
    acc[d.type].push(d)
    return acc
  }, {})

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-text-muted">{projectDocs.length} documents</span>
        <button className="text-xs px-3 py-1 rounded-button" style={{ background: 'rgba(200,169,126,0.1)', border: '1px solid rgba(200,169,126,0.2)', color: '#C8A97E' }}>+ Upload Document</button>
      </div>
      {Object.entries(grouped).map(([type, docs]) => (
        <div key={type} className="mb-4">
          <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">{type}</div>
          <div className="flex flex-col gap-2">
            {docs.map((doc) => {
              const currentRev = doc.revisions.find((r) => r.current)
              return (
                <button key={doc.id} onClick={() => setSelectedDoc(doc)} className="flex items-center justify-between p-3 rounded-button text-left transition-all hover:border-gold/30" style={{ background: '#0A0A0B', border: '1px solid #1E1E20' }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-base shrink-0">📄</span>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-text-primary truncate">{doc.title}</div>
                      <div className="text-xs text-text-muted mt-0.5">v{currentRev?.version} · {new Date(currentRev?.uploadedDate ?? '').toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {doc.sharedWithClient && <span className="text-xs px-1 py-0.5 rounded" style={{ color: '#22C55E', background: 'rgba(34,197,94,0.1)' }}>Shared</span>}
                    <span className="text-xs text-text-muted">{doc.revisions.length} rev{doc.revisions.length > 1 ? 's' : ''}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}
      {projectDocs.length === 0 && <p className="text-xs text-text-muted py-4">No documents uploaded yet.</p>}
    </div>
  )
}

function ApprovalsTab({ projectId }: { projectId: string }) {
  const projectApprovals = APPROVALS.filter((a) => a.projectId === projectId)
  const pendingCount = projectApprovals.filter((a) => a.status === 'pending').length

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-text-muted">{projectApprovals.length} approvals · {pendingCount} awaiting response</span>
        <button className="text-xs px-3 py-1 rounded-button" style={{ background: 'rgba(200,169,126,0.1)', border: '1px solid rgba(200,169,126,0.2)', color: '#C8A97E' }}>+ Request Approval</button>
      </div>
      <div className="flex flex-col gap-3">
        {projectApprovals.map((a) => {
          const sc = APPROVAL_STATUS_CONFIG[a.status]
          return (
            <div key={a.id} className="p-4 rounded-card border" style={{ border: `1px solid ${a.status === 'pending' ? 'rgba(245,158,11,0.25)' : '#1E1E20'}`, background: a.status === 'pending' ? 'rgba(245,158,11,0.04)' : '#0A0A0B' }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="font-medium text-sm text-text-primary">{a.title}</div>
                <span className="text-xs px-2 py-0.5 rounded font-medium shrink-0" style={{ background: `${sc.color}20`, color: sc.color }}>{sc.label}</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed mb-3">{a.description}</p>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span>Requested by {a.requestedBy} · {new Date(a.requestedDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                {a.respondedDate && <span>Responded {new Date(a.respondedDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })} by {a.responseBy}</span>}
              </div>
              {a.comments && (
                <div className="mt-3 p-2 rounded text-xs text-text-secondary italic" style={{ background: '#141415' }}>
                  "{a.comments}"
                </div>
              )}
            </div>
          )
        })}
        {projectApprovals.length === 0 && <p className="text-xs text-text-muted">No approvals requested for this project.</p>}
      </div>
    </div>
  )
}

function ProjectDetailPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  const [showAssumptions, setShowAssumptions] = useState(false)
  const [addingTime, setAddingTime] = useState(false)
  const [quickHours, setQuickHours] = useState('1')
  const [showDetails, setShowDetails] = useState(false)
  const [activity, setActivity] = useState('')
  const [activeTab, setActiveTab] = useState<DetailTab>('budget')
  const { startTimer, addTimeEntry, showToast } = useAppStore()

  const budget = project.projectBudget
  const fin = project.financials
  const consultants = project.consultants ?? []

  const phaseName = PHASE_LABELS[project.phase] ?? project.phase

  const handleSaveTime = () => {
    const hrs = parseFloat(quickHours)
    if (isNaN(hrs) || hrs <= 0) return
    addTimeEntry({
      userId: 'tm_001',
      projectId: project.id,
      phase: project.phase,
      hours: hrs,
      date: TODAY,
      activity: activity || 'Manual Entry',
      note: '',
      billable: true,
    })
    showToast(`${hrs}h logged to ${project.name}`)
    setAddingTime(false)
    setQuickHours('1')
    setActivity('')
    setShowDetails(false)
  }

  const co_config = {
    approved: { color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
    pending: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
    rejected: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  }

  const health = healthScore(project)

  const pendingApprovals = APPROVALS.filter((a) => a.projectId === project.id && a.status === 'pending').length
  const overdueRFIs = RFIS.filter((r) => r.projectId === project.id && r.status === 'overdue').length
  const pendingActions = MEETINGS.filter((m) => m.projectId === project.id).flatMap((m) => m.actionItems).filter((a) => a.status !== 'completed').length

  const TABS: { id: DetailTab; label: string; badge?: number }[] = [
    { id: 'budget', label: 'Budget' },
    { id: 'financials', label: 'Financials' },
    { id: 'consultants', label: 'Consultants' },
    { id: 'meetings', label: 'Meetings', badge: pendingActions > 0 ? pendingActions : undefined },
    { id: 'billing', label: 'Billing' },
    { id: 'documents', label: 'Documents' },
    { id: 'rfis', label: 'RFIs', badge: overdueRFIs > 0 ? overdueRFIs : undefined },
    { id: 'approvals', label: 'Approvals', badge: pendingApprovals > 0 ? pendingApprovals : undefined },
  ]

  return (
    <div
      className="rounded-card border border-border bg-surface mt-2 overflow-hidden"
      style={{ borderColor: 'rgba(200,169,126,0.2)' }}
    >
      {/* Detail header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border" style={{ background: 'rgba(200,169,126,0.04)' }}>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-text-muted hover:text-gold transition-colors text-sm">← Back</button>
          <span className="text-text-muted text-sm">/</span>
          <h2 className="font-serif text-base text-text-primary">{project.name}</h2>
          <StatusBadge status={project.phase} />
          <span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ background: health.bg, color: health.color }}>
            {health.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!addingTime ? (
            <button
              onClick={() => setAddingTime(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-button text-xs font-medium transition-all"
              style={{ background: 'rgba(200,169,126,0.15)', border: '1px solid rgba(200,169,126,0.3)', color: '#C8A97E' }}
            >
              + Add Time
            </button>
          ) : null}
          <button
            onClick={() => startTimer(project.id, project.name, phaseName)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-button text-xs font-medium transition-all"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444' }}
          >
            ▶ Start Timer
          </button>
        </div>
      </div>

      {/* Quick Add Time */}
      {addingTime && (
        <div className="px-6 py-3 border-b border-border flex items-center gap-3 flex-wrap" style={{ background: 'rgba(200,169,126,0.03)' }}>
          <span className="text-xs text-text-muted">Log time:</span>
          <input
            type="number"
            min="0.25"
            step="0.25"
            value={quickHours}
            onChange={(e) => setQuickHours(e.target.value)}
            className="w-16 px-2 py-1 rounded text-xs font-mono text-text-primary bg-bg border border-border focus:outline-none focus:border-gold/50"
          />
          <span className="text-xs text-text-muted">hours on {TODAY}</span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-text-muted hover:text-gold transition-colors"
          >
            {showDetails ? '▲ Hide details' : '▼ Add details'}
          </button>
          {showDetails && (
            <input
              type="text"
              placeholder="Activity (optional)"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="px-2 py-1 rounded text-xs text-text-primary bg-bg border border-border focus:outline-none focus:border-gold/50 w-40"
            />
          )}
          <button
            onClick={handleSaveTime}
            className="px-3 py-1 rounded-button text-xs font-semibold transition-all"
            style={{ background: 'rgba(200,169,126,0.2)', color: '#C8A97E' }}
          >
            Save
          </button>
          <button
            onClick={() => setAddingTime(false)}
            className="text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Tab navigation */}
      <div className="flex items-center gap-0 px-6 border-b border-border overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-all -mb-px whitespace-nowrap"
            style={{
              borderColor: activeTab === tab.id ? '#C8A97E' : 'transparent',
              color: activeTab === tab.id ? '#C8A97E' : '#8A8A8E',
            }}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span className="text-xs rounded-full w-4 h-4 flex items-center justify-center font-mono" style={{ background: '#EF4444', color: '#fff', fontSize: 9 }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === 'budget' && (
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h3 className="font-serif text-sm text-text-primary mb-4">Phase Budget</h3>
              {budget ? (
                <>
                  <div className="flex flex-col gap-3 mb-4">
                    {budget.phases.map((ph) => (
                      <PhaseBar key={ph.phase} phase={ph} />
                    ))}
                  </div>
                  <button
                    onClick={() => setShowAssumptions(!showAssumptions)}
                    className="text-xs text-text-muted hover:text-gold transition-colors mb-2"
                  >
                    {showAssumptions ? '▲' : '▼'} Scope boundary
                  </button>
                  {showAssumptions && (
                    <div className="text-xs text-text-secondary space-y-2 p-3 rounded-button" style={{ background: '#0A0A0B' }}>
                      <div><span className="text-text-muted font-medium">Includes: </span>{budget.assumptions}</div>
                      <div><span className="text-text-muted font-medium">Excludes: </span>{budget.exclusions}</div>
                    </div>
                  )}
                  {budget.changeOrders.length > 0 && (
                    <div className="mt-4">
                      <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Change Orders</div>
                      <div className="flex flex-col gap-2">
                        {budget.changeOrders.map((co) => {
                          const cfg = co_config[co.status]
                          return (
                            <div key={co.id} className="flex items-start gap-2">
                              <Badge color={cfg.color} bg={cfg.bg} className="shrink-0 mt-0.5">
                                {co.status.charAt(0).toUpperCase() + co.status.slice(1)}
                              </Badge>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-text-secondary leading-tight">{co.description}</div>
                                <div className="text-xs text-text-muted">{co.hours}h · {formatCurrency(co.cost)}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-text-muted">No budget data available.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="max-w-md">
            <h3 className="font-serif text-sm text-text-primary mb-4">Financials</h3>
            {fin ? (
              <>
                <div className="flex flex-col gap-1 mb-5">
                  {[
                    { label: 'Invoiced', value: formatCurrency(fin.invoiced), color: undefined },
                    { label: 'Collected', value: formatCurrency(fin.collected), color: '#22C55E' },
                    { label: 'Outstanding', value: formatCurrency(fin.outstanding), color: fin.outstanding > 0 ? '#F59E0B' : '#5A5A60' },
                    { label: 'Direct Labor', value: formatCurrency(fin.directLabor), color: undefined },
                    ...(fin.consultantCosts > 0 ? [{ label: 'Consultant Costs', value: formatCurrency(fin.consultantCosts), color: undefined }] : []),
                    { label: 'Expenses', value: formatCurrency(fin.expenses), color: undefined },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-xs text-text-muted">{row.label}</span>
                      <span className="text-xs font-mono" style={{ color: row.color ?? '#E8E8EA' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div
                  className="rounded-button p-4"
                  style={{
                    background: fin.marginPercent >= 20 ? 'rgba(34,197,94,0.08)' : fin.marginPercent >= 10 ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)',
                    border: `1px solid ${fin.marginPercent >= 20 ? 'rgba(34,197,94,0.2)' : fin.marginPercent >= 10 ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-text-secondary">Gross Margin</span>
                    <span className="text-sm font-mono font-bold" style={{ color: fin.marginPercent >= 20 ? '#22C55E' : fin.marginPercent >= 10 ? '#F59E0B' : '#EF4444' }}>
                      {fin.marginPercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-lg font-mono font-semibold text-text-primary">{formatCurrency(fin.grossMargin)}</div>
                  <div className="text-xs text-text-muted mt-1">
                    {fin.marginPercent >= 20 ? '✓ Above 20% target' : fin.marginPercent >= 10 ? '⚠ Below 20% target' : '✗ Below 10% — at risk'}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-xs text-text-muted">No financial data available.</p>
            )}
          </div>
        )}

        {activeTab === 'consultants' && (
          <div>
            <h3 className="font-serif text-sm text-text-primary mb-4">Consultants</h3>
            {consultants.length === 0 ? (
              <p className="text-xs text-text-muted">No consultants on this project.</p>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {consultants.map((c, i) => {
                  const spentPct = c.budgeted > 0 ? Math.round((c.spent / c.budgeted) * 100) : 0
                  const barColor = spentPct >= 100 ? '#EF4444' : spentPct >= 80 ? '#F59E0B' : '#22C55E'
                  return (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-text-primary">{c.name}</span>
                        <Badge color="#8A8A8E" bg="#1E1E20">{c.specialty}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1"><ProgressBar value={Math.min(spentPct, 100)} height={5} color={barColor} /></div>
                        <span className="text-xs font-mono text-text-muted shrink-0">{spentPct}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-text-muted">
                        <span>{formatCurrency(c.spent)} / {formatCurrency(c.budgeted)}</span>
                        <span>+{c.markup}% markup</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-muted">Passed through</span>
                        <span style={{ color: '#22C55E' }}>{formatCurrency(c.passedThrough)}</span>
                      </div>
                      {c.pendingPassThrough > 0 && (
                        <div className="flex items-center justify-between text-xs px-2.5 py-2 rounded" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                          <span style={{ color: '#F59E0B' }}>⚠ Pending pass-through</span>
                          <span className="font-mono font-semibold" style={{ color: '#F59E0B' }}>{formatCurrency(c.pendingPassThrough)}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">About</div>
              <p className="text-xs text-text-secondary leading-relaxed">{project.description}</p>
              <div className="flex flex-col gap-1 mt-3">
                <div className="text-xs text-text-muted">{project.address}</div>
                <div className="text-xs text-text-muted">{formatDate(project.startDate)} → {formatDate(project.dueDate)}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'meetings' && <MeetingsTab meetings={MEETINGS} projectId={project.id} />}
        {activeTab === 'billing' && <BillingTab projectId={project.id} />}
        {activeTab === 'documents' && <DocumentsTab projectId={project.id} />}
        {activeTab === 'rfis' && <RFIsTab projectId={project.id} />}
        {activeTab === 'approvals' && <ApprovalsTab projectId={project.id} />}
      </div>
    </div>
  )
}

export function ProjectsView() {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
  const [phaseFilter, setPhaseFilter] = useState<ProjectPhase | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<ProjectType | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { allProjects, projectsByPhase } = useProjects()
  const { startTimer } = useAppStore()

  const filtered = allProjects.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    if (phaseFilter !== 'all' && p.phase !== phaseFilter) return false
    if (typeFilter !== 'all' && p.type !== typeFilter) return false
    return true
  })

  const selectedProject = allProjects.find((p) => p.id === selectedId) ?? null

  const handleCardClick = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Projects"
        subtitle={`${allProjects.length} total · ${allProjects.filter((p) => p.status === 'active').length} active`}
        actions={
          <button className="px-4 py-2 rounded-button bg-gold/20 border border-gold/30 text-gold text-sm font-medium hover:bg-gold/30 transition-colors">
            + New Project
          </button>
        }
      />

      {/* Phase Pipeline Bar */}
      <div className="rounded-card border border-border bg-surface p-4 mb-6">
        <div className="text-xs text-text-muted mb-3 uppercase tracking-wider">Projects by AIA Phase</div>
        <div className="flex gap-2">
          {PHASES_ORDERED.map((phase) => {
            const count = projectsByPhase[phase].length
            return (
              <button
                key={phase}
                onClick={() => setPhaseFilter(phaseFilter === phase ? 'all' : phase)}
                className={`flex-1 flex flex-col items-center gap-1.5 p-2 rounded-button transition-all ${
                  phaseFilter === phase ? 'bg-gold/15 border border-gold/30' : 'hover:bg-border/40'
                }`}
              >
                <span className="text-lg font-mono font-semibold text-text-primary">{count}</span>
                <span className="text-xs text-text-secondary text-center leading-tight">{PHASE_LABELS[phase]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 mb-5">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
          className="px-3 py-1.5 rounded-button bg-surface border border-border text-text-secondary text-sm focus:outline-none focus:border-gold/50"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="on_hold">On Hold</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as ProjectType | 'all')}
          className="px-3 py-1.5 rounded-button bg-surface border border-border text-text-secondary text-sm focus:outline-none focus:border-gold/50"
        >
          <option value="all">All Types</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="institutional">Institutional</option>
          <option value="interior">Interior</option>
          <option value="mixed_use">Mixed Use</option>
        </select>
        <div className="ml-auto text-xs text-text-muted">
          {filtered.length} of {allProjects.length} projects
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((project) => {
          const budgetPct = Math.round((project.spent / project.budget) * 100)
          const priorityColor = PRIORITY_COLORS[project.priority]
          const health = healthScore(project)
          const isSelected = selectedId === project.id
          const phaseName = PHASE_LABELS[project.phase] ?? project.phase

          return (
            <div
              key={project.id}
              onClick={() => handleCardClick(project.id)}
              className="rounded-card border bg-surface p-5 hover:border-gold/30 transition-all cursor-pointer group relative"
              style={{ borderColor: isSelected ? 'rgba(200,169,126,0.4)' : '#1E1E20' }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: priorityColor }}
                      title={`${project.priority} priority`}
                    />
                    <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-gold transition-colors">
                      {project.name}
                    </h3>
                  </div>
                  <p className="text-xs text-text-muted truncate">{project.clientName}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={project.status} />
                  <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ background: health.bg, color: health.color }}>
                    {health.label}
                  </span>
                </div>
              </div>

              {/* Type + Phase */}
              <div className="flex items-center gap-2 mb-4">
                <StatusBadge status={project.type} />
                <StatusBadge status={project.phase} />
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text-muted">Progress</span>
                  <span className="text-xs font-mono text-text-secondary">{project.progress}%</span>
                </div>
                <ProgressBar value={project.progress} height={5} color="#C8A97E" />
              </div>

              {/* Budget */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text-muted">Budget</span>
                  <span className={`text-xs font-mono ${budgetPct > 90 ? 'text-status-red' : budgetPct > 75 ? 'text-status-amber' : 'text-text-secondary'}`}>
                    {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
                  </span>
                </div>
                <ProgressBar
                  value={budgetPct}
                  height={4}
                  color={budgetPct > 90 ? '#EF4444' : budgetPct > 75 ? '#F59E0B' : '#22C55E'}
                />
              </div>

              {/* P&L quick stat */}
              {project.financials && (
                <div className="mb-3 flex items-center justify-between py-2 px-2.5 rounded" style={{ background: '#0A0A0B' }}>
                  <span className="text-xs text-text-muted">Margin</span>
                  <span
                    className="text-xs font-mono font-semibold"
                    style={{ color: project.financials.marginPercent >= 20 ? '#22C55E' : project.financials.marginPercent >= 10 ? '#F59E0B' : '#EF4444' }}
                  >
                    {project.financials.marginPercent.toFixed(1)}%
                  </span>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <div className="text-xs text-text-muted">Due</div>
                  <div className="text-xs font-mono text-text-secondary">{formatDate(project.dueDate)}</div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Start timer button — visible on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      startTimer(project.id, project.name, phaseName)
                    }}
                    title="Start timer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-6 h-6 rounded-full text-xs"
                    style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' }}
                  >
                    ▶
                  </button>
                  <AvatarStack members={project.members} size="sm" max={3} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Detail Panel */}
      {selectedProject && (
        <ProjectDetailPanel
          project={selectedProject}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  )
}
