import type { Metadata } from 'next'

import { ForgotPasswordPage } from '@auth/pages/forgot-password'

export const metadata: Metadata = {
  title: 'Recuperar contraseña',
}

export default function Page() {
  return <ForgotPasswordPage />
}
