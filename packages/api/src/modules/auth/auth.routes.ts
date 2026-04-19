import type { FastifyInstance } from 'fastify'
import { loginHandler, refreshHandler, logoutHandler, meHandler } from './auth.controller.js'
import { verifyJWT } from '../../middleware/auth.js'

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', loginHandler)
  app.post('/refresh', refreshHandler)
  app.post('/logout', { preHandler: [verifyJWT] }, logoutHandler)
  app.get('/me', { preHandler: [verifyJWT] }, meHandler)
}
