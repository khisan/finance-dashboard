import { useState, useEffect, createContext, useContext } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null,
  )
  const [token, setToken] = useState(
    () => localStorage.getItem("authToken") || null,
  )
  const [isLoading, setIsLoading] = useState(false)

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

  const login = async (credentials) => {
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

export const useAuth = () => {
  return useContext(AuthContext)
}
