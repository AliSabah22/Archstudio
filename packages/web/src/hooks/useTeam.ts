import { useMemo } from 'react'
import { TEAM_MEMBERS } from '@/data/mockData'

export function useTeam() {
  const avgUtilization = useMemo(() => {
    const total = TEAM_MEMBERS.reduce((sum, m) => sum + m.utilization, 0)
    return Math.round(total / TEAM_MEMBERS.length)
  }, [])

  const totalBillableHours = useMemo(() => {
    return TEAM_MEMBERS.reduce((sum, m) => sum + m.billableHoursThisMonth, 0)
  }, [])

  const sortedByUtilization = useMemo(() => {
    return [...TEAM_MEMBERS].sort((a, b) => b.utilization - a.utilization)
  }, [])

  return {
    members: TEAM_MEMBERS,
    sortedByUtilization,
    avgUtilization,
    totalBillableHours,
    memberCount: TEAM_MEMBERS.length,
  }
}
