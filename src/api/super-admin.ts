import type { SetSuperAdminRequest, SuperAdminUser } from '@/config/api'
import { API_ENDPOINTS } from '@/config/api'
import http from '@/utils/http'

export const superAdminAPI = {
  // 获取超级管理员列表
  list() {
    return http.get<{ super_admins: SuperAdminUser[] }>(API_ENDPOINTS.SUPER_ADMIN.LIST)
  },
  
  // 设置用户为超级管理员
  setSuperAdmin(data: SetSuperAdminRequest) {
    return http.post(API_ENDPOINTS.SUPER_ADMIN.SET, data)
  },
  
  // 取消用户的超级管理员权限
  removeSuperAdmin(userId: string) {
    return http.delete(API_ENDPOINTS.SUPER_ADMIN.REMOVE(userId))
  }
} 