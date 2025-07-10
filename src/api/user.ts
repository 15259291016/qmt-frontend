import { API_ENDPOINTS, type ApiResponse, type SubscribeRequest, type Subscription } from '@/config/api'
import http from '@/utils/http'

// 用户相关API
export const userAPI = {
  // 订阅激活/续费
  subscribe(data: SubscribeRequest): Promise<ApiResponse<Subscription>> {
    return http.post(API_ENDPOINTS.USER.SUBSCRIBE, data)
  }
} 