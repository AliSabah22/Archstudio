export interface Client {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  address: string
  city: string
  projectCount: number
  totalBilled: number
  createdAt: string
}

export interface ClientReferral {
  name: string
  value: number
}

export interface ClientRecord {
  id: string
  name: string
  type: 'Residential' | 'Commercial' | 'Hospitality'
  projects: string[]
  totalRevenue: number
  referrals: ClientReferral[]
  lastInteraction: string
  status: 'active' | 'recent' | 'dormant'
}
