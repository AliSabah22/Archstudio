import { InvoiceStatus } from './common'

export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

export interface Invoice {
  id: string
  number: string
  projectId: string
  projectName: string
  clientId: string
  clientName: string
  status: InvoiceStatus
  lineItems: InvoiceLineItem[]
  subtotal: number
  tax: number
  total: number
  issueDate: string
  dueDate: string
  paidDate?: string
  notes?: string
}
