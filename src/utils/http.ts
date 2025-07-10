import { API_CONFIG, type ApiResponse, ERROR_MESSAGES } from '@/config/api'
import router from '@/router'
import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

// 创建axios实例
const http: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true // 支持跨域携带cookie
})

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加认证token
    const token = localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY)
    if (token && config.headers) {
      config.headers[API_CONFIG.AUTH.TOKEN_HEADER] = 
        `${API_CONFIG.AUTH.TOKEN_PREFIX} ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 统一处理响应数据
    const { data } = response
    if (data.code === 200) {
      return response
    } else {
      // 处理业务错误
      return Promise.reject(new Error(data.msg || '请求失败'))
    }
  },
  (error) => {
    // 处理HTTP错误
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // 未授权，跳转到登录页
          localStorage.removeItem(API_CONFIG.AUTH.TOKEN_KEY)
          localStorage.removeItem(API_CONFIG.AUTH.REFRESH_TOKEN_KEY)
          router.push('/login')
          break
        case 403:
          // 权限不足
          console.error(ERROR_MESSAGES.FORBIDDEN)
          break
        case 500:
          // 服务器错误
          console.error(ERROR_MESSAGES.INTERNAL_ERROR)
          break
        default:
          console.error(data?.msg || '请求失败')
      }
    }
    return Promise.reject(error)
  }
)

export default http 