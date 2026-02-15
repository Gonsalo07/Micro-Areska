import type { Metadata } from 'next'

import { LoginPage } from '@auth/pages/login'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
}

export default function Page() {
  return <LoginPage />
}
