import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middleware/auth.js'
import { prisma } from '../../lib/db.js'
import { z } from 'zod'

const FeeStructureEnum = z.enum([
  'percentage_of_construction',
  'hourly_rate',
  'fixed_fee',
  'stipulated',
])

const HourBreakdownSchema = z.object({
  phase: z.string(),
  hours: z.number().positive(),
  rate: z.number().positive(),
})

const CreateEstimateSchema = z.object({
  name: z.string().min(1),
  opportunityId: z.string().optional(),
  projectId: z.string().optional(),
  clientName: z.string(),
  feeStructure: FeeStructureEnum,
  estimatedFee: z.number().positive(),
  hourBreakdown: z.array(HourBreakdownSchema),
  status: z.enum(['draft', 'sent', 'accepted', 'rejected']).default('draft'),
  expiresAt: z.string(),
  notes: z.string().optional(),
})

export async function estimateRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyJWT)

  app.get('/', async (_req, reply) => {
    const estimates = await prisma.estimate.findMany({
      include: { hourBreakdown: true },
      orderBy: { createdAt: 'desc' },
    })
    return reply.send({ data: estimates })
  })

  app.get('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const estimate = await prisma.estimate.findUniqueOrThrow({
      where: { id },
      include: { hourBreakdown: true },
    })
    return reply.send({ data: estimate })
  })

  app.post('/', async (req, reply) => {
    const parsed = CreateEstimateSchema.safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Validation error' })
    const { hourBreakdown, ...data } = parsed.data
    const estimate = await prisma.estimate.create({
      data: {
        ...data,
        expiresAt: new Date(data.expiresAt),
        hourBreakdown: {
          create: hourBreakdown.map((hb) => ({ ...hb, amount: hb.hours * hb.rate })),
        },
      },
    })
    return reply.status(201).send({ data: estimate })
  })

  app.patch('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const parsed = CreateEstimateSchema.partial().safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Validation error' })
    const { hourBreakdown: _, ...data } = parsed.data
    const estimate = await prisma.estimate.update({
      where: { id },
      data: { ...data, expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined },
    })
    return reply.send({ data: estimate })
  })

  app.delete('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    await prisma.estimate.delete({ where: { id } })
    return reply.status(204).send()
  })
}
