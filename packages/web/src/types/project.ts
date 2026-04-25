import { ProjectPhase, ProjectStatus, ProjectType, UserRole } from './common'

export interface ProjectMember {
  id: string
  name: string
  initials: string
  role: UserRole
}

export interface BudgetPhase {
  phase: string
  estimatedHours: number
  actualHours: number
}

export interface ChangeOrder {
  id: number
  description: string
  hours: number
  cost: number
  status: 'approved' | 'pending' | 'rejected'
  date: string
}

export interface ProjectBudget {
  totalEstimatedHours: number
  phases: BudgetPhase[]
  assumptions: string
  exclusions: string
  changeOrders: ChangeOrder[]
  meetingsEstimated?: number
  meetingsActual?: number
}

export interface ConsultantEntry {
  name: string
  specialty: string
  budgeted: number
  spent: number
  markup: number
  passedThrough: number
  pendingPassThrough: number
}

export interface ProjectFinancials {
  invoiced: number
  collected: number
  outstanding: number
  directLabor: number
  consultantCosts: number
  expenses: number
  totalCost: number
  grossMargin: number
  marginPercent: number
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
  projectBudget?: ProjectBudget
  consultants?: ConsultantEntry[]
  financials?: ProjectFinancials
}
