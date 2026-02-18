'use client'

import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface DeleteAlertDialogProps {
  open: boolean
  onClose: () => void
  title: string
  description: string
  onConfirm: () => Promise<void>
  queryKey?: string[]
  itemId?: number
  successMessage?: string
  errorMessage?: string
}

export function DeleteAlertDialog({
  open,
  onClose,
  title,
  description,
  onConfirm,
  queryKey,
  itemId,
  successMessage = 'Eliminado correctamente',
  errorMessage = 'Error al eliminar',
}: DeleteAlertDialogProps) {
  const queryClient = useQueryClient()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDeleting(true)
    try {
      await onConfirm()
      toast.success(successMessage)
      if (queryKey && itemId !== undefined) {
        queryClient.setQueriesData<{ id: number }[]>({ queryKey }, (currentData) => {
          if (!currentData) return currentData
          if (Array.isArray(currentData)) {
            return currentData.filter((item) => item.id !== itemId)
          }
          return currentData
        })
      } else if (queryKey) {
        queryClient.invalidateQueries({ queryKey })
      }
      onClose()
    } catch {
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            <Trash2Icon className="mr-2 size-4" />
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
