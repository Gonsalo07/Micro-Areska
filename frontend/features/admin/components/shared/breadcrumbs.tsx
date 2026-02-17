import Link from 'next/link'

import { getRoute, groupTitles } from '@admin/config/routes'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'

interface BreadcrumbsProps {
  pathname: string
  resourceCode?: string
  isLoading?: boolean
  onNavigateBack?: () => void
}

export function Breadcrumbs({
  pathname,
  resourceCode,
  isLoading = false,
  onNavigateBack,
}: BreadcrumbsProps) {
  const currentRoute = getRoute(pathname)
  if (!currentRoute) return null

  const groupKey = currentRoute.sidebar?.group
  const groupName = groupKey ? groupTitles[groupKey] : undefined
  const isViewPage = resourceCode !== undefined

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {groupName && (
          <BreadcrumbItem>
            <span className="text-muted-foreground cursor-default">{groupName}</span>
          </BreadcrumbItem>
        )}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {isViewPage ? (
            onNavigateBack ? (
              <BreadcrumbLink
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  onNavigateBack()
                }}
              >
                {currentRoute.title}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbLink asChild>
                <Link href={pathname}>{currentRoute.title}</Link>
              </BreadcrumbLink>
            )
          ) : (
            <BreadcrumbPage>{currentRoute.title}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {isViewPage && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {isLoading ? <Skeleton className="h-4 w-28" /> : resourceCode}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
