import { create } from 'zustand'
import { UserRole } from '@/types/common'

interface User {
  id: string
  name: string
  initials: string
  role: UserRole
  email: string
}

export interface TimerState {
  isRunning: boolean
  projectId: string | null
  projectName: string
  phase: string
  startTime: Date | null
}

export interface TimeEntry {
  id: string
  userId: string
  projectId: string
  phase: string
  hours: number
  date: string
  activity: string
  note: string
  billable: boolean
}

interface AppState {
  activeView: string
  sidebarOpen: boolean
  user: User
  timer: TimerState
  timeEntries: TimeEntry[]
  toastMessage: string | null
  setActiveView: (view: string) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  startTimer: (projectId: string, projectName: string, phase: string) => void
  stopTimer: () => TimeEntry | null
  discardTimer: () => void
  addTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void
  showToast: (message: string) => void
  clearToast: () => void
}

const MOCK_USER: User = {
  id: 'user_001',
  name: 'Pamir Dogan',
  initials: 'PD',
  role: UserRole.Principal,
  email: 'pamir@archstudio.ca',
}

const DEFAULT_TIMER: TimerState = {
  isRunning: false,
  projectId: null,
  projectName: '',
  phase: '',
  startTime: null,
}

export const useAppStore = create<AppState>((set, get) => ({
  activeView: 'dashboard',
  sidebarOpen: true,
  user: MOCK_USER,
  timer: DEFAULT_TIMER,
  timeEntries: [],
  toastMessage: null,
  setActiveView: (view) => set({ activeView: view }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  startTimer: (projectId, projectName, phase) =>
    set({ timer: { isRunning: true, projectId, projectName, phase, startTime: new Date() } }),
  stopTimer: () => {
    const { timer, timeEntries } = get()
    if (!timer.isRunning || !timer.startTime || !timer.projectId) return null
    const elapsedMs = Date.now() - timer.startTime.getTime()
    const hours = Math.max(Math.round((elapsedMs / 3_600_000) * 100) / 100, 0.01)
    const entry: TimeEntry = {
      id: `te_${Date.now()}`,
      userId: 'tm_001',
      projectId: timer.projectId,
      phase: timer.phase,
      hours,
      date: new Date().toISOString().split('T')[0],
      activity: 'Timer Session',
      note: '',
      billable: true,
    }
    set({ timer: DEFAULT_TIMER, timeEntries: [...timeEntries, entry] })
    return entry
  },
  discardTimer: () => set({ timer: DEFAULT_TIMER }),
  addTimeEntry: (entry) =>
    set((state) => ({
      timeEntries: [...state.timeEntries, { ...entry, id: `te_${Date.now()}` }],
    })),
  showToast: (message) => {
    set({ toastMessage: message })
    setTimeout(() => get().clearToast(), 3500)
  },
  clearToast: () => set({ toastMessage: null }),
}))
