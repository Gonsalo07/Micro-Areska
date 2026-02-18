'use client'

import { Skeleton } from '@/components/ui/skeleton'

const columnClasses = {
  1: 'grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
} as const

interface DialogSectionProps {
  columns?: 1 | 2 | 3
  isLoading?: boolean
  skeletonFields?: number
  children: React.ReactNode
}

function SectionSkeleton({ fields, columns }: { fields: number; columns: 1 | 2 | 3 }) {
  return (
    <div className={`grid gap-4 ${columnClasses[columns]}`}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  )
}

export function DialogSection({
  columns = 2,
  isLoading = false,
  skeletonFields,
  children,
}: DialogSectionProps) {
  return (
    <div className="space-y-3">
      {isLoading && skeletonFields ? (
        <SectionSkeleton fields={skeletonFields} columns={columns} />
      ) : (
        <div className={`grid gap-4 ${columnClasses[columns]}`}>{children}</div>
      )}
    </div>
  )
}

interface DetailFieldProps {
  label: string
  children: React.ReactNode
}

export function DetailField({ label, children }: DetailFieldProps) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex min-h-9 items-center">{children}</div>
    </div>
  )
}
