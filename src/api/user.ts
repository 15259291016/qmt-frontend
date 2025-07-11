import { API_ENDPOINTS } from '@/config/api'
import http from '@/utils/http'

// 用户数据类型定义
interface UserData {
  username: string
  email: string
  full_name?: string
  password?: string
  status?: string
  is_admin?: boolean
  is_super_admin?: boolean
}

interface RoleAssignment {
  role_id: string
  expires_at?: string
}

export const userAPI = {
  // 获取用户列表
  list(params: any = {}) {
    return http.get(API_ENDPOINTS.BUSINESS.USERS, { params })
  },
  
  // 获取单个用户
  detail(userId: string) {
    return http.get(`${API_ENDPOINTS.BUSINESS.USERS}/${userId}`)
  },
  
  // 创建用户
  create(userData: UserData) {
    return http.post(API_ENDPOINTS.BUSINESS.USERS, userData)
  },
  
  // 更新用户
  update(userId: string, userData: Partial<UserData>) {
    return http.put(`${API_ENDPOINTS.BUSINESS.USERS}/${userId}`, userData)
  },
  
  // 删除用户
  remove(userId: string) {
    return http.delete(`${API_ENDPOINTS.BUSINESS.USERS}/${userId}`)
  },
  
  // 获取用户角色
  getUserRoles(userId: string) {
    return http.get(API_ENDPOINTS.PERMISSION.USER_ROLES(userId))
  },
  
  // 分配角色
  assignRole(userId: string, roleId: string, expires_at?: string) {
    return http.post(API_ENDPOINTS.PERMISSION.USER_ROLES(userId), { role_id: roleId, expires_at })
  },
  
  // 移除角色
  removeRole(userId: string, roleId: string) {
    return http.delete(`${API_ENDPOINTS.PERMISSION.USER_ROLES(userId)}/${roleId}`)
  },
  
  // 获取用户权限
  getUserPermissions(userId: string) {
    return http.get(API_ENDPOINTS.PERMISSION.USER_PERMISSIONS(userId))
  },
  
  // 批量分配角色
  assignRoles(userId: string, roleIds: string[]) {
    return http.post(`${API_ENDPOINTS.PERMISSION.USER_ROLES(userId)}/batch`, { role_ids: roleIds })
  },
  
  // 重置用户密码
  resetPassword(userId: string, newPassword: string) {
    return http.post(`${API_ENDPOINTS.BUSINESS.USERS}/${userId}/reset-password`, { password: newPassword })
  },
  
  // 启用/禁用用户
  toggleStatus(userId: string, status: string) {
    return http.patch(`${API_ENDPOINTS.BUSINESS.USERS}/${userId}/status`, { status })
  },
  
  // 获取用户统计信息
  getStats() {
    return http.get(`${API_ENDPOINTS.BUSINESS.USERS}/stats`)
  },
  
  // 设置用户为管理员
  setAdmin(userId: string, isAdmin: boolean) {
    return http.put(`${API_ENDPOINTS.BUSINESS.USERS}/${userId}`, { is_admin: isAdmin })
  },
  
  // 设置用户为超级管理员（仅超级管理员可用）
  setSuperAdmin(userId: string, isSuperAdmin: boolean) {
    return http.put(`${API_ENDPOINTS.BUSINESS.USERS}/${userId}`, { is_super_admin: isSuperAdmin })
  }
} 