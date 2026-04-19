import type { FastifyInstance } from 'fastify'
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  updateProjectPhase,
  deleteProject,
  getProjectBudget,
} from './project.controller.js'
import { verifyJWT } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/rbac.js'

export async function projectRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyJWT)

  app.get('/', listProjects)
  app.get('/:id', getProject)
  app.get('/:id/budget', getProjectBudget)
  app.post('/', { preHandler: [requireRole('architect')] }, createProject)
  app.patch('/:id', { preHandler: [requireRole('architect')] }, updateProject)
  app.patch('/:id/phase', { preHandler: [requireRole('architect')] }, updateProjectPhase)
  app.delete('/:id', { preHandler: [requireRole('principal')] }, deleteProject)
}
