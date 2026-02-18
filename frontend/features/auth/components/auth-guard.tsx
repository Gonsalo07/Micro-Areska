'use client'

import { useRequireAuth } from '@auth/hooks/use-require-auth'

import LoadingScreen from '@/components/shared/loading-screen'

interface Props {
  children: React.ReactNode
}

export function AuthGuard({ children }: Props) {
  const { loading, shouldRender } = useRequireAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!shouldRender) {
    return null
  }

  return <>{children}</>
}
