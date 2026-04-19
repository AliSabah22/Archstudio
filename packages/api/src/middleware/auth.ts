import type { FastifyRequest, FastifyReply } from 'fastify'

export interface JWTPayload {
  sub: string
  role: string
  email: string
  iat?: number
  exp?: number
  type?: string
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JWTPayload
    user: JWTPayload
  }
}

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized', message: 'Invalid or expired token' })
  }
}

export async function optionalJWT(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const authHeader = request.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    try {
      await request.jwtVerify()
    } catch {
      // Ignore, continue without auth
    }
  }
}
