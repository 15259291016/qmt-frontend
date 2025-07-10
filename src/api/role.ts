import { API_ENDPOINTS } from '@/config/api'
import http from '@/utils/http'

export const roleAPI = {
  // 获取角色列表
  list(params = {}) {
    return http.get(API_ENDPOINTS.PERMISSION.ROLES, { params })
  },
  // 获取单个角色
  detail(roleId) {
    return http.get(`${API_ENDPOINTS.PERMISSION.ROLES}/${roleId}`)
  },
  // 创建角色
  create(data) {
    return http.post(API_ENDPOINTS.PERMISSION.ROLES, data)
  },
  // 更新角色
  update(roleId, data) {
    return http.put(`${API_ENDPOINTS.PERMISSION.ROLES}/${roleId}`, data)
  },
  // 删除角色
  remove(roleId) {
    return http.delete(`${API_ENDPOINTS.PERMISSION.ROLES}/${roleId}`)
  }
} 