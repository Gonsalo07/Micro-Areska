import type { Metadata } from 'next'

import { ReturnsPage } from '@public/pages/returns'

export const metadata: Metadata = {
  title: 'Política de devoluciones',
}
export default function Page() {
  return <ReturnsPage />
}
