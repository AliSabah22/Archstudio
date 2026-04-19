import { create } from 'zustand'
import { UserRole } from '@/types/common'

interface User {
  id: string
  name: string
  initials: string
  role: UserRole
  email: string
}

interface AppState {
  activeView: string
  sidebarOpen: boolean
  user: User
  setActiveView: (view: string) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

const MOCK_USER: User = {
  id: 'user_001',
  name: 'Pamir Dogan',
  initials: 'PD',
  role: UserRole.Principal,
  email: 'pamir@archstudio.ca',
}

export const useAppStore = create<AppState>((set) => ({
  activeView: 'dashboard',
  sidebarOpen: true,
  user: MOCK_USER,
  setActiveView: (view) => set({ activeView: view }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
