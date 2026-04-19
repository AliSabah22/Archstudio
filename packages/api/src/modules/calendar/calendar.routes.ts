import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middleware/auth.js'
import { prisma } from '../../lib/db.js'
import { z } from 'zod'

const EventTypeEnum = z.enum(['meeting', 'site_visit', 'deadline', 'standup', 'consultation'])

const CreateEventSchema = z.object({
  title: z.string().min(1),
  type: EventTypeEnum,
  projectId: z.string().optional(),
  startTime: z.string(),
  endTime: z.string(),
  date: z.string(),
  location: z.string().optional(),
  notes: z.string().optional(),
  attendeeIds: z.array(z.string()).optional(),
})

export async function calendarRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyJWT)

  app.get('/', async (req, reply) => {
    const query = req.query as Record<string, string>
    const start = query['start'] ? new Date(query['start']) : new Date()
    const end = query['end'] ? new Date(query['end']) : new Date(Date.now() + 7 * 86400000)

    const events = await prisma.calendarEvent.findMany({
      where: { date: { gte: start, lte: end } },
      include: {
        project: { select: { name: true } },
        attendees: { select: { user: { select: { id: true, name: true } } } },
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    })
    return reply.send({ data: events })
  })

  app.post('/', async (req, reply) => {
    const parsed = CreateEventSchema.safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Validation error' })
    const { attendeeIds, ...data } = parsed.data
    const event = await prisma.calendarEvent.create({
      data: {
        ...data,
        date: new Date(data.date),
        attendees: attendeeIds
          ? { create: attendeeIds.map((userId) => ({ userId })) }
          : undefined,
      },
    })
    return reply.status(201).send({ data: event })
  })

  app.patch('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const parsed = CreateEventSchema.partial().safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Validation error' })
    const { attendeeIds: _, ...data } = parsed.data
    const event = await prisma.calendarEvent.update({
      where: { id },
      data: { ...data, date: data.date ? new Date(data.date) : undefined },
    })
    return reply.send({ data: event })
  })

  app.delete('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    await prisma.calendarEvent.delete({ where: { id } })
    return reply.status(204).send()
  })
}
