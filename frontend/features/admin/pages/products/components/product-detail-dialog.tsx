'use client'

import { useQuery } from '@tanstack/react-query'
import { ImageIcon, Tag } from 'lucide-react'

import { adminProductsApi } from '@admin/api/products'
import { DetailField, DialogSection } from '@admin/components/shared/dialog-section'
import { ResourceDialog } from '@admin/components/shared/resource-dialog'
import { getColumnLabel } from '@admin/config/column-labels'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface Props {
  open: boolean
  onClose: () => void
  itemId: number
  onEdit: () => void
}

const resource = 'products'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(value)

export function ProductDetailDialog({ open, onClose, itemId, onEdit }: Props) {
  const { data: product, isLoading } = useQuery({
    queryKey: ['products', itemId],
    queryFn: () => adminProductsApi.getById(itemId),
    enabled: open,
  })

  return (
    <ResourceDialog
      open={open}
      onClose={onClose}
      mode="detail"
      resourceName="producto"
      itemName={product?.name}
      isLoading={isLoading}
      onEdit={onEdit}
      size="lg"
    >
      <div className="space-y-6">
        <DialogSection columns={2} isLoading={isLoading} skeletonFields={4}>
          {product && (
            <>
              <DetailField label="Imagen">
                <Avatar className="size-40 rounded-lg mt-2">
                  <AvatarImage
                    src={product.mainImage || undefined}
                    alt={product.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-lg">
                    <ImageIcon className="size-6 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
              </DetailField>

              <div className="flex flex-col gap-3">
                <DetailField label={getColumnLabel(resource, 'category')}>
                  <Badge variant="outline">
                    <Tag className="mr-1 size-3" />
                    {product.category?.name ?? 'Sin categoría'}
                  </Badge>
                </DetailField>

                <DetailField label={getColumnLabel(resource, 'badge')}>
                  {product.badge ? (
                    <Badge variant="secondary">{product.badge}</Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </DetailField>
              </div>
            </>
          )}
        </DialogSection>

        <DialogSection columns={2} isLoading={isLoading} skeletonFields={3}>
          {product && (
            <>
              <DetailField label={getColumnLabel(resource, 'price')}>
                <span className="text-sm font-medium">{formatCurrency(product.price)}</span>
              </DetailField>

              <DetailField label={getColumnLabel(resource, 'originalPrice')}>
                {product.originalPrice ? (
                  <span className="text-sm font-medium line-through text-muted-foreground">
                    {formatCurrency(product.originalPrice)}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </DetailField>

              <DetailField label={getColumnLabel(resource, 'stock')}>
                <Badge variant={product.stock > 0 ? 'secondary' : 'destructive'}>
                  {product.stock} {product.stock === 1 ? 'und.' : 'unds.'}
                </Badge>
              </DetailField>
            </>
          )}
        </DialogSection>

        {product?.description && (
          <DialogSection columns={1}>
            <DetailField label="Descripción">
              <p className="text-sm">{product.description}</p>
            </DetailField>
          </DialogSection>
        )}
      </div>
    </ResourceDialog>
  )
}
