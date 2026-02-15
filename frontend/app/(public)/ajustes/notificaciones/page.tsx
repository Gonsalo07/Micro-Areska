import type { Metadata } from 'next'

import { SettingsNotificationsPage } from '@public/pages/settings/pages/notifications'

export const metadata: Metadata = {
  title: 'Notificaciones',
}

export default function Page() {
  return <SettingsNotificationsPage />
}
