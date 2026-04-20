import { PageHeader } from '@/design-system/layouts/PageHeader'
import { StatCard } from '@/design-system/components/StatCard'
import { Avatar } from '@/design-system/components/Avatar'
import { ProgressBar } from '@/design-system/components/ProgressBar'
import { Badge } from '@/design-system/components/Badge'
import { useTeam } from '@/hooks/useTeam'
import { UserRole } from '@/types/common'

const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.Principal]: 'Principal',
  [UserRole.SeniorArchitect]: 'Sr. Architect',
  [UserRole.Architect]: 'Architect',
  [UserRole.Designer]: 'Designer',
  [UserRole.Intern]: 'Intern',
  [UserRole.Admin]: 'Admin',
}

const ROLE_COLORS: Record<UserRole, { color: string; bg: string }> = {
  [UserRole.Principal]: { color: '#C8A97E', bg: 'rgba(200,169,126,0.15)' },
  [UserRole.SeniorArchitect]: { color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
  [UserRole.Architect]: { color: '#A855F7', bg: 'rgba(168,85,247,0.15)' },
  [UserRole.Designer]: { color: '#22C55E', bg: 'rgba(34,197,94,0.15)' },
  [UserRole.Intern]: { color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  [UserRole.Admin]: { color: '#8A8A8E', bg: '#1E1E20' },
}

function trendArrow(current: number, trailing: number): { symbol: string; color: string } {
  const diff = current - trailing
  if (diff >= 3) return { symbol: '↑', color: '#22C55E' }
  if (diff <= -3) return { symbol: '↓', color: '#EF4444' }
  return { symbol: '→', color: '#8A8A8E' }
}

export function TeamView() {
  const { sortedByUtilization, avgUtilization, totalBillableHours, memberCount, members } = useTeam()

  const burnoutRisk = members.filter((m) => m.trailingUtilization > 90)
  const underutilized = members.filter((m) => m.trailingUtilization < 65)

  // Target zone: 75–85%
  const targetMin = 75
  const targetMax = 85
  const targetMinPct = targetMin
  const targetMaxPct = targetMax

  return (
    <div className="p-8">
      <PageHeader
        title="Team"
        subtitle="Staff utilization & capacity"
      />

      {/* Burnout risk banner */}
      {burnoutRisk.map((m) => (
        <div
          key={m.id}
          className="flex items-center gap-3 mb-4 px-5 py-3 rounded-card"
          style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444' }}
        >
          <span style={{ color: '#EF4444', fontSize: 14 }}>⚠</span>
          <div>
            <span className="text-sm font-medium" style={{ color: '#EF4444' }}>Burnout Risk: {m.name}</span>
            <span className="text-sm text-text-muted ml-2">
              has been above 90% utilization for 6+ consecutive weeks ({m.trailingUtilization}% trailing avg)
            </span>
          </div>
        </div>
      ))}

      {/* Underutilization notes */}
      {underutilized.map((m) => (
        <div
          key={m.id}
          className="flex items-center gap-3 mb-4 px-5 py-3 rounded-card"
          style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)', borderLeft: '3px solid #3B82F6' }}
        >
          <span style={{ color: '#3B82F6', fontSize: 14 }}>ℹ</span>
          <span className="text-sm text-text-secondary">
            <span className="font-medium text-text-primary">{m.name}</span> is at {m.trailingUtilization}% utilization — has capacity for additional project work.
          </span>
        </div>
      ))}

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Firm Avg Utilization"
          value={`${avgUtilization}%`}
          subText="Target: 75–85%"
          trend={{ direction: avgUtilization >= 75 && avgUtilization <= 85 ? 'up' : 'down', percent: Math.abs(avgUtilization - 80) }}
        />
        <StatCard
          label="Total Billable Hours"
          value={String(totalBillableHours)}
          subText="This month across team"
          trend={{ direction: 'up', percent: 4 }}
        />
        <StatCard
          label="Team Size"
          value={String(memberCount)}
          subText="Full-time employees"
        />
      </div>

      {/* Firm-Wide Utilization Bar */}
      <div className="rounded-card border border-border bg-surface p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-sm text-text-primary">Firm-Wide Utilization</h3>
          <span className="text-xs text-text-muted">Target zone: {targetMin}–{targetMax}%</span>
        </div>
        <div className="relative h-6 rounded-full overflow-hidden" style={{ background: '#0A0A0B' }}>
          {/* target zone highlight */}
          <div
            className="absolute top-0 bottom-0 rounded"
            style={{
              left: `${targetMinPct}%`,
              width: `${targetMaxPct - targetMinPct}%`,
              background: 'rgba(34,197,94,0.15)',
              border: '1px solid rgba(34,197,94,0.3)',
            }}
          />
          {/* current average marker */}
          <div
            className="absolute top-1 bottom-1 w-0.5 rounded"
            style={{
              left: `${avgUtilization}%`,
              background: avgUtilization >= 75 && avgUtilization <= 85 ? '#22C55E' : avgUtilization > 85 ? '#EF4444' : '#F59E0B',
            }}
          />
          {/* label */}
          <div
            className="absolute top-0 bottom-0 flex items-center"
            style={{ left: `${Math.max(avgUtilization - 4, 2)}%` }}
          >
            <span className="text-xs font-mono font-bold px-1" style={{ color: '#E8E8EA' }}>{avgUtilization}%</span>
          </div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-text-muted">0%</span>
          <span className="text-xs" style={{ color: '#22C55E' }}>Target zone {targetMin}–{targetMax}%</span>
          <span className="text-xs text-text-muted">100%</span>
        </div>
      </div>

      {/* Team Table */}
      <div className="rounded-card border border-border bg-surface overflow-hidden">
        {/* Table Header */}
        <div className="grid gap-4 px-5 py-3 border-b border-border" style={{ gridTemplateColumns: 'auto 1fr 140px 220px 60px 80px 80px 70px' }}>
          <div className="w-8" />
          <div className="text-xs font-medium text-text-muted uppercase tracking-wider">Member</div>
          <div className="text-xs font-medium text-text-muted uppercase tracking-wider">Role</div>
          <div className="text-xs font-medium text-text-muted uppercase tracking-wider">Utilization</div>
          <div className="text-xs font-medium text-text-muted uppercase tracking-wider">4 Wks</div>
          <div className="text-xs font-medium text-text-muted uppercase tracking-wider text-right">Projects</div>
          <div className="text-xs font-medium text-text-muted uppercase tracking-wider text-right">Hours</div>
          <div className="text-xs font-medium text-text-muted uppercase tracking-wider text-right">Wk Hrs</div>
        </div>

        {/* Table Rows */}
        {sortedByUtilization.map((member) => {
          const utilizationColor =
            member.utilization >= 90 ? '#EF4444' : member.utilization >= 75 ? '#22C55E' : '#F59E0B'
          const roleConfig = ROLE_COLORS[member.role]
          const trend = trendArrow(member.utilization, member.trailingUtilization)
          const wkColor = member.weeklyHoursLogged >= 32 ? '#22C55E' : member.weeklyHoursLogged >= 24 ? '#F59E0B' : '#EF4444'
          const weeklyHours = member.weeklyHours ?? []
          const maxWeeklyHrs = Math.max(...weeklyHours, 40)

          return (
            <div
              key={member.id}
              className="grid gap-4 px-5 py-4 border-b border-border hover:bg-bg/50 transition-colors items-center last:border-0"
              style={{ gridTemplateColumns: 'auto 1fr 140px 220px 60px 80px 80px 70px' }}
            >
              <Avatar initials={member.initials} size="md" />
              <div>
                <div className="flex items-center gap-1.5">
                  <div className="text-sm font-medium text-text-primary">{member.name}</div>
                  {member.trailingUtilization > 90 && (
                    <span title="Burnout risk" style={{ color: '#EF4444', fontSize: 12 }}>⚠</span>
                  )}
                </div>
                <div className="text-xs text-text-muted">{member.email}</div>
              </div>
              <div>
                <Badge color={roleConfig.color} bg={roleConfig.bg}>
                  {ROLE_LABELS[member.role]}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <ProgressBar value={member.utilization} height={5} color={utilizationColor} />
                </div>
                <span
                  className="text-xs font-mono font-semibold w-8 text-right shrink-0"
                  style={{ color: utilizationColor }}
                >
                  {member.utilization}%
                </span>
                <span className="text-xs font-mono font-bold shrink-0 w-6" style={{ color: trend.color }}>
                  {trend.symbol}
                </span>
              </div>
              {/* Weekly pattern mini bars */}
              <div className="flex items-end gap-0.5 h-6">
                {weeklyHours.map((h, i) => (
                  <div
                    key={i}
                    title={`Week ${i + 1}: ${h}h`}
                    style={{
                      width: 8,
                      height: `${Math.max((h / maxWeeklyHrs) * 24, h === 0 ? 2 : 4)}px`,
                      borderRadius: 2,
                      background: h === 0 ? '#2A2A2E' : utilizationColor,
                      opacity: h === 0 ? 0.4 : 0.8,
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
              <div className="text-right">
                <span className="text-sm font-mono text-text-primary">{member.activeProjectCount}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-mono text-text-primary">{member.billableHoursThisMonth}h</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-mono font-semibold" style={{ color: wkColor }}>
                  {member.weeklyHoursLogged}h
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-3 px-1">
        <span className="text-xs text-text-muted">Trend: current vs 2-week trailing avg</span>
        <div className="flex items-center gap-4">
          <span className="text-xs" style={{ color: '#22C55E' }}>↑ Increasing</span>
          <span className="text-xs" style={{ color: '#8A8A8E' }}>→ Stable</span>
          <span className="text-xs" style={{ color: '#EF4444' }}>↓ Decreasing</span>
        </div>
        <span className="text-xs text-text-muted ml-auto">Wk Hrs target: ≥32h</span>
      </div>
    </div>
  )
}
