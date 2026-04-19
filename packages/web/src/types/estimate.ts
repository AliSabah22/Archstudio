import { FeeStructure } from './common'

export interface EstimateHourBreakdown {
  phase: string
  hours: number
  rate: number
  amount: number
}

export interface Estimate {
  id: string
  name: string
  opportunityId?: string
  projectId?: string
  clientName: string
  feeStructure: FeeStructure
  estimatedFee: number
  hourBreakdown: EstimateHourBreakdown[]
  status: 'draft' | 'sent' | 'accepted' | 'rejected'
  createdAt: string
  expiresAt: string
  notes?: string
}
