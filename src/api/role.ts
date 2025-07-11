import { API_ENDPOINTS } from '@/config/api'
import http from '@/utils/http'

// 角色数据类型定义
interface RoleData {
  name: string
  description?: string
  permissions?: string[]
}

export const roleAPI = {
  // 获取角色列表
  list(params: any = {}) {
    return http.get(API_ENDPOINTS.PERMISSION.ROLES, { params })
  },
  
  // 获取单个角色
  detail(roleId: string) {
    return http.get(`${API_ENDPOINTS.PERMISSION.ROLES}/${roleId}`)
  },
  
  // 创建角色
  create(data: RoleData) {
    return http.post(API_ENDPOINTS.PERMISSION.ROLES, data)
  },
  
  // 更新角色
  update(roleId: string, data: Partial<RoleData>) {
    return http.put(`${API_ENDPOINTS.PERMISSION.ROLES}/${roleId}`, data)
  },
  
  // 删除角色
  remove(roleId: string) {
    return http.delete(`${API_ENDPOINTS.PERMISSION.ROLES}/${roleId}`)
  }
} 