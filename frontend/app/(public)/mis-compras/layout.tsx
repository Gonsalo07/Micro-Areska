'use client'

import { ReactNode } from 'react'

import { Store } from 'lucide-react'

import { ProtectedRoute } from '@/components/shared/protected-route'

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <ProtectedRoute
      title="Tus compras"
      message="Por favor, inicia sesión para ver el historial de tus compras."
      icon={Store}
    >
      {children}
    </ProtectedRoute>
  )
}
