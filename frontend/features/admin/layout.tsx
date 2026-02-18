'use client'

import { AdminGuard } from '@auth/components/admin-guard'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { QueryProvider } from '@/providers/query-provider'

import { Header } from './components/header'
import { CommandMenu } from './components/shared/command-menu'
import { AppSidebar } from './components/sidebar/app-sidebar'

interface Props {
  children?: React.ReactNode
}

export function AdminLayout({ children }: Props) {
  return (
    <AdminGuard>
      <QueryProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="@container/main has-[[data-layout=fixed]]:h-svh">
            <Header />
            {children}
          </SidebarInset>
          <CommandMenu />
        </SidebarProvider>
      </QueryProvider>
    </AdminGuard>
  )
}
