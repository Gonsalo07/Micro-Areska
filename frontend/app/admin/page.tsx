'use client'

import { LayoutDashboard } from 'lucide-react'

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <LayoutDashboard strokeWidth={2.5} />
          Dashboard
        </h1>
        <p className="text-muted-foreground">Panel de administracion de Areska.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4 space-y-2">
          <p className="text-sm text-muted-foreground">Productos</p>
          <p className="text-2xl font-bold">--</p>
        </div>
        <div className="rounded-lg border p-4 space-y-2">
          <p className="text-sm text-muted-foreground">Categorias</p>
          <p className="text-2xl font-bold">--</p>
        </div>
        <div className="rounded-lg border p-4 space-y-2">
          <p className="text-sm text-muted-foreground">Pedidos</p>
          <p className="text-2xl font-bold">--</p>
        </div>
        <div className="rounded-lg border p-4 space-y-2">
          <p className="text-sm text-muted-foreground">Usuarios</p>
          <p className="text-2xl font-bold">--</p>
        </div>
      </div>
    </div>
  )
}
