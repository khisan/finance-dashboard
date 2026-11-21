export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  status?: number
}

export interface ApiError {
  message: string
  status?: number
}
