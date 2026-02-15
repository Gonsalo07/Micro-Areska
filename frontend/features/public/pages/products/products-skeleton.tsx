import { Skeleton } from '@/components/ui/skeleton'

import { ProductCardSkeleton } from './detail/product-card-skeleton'

export function ProductsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters Sidebar Skeleton */}
        <div className="lg:w-64">
          <div className="mb-4 lg:hidden">
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="hidden space-y-6 lg:block">
            {/* Category Filter Skeleton */}
            <div>
              <Skeleton className="mb-3 h-4 w-24" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="size-4 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>

            {/* Price Filter Skeleton */}
            <div>
              <Skeleton className="mb-3 h-4 w-32" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="size-4 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="flex-1">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center items-start justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-56" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
