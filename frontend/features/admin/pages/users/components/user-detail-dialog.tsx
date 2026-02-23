'use client'

import { useQuery } from '@tanstack/react-query'
import { CheckCircle, XCircle } from 'lucide-react'

import { adminUsersApi } from '@admin/api/users'
import { DetailField, DialogSection } from '@admin/components/shared/dialog-section'
import { ResourceDialog } from '@admin/components/shared/resource-dialog'
import { getColumnLabel } from '@admin/config/column-labels'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getInitials } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
  itemId: number
}

const resource = 'users'

const authProviderLabels: Record<string, string> = {
  'google.com': 'Google',
  password: 'Email / Password',
}

export function UserDetailDialog({ open, onClose, itemId }: Props) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['users', itemId],
    queryFn: () => adminUsersApi.getById(itemId),
    enabled: open,
  })

  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : undefined

  return (
    <ResourceDialog
      open={open}
      onClose={onClose}
      mode="detail"
      resourceName="usuario"
      itemName={fullName}
      isLoading={isLoading}
      size="lg"
    >
      <div className="space-y-6">
        <DialogSection columns={2} isLoading={isLoading} skeletonFields={4}>
          {user && (
            <>
              <DetailField label="Avatar">
                <Avatar className="size-16 mt-1">
                  <AvatarImage src={user.photoUrl ?? undefined} alt={fullName} />
                  <AvatarFallback className="text-lg">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
              </DetailField>

              <div className="flex flex-col gap-3">
                <DetailField label="Nombre completo">
                  <span className="text-sm font-medium">{fullName}</span>
                </DetailField>

                <DetailField label={getColumnLabel(resource, 'authProvider')}>
                  <Badge variant="outline" className="text-xs">
                    {authProviderLabels[user.authProvider] ?? user.authProvider}
                  </Badge>
                </DetailField>

                {user.role && (
                  <DetailField label="Rol">
                    <Badge variant="secondary" className="text-xs capitalize">
                      {user.role.toLowerCase()}
                    </Badge>
                  </DetailField>
                )}
              </div>
            </>
          )}
        </DialogSection>

        <DialogSection columns={2} isLoading={isLoading} skeletonFields={4}>
          {user && (
            <>
              <DetailField label={getColumnLabel(resource, 'email')}>
                <span className="text-sm">{user.email}</span>
              </DetailField>

              <DetailField label="Email verificado">
                <div className="flex items-center gap-1.5 text-sm">
                  {user.emailVerified ? (
                    <>
                      <CheckCircle className="size-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">Verificado</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="size-4 text-destructive" />
                      <span className="text-destructive">No verificado</span>
                    </>
                  )}
                </div>
              </DetailField>

              <DetailField label={getColumnLabel(resource, 'phone')}>
                <span className="text-sm">{user.phone || '-'}</span>
              </DetailField>

              {user.address && (
                <DetailField label="Dirección">
                  <span className="text-sm">{user.address}</span>
                </DetailField>
              )}

              <DetailField label="Miembro desde">
                <span className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </DetailField>
            </>
          )}
        </DialogSection>
      </div>
    </ResourceDialog>
  )
}
