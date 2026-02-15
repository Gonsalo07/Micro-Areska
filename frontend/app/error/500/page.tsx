import type { Metadata } from 'next'

import { GeneralErrorPage } from '@error/pages/general'

export const metadata: Metadata = {
  title: 'Algo salió mal',
}

export default function Page() {
  return <GeneralErrorPage />
}
