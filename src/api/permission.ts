import { API_ENDPOINTS } from '@/config/api'
import http from '@/utils/http'

// 权限数据类型定义
interface PermissionData {
  name: string
  resource: string
  action: string
  description?: string
}

export const permissionAPI = {
  // 获取权限列表
  list(params: any = {}) {
    return http.get(API_ENDPOINTS.PERMISSION.PERMISSIONS, { params })
  },
  
  // 获取单个权限
  detail(permissionId: string) {
    return http.get(`${API_ENDPOINTS.PERMISSION.PERMISSIONS}/${permissionId}`)
  },
  
  // 创建权限
  create(data: PermissionData) {
    return http.post(API_ENDPOINTS.PERMISSION.PERMISSIONS, data)
  },
  
  // 更新权限
  update(permissionId: string, data: Partial<PermissionData>) {
    return http.put(`${API_ENDPOINTS.PERMISSION.PERMISSIONS}/${permissionId}`, data)
  },
  
  // 删除权限
  remove(permissionId: string) {
    return http.delete(`${API_ENDPOINTS.PERMISSION.PERMISSIONS}/${permissionId}`)
  }
} 