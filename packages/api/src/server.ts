import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import { errorHandler } from './middleware/errorHandler.js'
import { registerRoutes } from './router.js'

const PORT = parseInt(process.env['API_PORT'] ?? '3000', 10)
const FRONTEND_URL = process.env['FRONTEND_URL'] ?? 'http://localhost:5173'
const JWT_SECRET = process.env['JWT_SECRET'] ?? 'dev-jwt-secret-change-me'

export async function buildServer() {
  const app = Fastify({
    logger: {
      level: process.env['NODE_ENV'] === 'production' ? 'info' : 'debug',
      transport:
        process.env['NODE_ENV'] !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
  })

  // Security
  await app.register(helmet, {
    contentSecurityPolicy: false,
  })

  // CORS
  await app.register(cors, {
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })

  // JWT
  await app.register(jwt, {
    secret: JWT_SECRET,
    sign: { expiresIn: '15m' },
  })

  // Global error handler
  app.setErrorHandler(errorHandler)

  // Routes
  await registerRoutes(app)

  return app
}

async function main() {
  const app = await buildServer()
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' })
    console.log(`ArchStudio API running on http://localhost:${PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

main()
