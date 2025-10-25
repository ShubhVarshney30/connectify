import { useAuth } from '@/contexts/auth-context'

// Re-export useAuth for convenience
export { useAuth }

// Additional auth hooks for specific use cases

export function useUser() {
  const { user } = useAuth()
  return user
}

export function useIsAuthenticated() {
  const { user } = useAuth()
  return !!user
}

export function useIsLoading() {
  const { loading } = useAuth()
  return loading
}

export function useRequireAuth() {
  const { user, loading } = useAuth()

  if (loading) {
    return { user: null, loading: true, isAuthenticated: false }
  }

  if (!user) {
    return { user: null, loading: false, isAuthenticated: false }
  }

  return { user, loading: false, isAuthenticated: true }
}
