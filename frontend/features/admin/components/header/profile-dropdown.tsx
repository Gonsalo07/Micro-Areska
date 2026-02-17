'use client'

import { useState } from 'react'

import { Bell, LogOut, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useAuthStore } from '@auth/stores/auth.store'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getInitials } from '@/lib/utils'

export function ProfileDropdown() {
  const profile = useAuthStore((s) => s.profile)
  const signOut = useAuthStore((s) => s.logout)
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const user = {
    name: profile ? `${profile.firstName} ${profile.lastName}`.trim() : '',
    email: profile?.email || '',
    avatar: profile?.photoUrl || '',
  }

  const handleLogoutClick = () => {
    setDropdownOpen(false)
    setTimeout(() => {
      setConfirmDialogOpen(true)
    }, 50)
  }

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative size-8 rounded-full">
            <Avatar className="size-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1.5">
              <span className="text-sm leading-none font-medium">{user.name}</span>
              <span className="text-xs leading-none text-muted-foreground">{user.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/admin/ajustes">
                <User className="text-current" />
                Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/ajustes/notificaciones">
                <Bell className="text-current" />
                Notificaciones
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleLogoutClick}>
            <LogOut />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        title="¿Estás seguro?"
        description="Esto cerrará tu sesión y te redirigirá a la pantalla de inicio."
        actionButton={{
          label: 'Cerrar sesión',
          variant: 'destructive',
          icon: <LogOut />,
        }}
        onConfirm={async () => {
          await signOut()
          router.push('/')
        }}
        onOpenChange={setConfirmDialogOpen}
        open={confirmDialogOpen}
      />
    </>
  )
}
