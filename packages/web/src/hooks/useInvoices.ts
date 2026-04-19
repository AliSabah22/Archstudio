import { useMemo, useState } from 'react'
import { INVOICES } from '@/data/mockData'
import { InvoiceStatus } from '@/types/common'

export function useInvoices() {
  const [activeFilter, setActiveFilter] = useState<InvoiceStatus | 'all'>('all')

  const filteredInvoices = useMemo(() => {
    if (activeFilter === 'all') return INVOICES
    return INVOICES.filter((inv) => inv.status === activeFilter)
  }, [activeFilter])

  const financialSummary = useMemo(() => {
    const outstanding = INVOICES.filter(
      (inv) => inv.status === InvoiceStatus.Sent || inv.status === InvoiceStatus.Overdue
    ).reduce((sum, inv) => sum + inv.total, 0)

    const collected = INVOICES.filter(
      (inv) => inv.status === InvoiceStatus.Paid
    ).reduce((sum, inv) => sum + inv.total, 0)

    const overdue = INVOICES.filter(
      (inv) => inv.status === InvoiceStatus.Overdue
    ).reduce((sum, inv) => sum + inv.total, 0)

    return { outstanding, collected, overdue }
  }, [])

  const countByStatus = useMemo(() => {
    return {
      all: INVOICES.length,
      [InvoiceStatus.Draft]: INVOICES.filter((i) => i.status === InvoiceStatus.Draft).length,
      [InvoiceStatus.Sent]: INVOICES.filter((i) => i.status === InvoiceStatus.Sent).length,
      [InvoiceStatus.Paid]: INVOICES.filter((i) => i.status === InvoiceStatus.Paid).length,
      [InvoiceStatus.Overdue]: INVOICES.filter((i) => i.status === InvoiceStatus.Overdue).length,
    }
  }, [])

  return {
    invoices: filteredInvoices,
    allInvoices: INVOICES,
    activeFilter,
    setActiveFilter,
    financialSummary,
    countByStatus,
  }
}
