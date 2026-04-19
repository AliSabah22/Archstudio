import { PipelineStage, ProjectType, LeadChannel } from './common'

export interface PipelineOpportunity {
  id: string
  name: string
  contactName: string
  contactEmail: string
  contactPhone: string
  estimatedValue: number
  probability: number
  stage: PipelineStage
  projectType: ProjectType
  source: LeadChannel
  nextAction: string
  nextActionDate: string
  notes: string
  createdAt: string
  updatedAt: string
}
