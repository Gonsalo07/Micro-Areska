'use client'

import { ReactNode } from 'react'

import { CreditCard } from 'lucide-react'

import { ProtectedRoute } from '@/components/shared/protected-route'

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <ProtectedRoute
      title="Proceso de pago"
      message="Por favor, inicia sesión para continuar con tu compra."
      icon={CreditCard}
    >
      {children}
    </ProtectedRoute>
  )
}
