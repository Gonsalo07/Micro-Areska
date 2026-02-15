'use client'

import { useEffect, useState } from 'react'

import { LogIn, LogOut, Menu, Search, Settings, ShoppingCart, Store, X } from 'lucide-react'
import Link from 'next/link'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Logo } from '@/components/shared/logo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { getInitials } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

import { CartCount } from './cart-count'
import { Navigation } from './navigation'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout, init, isLoadingInitial } = useAuthStore()
  useEffect(() => {
    init()
  }, [init])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const handleLogoutClick = () => {
    setDropdownOpen(false)
    setTimeout(() => {
      setConfirmDialogOpen(true)
    }, 50)
  }

  const handleConfirmLogout = async () => {
    await logout()
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Logo width={32} height={32} />
            <span className="font-medium">Areska</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            <Navigation />
          </div>

          {/* Search Bar */}
          <InputGroup className="mx-8 hidden max-w-xs flex-1 items-center md:flex">
            <InputGroupInput placeholder="Buscar productos..." />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>

          {/* Right Side */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {/* Cart */}
            <Button variant="outline" size="icon" className="relative" asChild>
              <Link href="/carrito">
                <ShoppingCart />
                <CartCount />
              </Link>
            </Button>

            {isLoadingInitial ? (
              <div className="h-10 w-10 animate-pulse rounded-md bg-muted" />
            ) : user ? (
              <>
                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Avatar className="size-8">
                        {user.photoUrl ? (
                          <AvatarImage src={user.photoUrl} alt="Foto de perfil" />
                        ) : (
                          <AvatarFallback className="text-xs">
                            {getInitials(user.firstName, user.lastName)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-44 rounded-lg"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/mis-compras">
                          <Store className="text-current" />
                          Mis compras
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/ajustes">
                          <Settings className="text-current" />
                          Ajustes
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
                  description="Esto cerrará tu sesión y te redirigirá a la pantalla de inicio de sesión."
                  actionButton={{
                    label: 'Cerrar sesión',
                    variant: 'destructive',
                    icon: <LogOut />,
                  }}
                  onOpenChange={setConfirmDialogOpen}
                  open={confirmDialogOpen}
                  onConfirm={handleConfirmLogout}
                />
              </>
            ) : (
              <Link href="/iniciar-sesion">
                <Button>
                  <LogIn /> Iniciar sesión
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              className="md:hidden"
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t bg-background py-4 md:hidden">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="hover:text-primary transition-colors">
                Inicio
              </Link>
              <Link href="/productos" className="hover:text-primary transition-colors">
                Tienda
              </Link>
              <Link href="/about" className="hover:text-primary transition-colors">
                Acerca de
              </Link>
              <div className="border-t pt-4">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full rounded-lg border border-input bg-card px-4 py-2 placeholder:text-muted-foreground focus:border-transparent focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
