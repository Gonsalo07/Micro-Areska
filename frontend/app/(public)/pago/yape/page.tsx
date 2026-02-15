import type { Metadata } from 'next'

import { YapePage } from '@public/pages/checkout/yape'

export const metadata: Metadata = {
  title: 'Pagar con Yape',
}

export default function Page() {
  return <YapePage />
}
