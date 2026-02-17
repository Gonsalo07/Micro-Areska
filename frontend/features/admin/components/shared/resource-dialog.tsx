'use client'

import { createContext, useCallback, useContext, useState } from 'react'

import { CirclePlus, Info, Pencil } from 'lucide-react'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

export type DialogMode = 'detail' | 'edit' | 'create'

const modeIcons = {
  detail: Info,
  edit: Pencil,
  create: CirclePlus,
}

interface DialogFooterContextValue {
  footer: React.ReactNode
  setFooter: (footer: React.ReactNode) => void
}

const DialogFooterContext = createContext<DialogFooterContextValue | null>(null)

export function useDialogFooter() {
  const context = useContext(DialogFooterContext)
  if (!context) {
    throw new Error('useDialogFooter must be used within a ResourceDialog')
  }
  return context
}

interface DialogDirtyContextValue {
  isDirty: boolean
  setIsDirty: (dirty: boolean) => void
}

const DialogDirtyContext = createContext<DialogDirtyContextValue | null>(null)

export function useDialogDirty() {
  const context = useContext(DialogDirtyContext)
  if (!context) {
    throw new Error('useDialogDirty must be used within a ResourceDialog')
  }
  return context
}

type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full'

interface ResourceDialogProps {
  open: boolean
  onClose: () => void
  onEdit?: () => void
  onDiscard?: () => void
  isLoading?: boolean
  mode: DialogMode
  resourceName: string
  itemName?: string
  description?: string
  size?: DialogSize
  footer?: React.ReactNode
  children: React.ReactNode
}

const sizeClasses: Record<DialogSize, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
  '6xl': 'sm:max-w-6xl',
  '7xl': 'sm:max-w-7xl',
  full: 'sm:max-w-[95vw]',
}

function getTitle(mode: DialogMode, resourceName: string, itemName?: string): string {
  switch (mode) {
    case 'detail':
      return `Detalles de ${itemName || resourceName}`
    case 'edit':
      return `Editar ${itemName || resourceName}`
    case 'create':
      return `Nuevo ${resourceName}`
  }
}

function getDiscardText(mode: DialogMode): {
  title: string
  description: string
  cancelLabel: string
} {
  if (mode === 'create') {
    return {
      title: 'Cambios sin agregar',
      description: 'Tienes cambios sin agregar. ¿Estás seguro de que deseas salir sin agregar?',
      cancelLabel: 'Seguir agregando',
    }
  }
  return {
    title: 'Cambios sin guardar',
    description: 'Tienes cambios sin guardar. ¿Estás seguro de que deseas salir sin guardar?',
    cancelLabel: 'Seguir editando',
  }
}

export function ResourceDialog({
  open,
  onClose,
  onEdit,
  onDiscard,
  isLoading = false,
  mode,
  resourceName,
  itemName,
  description,
  size = 'md',
  footer: propFooter,
  children,
}: ResourceDialogProps) {
  const [contextFooter, setFooter] = useState<React.ReactNode>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  const handleSetFooter = useCallback((newFooter: React.ReactNode) => {
    setFooter(newFooter)
  }, [])

  const handleSetDirty = useCallback((dirty: boolean) => {
    setIsDirty(dirty)
  }, [])

  const handleClose = useCallback(() => {
    if (isDirty && (mode === 'edit' || mode === 'create')) {
      setShowDiscardConfirm(true)
    } else {
      onClose()
    }
  }, [isDirty, mode, onClose])

  const handleConfirmDiscard = useCallback(() => {
    onDiscard?.()
    setShowDiscardConfirm(false)
    onClose()
  }, [onDiscard, onClose])

  let finalFooter = propFooter || contextFooter

  if (!finalFooter && mode === 'detail') {
    if (isLoading) {
      finalFooter = <Skeleton className="h-10 w-24" />
    } else {
      finalFooter = (
        <>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          {onEdit && (
            <Button onClick={onEdit}>
              <Pencil className="size-4 mr-2" />
              Editar
            </Button>
          )}
        </>
      )
    }
  }

  const discardText = getDiscardText(mode)

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className={`${sizeClasses[size]} max-h-[90vh] flex flex-col`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {(() => {
                const Icon = modeIcons[mode]
                return <Icon className="size-5" />
              })()}
              {getTitle(mode, resourceName, itemName)}
            </DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <DialogFooterContext.Provider
            value={{ footer: contextFooter, setFooter: handleSetFooter }}
          >
            <DialogDirtyContext.Provider value={{ isDirty, setIsDirty: handleSetDirty }}>
              <div className="-mx-1 flex-1 overflow-y-auto px-1">{children}</div>
              {finalFooter && <DialogFooter>{finalFooter}</DialogFooter>}
            </DialogDirtyContext.Provider>
          </DialogFooterContext.Provider>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showDiscardConfirm}
        onOpenChange={setShowDiscardConfirm}
        title={discardText.title}
        description={discardText.description}
        actionButton={{ label: 'Descartar', variant: 'destructive' }}
        cancelLabel={discardText.cancelLabel}
        onConfirm={handleConfirmDiscard}
      />
    </>
  )
}
