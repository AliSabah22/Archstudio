import { prisma } from '../../lib/db.js'
import type { CreateProjectInput, UpdateProjectInput, UpdatePhaseInput } from './project.model.js'

export const ProjectService = {
  async list(filters: { status?: string; type?: string; clientId?: string }) {
    return prisma.project.findMany({
      where: {
        status: filters.status as never | undefined,
        type: filters.type as never | undefined,
        clientId: filters.clientId,
      },
      include: {
        client: { select: { id: true, name: true } },
        members: { include: { user: { select: { id: true, name: true, role: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getById(id: string) {
    return prisma.project.findUniqueOrThrow({
      where: { id },
      include: {
        client: true,
        members: { include: { user: true } },
        invoices: { select: { id: true, number: true, total: true, status: true } },
      },
    })
  },

  async create(data: CreateProjectInput) {
    return prisma.project.create({
      data: {
        name: data.name,
        clientId: data.clientId,
        type: data.type,
        phase: data.phase ?? 'pre_design',
        status: data.status ?? 'active',
        budget: data.budget,
        startDate: new Date(data.startDate),
        dueDate: new Date(data.dueDate),
        address: data.address,
        description: data.description,
        priority: data.priority ?? 'medium',
      },
    })
  },

  async update(id: string, data: UpdateProjectInput) {
    return prisma.project.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    })
  },

  async updatePhase(id: string, data: UpdatePhaseInput) {
    return prisma.project.update({
      where: { id },
      data: { phase: data.phase },
    })
  },

  async delete(id: string) {
    return prisma.project.delete({ where: { id } })
  },

  async getBudgetStatus(id: string) {
    const project = await prisma.project.findUniqueOrThrow({ where: { id } })
    const timeEntries = await prisma.timeEntry.findMany({
      where: { projectId: id },
      include: { user: { select: { hourlyRate: true } } },
    })
    let spent = 0
    for (const entry of timeEntries) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rate = (entry as any).user?.hourlyRate?.toNumber?.() ?? (entry as any).user?.hourlyRate ?? 0
      spent += Number(entry.hours) * Number(rate)
    }
    return {
      budget: project.budget,
      spent,
      remaining: project.budget.toNumber() - spent,
      percentUsed: Math.round((spent / project.budget.toNumber()) * 100),
    }
  },
}
