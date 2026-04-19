import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middleware/auth.js'
import { prisma } from '../../lib/db.js'
import { z } from 'zod'

const CreateTimeEntrySchema = z.object({
  projectId: z.string(),
  date: z.string(),
  hours: z.number().positive().max(24),
  description: z.string().optional(),
  billable: z.boolean().default(true),
})

export async function timeEntryRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyJWT)

  app.get('/', async (req, reply) => {
    const query = req.query as Record<string, string>
    const userId = query['userId'] ?? req.user.sub
    const entries = await prisma.timeEntry.findMany({
      where: {
        userId,
        projectId: query['projectId'],
        date: {
          gte: query['start'] ? new Date(query['start']) : undefined,
          lte: query['end'] ? new Date(query['end']) : undefined,
        },
      },
      include: { project: { select: { name: true } } },
      orderBy: { date: 'desc' },
    })
    return reply.send({ data: entries })
  })

  app.post('/', async (req, reply) => {
    const parsed = CreateTimeEntrySchema.safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Validation error' })
    const entry = await prisma.timeEntry.create({
      data: {
        ...parsed.data,
        userId: req.user.sub,
        date: new Date(parsed.data.date),
      },
    })
    return reply.status(201).send({ data: entry })
  })

  app.patch('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const parsed = CreateTimeEntrySchema.partial().safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Validation error' })
    const { date, ...rest } = parsed.data
    const entry = await prisma.timeEntry.update({
      where: { id },
      data: { ...rest, date: date ? new Date(date) : undefined },
    })
    return reply.send({ data: entry })
  })

  app.delete('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    await prisma.timeEntry.delete({ where: { id } })
    return reply.status(204).send()
  })
}
