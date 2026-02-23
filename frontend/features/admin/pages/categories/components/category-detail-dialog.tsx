'use client'

import { useQuery } from '@tanstack/react-query'

import { adminCategoriesApi } from '@admin/api/categories'
import { DetailField, DialogSection } from '@admin/components/shared/dialog-section'
import { ResourceDialog } from '@admin/components/shared/resource-dialog'
import { getColumnLabel } from '@admin/config/column-labels'

import { Badge } from '@/components/ui/badge'

interface Props {
  open: boolean
  onClose: () => void
  itemId: number
  onEdit: () => void
}

const resource = 'categories'

export function CategoryDetailDialog({ open, onClose, itemId, onEdit }: Props) {
  const { data: category, isLoading } = useQuery({
    queryKey: ['categories', itemId],
    queryFn: () => adminCategoriesApi.getById(itemId),
    enabled: open,
  })

  return (
    <ResourceDialog
      open={open}
      onClose={onClose}
      mode="detail"
      resourceName="categoría"
      itemName={category?.name}
      isLoading={isLoading}
      onEdit={onEdit}
      size="md"
    >
      <div className="space-y-6">
        <DialogSection columns={2} isLoading={isLoading} skeletonFields={3}>
          {category && (
            <>
              <DetailField label={getColumnLabel(resource, 'name')}>
                <span className="text-sm font-medium">{category.name}</span>
              </DetailField>

              <DetailField label={getColumnLabel(resource, 'slug')}>
                <Badge variant="secondary" className="font-mono text-xs">
                  {category.slug}
                </Badge>
              </DetailField>

              <DetailField label={getColumnLabel(resource, 'createdAt')}>
                <span className="text-sm text-muted-foreground">
                  {new Date(category.createdAt).toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </DetailField>
            </>
          )}
        </DialogSection>

        {category?.description && (
          <DialogSection columns={1}>
            <DetailField label={getColumnLabel(resource, 'description')}>
              <p className="text-sm">{category.description}</p>
            </DetailField>
          </DialogSection>
        )}
      </div>
    </ResourceDialog>
  )
}
