import { CircleArrowUp, Info } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            Eleva tu juego al
            <span className="text-primary block">siguiente nivel</span>
          </h1>
          <p className="mb-8 max-w-lg text-lg text-muted-foreground">
            Descubre periféricos gaming de alta precisión y rendimiento. Teclados mecánicos, ratones
            ultra rápidos y auriculares premium diseñados para dominar cada partida.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/sobre-nosotros">
                <Info />
                Saber más
              </Link>
            </Button>
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/productos">
                <CircleArrowUp />
                Comprar ahora
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
            <Image src="/images/hero.webp" alt="Producto Principal" className="object-cover" fill />
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-xl bg-card border p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
                <span className="font-bold text-primary-foreground">50%</span>
              </div>
              <div>
                <p className="font-semibold">Oferta especial</p>
                <p className="text-sm text-muted-foreground">Por tiempo limitado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
