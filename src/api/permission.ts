import { API_ENDPOINTS, type ApiResponse, type Permission, type Role } from '@/config/api'
import http from '@/utils/http'

// 权限相关API
export const permissionAPI = {
  // 获取角色列表
  getRoles(): Promise<ApiResponse<Role[]>> {
    return http.get(API_ENDPOINTS.PERMISSION.ROLES)
  },
  
  // 获取权限列表
  getPermissions(): Promise<ApiResponse<Permission[]>> {
    return http.get(API_ENDPOINTS.PERMISSION.PERMISSIONS)
  },
  
  // 获取用户角色
  getUserRoles(userId: string): Promise<ApiResponse<Role[]>> {
    return http.get(API_ENDPOINTS.PERMISSION.USER_ROLES(userId))
  },
  
  // 获取用户权限
  getUserPermissions(userId: string): Promise<ApiResponse<Permission[]>> {
    return http.get(API_ENDPOINTS.PERMISSION.USER_PERMISSIONS(userId))
  }
} 