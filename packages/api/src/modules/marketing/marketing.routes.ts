import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middleware/auth.js'
import { prisma } from '../../lib/db.js'
import { z } from 'zod'

const LeadChannelEnum = z.enum(['instagram', 'website', 'referral', 'google_ads'])

const CreateLeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  channel: LeadChannelEnum,
  estimatedValue: z.number().positive().optional(),
  notes: z.string().optional(),
  opportunityId: z.string().optional(),
})

export async function marketingRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyJWT)

  app.get('/leads', async (req, reply) => {
    const query = req.query as Record<string, string>
    const leads = await prisma.marketingLead.findMany({
      where: query['channel'] ? { channel: query['channel'] as never } : undefined,
      orderBy: { createdAt: 'desc' },
    })
    return reply.send({ data: leads })
  })

  app.get('/analytics', async (req, reply) => {
    const query = req.query as Record<string, string>
    const month = query['month'] ?? new Date().toISOString().slice(0, 7)
    const startDate = new Date(`${month}-01`)
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + 1)

    const leads = await prisma.marketingLead.findMany({
      where: { createdAt: { gte: startDate, lt: endDate } },
    })

    const byChannel: Record<string, number> = {}
    for (const lead of leads) {
      const ch = String(lead.channel)
      byChannel[ch] = (byChannel[ch] ?? 0) + 1
    }

    return reply.send({
      data: {
        totalLeads: leads.length,
        byChannel,
        month,
      },
    })
  })

  app.post('/leads', async (req, reply) => {
    const parsed = CreateLeadSchema.safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Validation error' })
    const lead = await prisma.marketingLead.create({ data: parsed.data })
    return reply.status(201).send({ data: lead })
  })

  app.patch('/leads/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const parsed = CreateLeadSchema.partial().safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Validation error' })
    const lead = await prisma.marketingLead.update({ where: { id }, data: parsed.data })
    return reply.send({ data: lead })
  })
}
