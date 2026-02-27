'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartData = [
  { mes: 'Ene', entregados: 670, pendientes: 98, cancelados: 44 },
  { mes: 'Feb', entregados: 790, pendientes: 112, cancelados: 41 },
  { mes: 'Mar', entregados: 910, pendientes: 134, cancelados: 43 },
  { mes: 'Abr', entregados: 720, pendientes: 105, cancelados: 49 },
  { mes: 'May', entregados: 1020, pendientes: 161, cancelados: 50 },
  { mes: 'Jun', entregados: 1040, pendientes: 152, cancelados: 55 },
]

const chartConfig = {
  entregados: {
    label: 'Entregados',
    color: 'var(--chart-2)',
  },
  pendientes: {
    label: 'Pendientes',
    color: 'var(--chart-3)',
  },
  cancelados: {
    label: 'Cancelados',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig

export function OrdersChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de Pedidos</CardTitle>
        <CardDescription>Desglose mensual por estado — Enero a Junio 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart data={chartData} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="mes"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Bar dataKey="entregados" fill="var(--color-entregados)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pendientes" fill="var(--color-pendientes)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cancelados" fill="var(--color-cancelados)" radius={[4, 4, 0, 0]} />
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <ChartLegend content={ChartLegendContent as any} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
