'use client'

import { LayoutDashboard } from 'lucide-react'

import { OrdersChart } from '@admin/components/dashboard/orders-chart'
import { RevenueChart } from '@admin/components/dashboard/revenue-chart'
import { SectionCards } from '@admin/components/dashboard/section-cards'

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <LayoutDashboard strokeWidth={2.5} />
          Dashboard
        </h1>
        <p className="text-muted-foreground">Panel de administración de Areska.</p>
      </div>

      <SectionCards />

      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart />
        <OrdersChart />
      </div>
    </div>
  )
}
