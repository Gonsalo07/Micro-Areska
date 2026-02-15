import type { Metadata } from 'next'

import { SettingsAppearancePage } from '@public/pages/settings/pages/appearance'

export const metadata: Metadata = {
  title: 'Apariencia',
}

export default function Page() {
  return <SettingsAppearancePage />
}
