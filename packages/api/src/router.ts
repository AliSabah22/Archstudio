import type { FastifyInstance } from 'fastify'
import { authRoutes } from './modules/auth/auth.routes.js'
import { projectRoutes } from './modules/projects/project.routes.js'
import { clientRoutes } from './modules/clients/client.routes.js'
import { pipelineRoutes } from './modules/pipeline/pipeline.routes.js'
import { invoiceRoutes } from './modules/invoices/invoice.routes.js'
import { estimateRoutes } from './modules/estimates/estimate.routes.js'
import { teamRoutes } from './modules/team/team.routes.js'
import { calendarRoutes } from './modules/calendar/calendar.routes.js'
import { marketingRoutes } from './modules/marketing/marketing.routes.js'
import { timeEntryRoutes } from './modules/time-entries/timeEntry.routes.js'
import { notificationRoutes } from './modules/notifications/notification.routes.js'

export async function registerRoutes(app: FastifyInstance) {
  // Health check
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

  // API v1 routes
  await app.register(authRoutes, { prefix: '/api/v1/auth' })
  await app.register(projectRoutes, { prefix: '/api/v1/projects' })
  await app.register(clientRoutes, { prefix: '/api/v1/clients' })
  await app.register(pipelineRoutes, { prefix: '/api/v1/pipeline' })
  await app.register(invoiceRoutes, { prefix: '/api/v1/invoices' })
  await app.register(estimateRoutes, { prefix: '/api/v1/estimates' })
  await app.register(teamRoutes, { prefix: '/api/v1/team' })
  await app.register(calendarRoutes, { prefix: '/api/v1/calendar' })
  await app.register(marketingRoutes, { prefix: '/api/v1/marketing' })
  await app.register(timeEntryRoutes, { prefix: '/api/v1/time-entries' })
  await app.register(notificationRoutes, { prefix: '/api/v1/notifications' })
}
