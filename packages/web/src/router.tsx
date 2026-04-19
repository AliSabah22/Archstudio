export const ROUTES = {
  DASHBOARD: '/',
  PROJECTS: '/projects',
  PIPELINE: '/pipeline',
  TEAM: '/team',
  INVOICES: '/invoices',
  ESTIMATES: '/estimates',
  CALENDAR: '/calendar',
  MARKETING: '/marketing',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
