import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { Logo } from '@/components/shared/logo'
import { Button } from '@/components/ui/button'

interface Props {
  children?: React.ReactNode
}

export function AuthLayout({ children }: Props) {
  return (
    <div className="relative min-h-svh">
      <Button variant="ghost" asChild className="absolute top-4 left-4">
        <Link href="/">
          <ArrowLeft />
          Ir al inicio
        </Link>
      </Button>
      <div className="flex items-center justify-center min-h-svh p-6 md:p-10">
        <div className="w-full max-w-sm flex flex-col gap-6">
          <span className="flex items-center gap-2 self-center font-medium">
            <Logo className="size-6" />
            Areska
          </span>
          {children}
        </div>
      </div>
    </div>
  )
}
