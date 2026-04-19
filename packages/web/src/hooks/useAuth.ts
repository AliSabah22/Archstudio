import { useAppStore } from '@/stores/appStore'
import { UserRole } from '@/types/common'

export function useAuth() {
  const user = useAppStore((state) => state.user)

  const hasRole = (role: UserRole): boolean => {
    const hierarchy: UserRole[] = [
      UserRole.Intern,
      UserRole.Designer,
      UserRole.Architect,
      UserRole.SeniorArchitect,
      UserRole.Principal,
    ]
    const userIndex = hierarchy.indexOf(user.role)
    const requiredIndex = hierarchy.indexOf(role)
    return userIndex >= requiredIndex
  }

  return {
    user,
    isAuthenticated: true,
    isPrincipal: user.role === UserRole.Principal,
    isAdmin: user.role === UserRole.Admin || user.role === UserRole.Principal,
    hasRole,
  }
}
