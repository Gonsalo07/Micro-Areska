import type { Metadata } from 'next'

import { adminRoutes } from '@admin/config/routes'
import { UsersPage } from '@admin/pages/users'

const PATHNAME = '/admin/usuarios'
const page = adminRoutes[PATHNAME]!

export const metadata: Metadata = {
  title: page.title,
}

export default function Page() {
  return <UsersPage title={page.title} pathname={PATHNAME} resource={page.resource!} />
}
