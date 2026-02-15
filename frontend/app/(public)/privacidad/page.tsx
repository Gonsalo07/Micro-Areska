import type { Metadata } from 'next'

import { PrivacyPolicyPage } from '@public/pages/privacy'

export const metadata: Metadata = {
  title: 'Política de privacidad',
}

export default function Page() {
  return <PrivacyPolicyPage />
}
