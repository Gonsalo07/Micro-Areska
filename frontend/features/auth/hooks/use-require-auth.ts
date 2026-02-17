'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useAuth } from './use-auth'

interface UseRequireAuthOptions {
  redirectTo?: string
  requireAdmin?: boolean
}

interface UseRequireAuthReturn {
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  shouldRender: boolean
}

export function useRequireAuth(options: UseRequireAuthOptions = {}): UseRequireAuthReturn {
  const { redirectTo = '/', requireAdmin = false } = options
  const { loading, isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()

  const shouldRedirect = !loading && (!isAuthenticated || (requireAdmin && !isAdmin))

  useEffect(() => {
    if (shouldRedirect) {
      router.push(redirectTo)
    }
  }, [shouldRedirect, redirectTo, router])

  return {
    loading,
    isAuthenticated,
    isAdmin,
    shouldRender: !loading && !shouldRedirect,
  }
}
