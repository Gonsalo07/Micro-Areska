'use client'

import { ReactNode } from 'react'

import { LogIn, LucideIcon } from 'lucide-react'

import { useAuthStore } from '@auth/stores/auth.store'

import { EmptyState } from '@/components/shared/empty-state'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  title?: string
  message?: string
  icon?: LucideIcon
}

export function ProtectedRoute({
  children,
  fallback,
  title = 'Debes iniciar sesión',
  message = 'Por favor, inicia sesión para acceder a este contenido.',
  icon = LogIn,
}: Props) {
  const loading = useAuthStore((s) => s.loading)
  const profile = useAuthStore((s) => s.profile)

  if (loading) {
    return <Skeleton className="h-96 w-full" />
  }

  if (!profile) {
    return (
      fallback || (
        <EmptyState
          title={title}
          description={message}
          icon={icon}
          action={{
            label: 'Iniciar sesión',
            href: '/iniciar-sesion',
            icon: LogIn,
          }}
        />
      )
    )
  }

  return <>{children}</>
}
