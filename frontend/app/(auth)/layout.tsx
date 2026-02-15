'use client'

import { ReactNode, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { AuthLayout } from '@auth/layout'

import { useAuthStore } from '@/stores/auth-store'

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  const { init, user, isLoadingInitial } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    if (!isLoadingInitial && user) {
      router.replace('/')
    }
  }, [isLoadingInitial, user, router])

  if (isLoadingInitial) {
    return null
  }

  if (user) {
    return null
  }

  return <AuthLayout>{children}</AuthLayout>
}
