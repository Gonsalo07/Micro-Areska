import type { Metadata } from 'next'

import { adminRoutes } from '@admin/config/routes'
import { CategoriesPage } from '@admin/pages/categories'

const PATHNAME = '/admin/categorias'
const page = adminRoutes[PATHNAME]!

export const metadata: Metadata = {
  title: page.title,
}

export default function Page() {
  return <CategoriesPage title={page.title} pathname={PATHNAME} resource={page.resource!} />
}
