import type { Metadata } from 'next'

import { UnauthorisedErrorPage } from '@error/pages/unauthorized'

export const metadata: Metadata = {
  title: 'Acceso no autorizado',
}

export default function Page() {
  return <UnauthorisedErrorPage />
}
