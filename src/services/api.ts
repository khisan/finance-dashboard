import axios, { InternalAxiosRequestConfig } from "axios"
import { redirectToLogin } from "../utils/loginRedirect"

// Endpoint publik: 401 di sini berarti kredensial salah, bukan sesi expired.
const PUBLIC_AUTH_ENDPOINTS = ["/auth/login", "/auth/register"]

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // Set a timeout of 10 seconds for all requests
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("authToken") // Retrieve the auth token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}` // Attach the token to the Authorization header
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle errors globally
    const requestPath: string = error.config?.url ?? ""
    if (
      error.response?.status === 401 &&
      !PUBLIC_AUTH_ENDPOINTS.some((endpoint) => requestPath.startsWith(endpoint))
    ) {
      // Sesi/token tidak valid — bersihkan storage dan lempar ke login.
      redirectToLogin()
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request)
    } else {
      // Something else happened while setting up the request
      console.error("Error setting up request:", error.message)
    }
    return Promise.reject(error)
  },
)

export default api
