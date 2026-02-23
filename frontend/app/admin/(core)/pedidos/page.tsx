import type { Metadata } from 'next'

import { adminRoutes } from '@admin/config/routes'
import { OrdersPage } from '@admin/pages/orders'

const PATHNAME = '/admin/pedidos'
const page = adminRoutes[PATHNAME]!

export const metadata: Metadata = {
  title: page.title,
}

export default function Page() {
  return <OrdersPage title={page.title} pathname={PATHNAME} resource={page.resource!} />
}
