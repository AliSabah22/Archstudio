import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middleware/auth.js'
import { prisma } from '../../lib/db.js'
import { z } from 'zod'

const CreateClientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
})

export async function clientRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyJWT)

  app.get('/', async (_req, reply) => {
    const clients = await prisma.client.findMany({ orderBy: { name: 'asc' } })
    return reply.send({ data: clients })
  })

  app.get('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const client = await prisma.client.findUniqueOrThrow({ where: { id }, include: { projects: true } })
    return reply.send({ data: client })
  })

  app.post('/', async (req, reply) => {
    const parsed = CreateClientSchema.safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Validation error' })
    const client = await prisma.client.create({ data: parsed.data })
    return reply.status(201).send({ data: client })
  })

  app.patch('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const parsed = CreateClientSchema.partial().safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Validation error' })
    const client = await prisma.client.update({ where: { id }, data: parsed.data })
    return reply.send({ data: client })
  })

  app.delete('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    await prisma.client.delete({ where: { id } })
    return reply.status(204).send()
  })
}
