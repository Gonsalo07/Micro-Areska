import { config } from '@/lib/config'

import { ApiError, ApiResponse } from './types'

export class ApiClientError extends Error {
  constructor(
    public status: number,
    public path: string,
    message: string,
    public errors?: ApiError['errors']
  ) {
    super(message)
    this.name = 'ApiClientError'
  }

  static fromApiError(error: ApiError): ApiClientError {
    return new ApiClientError(error.status, error.path, error.message, error.errors)
  }
}

export type ApiClientOptions = RequestInit & {
  authenticated?: boolean
}

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = config.api.baseUrl) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const headers = new Headers(options.headers)
    headers.set('Content-Type', 'application/json')

    const isBrowser = typeof window !== 'undefined'

    if (options.authenticated !== false && isBrowser) {
      const { getAuthClient } = await import('@/lib/firebase/client')
      try {
        const auth = getAuthClient()
        const token = await auth.currentUser?.getIdToken()
        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        }
      } catch {}
    }

    const { authenticated: _, ...fetchOptions } = options

    try {
      const res = await fetch(url, {
        ...fetchOptions,
        headers,
      })

      if (res.status === 204) return null as T

      const text = await res.text()

      if (!text || text.trim() === '') {
        return [] as T
      }

      let json: ApiResponse<T>
      try {
        json = JSON.parse(text) as ApiResponse<T>
      } catch {
        throw new ApiClientError(res.status, endpoint, text || `HTTP Error ${res.status}`)
      }

      if (!json.success) {
        throw ApiClientError.fromApiError(json)
      }

      return json.data
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error
      }

      throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred')
    }
  }

  get<T>(endpoint: string, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', ...options })
  }

  post<T>(endpoint: string, body?: unknown, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    })
  }

  put<T>(endpoint: string, body?: unknown, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    })
  }

  delete<T>(endpoint: string, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options })
  }
}

export const apiClient = new ApiClient()
