import type { Metadata } from 'next'

import { ForbiddenErrorPage } from '@error/pages/forbidden'

export const metadata: Metadata = {
  title: 'Acceso denegado',
}

export default function Page() {
  return <ForbiddenErrorPage />
}
