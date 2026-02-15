import type { Metadata } from 'next'

import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = {
  title: 'Sobre nosotros',
}

export default function Page() {
  return (
    <div className="flex items-center justify-center py-20 px-6">
      <ComingSoon />
    </div>
  )
}
