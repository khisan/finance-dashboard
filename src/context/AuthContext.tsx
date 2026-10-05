import { useState, useEffect, createContext, useContext } from "react"
import { User, LoginCredentials, AuthContextType } from "../types/auth"
import api from "../services/api"

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) return null
    try {
      return JSON.parse(storedUser)
    } catch (error) {
      console.error("Gagal parse data user:", error)
      localStorage.removeItem("user")
      return null
    }
  })
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("authToken") || null,
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("authToken")

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      } catch (error) {
        console.error("Gagal parse data user:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("authToken")
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true)
    try {
      // Simulate an API call
      const response = await api.post("/login", credentials)
      const { user, token } = response.data

      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("authToken", token)
      setUser(user)
      setToken(token)
    } catch (error) {
      console.error("Error during login:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("authToken")
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
