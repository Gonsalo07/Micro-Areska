import type { Metadata } from 'next'

import { SettingsAccountPage } from '@public/pages/settings/pages/account'

export const metadata: Metadata = {
  title: 'Cuenta',
}

export default function Page() {
  return <SettingsAccountPage />
}
