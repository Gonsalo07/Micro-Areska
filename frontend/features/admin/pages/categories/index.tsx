'use client'

import { useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { adminCategoriesApi } from '@admin/api/categories'
import { TableListLayout } from '@admin/components/shared/table-list-layout'
import type { CategoryList } from '@admin/types/category/category-list'

import { getColumns } from './columns'
import { CategoryCreateDialog } from './components/category-create-dialog'
import { CategoryDetailDialog } from './components/category-detail-dialog'
import { CategoryUpdateDialog } from './components/category-update-dialog'

interface Props {
  title: string
  pathname: string
  resource: string
}

export function CategoriesPage({ title, pathname, resource }: Props) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editCategory, setEditCategory] = useState<CategoryList | null>(null)
  const [detailCategory, setDetailCategory] = useState<CategoryList | null>(null)

  const {
    data: categories,
    isFetching,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: [resource],
    queryFn: adminCategoriesApi.getAll,
    refetchOnWindowFocus: false,
  })

  const columns = useMemo(
    () =>
      getColumns({
        onDetail: (category) => setDetailCategory(category),
        onEdit: (category) => setEditCategory(category),
      }),
    []
  )

  const isRefreshingOrFetching = isRefetching || isFetching

  return (
    <>
      <TableListLayout
        resource={resource}
        title={title}
        description="Administra las categorías de productos del sistema."
        pathname={pathname}
        columns={columns}
        data={categories}
        onCreate={() => setShowCreateDialog(true)}
        onRefresh={() => refetch()}
        onRowClick={(category) => setDetailCategory(category)}
        isRefetching={isRefreshingOrFetching}
      />

      <CategoryCreateDialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} />

      {editCategory && (
        <CategoryUpdateDialog open onClose={() => setEditCategory(null)} itemId={editCategory.id} />
      )}

      {detailCategory && (
        <CategoryDetailDialog
          open
          onClose={() => setDetailCategory(null)}
          itemId={detailCategory.id}
          onEdit={() => {
            setEditCategory(detailCategory)
            setDetailCategory(null)
          }}
        />
      )}
    </>
  )
}
