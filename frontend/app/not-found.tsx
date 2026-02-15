import type { Metadata } from 'next'

import { NotFoundErrorPage } from '@error/pages/not-found'

export const metadata: Metadata = {
  title: 'Página no encontrada',
}

export default function NotFound() {
  return <NotFoundErrorPage />
}
