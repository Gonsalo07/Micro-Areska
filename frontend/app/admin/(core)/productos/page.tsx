import type { Metadata } from 'next'

import { adminRoutes } from '@admin/config/routes'
import { ProductsPage } from '@admin/pages/products'

const PATHNAME = '/admin/productos'
const page = adminRoutes[PATHNAME]!

export const metadata: Metadata = {
  title: page.title,
}

export default function Page() {
  return <ProductsPage title={page.title} pathname={PATHNAME} resource={page.resource!} />
}
