import { API_ENDPOINTS } from '@/config/api'
import http from '@/utils/http'

export const permissionAPI = {
  // 获取权限列表
  list(params = {}) {
    return http.get(API_ENDPOINTS.PERMISSION.PERMISSIONS, { params })
  },
  // 获取单个权限
  detail(permissionId) {
    return http.get(`${API_ENDPOINTS.PERMISSION.PERMISSIONS}/${permissionId}`)
  },
  // 创建权限
  create(data) {
    return http.post(API_ENDPOINTS.PERMISSION.PERMISSIONS, data)
  }
} 