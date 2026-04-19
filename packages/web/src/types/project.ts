import { ProjectPhase, ProjectStatus, ProjectType, UserRole } from './common'

export interface ProjectMember {
  id: string
  name: string
  initials: string
  role: UserRole
}

export interface Project {
  id: string
  name: string
  clientId: string
  clientName: string
  type: ProjectType
  phase: ProjectPhase
  status: ProjectStatus
  progress: number
  budget: number
  spent: number
  startDate: string
  dueDate: string
  members: ProjectMember[]
  priority: 'high' | 'medium' | 'low'
  address: string
  description: string
}
