'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { DefaultValues, FieldValues, useForm, UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodType } from 'zod'

import { ApiClientError } from '@/lib/api/client'

interface UseResourceFormOptions<TData, TFormValues extends FieldValues, TListItem = unknown> {
  fetchFn?: () => Promise<TData>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: ZodType<TFormValues, any, any>
  defaultValues: DefaultValues<TFormValues>
  mapDataToForm?: (data: TData) => Partial<TFormValues>
  onSubmit: (values: TFormValues) => Promise<TListItem | void>
  onSuccess?: () => void
  onError?: (error: string) => void
  queryKey?: string[]
  updateQueryData?: (currentData: TListItem[], updatedItem: TListItem) => TListItem[]
  successMessage?: string
  errorMessage?: string
  fieldErrorMessages?: Record<string, string>
}

interface UseResourceFormResult<TData, TFormValues extends FieldValues> {
  form: UseFormReturn<TFormValues>
  data: TData | null
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
}

export function useResourceForm<TData, TFormValues extends FieldValues, TListItem = unknown>({
  fetchFn,
  schema,
  defaultValues,
  mapDataToForm,
  onSubmit,
  onSuccess,
  onError,
  queryKey,
  updateQueryData,
  successMessage = 'Guardado correctamente',
  errorMessage = 'Error al guardar',
  fieldErrorMessages,
}: UseResourceFormOptions<TData, TFormValues, TListItem>): UseResourceFormResult<
  TData,
  TFormValues
> {
  const queryClient = useQueryClient()
  const [data, setData] = useState<TData | null>(null)
  const [isLoading, setIsLoading] = useState(!!fetchFn)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const defaultValuesRef = useRef(defaultValues)
  const mapDataToFormRef = useRef(mapDataToForm)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    defaultValuesRef.current = defaultValues
    mapDataToFormRef.current = mapDataToForm
    onErrorRef.current = onError
  })

  const form = useForm<TFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues,
  })

  const fetchData = useCallback(async () => {
    if (!fetchFn) return

    try {
      setIsLoading(true)
      setError(null)
      const result = await fetchFn()
      setData(result)

      if (mapDataToFormRef.current && result) {
        const formValues = mapDataToFormRef.current(result)
        form.reset({ ...defaultValuesRef.current, ...formValues } as TFormValues)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar datos'
      setError(message)
      onErrorRef.current?.(message)
    } finally {
      setIsLoading(false)
    }
  }, [fetchFn, form])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true)
    try {
      const result = await onSubmit(values)
      toast.success(successMessage)
      form.reset(values)
      if (queryKey && result && updateQueryData) {
        queryClient.setQueriesData<TListItem[] | { content: TListItem[]; [key: string]: unknown }>(
          { queryKey },
          (currentData) => {
            if (!currentData) return currentData
            if (Array.isArray(currentData)) {
              return updateQueryData(currentData, result)
            }
            if ('content' in currentData && Array.isArray(currentData.content)) {
              return { ...currentData, content: updateQueryData(currentData.content, result) }
            }
            return currentData
          }
        )
      } else if (queryKey) {
        queryClient.invalidateQueries({ queryKey })
      }
      onSuccess?.()
    } catch (err) {
      if (err instanceof ApiClientError && err.errors?.length) {
        let hasFieldError = false
        for (const fieldErr of err.errors) {
          const msg = (fieldErr.code && fieldErrorMessages?.[fieldErr.code]) ?? fieldErr.message
          if (fieldErr.field in (defaultValues as Record<string, unknown>)) {
            form.setError(fieldErr.field as never, { message: msg })
            hasFieldError = true
          }
        }
        if (hasFieldError) {
          setIsSubmitting(false)
          return
        }
      }
      const message = err instanceof Error ? err.message : errorMessage
      toast.error(message)
      onError?.(message)
    } finally {
      setIsSubmitting(false)
    }
  })

  return {
    form,
    data,
    isLoading,
    isSubmitting,
    error,
    handleSubmit,
  }
}
