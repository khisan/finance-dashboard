import { useState, useEffect, createContext, useContext } from "react"
import { LoginRequest, AuthContextType } from "../types/auth"
import { User } from "@/types/user"
import { authServices } from "@/services/auth/authService"

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

  const login = async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true)
    try {
      const token = await authServices.login(credentials)
      localStorage.setItem("authToken", token)
      setToken(token)
    } catch (error) {
      throw error
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

  const getUser = async (email: string) => {
    setIsLoading(true)
    try {
      const user = await authServices.getUser(email)
      const userStr = JSON.stringify(user)
      localStorage.setItem("User", userStr)
      setUser(user)
      console.log("set user: ", user)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, logout, getUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}
