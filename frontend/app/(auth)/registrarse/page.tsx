import type { Metadata } from 'next'

import { SignUpPage } from '@auth/pages/signup'

export const metadata: Metadata = {
  title: 'Registrarse',
}

export default function Page() {
  return <SignUpPage />
}
