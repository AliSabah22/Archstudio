import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/rbac.js'
import { prisma } from '../../lib/db.js'
import { z } from 'zod'

const InvoiceStatusEnum = z.enum(['draft', 'sent', 'paid', 'overdue'])

const LineItemSchema = z.object({
  description: z.string(),
  quantity: z.number().positive(),
  unitPrice: z.number().positive(),
})

const CreateInvoiceSchema = z.object({
  projectId: z.string(),
  clientId: z.string(),
  status: InvoiceStatusEnum.default('draft'),
  lineItems: z.array(LineItemSchema).min(1),
  tax: z.number().min(0).default(0),
  dueDate: z.string(),
  notes: z.string().optional(),
})

export async function invoiceRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyJWT)

  app.get('/', async (req, reply) => {
    const query = req.query as Record<string, string>
    const invoices = await prisma.invoice.findMany({
      where: query['status'] ? { status: query['status'] as never } : undefined,
      include: {
        project: { select: { name: true } },
        client: { select: { name: true } },
        lineItems: true,
      },
      orderBy: { issueDate: 'desc' },
    })
    return reply.send({ data: invoices })
  })

  app.get('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const invoice = await prisma.invoice.findUniqueOrThrow({
      where: { id },
      include: { lineItems: true, project: true, client: true },
    })
    return reply.send({ data: invoice })
  })

  app.post('/', { preHandler: [requireRole('architect')] }, async (req, reply) => {
    const parsed = CreateInvoiceSchema.safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Validation error' })
    const { lineItems, ...invoiceData } = parsed.data
    const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    const total = subtotal + subtotal * (invoiceData.tax / 100)
    const lastInvoice = await prisma.invoice.findFirst({ orderBy: { createdAt: 'desc' } })
    const nextNum = lastInvoice ? parseInt(lastInvoice.number.split('-').pop() ?? '0') + 1 : 1
    const number = `INV-${new Date().getFullYear()}-${String(nextNum).padStart(3, '0')}`
    const invoice = await prisma.invoice.create({
      data: {
        ...invoiceData,
        number,
        subtotal,
        total,
        issueDate: new Date(),
        dueDate: new Date(invoiceData.dueDate),
        lineItems: { create: lineItems.map((li) => ({ ...li, amount: li.quantity * li.unitPrice })) },
      },
    })
    return reply.status(201).send({ data: invoice })
  })

  app.patch('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const parsed = z.object({ status: InvoiceStatusEnum }).safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Validation error' })
    const invoice = await prisma.invoice.update({ where: { id }, data: parsed.data })
    return reply.send({ data: invoice })
  })

  app.delete('/:id', { preHandler: [requireRole('principal')] }, async (req, reply) => {
    const { id } = req.params as { id: string }
    await prisma.invoice.delete({ where: { id } })
    return reply.status(204).send()
  })
}
