// SendGrid mailer stub — replace with actual SendGrid SDK integration
// Install: pnpm add @sendgrid/mail

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
}

interface SendResult {
  success: boolean
  messageId?: string
  error?: string
}

const FROM_ADDRESS = process.env['SENDGRID_FROM'] ?? 'noreply@archstudio.ca'

export async function sendEmail(options: EmailOptions): Promise<SendResult> {
  if (process.env['NODE_ENV'] === 'development') {
    console.log('[Mailer] Email (dev — not sent):')
    console.log(`  To: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`)
    console.log(`  Subject: ${options.subject}`)
    return { success: true, messageId: `dev-${Date.now()}` }
  }

  // Production: integrate SendGrid here
  // const sgMail = await import('@sendgrid/mail')
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
  // const [response] = await sgMail.send({ ...options, from: options.from ?? FROM_ADDRESS })
  // return { success: true, messageId: response.headers['x-message-id'] }

  console.warn('[Mailer] Production email not configured. Message not sent.')
  return { success: false, error: 'Email provider not configured' }
}

export function invoiceReminderEmail(params: {
  clientName: string
  invoiceNumber: string
  amount: number
  dueDate: string
  firmName?: string
}): Pick<EmailOptions, 'subject' | 'html' | 'text'> {
  const firm = params.firmName ?? 'ArchStudio'
  const amount = params.amount.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })
  return {
    subject: `Payment Reminder: Invoice ${params.invoiceNumber} — ${firm}`,
    text: `Dear ${params.clientName},\n\nThis is a reminder that invoice ${params.invoiceNumber} for ${amount} was due on ${params.dueDate}.\n\nPlease remit payment at your earliest convenience.\n\nThank you,\n${firm}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>${firm}</h2>
        <p>Dear ${params.clientName},</p>
        <p>This is a friendly reminder that the following invoice is outstanding:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td><strong>Invoice #:</strong></td><td>${params.invoiceNumber}</td></tr>
          <tr><td><strong>Amount:</strong></td><td>${amount}</td></tr>
          <tr><td><strong>Due Date:</strong></td><td>${params.dueDate}</td></tr>
        </table>
        <p>Please remit payment at your earliest convenience.</p>
        <p>Thank you for your business.</p>
        <p>${firm}</p>
      </div>
    `,
  }
}

export { FROM_ADDRESS }
