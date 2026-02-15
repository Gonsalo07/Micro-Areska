import type { Metadata } from 'next'

import { ShippingPage } from '@public/pages/shipping'

export const metadata: Metadata = {
  title: 'Información de envíos',
}
export default function Page() {
  return <ShippingPage />
}
