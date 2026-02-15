import type { Metadata } from 'next'

import { SettingsProfilePage } from '@public/pages/settings/pages/profile'

export const metadata: Metadata = {
  title: 'Ajustes',
}

export default function Page() {
  return <SettingsProfilePage />
}
