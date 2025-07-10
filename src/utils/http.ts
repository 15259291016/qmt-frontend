import { API_CONFIG } from '@/config/api'
import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

// 创建axios实例
const http: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从localStorage获取token
    const token = localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回响应数据
    return response
  },
  async (error) => {
    console.error('HTTP请求错误:', error)
    
    // 处理401错误（未授权）
    if (error.response?.status === 401) {
      console.warn('收到401错误，清除本地token')
      localStorage.removeItem(API_CONFIG.AUTH.TOKEN_KEY)
      localStorage.removeItem(API_CONFIG.AUTH.REFRESH_TOKEN_KEY)
      
      // 如果不是登录页面，跳转到登录页
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      
      return Promise.reject(new Error('登录已失效，请重新登录'))
    }
    
    // 处理403错误（禁止访问）
    if (error.response?.status === 403) {
      return Promise.reject(new Error('没有权限访问此资源'))
    }
    
    // 处理404错误（资源不存在）
    if (error.response?.status === 404) {
      return Promise.reject(new Error('请求的资源不存在'))
    }
    
    // 处理500错误（服务器错误）
    if (error.response?.status >= 500) {
      return Promise.reject(new Error('服务器内部错误，请稍后重试'))
    }
    
    // 处理网络错误
    if (!error.response) {
      return Promise.reject(new Error('网络连接失败，请检查网络后重试'))
    }
    
    // 处理其他错误
    const errorMessage = error.response?.data?.message || error.response?.data?.detail || error.message || '请求失败'
    return Promise.reject(new Error(errorMessage))
  }
)

export default http 