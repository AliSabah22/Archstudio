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
