export type ApiResponse<T = unknown> = {
  success: true
  data: T
  timestamp?: string
} | ApiError

export type ApiError = {
  success: false
  status: number
  message: string
  path: string
  timestamp?: string
  errors?: Record<string, string[]>
}
