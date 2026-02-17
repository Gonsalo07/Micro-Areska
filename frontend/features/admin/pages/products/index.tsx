'use client'

import { useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { adminCategoriesApi } from '@admin/api/categories'
import { adminProductsApi } from '@admin/api/products'
import { DeleteAlertDialog } from '@admin/components/shared/delete-alert-dialog'
import { TableListLayout } from '@admin/components/shared/table-list-layout'
import { ProductCreateDialog } from '@admin/pages/products/components/product-create-dialog'
import { ProductDetailDialog } from '@admin/pages/products/components/product-detail-dialog'
import { ProductUpdateDialog } from '@admin/pages/products/components/product-update-dialog'
import type { ProductList } from '@admin/types/product/product-list'

import { getColumns } from './columns'

interface Props {
  title: string
  pathname: string
  resource: string
}

export function ProductsPage({ title, pathname, resource }: Props) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editProduct, setEditProduct] = useState<ProductList | null>(null)
  const [detailProduct, setDetailProduct] = useState<ProductList | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<ProductList | null>(null)

  const {
    data: products,
    isFetching,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: [resource],
    queryFn: adminProductsApi.getAll,
    refetchOnWindowFocus: false,
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: adminCategoriesApi.getAll,
  })

  const categoryOptions = useMemo(
    () => categories?.map((c) => ({ label: c.name, value: String(c.id) })) ?? [],
    [categories]
  )

  const columns = useMemo(
    () =>
      getColumns({
        categories: categoryOptions,
        onDetail: (product) => setDetailProduct(product),
        onEdit: (product) => setEditProduct(product),
        onDelete: (product) => setDeleteProduct(product),
      }),
    [categoryOptions]
  )

  const isRefreshingOrFetching = isRefetching || isFetching

  return (
    <>
      <TableListLayout
        resource={resource}
        title={title}
        description="Administra los productos del sistema."
        pathname={pathname}
        columns={columns}
        data={products}
        onCreate={() => setShowCreateDialog(true)}
        onRefresh={() => refetch()}
        onRowClick={(product) => setDetailProduct(product)}
        isRefetching={isRefreshingOrFetching}
      />

      <ProductCreateDialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} />

      {editProduct && (
        <ProductUpdateDialog open onClose={() => setEditProduct(null)} itemId={editProduct.id} />
      )}

      {detailProduct && (
        <ProductDetailDialog
          open
          onClose={() => setDetailProduct(null)}
          itemId={detailProduct.id}
          onEdit={() => {
            setEditProduct(detailProduct)
            setDetailProduct(null)
          }}
        />
      )}

      {deleteProduct && (
        <DeleteAlertDialog
          open
          onClose={() => setDeleteProduct(null)}
          title={`¿Eliminar "${deleteProduct.name}"?`}
          description="El producto será eliminado permanentemente. Esta acción no se puede deshacer."
          onConfirm={() => adminProductsApi.delete(deleteProduct.id)}
          queryKey={[resource]}
          itemId={deleteProduct.id}
          successMessage="Producto eliminado correctamente"
          errorMessage="Error al eliminar el producto"
        />
      )}
    </>
  )
}
