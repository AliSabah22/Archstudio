import type { FastifyRequest, FastifyReply } from 'fastify'

export type Role = 'principal' | 'senior_architect' | 'architect' | 'designer' | 'intern' | 'admin'

const ROLE_HIERARCHY: Record<Role, number> = {
  intern: 1,
  designer: 2,
  architect: 3,
  senior_architect: 4,
  principal: 5,
  admin: 5,
}

export function requireRole(minimumRole: Role) {
  return async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const user = request.user
    if (!user) {
      reply.status(401).send({ error: 'Unauthorized' })
      return
    }
    const userLevel = ROLE_HIERARCHY[user.role as Role] ?? 0
    const requiredLevel = ROLE_HIERARCHY[minimumRole]
    if (userLevel < requiredLevel) {
      reply.status(403).send({
        error: 'Forbidden',
        message: `This action requires ${minimumRole} role or higher`,
      })
    }
  }
}

export function requireSelf(paramName = 'id') {
  return async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const user = request.user
    const params = request.params as Record<string, string>
    const targetId = params[paramName]
    if (!user) {
      reply.status(401).send({ error: 'Unauthorized' })
      return
    }
    const isPrincipal = (ROLE_HIERARCHY[user.role as Role] ?? 0) >= ROLE_HIERARCHY['principal']
    if (!isPrincipal && user.sub !== targetId) {
      reply.status(403).send({ error: 'Forbidden', message: 'Can only access your own resources' })
    }
  }
}
