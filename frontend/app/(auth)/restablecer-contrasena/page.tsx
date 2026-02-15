import { Suspense } from 'react'

import type { Metadata } from 'next'

import { ResetPasswordPage } from '@auth/pages/reset-password'
import { ResetPasswordSkeleton } from '@auth/pages/reset-password/skeleton'

export const metadata: Metadata = {
  title: 'Restablecer contraseña',
}

export default function Page() {
  return (
    <Suspense fallback={<ResetPasswordSkeleton />}>
      <ResetPasswordPage />
    </Suspense>
  )
}
