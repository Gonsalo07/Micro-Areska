import { LucideIcon } from 'lucide-react'
import { Ellipsis } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface RowActionItem {
  icon?: LucideIcon | ReactNode
  label: string
  onClick?: () => void
  href?: string
  variant?: 'default' | 'destructive'
}

interface DataTableRowActionsProps {
  items: RowActionItem[]
}

export function DataTableRowActions({ items }: DataTableRowActionsProps) {
  if (items.length === 0) return null

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Abrir menú"
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          onClick={(e) => e.stopPropagation()}
        >
          <Ellipsis className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        {items.map((item, index) => {
          const Icon = item.icon as LucideIcon | undefined
          const iconElement = Icon && <Icon className="mr-1" />

          if (item.href) {
            return (
              <DropdownMenuItem key={index} asChild variant={item.variant}>
                <Link href={item.href}>
                  {iconElement}
                  {item.label}
                </Link>
              </DropdownMenuItem>
            )
          }

          return (
            <DropdownMenuItem key={index} onClick={item.onClick} variant={item.variant}>
              {iconElement}
              {item.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
