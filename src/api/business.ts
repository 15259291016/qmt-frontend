import { API_ENDPOINTS, type ApiResponse } from '@/config/api'
import http from '@/utils/http'

// 业务相关API
export const businessAPI = {
  // 获取数据列表
  getData(): Promise<ApiResponse<any[]>> {
    return http.get(API_ENDPOINTS.BUSINESS.DATA)
  },
  
  // 获取系统信息
  getSystemInfo(): Promise<ApiResponse<{ version: string }>> {
    return http.get(API_ENDPOINTS.BUSINESS.SYSTEM)
  },
  
  // 获取用户列表
  getUsers(): Promise<ApiResponse<any[]>> {
    return http.get(API_ENDPOINTS.BUSINESS.USERS)
  },
  
  // 获取管理员信息
  getAdminInfo(): Promise<ApiResponse<any>> {
    return http.get(API_ENDPOINTS.BUSINESS.ADMIN)
  },
  
  // 获取混合权限信息
  getMixedPermissions(): Promise<ApiResponse<any>> {
    return http.get(API_ENDPOINTS.BUSINESS.MIXED_PERMISSIONS)
  }
} 