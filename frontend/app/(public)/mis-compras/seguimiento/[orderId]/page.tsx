import type { Metadata } from 'next'

import { TrackingPage } from '@public/pages/tracking'

export const metadata: Metadata = {
  title: 'Seguimiento de Pedido - Areska',
  description: 'Rastrea tu pedido en tiempo real',
}

export default function Page() {
  return <TrackingPage />
}
