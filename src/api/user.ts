import { API_ENDPOINTS } from '@/config/api'
import http from '@/utils/http'

export const userAPI = {
  // 获取用户列表
  list(params = {}) {
    return http.get(API_ENDPOINTS.BUSINESS.USERS, { params })
  },
  // 获取单个用户
  detail(userId) {
    return http.get(`${API_ENDPOINTS.BUSINESS.USERS}/${userId}`)
  },
  // 获取用户角色
  getUserRoles(userId) {
    return http.get(API_ENDPOINTS.PERMISSION.USER_ROLES(userId))
  },
  // 分配角色
  assignRole(userId, roleId, expires_at) {
    return http.post(API_ENDPOINTS.PERMISSION.USER_ROLES(userId), { role_id: roleId, expires_at })
  },
  // 移除角色
  removeRole(userId, roleId) {
    return http.delete(`${API_ENDPOINTS.PERMISSION.USER_ROLES(userId)}/${roleId}`)
  },
  // 获取用户权限
  getUserPermissions(userId) {
    return http.get(API_ENDPOINTS.PERMISSION.USER_PERMISSIONS(userId))
  }
} 