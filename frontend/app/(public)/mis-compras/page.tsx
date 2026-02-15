import type { Metadata } from 'next'

import { MyPurchasesPage } from '@public/pages/my-purchases'

export const metadata: Metadata = {
  title: 'Mis compras',
}

export default function Page() {
  return <MyPurchasesPage />
}
