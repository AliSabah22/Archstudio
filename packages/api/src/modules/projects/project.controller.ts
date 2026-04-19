import type { FastifyRequest, FastifyReply } from 'fastify'
import { ProjectService } from './project.service.js'
import { CreateProjectSchema, UpdateProjectSchema, UpdatePhaseSchema } from './project.model.js'

export async function listProjects(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as Record<string, string>
  const projects = await ProjectService.list({
    status: query['status'],
    type: query['type'],
    clientId: query['clientId'],
  })
  return reply.send({ data: projects })
}

export async function getProject(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const project = await ProjectService.getById(id)
  return reply.send({ data: project })
}

export async function createProject(request: FastifyRequest, reply: FastifyReply) {
  const parsed = CreateProjectSchema.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Validation error', details: parsed.error.flatten() })
  }
  const project = await ProjectService.create(parsed.data)
  return reply.status(201).send({ data: project })
}

export async function updateProject(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const parsed = UpdateProjectSchema.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Validation error', details: parsed.error.flatten() })
  }
  const project = await ProjectService.update(id, parsed.data)
  return reply.send({ data: project })
}

export async function updateProjectPhase(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const parsed = UpdatePhaseSchema.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Validation error' })
  }
  const project = await ProjectService.updatePhase(id, parsed.data)
  return reply.send({ data: project })
}

export async function deleteProject(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  await ProjectService.delete(id)
  return reply.status(204).send()
}

export async function getProjectBudget(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const status = await ProjectService.getBudgetStatus(id)
  return reply.send({ data: status })
}
