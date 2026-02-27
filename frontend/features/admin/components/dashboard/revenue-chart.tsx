'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartData = [
  { mes: 'Ene', ingresos: 28400, pedidos: 812 },
  { mes: 'Feb', ingresos: 31200, pedidos: 943 },
  { mes: 'Mar', ingresos: 35800, pedidos: 1087 },
  { mes: 'Abr', ingresos: 29700, pedidos: 874 },
  { mes: 'May', ingresos: 44600, pedidos: 1231 },
  { mes: 'Jun', ingresos: 48320, pedidos: 1247 },
]

const chartConfig = {
  ingresos: {
    label: 'Ingresos (S/)',
    color: 'var(--chart-1)',
  },
  pedidos: {
    label: 'Pedidos',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos y Pedidos</CardTitle>
        <CardDescription>Últimos 6 meses — Enero a Junio 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="fillIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-ingresos)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-ingresos)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillPedidos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-pedidos)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-pedidos)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="mes"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="ingresos"
              orientation="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `S/${(v / 1000).toFixed(0)}k`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area
              yAxisId="ingresos"
              dataKey="ingresos"
              type="natural"
              fill="url(#fillIngresos)"
              stroke="var(--color-ingresos)"
              stackId="a"
            />
            <Area
              yAxisId="ingresos"
              dataKey="pedidos"
              type="natural"
              fill="url(#fillPedidos)"
              stroke="var(--color-pedidos)"
              stackId="b"
            />
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <ChartLegend content={ChartLegendContent as any} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="text-muted-foreground text-sm">
          Datos históricos del sistema Areska — actualizados mensualmente.
        </div>
      </CardFooter>
    </Card>
  )
}
