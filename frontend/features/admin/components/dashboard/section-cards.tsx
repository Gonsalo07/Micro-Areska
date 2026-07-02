import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const cards = [
  {
    label: 'Pedidos del Mes',
    value: '1,247',
    change: 12.5,
    trendText: 'Incremento este mes',
    description: 'Comparado con el mes anterior.',
  },
  {
    label: 'Ingresos del Mes',
    value: 'S/ 48,320',
    change: 8.3,
    trendText: 'Ingresos en crecimiento',
    description: 'Comparado con el mes anterior.',
  },
  {
    label: 'Productos Activos',
    value: '89',
    change: 3.2,
    trendText: 'Nuevos productos este mes',
    description: 'Comparado con el mes anterior.',
  },
  {
    label: 'Clientes',
    value: '2,841',
    change: 15.7,
    trendText: 'Nuevos clientes este mes',
    description: 'Comparado con el mes anterior.',
  },
]

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const isPositive = card.change >= 0
        const TrendIcon = isPositive ? TrendingUpIcon : TrendingDownIcon

        return (
          <Card key={card.label}>
            <CardHeader className="relative">
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums sm:text-3xl">
                {card.value}
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                  <TrendIcon className="size-3" />
                  {isPositive ? '+' : ''}
                  {card.change.toFixed(1)}%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="flex gap-2 font-medium">
                {card.trendText} <TrendIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">{card.description}</div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
