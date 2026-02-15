import type { Metadata } from 'next'

import { CheckoutPage } from '@public/pages/checkout'

export const metadata: Metadata = {
  title: 'Proceso de pago',
}

export default function Page() {
  return <CheckoutPage />
}
