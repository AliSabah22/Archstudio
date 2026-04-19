import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middleware/auth.js'
import { prisma } from '../../lib/db.js'

export async function notificationRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyJWT)

  app.get('/', async (req, reply) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.sub },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return reply.send({ data: notifications })
  })

  app.patch('/:id/read', async (req, reply) => {
    const { id } = req.params as { id: string }
    const notification = await prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    })
    return reply.send({ data: notification })
  })

  app.patch('/read-all', async (req, reply) => {
    await prisma.notification.updateMany({
      where: { userId: req.user.sub, readAt: null },
      data: { readAt: new Date() },
    })
    return reply.status(204).send()
  })
}
