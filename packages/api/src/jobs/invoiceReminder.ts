import { Worker, Queue } from 'bullmq'
import { getRedis } from '../lib/redis.js'
import { prisma } from '../lib/db.js'
import { sendEmail, invoiceReminderEmail } from '../lib/mailer.js'

export const INVOICE_REMINDER_QUEUE = 'invoice-reminders'

export function createInvoiceReminderQueue() {
  const connection = getRedis()
  return new Queue(INVOICE_REMINDER_QUEUE, { connection })
}

export function startInvoiceReminderWorker() {
  const connection = getRedis()

  const worker = new Worker(
    INVOICE_REMINDER_QUEUE,
    async (job) => {
      console.log(`[InvoiceReminder] Processing job ${job.id}`)

      const today = new Date()
      const overdueInvoices = await prisma.invoice.findMany({
        where: {
          status: 'overdue',
          dueDate: { lt: today },
        },
        include: {
          client: { select: { name: true, email: true } },
        },
      })

      console.log(`[InvoiceReminder] Found ${overdueInvoices.length} overdue invoices`)

      for (const invoice of overdueInvoices) {
        if (!invoice.client.email) continue
        const emailContent = invoiceReminderEmail({
          clientName: invoice.client.name,
          invoiceNumber: invoice.number,
          amount: invoice.total.toNumber(),
          dueDate: invoice.dueDate.toLocaleDateString('en-CA'),
        })
        await sendEmail({
          to: invoice.client.email,
          ...emailContent,
        })
        console.log(`[InvoiceReminder] Reminder sent for ${invoice.number} to ${invoice.client.email}`)
      }

      return { processedCount: overdueInvoices.length }
    },
    { connection }
  )

  worker.on('completed', (job) => {
    console.log(`[InvoiceReminder] Job ${job.id} completed`)
  })

  worker.on('failed', (job, err) => {
    console.error(`[InvoiceReminder] Job ${job?.id} failed:`, err.message)
  })

  return worker
}
