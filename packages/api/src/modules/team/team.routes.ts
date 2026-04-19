import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/rbac.js'
import { prisma } from '../../lib/db.js'
import { z } from 'zod'

const UserRoleEnum = z.enum(['principal', 'senior_architect', 'architect', 'designer', 'intern', 'admin'])

const CreateMemberSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: UserRoleEnum,
  phone: z.string().optional(),
  hourlyRate: z.number().positive().optional(),
})

export async function teamRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyJWT)

  app.get('/', async (_req, reply) => {
    const members = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        hourlyRate: true,
        createdAt: true,
        _count: { select: { projectMemberships: true } },
      },
      orderBy: { name: 'asc' },
    })
    return reply.send({ data: members })
  })

  app.get('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const member = await prisma.user.findUniqueOrThrow({
      where: { id },
      include: {
        projectMemberships: { include: { project: { select: { id: true, name: true, status: true } } } },
      },
    })
    return reply.send({ data: member })
  })

  app.get('/:id/utilization', async (req, reply) => {
    const { id } = req.params as { id: string }
    const query = req.query as Record<string, string>
    const month = query['month'] ?? new Date().toISOString().slice(0, 7)
    const startDate = new Date(`${month}-01`)
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + 1)

    const entries = await prisma.timeEntry.findMany({
      where: { userId: id, date: { gte: startDate, lt: endDate } },
    })
    let billableHours = 0
    let totalHours = 0
    for (const e of entries) {
      const h = Number(e.hours)
      totalHours += h
      if (e.billable) billableHours += h
    }
    const targetHours = 160

    return reply.send({
      data: {
        billableHours,
        totalHours,
        targetHours,
        utilization: Math.round((billableHours / targetHours) * 100),
      },
    })
  })

  app.post('/', { preHandler: [requireRole('principal')] }, async (req, reply) => {
    const parsed = CreateMemberSchema.safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Validation error' })
    const member = await prisma.user.create({
      data: { ...parsed.data, passwordHash: 'placeholder' },
    })
    return reply.status(201).send({ data: member })
  })

  app.patch('/:id', { preHandler: [requireRole('principal')] }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const parsed = CreateMemberSchema.partial().safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Validation error' })
    const member = await prisma.user.update({ where: { id }, data: parsed.data })
    return reply.send({ data: member })
  })
}
