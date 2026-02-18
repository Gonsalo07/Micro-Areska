'use client'

import { ReactNode, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { AuthLayout } from '@auth/layout'
import { useAuthStore } from '@auth/stores/auth.store'

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  const loading = useAuthStore((s) => s.loading)
  const profile = useAuthStore((s) => s.profile)
  const router = useRouter()

  useEffect(() => {
    if (!loading && profile) {
      router.replace('/')
    }
  }, [loading, profile, router])

  if (loading) {
    return null
  }

  if (profile) {
    return null
  }

  return <AuthLayout>{children}</AuthLayout>
}
