import { z } from 'zod'

export const ProjectPhaseEnum = z.enum([
  'pre_design',
  'schematic_design',
  'design_development',
  'construction_documents',
  'bidding',
  'construction_administration',
])

export const ProjectStatusEnum = z.enum(['active', 'on_hold', 'completed'])
export const ProjectTypeEnum = z.enum(['residential', 'commercial', 'institutional', 'interior', 'mixed_use'])
export const PriorityEnum = z.enum(['high', 'medium', 'low'])

export const CreateProjectSchema = z.object({
  name: z.string().min(1).max(200),
  clientId: z.string().uuid(),
  type: ProjectTypeEnum,
  phase: ProjectPhaseEnum.default('pre_design'),
  status: ProjectStatusEnum.default('active'),
  budget: z.number().positive(),
  startDate: z.string().datetime(),
  dueDate: z.string().datetime(),
  address: z.string().optional(),
  description: z.string().optional(),
  priority: PriorityEnum.default('medium'),
})

export const UpdateProjectSchema = CreateProjectSchema.partial()

export const UpdatePhaseSchema = z.object({
  phase: ProjectPhaseEnum,
})

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>
export type UpdatePhaseInput = z.infer<typeof UpdatePhaseSchema>
