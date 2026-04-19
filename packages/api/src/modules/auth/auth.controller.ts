import type { FastifyRequest, FastifyReply } from 'fastify'
import { AuthService } from './auth.service.js'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const refreshSchema = z.object({
  refreshToken: z.string(),
})

export async function loginHandler(request: FastifyRequest, reply: FastifyReply) {
  const parsed = loginSchema.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Invalid credentials format' })
  }
  const { email, password } = parsed.data
  const result = await AuthService.validateCredentials(email, password)
  if (!result) {
    return reply.status(401).send({ error: 'Invalid email or password' })
  }
  const tokens = AuthService.generateTokens(result, request.server)
  return reply.status(200).send({ user: result, ...tokens })
}

export async function refreshHandler(request: FastifyRequest, reply: FastifyReply) {
  const parsed = refreshSchema.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Refresh token required' })
  }
  try {
    const result = AuthService.refreshTokens(parsed.data.refreshToken, request.server)
    return reply.status(200).send(result)
  } catch {
    return reply.status(401).send({ error: 'Invalid or expired refresh token' })
  }
}

export async function logoutHandler(_request: FastifyRequest, reply: FastifyReply) {
  return reply.status(204).send()
}

export async function meHandler(request: FastifyRequest, reply: FastifyReply) {
  return reply.status(200).send({ user: request.user })
}
