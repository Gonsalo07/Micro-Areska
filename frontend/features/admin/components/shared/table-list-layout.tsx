'use client'

import { useMemo } from 'react'

import type { ColumnDef } from '@tanstack/react-table'
import { CirclePlus, FileSpreadsheet, FileX, RotateCw } from 'lucide-react'

import { DataTable } from '@admin/components/data-table/data-table'
import { DataTableSkeleton } from '@admin/components/data-table/data-table-skeleton'
import { Breadcrumbs } from '@admin/components/shared/breadcrumbs'
import { getRoute } from '@admin/config/routes'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

const DEFAULT_PAGE_SIZE = 20

interface TableListLayoutProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data?: TData[]
  resource: string
  title: string
  description: string
  pathname: string
  filterCount?: number
  onCreate?: () => void
  onRefresh?: () => void
  getRowHref?: (row: TData) => string
  onRowClick?: (row: TData) => void
  isRefetching?: boolean
  isFetchingData?: boolean
  showAddButton?: boolean
  showExcelButton?: boolean
  showPdfButton?: boolean
}

function getFilterCount<TData, TValue>(
  columns: ColumnDef<TData, TValue>[],
  filterCount: number | undefined
): number {
  if (filterCount !== undefined) return filterCount
  return columns.filter((col) => {
    const meta = col.meta as Record<string, unknown> | undefined
    return meta?.filter
  }).length
}

export function TableListLayout<TData, TValue>({
  columns,
  data,
  resource,
  title,
  description,
  pathname,
  filterCount,
  onCreate,
  onRefresh,
  getRowHref,
  onRowClick,
  isRefetching = false,
  isFetchingData = false,
  showAddButton = true,
  showExcelButton = true,
  showPdfButton = true,
}: TableListLayoutProps<TData, TValue>) {
  const computedFilterCount = getFilterCount(columns, filterCount)
  const isLoading = data === undefined
  const isRefreshingOrFetching = isRefetching || isFetchingData

  const skeletonRowCount = useMemo(() => {
    if (typeof window === 'undefined') return DEFAULT_PAGE_SIZE
    const storageKey = `${resource}-page-size`
    const savedSize = localStorage.getItem(storageKey)
    return savedSize ? Number(savedSize) : DEFAULT_PAGE_SIZE
  }, [resource])

  const route = getRoute(pathname)
  const Icon = route?.sidebar?.icon

  return (
    <>
      <Breadcrumbs pathname={pathname} />
      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {Icon && <Icon strokeWidth={2.5} />}
              {title}
            </h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-wrap gap-2">
              {showExcelButton && (
                <Button variant="outline" disabled={isLoading}>
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <FileX className="text-green-500 dark:text-green-400" />
                  )}
                  Excel
                </Button>
              )}
              {showPdfButton && (
                <Button variant="outline" disabled={isLoading}>
                  {isLoading ? <Spinner /> : <FileSpreadsheet className="text-destructive" />}
                  PDF
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={onRefresh} disabled={isRefreshingOrFetching}>
                {isRefreshingOrFetching ? <Spinner /> : <RotateCw />}
                Refrescar
              </Button>
              {showAddButton && (
                <Button disabled={isLoading} onClick={onCreate}>
                  {isLoading ? <Spinner /> : <CirclePlus />}
                  Agregar
                </Button>
              )}
            </div>
          </div>
        </div>
        {isLoading ? (
          <DataTableSkeleton
            columnCount={columns.length}
            rowCount={skeletonRowCount}
            filterCount={computedFilterCount}
          />
        ) : (
          <DataTable
            columns={columns}
            data={data ?? []}
            resource={resource}
            onRowClick={onRowClick}
            isFetchingData={isRefreshingOrFetching}
          />
        )}
      </div>
    </>
  )
}
