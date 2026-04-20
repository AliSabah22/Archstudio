import { UserRole } from './common'

export interface TeamMember {
  id: string
  name: string
  initials: string
  role: UserRole
  email: string
  phone: string
  hourlyRate: number
  utilization: number
  trailingUtilization: number
  weeklyHoursLogged: number
  billableHoursThisMonth: number
  totalHoursThisMonth: number
  activeProjectCount: number
  activeProjectIds: string[]
  joinedAt: string
  weeklyHours?: number[]
}

export interface UtilizationData {
  memberId: string
  week: string
  billableHours: number
  nonBillableHours: number
  targetHours: number
  utilization: number
}
