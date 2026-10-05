export interface User {
  id?: number
  email: string
  name?: string
  role?: string
}

export interface LoginCredentials {
  email: string
  password?: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}
