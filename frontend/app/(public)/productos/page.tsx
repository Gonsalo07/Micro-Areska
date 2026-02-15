import { Suspense } from 'react'

import type { Metadata } from 'next'

import { ProductsPage } from '@public/pages/products'
import { ProductsSkeleton } from '@public/pages/products/products-skeleton'

export const metadata: Metadata = {
  title: 'Catálogo de productos',
}
export default function Page() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsPage />
    </Suspense>
  )
}
