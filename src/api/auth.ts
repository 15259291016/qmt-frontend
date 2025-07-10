import { API_ENDPOINTS, type ApiResponse, type LoginRequest, type RegisterRequest, type User } from '@/config/api'
import http from '@/utils/http'

// 认证相关API
export const authAPI = {
  // 用户注册
  register(data: RegisterRequest): Promise<ApiResponse<{ user_id: string }>> {
    return http.post(API_ENDPOINTS.AUTH.REGISTER, data)
  },
  
  // 用户登录
  login(data: LoginRequest): Promise<ApiResponse<{
    access_token: string
    refresh_token: string
    user: User
  }>> {
    return http.post(API_ENDPOINTS.AUTH.LOGIN, data)
  },
  
  // 用户登出
  logout(): Promise<ApiResponse<null>> {
    return http.post(API_ENDPOINTS.AUTH.LOGOUT)
  },
  
  // 刷新token
  refreshToken(): Promise<ApiResponse<{
    access_token: string
    refresh_token: string
  }>> {
    const refreshToken = localStorage.getItem('refresh_token')
    return http.post(API_ENDPOINTS.AUTH.REFRESH, { refresh_token: refreshToken })
  },
  
  // 获取用户信息
  getProfile(): Promise<ApiResponse<User>> {
    return http.get(API_ENDPOINTS.AUTH.PROFILE)
  }
} 