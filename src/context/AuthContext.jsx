import { useState } from "react"

const [user, setUser] = useState(
  () => JSON.parse(localStorage.getItem("user")) || null,
)
const [token, setToken] = useState(
  () => localStorage.getItem("authToken") || null,
)
const [isLoading, setIsLoading] = useState(false)

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
