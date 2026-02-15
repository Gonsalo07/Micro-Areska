export interface ApiFieldError {
  field: string
  message: string
  rejectedValue?: unknown
}

export interface ApiSuccess<T> {
  success: true
  message: string
  data: T
  timestamp: string
}

export interface ApiError {
  success: false
  status: number
  message: string
  path: string
  timestamp: string
  errors: ApiFieldError[] | null
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError
