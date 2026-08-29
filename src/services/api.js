const { default: axios } = require("axios")

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // Set a timeout of 10 seconds for all requests
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
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
    return response.data // Return only the data from the response
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("API Error:", error.response.status, error.response.data)
    } else if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., token expired)
      console.error("Unauthorized access - perhaps the token has expired.")
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
