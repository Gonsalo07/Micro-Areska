import type { Metadata } from 'next'

import { MaintenanceErrorPage } from '@error/pages/maintenance'

export const metadata: Metadata = {
  title: 'Sitio en mantenimiento',
}

export default function Page() {
  return <MaintenanceErrorPage />
}
