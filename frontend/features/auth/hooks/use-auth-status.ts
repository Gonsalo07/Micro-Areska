'use client'

import { useMemo } from 'react'

import type { AuthStatus } from '@auth/lib/types'

import { useAuth } from './use-auth'

export function useAuthStatus(): AuthStatus {
  const { loading, isAuthenticated } = useAuth()

  return useMemo(() => {
    if (loading) return 'loading'
    return isAuthenticated ? 'authenticated' : 'unauthenticated'
  }, [loading, isAuthenticated])
}
