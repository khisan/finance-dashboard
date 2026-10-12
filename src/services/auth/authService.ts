import api from "../api"
import { LoginRequest, RegisterRequest } from "../../types/auth"
import { ApiResponse } from "@/types/api"
import { User } from "@/types/user"

const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  REFRESH_TOKEN: "/auth/refresh-token",
  LOGOUT: "/auth/logout",
} as const

export const authServices = {
  login: async (credentials: LoginRequest): Promise<string> => {
    const response = await api.post<ApiResponse<string>>(
      AUTH_ENDPOINTS.LOGIN,
      credentials,
    )
    return response.data.data
  },

  register: async (userData: RegisterRequest): Promise<string> => {
    const response = await api.post<ApiResponse<string>>(
      AUTH_ENDPOINTS.REGISTER,
      userData,
    )
    return response.data.data
  },

  refreshToken: async (refreshToken: string): Promise<string> => {
    const response = await api.post<ApiResponse<string>>(
      AUTH_ENDPOINTS.REFRESH_TOKEN,
      { refreshToken },
    )
    return response.data.data
  },

  logout: async (): Promise<void> => {
    await api.post(AUTH_ENDPOINTS.LOGOUT)
  },

  getUser: async (email: string): Promise<User> => {
    const safeEmail = encodeURIComponent(email)
    const response = await api.get<ApiResponse<User>>(`/users/${safeEmail}`)
    console.log("response get user: ", response.data.data)
    return response.data.data
  },
}
