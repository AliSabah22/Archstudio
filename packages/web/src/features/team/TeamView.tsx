
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

export function TeamView() {
  const { sortedByUtilization, avgUtilization, totalBillableHours, memberCount } = useTeam()

  return (
    <div className="p-8">
      <PageHeader
        title="Team"
        subtitle="Staff utilization & capacity"
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Firm Avg Utilization"
          value={`${avgUtilization}%`}
          subText="Target: 80%"
          trend={{ direction: avgUtilization >= 80 ? 'up' : 'down', percent: Math.abs(avgUtilization - 80) }}
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

      {/* Team Table */}
      <div className="rounded-card border border-border bg-surface overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[auto_1fr_140px_200px_80px_80px] gap-4 px-5 py-3 border-b border-border">
          <div className="w-8" />
          <div className="text-xs font-medium text-text-muted uppercase tracking-wider">Member</div>
          <div className="text-xs font-medium text-text-muted uppercase tracking-wider">Role</div>
          <div className="text-xs font-medium text-text-muted uppercase tracking-wider">Utilization</div>
          <div className="text-xs font-medium text-text-muted uppercase tracking-wider text-right">Projects</div>
          <div className="text-xs font-medium text-text-muted uppercase tracking-wider text-right">Hours</div>
        </div>

        {/* Table Rows */}
        {sortedByUtilization.map((member) => {
          const utilizationColor =
            member.utilization >= 90
              ? '#EF4444'
              : member.utilization >= 75
              ? '#22C55E'
              : '#F59E0B'
          const roleConfig = ROLE_COLORS[member.role]

          return (
            <div
              key={member.id}
              className="grid grid-cols-[auto_1fr_140px_200px_80px_80px] gap-4 px-5 py-4 border-b border-border hover:bg-bg/50 transition-colors items-center last:border-0"
            >
              <Avatar initials={member.initials} size="md" />
              <div>
                <div className="text-sm font-medium text-text-primary">{member.name}</div>
                <div className="text-xs text-text-muted">{member.email}</div>
              </div>
              <div>
                <Badge color={roleConfig.color} bg={roleConfig.bg}>
                  {ROLE_LABELS[member.role]}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <ProgressBar value={member.utilization} height={5} color={utilizationColor} />
                </div>
                <span
                  className="text-xs font-mono font-semibold w-8 text-right shrink-0"
                  style={{ color: utilizationColor }}
                >
                  {member.utilization}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-mono text-text-primary">{member.activeProjectCount}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-mono text-text-primary">{member.billableHoursThisMonth}h</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
