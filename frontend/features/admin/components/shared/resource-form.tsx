'use client'

import { useEffect } from 'react'

import { CirclePlus, Save } from 'lucide-react'
import { FieldValues, UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'

import { useDialogDirty, useDialogFooter } from './resource-dialog'

interface FormSkeletonProps {
  fieldCount: number
  columns?: 1 | 2
}

function FormSkeleton({ fieldCount, columns = 1 }: FormSkeletonProps) {
  const gridClass = columns === 2 ? 'sm:grid-cols-2' : 'grid-cols-1'

  return (
    <div className={`grid gap-4 ${gridClass}`}>
      {Array.from({ length: fieldCount }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  )
}

interface ResourceFormProps<TFormValues extends FieldValues> {
  form: UseFormReturn<TFormValues>
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  onCancel: () => void
  children: React.ReactNode
  fieldCount: number
  columns?: 1 | 2
  mode?: 'edit' | 'create'
  submitLabel?: string
  submittingLabel?: string
  errorMessage?: string
}

export function ResourceForm<TFormValues extends FieldValues>({
  form,
  isLoading,
  isSubmitting,
  error,
  onSubmit,
  onCancel,
  children,
  fieldCount,
  columns = 1,
  mode = 'edit',
  submitLabel,
  submittingLabel,
  errorMessage = 'Error al cargar los datos',
}: ResourceFormProps<TFormValues>) {
  const { setFooter } = useDialogFooter()
  const { setIsDirty } = useDialogDirty()

  const defaultSubmitLabel = mode === 'create' ? 'Crear' : 'Guardar'
  const defaultSubmittingLabel = mode === 'create' ? 'Creando' : 'Guardando'
  const finalSubmitLabel = submitLabel ?? defaultSubmitLabel
  const finalSubmittingLabel = submittingLabel ?? defaultSubmittingLabel

  const canSubmit = mode === 'create' ? !isSubmitting : !isSubmitting && form.formState.isDirty

  useEffect(() => {
    setIsDirty(form.formState.isDirty)
  }, [form.formState.isDirty, setIsDirty])

  useEffect(() => {
    if (isLoading) {
      setFooter(
        <>
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </>
      )
      return
    }

    if (error) {
      setFooter(null)
      return
    }

    setFooter(
      <>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" form="resource-form" disabled={!canSubmit}>
          {isSubmitting ? (
            <Spinner />
          ) : mode === 'create' ? (
            <CirclePlus className="size-4 mr-2" />
          ) : (
            <Save className="size-4 mr-2" />
          )}
          {isSubmitting ? finalSubmittingLabel : finalSubmitLabel}
        </Button>
      </>
    )

    return () => setFooter(null)
  }, [
    isLoading,
    isSubmitting,
    error,
    canSubmit,
    finalSubmitLabel,
    finalSubmittingLabel,
    onCancel,
    setFooter,
    mode,
  ])

  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
        {errorMessage}
      </div>
    )
  }

  if (isLoading) {
    return <FormSkeleton fieldCount={fieldCount} columns={columns} />
  }

  const gridClass = columns === 2 ? 'sm:grid-cols-2' : 'grid-cols-1'

  return (
    <Form {...form}>
      <form id="resource-form" className={`grid gap-4 ${gridClass}`} onSubmit={onSubmit}>
        {children}
      </form>
    </Form>
  )
}
