import type { Metadata } from 'next'

import { CartPage } from '@public/pages/cart'

export const metadata: Metadata = {
  title: 'Carrito de compras',
}
export default function Page() {
  return <CartPage />
}
