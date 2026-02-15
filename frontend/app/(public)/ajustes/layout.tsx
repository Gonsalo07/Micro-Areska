'use client'

import { ReactNode } from 'react'

import { Settings } from 'lucide-react'

import { SettingsLayout } from '@public/pages/settings/layout'

import { ProtectedRoute } from '@/components/shared/protected-route'

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <ProtectedRoute
      title="Ajustes de perfil"
      message="Por favor, inicia sesión para acceder a tus ajustes personales."
      icon={Settings}
    >
      <SettingsLayout>{children}</SettingsLayout>
    </ProtectedRoute>
  )
}
