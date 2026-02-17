import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

import { ProfileDropdown } from './header/profile-dropdown'
import { Search } from './header/search'

export function Header() {
  return (
    <header className="bg-background sticky inset-x-0 top-0 isolate z-10 flex shrink-0 items-center gap-2 border-b">
      <div className="flex h-14 w-full items-center gap-3 px-5">
        <SidebarTrigger />
        <div className="flex h-6 items-center space-x-4 text-sm">
          <Separator orientation="vertical" />
        </div>
        <Search />
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/" title="Ir a la tienda" target="_blank" rel="noopener noreferrer">
              <ExternalLink />
              Tienda
            </Link>
          </Button>
          <ThemeToggle />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  )
}
