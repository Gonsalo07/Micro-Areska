'use client'

import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  title: string
  description: string
  icon?: LucideIcon
  action?: {
    label: string
    href: string
    icon?: LucideIcon
  }
  secondaryAction?: {
    label: string
    href: string
    icon?: LucideIcon
  }
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
      {Icon && <Icon className="mx-auto mb-4 size-12" />}
      <h1 className="mb-4 text-3xl font-bold">{title}</h1>
      <p className="mb-8 text-muted-foreground">{description}</p>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {action && (
          <Link href={action.href}>
            <Button size="lg">
              {action.icon && <action.icon />}
              {action.label}
            </Button>
          </Link>
        )}
        {secondaryAction && (
          <Link href={secondaryAction.href}>
            <Button size="lg" variant="outline">
              {secondaryAction.icon && <secondaryAction.icon />}
              {secondaryAction.label}
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
