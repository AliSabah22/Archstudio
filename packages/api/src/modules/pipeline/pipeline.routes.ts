import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middleware/auth.js'
import { prisma } from '../../lib/db.js'
import { z } from 'zod'

const PipelineStageEnum = z.enum([
  'initial_contact',
  'consultation',
  'proposal_sent',
  'shortlisted',
  'won',
  'lost',
])

const CreateOpportunitySchema = z.object({
  name: z.string().min(1),
  contactName: z.string(),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  estimatedValue: z.number().positive(),
  probability: z.number().min(0).max(100),
  stage: PipelineStageEnum.default('initial_contact'),
  projectType: z.string().optional(),
  source: z.string().optional(),
  nextAction: z.string().optional(),
  nextActionDate: z.string().optional(),
  notes: z.string().optional(),
})

export async function pipelineRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyJWT)

  app.get('/', async (_req, reply) => {
    const opps = await prisma.pipelineOpportunity.findMany({ orderBy: { updatedAt: 'desc' } })
    return reply.send({ data: opps })
  })

  app.get('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const opp = await prisma.pipelineOpportunity.findUniqueOrThrow({ where: { id } })
    return reply.send({ data: opp })
  })

  app.post('/', async (req, reply) => {
    const parsed = CreateOpportunitySchema.safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Validation error' })
    const opp = await prisma.pipelineOpportunity.create({ data: parsed.data })
    return reply.status(201).send({ data: opp })
  })

  app.patch('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const parsed = CreateOpportunitySchema.partial().safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Validation error' })
    const opp = await prisma.pipelineOpportunity.update({ where: { id }, data: parsed.data })
    return reply.send({ data: opp })
  })

  app.patch('/:id/stage', async (req, reply) => {
    const { id } = req.params as { id: string }
    const parsed = z.object({ stage: PipelineStageEnum }).safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Validation error' })
    const opp = await prisma.pipelineOpportunity.update({ where: { id }, data: { stage: parsed.data.stage } })
    return reply.send({ data: opp })
  })

  app.delete('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    await prisma.pipelineOpportunity.delete({ where: { id } })
    return reply.status(204).send()
  })
}
